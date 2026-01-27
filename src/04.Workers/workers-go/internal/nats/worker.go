package nats

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/farutech/orchestrator-workers/internal/handlers"
	"github.com/farutech/orchestrator-workers/internal/models"
	"github.com/nats-io/nats.go"
)

const (
	StreamName          = "PROVISIONING"
	SubjectProvisioning = "provisioning.tasks"
	SubjectDLQ          = "provisioning.dlq"
	ConsumerName        = "provisioning-worker"
	MaxDeliver          = 5
)

// Worker handles NATS message processing
type Worker struct {
	nc          *nats.Conn
	js          nats.JetStreamContext
	provisioner *handlers.Provisioner
	workerID    string
}

// NewWorker creates a new NATS worker
func NewWorker(nc *nats.Conn, provisioner *handlers.Provisioner, workerID string) (*Worker, error) {
	js, err := nc.JetStream()
	if err != nil {
		return nil, fmt.Errorf("failed to get JetStream context: %w", err)
	}

	worker := &Worker{
		nc:          nc,
		js:          js,
		provisioner: provisioner,
		workerID:    workerID,
	}

	// Ensure stream exists
	if err := worker.ensureStream(); err != nil {
		return nil, fmt.Errorf("failed to ensure stream: %w", err)
	}

	return worker, nil
}

// ensureStream creates or updates the JetStream stream
func (w *Worker) ensureStream() error {
	streamInfo, err := w.js.StreamInfo(StreamName)
	if err == nil {
		log.Printf("Stream '%s' already exists with %d messages", StreamName, streamInfo.State.Msgs)
		return nil
	}

	// Stream doesn't exist, create it
	streamConfig := &nats.StreamConfig{
		Name:        StreamName,
		Description: "Farutech provisioning tasks stream",
		Subjects:    []string{SubjectProvisioning, SubjectDLQ},
		Retention:   nats.WorkQueuePolicy,
		MaxAge:      72 * time.Hour, // Keep messages for 3 days
		Storage:     nats.FileStorage,
		Replicas:    1,
		Discard:     nats.DiscardOld,
	}

	info, err := w.js.AddStream(streamConfig)
	if err != nil {
		return fmt.Errorf("failed to create stream: %w", err)
	}

	log.Printf("✓ Stream '%s' created successfully", info.Config.Name)
	return nil
}

// Start begins processing messages from the stream
func (w *Worker) Start(ctx context.Context) error {
	log.Printf("Starting worker %s...", w.workerID)

	// Create durable consumer with retry configuration
	consumerConfig := &nats.ConsumerConfig{
		Durable:       ConsumerName,
		Description:   fmt.Sprintf("Provisioning worker consumer (%s)", w.workerID),
		FilterSubject: SubjectProvisioning,
		AckPolicy:     nats.AckExplicitPolicy,
		AckWait:       30 * time.Second,
		MaxDeliver:    MaxDeliver,
		DeliverPolicy: nats.DeliverAllPolicy,
		ReplayPolicy:  nats.ReplayInstantPolicy,
	}

	// Subscribe with pull-based consumer
	sub, err := w.js.PullSubscribe(SubjectProvisioning, ConsumerName, nats.Bind(StreamName, ConsumerName))
	if err != nil {
		// Consumer might not exist, try to create it
		_, err = w.js.AddConsumer(StreamName, consumerConfig)
		if err != nil {
			return fmt.Errorf("failed to add consumer: %w", err)
		}

		sub, err = w.js.PullSubscribe(SubjectProvisioning, ConsumerName, nats.Bind(StreamName, ConsumerName))
		if err != nil {
			return fmt.Errorf("failed to subscribe after creating consumer: %w", err)
		}
	}

	log.Printf("✓ Worker %s subscribed to %s", w.workerID, SubjectProvisioning)

	// Process messages in a loop
	go w.processMessages(ctx, sub)

	return nil
}

// processMessages handles incoming messages with retry logic
func (w *Worker) processMessages(ctx context.Context, sub *nats.Subscription) {
	for {
		select {
		case <-ctx.Done():
			log.Println("Stopping message processing...")
			return
		default:
			// Fetch messages (batch of 1)
			msgs, err := sub.Fetch(1, nats.MaxWait(5*time.Second))
			if err != nil {
				if err == nats.ErrTimeout {
					// No messages available, continue polling
					continue
				}
				log.Printf("Error fetching messages: %v", err)
				time.Sleep(1 * time.Second)
				continue
			}

			for _, msg := range msgs {
				w.handleMessage(msg)
			}
		}
	}
}

// handleMessage processes a single message
func (w *Worker) handleMessage(msg *nats.Msg) {
	start := time.Now()

	// Parse task from message
	var task models.ProvisioningTask
	if err := json.Unmarshal(msg.Data, &task); err != nil {
		log.Printf("❌ Failed to unmarshal task: %v", err)
		msg.Term() // Terminate message (won't be redelivered)
		return
	}

	// Get message metadata to check delivery count
	meta, err := msg.Metadata()
	if err != nil {
		log.Printf("⚠️  Failed to get message metadata: %v", err)
	} else {
		task.Attempt = int(meta.NumDelivered)
	}

	log.Printf("📦 Processing task %s (type: %s, attempt: %d/%d)",
		task.TaskID, task.TaskType, task.Attempt, task.MaxRetries)

	// Process the task
	result, err := w.provisioner.Process(&task)
	if err != nil {
		log.Printf("❌ Task %s failed: %v", task.TaskID, err)

		// Check if we should retry
		if w.provisioner.ShouldRetry(&task) {
			log.Printf("🔄 Task %s will be retried (attempt %d/%d)",
				task.TaskID, task.Attempt+1, task.MaxRetries)
			
			// NAck to trigger redelivery with backoff
			msg.Nak()
		} else {
			// Max retries exhausted, send to DLQ
			log.Printf("💀 Task %s exceeded max retries, sending to DLQ", task.TaskID)
			w.sendToDLQ(&task, err)
			msg.Term() // Terminate (remove from stream)
		}
		return
	}

	// Success - publish result and ACK message
	log.Printf("✅ Task %s completed successfully (took %dms)",
		task.TaskID, result.Duration)

	// Publish result to result stream (optional)
	w.publishResult(result)

	// Acknowledge message
	if err := msg.Ack(); err != nil {
		log.Printf("⚠️  Failed to ACK message: %v", err)
	}

	log.Printf("⏱️  Total processing time: %dms", time.Since(start).Milliseconds())
}

// sendToDLQ sends failed task to Dead Letter Queue
func (w *Worker) sendToDLQ(task *models.ProvisioningTask, processingError error) {
	dlqMessage := map[string]interface{}{
		"task":            task,
		"error":           processingError.Error(),
		"final_attempt":   task.Attempt,
		"dlq_timestamp":   time.Now().UTC(),
		"worker_id":       w.workerID,
	}

	data, err := json.Marshal(dlqMessage)
	if err != nil {
		log.Printf("⚠️  Failed to marshal DLQ message: %v", err)
		return
	}

	_, err = w.js.Publish(SubjectDLQ, data)
	if err != nil {
		log.Printf("⚠️  Failed to publish to DLQ: %v", err)
		return
	}

	log.Printf("💀 Task %s sent to DLQ", task.TaskID)
}

// publishResult publishes task result (optional, for monitoring)
func (w *Worker) publishResult(result *models.TaskResult) {
	// Could publish to a results stream for monitoring/analytics
	// For now, just log
	log.Printf("📊 Result: status=%s, duration=%dms", result.Status, result.Duration)
}
