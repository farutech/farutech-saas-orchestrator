package config

import (
	"os"
)

// Config holds the worker configuration
type Config struct {
	NatsURL      string
	WorkerID     string
	MaxRetries   int
	RetryBackoff int // seconds
}

// Load returns configuration from environment variables with defaults
func Load() *Config {
	return &Config{
		NatsURL:      getEnv("NATS_URL", "nats://localhost:4222"),
		WorkerID:     getEnv("WORKER_ID", "worker-001"),
		MaxRetries:   5,
		RetryBackoff: 10,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
