package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/nats-io/nats.go"
)

type TaskType string

const (
	TaskTypeProvision   TaskType = "provision"
	TaskTypeDeprovision TaskType = "deprovision"
	TaskTypeUpdate      TaskType = "update"
)

type ProvisioningTask struct {
	TaskID     string                 `json:"task_id"`
	TenantID   string                 `json:"tenant_id"`
	TaskType   TaskType               `json:"task_type"`
	ModuleID   string                 `json:"module_id"`
	Payload    map[string]interface{} `json:"payload"`
	Attempt    int                    `json:"attempt"`
	MaxRetries int                    `json:"max_retries"`
	CreatedAt  time.Time              `json:"created_at"`
}

func main() {
	natsURL := flag.String("nats", "nats://localhost:4222", "NATS server URL")
	taskType := flag.String("type", "provision", "Task type (provision, deprovision, update)")
	tenantID := flag.String("tenant", "tenant-001", "Tenant ID")
	moduleID := flag.String("module", "module-erp", "Module ID")
	count := flag.Int("count", 1, "Number of tasks to publish")
	flag.Parse()

	log.Printf("Connecting to NATS at %s...", *natsURL)

	// Connect to NATS
	nc, err := nats.Connect(*natsURL)
	if err != nil {
		log.Fatalf("Failed to connect to NATS: %v", err)
	}
	defer nc.Close()

	js, err := nc.JetStream()
	if err != nil {
		log.Fatalf("Failed to get JetStream context: %v", err)
	}

	log.Println("✅ Connected to NATS JetStream")

	// Publish tasks
	for i := 0; i < *count; i++ {
		task := ProvisioningTask{
			TaskID:     uuid.New().String(),
			TenantID:   fmt.Sprintf("%s-%d", *tenantID, i+1),
			TaskType:   TaskType(*taskType),
			ModuleID:   *moduleID,
			Payload: map[string]interface{}{
				"environment": "production",
				"features":    []string{"basic", "advanced"},
			},
			Attempt:    1,
			MaxRetries: 5,
			CreatedAt:  time.Now().UTC(),
		}

		data, err := json.Marshal(task)
		if err != nil {
			log.Printf("Failed to marshal task: %v", err)
			continue
		}

		_, err = js.Publish("provisioning.tasks", data)
		if err != nil {
			log.Printf("Failed to publish task: %v", err)
			continue
		}

		log.Printf("✅ Published task %s (type: %s, tenant: %s)",
			task.TaskID, task.TaskType, task.TenantID)

		if i < *count-1 {
			time.Sleep(100 * time.Millisecond)
		}
	}

	log.Printf("✅ Published %d tasks successfully", *count)
}
