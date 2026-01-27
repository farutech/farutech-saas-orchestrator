package models

import "time"

// TaskType represents the type of provisioning task
type TaskType string

const (
	TaskTypeProvision   TaskType = "provision"
	TaskTypeDeprovision TaskType = "deprovision"
	TaskTypeUpdate      TaskType = "update"
)

// TaskStatus represents the current status of a task
type TaskStatus string

const (
	TaskStatusPending  TaskStatus = "pending"
	TaskStatusRunning  TaskStatus = "running"
	TaskStatusSuccess  TaskStatus = "success"
	TaskStatusFailed   TaskStatus = "failed"
	TaskStatusRetrying TaskStatus = "retrying"
)

// ProvisioningTask represents a task message from NATS
type ProvisioningTask struct {
	TaskID       string                 `json:"task_id"`
	TenantID     string                 `json:"tenant_id"`
	TaskType     TaskType               `json:"task_type"`
	ModuleID     string                 `json:"module_id"`
	Payload      map[string]interface{} `json:"payload"`
	Attempt      int                    `json:"attempt"`
	MaxRetries   int                    `json:"max_retries"`
	CreatedAt    time.Time              `json:"created_at"`
}

// TaskResult represents the result of task execution
type TaskResult struct {
	TaskID    string     `json:"task_id"`
	Status    TaskStatus `json:"status"`
	Message   string     `json:"message,omitempty"`
	Error     string     `json:"error,omitempty"`
	Duration  int64      `json:"duration_ms"`
	Timestamp time.Time  `json:"timestamp"`
}
