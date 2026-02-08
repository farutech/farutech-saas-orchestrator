package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/farutech/orchestrator-workers/internal/api"
	"github.com/farutech/orchestrator-workers/internal/config"
	"github.com/farutech/orchestrator-workers/internal/handlers"
	"github.com/farutech/orchestrator-workers/internal/nats"
)

func main() {
	// Load configuration
	cfg := config.Load()
	
	log.Printf("╔════════════════════════════════════════════════╗")
	log.Printf("║  Farutech Orchestrator Worker v1.0.0          ║")
	log.Printf("╚════════════════════════════════════════════════╝")
	log.Printf("Worker ID:    %s", cfg.WorkerID)
	log.Printf("NATS URL:     %s", cfg.NatsURL)
	log.Printf("Max Retries:  %d", cfg.MaxRetries)
	log.Printf("Retry Backoff: %ds", cfg.RetryBackoff)
	log.Printf("API URL:      %s", cfg.APIURL)
	log.Printf("API Token:    %s", maskToken(cfg.APIToken))
	log.Printf("")
	
	// Initialize API client with service ID
	apiClient := api.NewClient(cfg.APIURL, cfg.WorkerID)
	
	// Authenticate service with the orchestrator
	log.Println("🔐 Authenticating service with orchestrator...")
	err = apiClient.AuthenticateService("provisioning-worker", []string{
		"tasks:read",
		"tasks:write", 
		"provisioning:execute",
	})
	if err != nil {
		log.Fatalf("❌ Failed to authenticate service: %v", err)
	}
	log.Println("✅ Service authenticated successfully")
	
	// Initialize NATS connection
	nc, err := nats.Connect(cfg.NatsURL)
	if err != nil {
		log.Fatalf("❌ Failed to connect to NATS: %v", err)
	}
	defer nc.Close()
	
	log.Println("✅ Connected to NATS JetStream")
	
	// Create provisioner handler
	provisioner := handlers.NewProvisioner(cfg.MaxRetries, cfg.RetryBackoff, apiClient)
	
	// Create worker
	worker, err := nats.NewWorker(nc, provisioner, cfg.WorkerID)
	if err != nil {
		log.Fatalf("❌ Failed to create worker: %v", err)
	}
	
	// Create context for graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	
	// Start worker
	if err := worker.Start(ctx); err != nil {
		log.Fatalf("❌ Failed to start worker: %v", err)
	}
	
	log.Printf("✅ Worker %s ready to process tasks", cfg.WorkerID)
	log.Printf("📡 Listening on subject: provisioning.tasks")
	log.Printf("💀 Dead Letter Queue: provisioning.dlq")
	log.Printf("")
	log.Println("Press Ctrl+C to shutdown gracefully...")
	
	// Wait for interrupt signal
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)
	
	<-sigCh
	log.Println("")
	log.Println("🛑 Shutdown signal received, stopping worker...")
	cancel()
	
	log.Println("✅ Worker stopped gracefully")
}

// maskToken masks the API token for logging
func maskToken(token string) string {
	if token == "" {
		return "not set"
	}
	if len(token) <= 8 {
		return "****"
	}
	return token[:4] + "****" + token[len(token)-4:]
}
