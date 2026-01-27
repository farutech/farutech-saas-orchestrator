package handlers

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/farutech/orchestrator-workers/internal/models"
)

// Provisioner handles provisioning tasks
type Provisioner struct {
	maxRetries   int
	retryBackoff int // base backoff in seconds
}

// NewProvisioner creates a new provisioner handler
func NewProvisioner(maxRetries, retryBackoff int) *Provisioner {
	return &Provisioner{
		maxRetries:   maxRetries,
		retryBackoff: retryBackoff,
	}
}

// Process executes a provisioning task with retry logic
func (p *Provisioner) Process(task *models.ProvisioningTask) (*models.TaskResult, error) {
	start := time.Now()
	
	log.Printf("Processing task %s (attempt %d/%d)", task.TaskID, task.Attempt, task.MaxRetries)
	
	// Simulate processing based on task type
	var err error
	switch task.TaskType {
	case models.TaskTypeProvision:
		err = p.provision(task)
	case models.TaskTypeDeprovision:
		err = p.deprovision(task)
	case models.TaskTypeUpdate:
		err = p.update(task)
	default:
		err = fmt.Errorf("unknown task type: %s", task.TaskType)
	}
	
	if err != nil {
		result := &models.TaskResult{
			TaskID:    task.TaskID,
			Status:    models.TaskStatusFailed,
			Error:     err.Error(),
			Duration:  time.Since(start).Milliseconds(),
			Timestamp: time.Now(),
		}
		
		if p.ShouldRetry(task) {
			result.Status = models.TaskStatusRetrying
		}
		
		return result, err
	}
	
	result := &models.TaskResult{
		TaskID:    task.TaskID,
		Status:    models.TaskStatusSuccess,
		Message:   fmt.Sprintf("Task %s completed successfully", task.TaskType),
		Duration:  time.Since(start).Milliseconds(),
		Timestamp: time.Now(),
	}
	
	return result, nil
}

// provision handles provisioning logic
func (p *Provisioner) provision(task *models.ProvisioningTask) error {
	log.Printf("🚀 Provisioning tenant %s for module %s", task.TenantID, task.ModuleID)
	
	// TODO: Implement actual provisioning:
	// 1. Call external API to create tenant resources
	// 2. Configure database schemas
	// 3. Initialize application settings
	// 4. Update tenant status in orchestrator DB
	
	// Simulate work and occasional failures for testing
	time.Sleep(time.Duration(rand.Intn(500)+500) * time.Millisecond)
	
	// Simulate 20% failure rate on first attempt (for testing retry logic)
	if task.Attempt == 1 && rand.Float32() < 0.2 {
		return fmt.Errorf("simulated provisioning failure (network timeout)")
	}
	
	log.Printf("✅ Tenant %s provisioned successfully", task.TenantID)
	return nil
}

// deprovision handles deprovisioning logic
func (p *Provisioner) deprovision(task *models.ProvisioningTask) error {
	log.Printf("🗑️  Deprovisioning tenant %s for module %s", task.TenantID, task.ModuleID)
	
	// TODO: Implement deprovisioning:
	// 1. Archive tenant data
	// 2. Remove resources
	// 3. Update status in orchestrator DB
	
	time.Sleep(time.Duration(rand.Intn(300)+200) * time.Millisecond)
	
	log.Printf("✅ Tenant %s deprovisioned successfully", task.TenantID)
	return nil
}

// update handles update logic
func (p *Provisioner) update(task *models.ProvisioningTask) error {
	log.Printf("🔄 Updating tenant %s configuration", task.TenantID)
	
	// TODO: Implement update logic:
	// 1. Apply configuration changes
	// 2. Update feature flags
	// 3. Restart services if needed
	
	time.Sleep(time.Duration(rand.Intn(400)+300) * time.Millisecond)
	
	log.Printf("✅ Tenant %s updated successfully", task.TenantID)
	return nil
}

// ShouldRetry determines if a failed task should be retried
func (p *Provisioner) ShouldRetry(task *models.ProvisioningTask) bool {
	return task.Attempt < task.MaxRetries
}

// CalculateBackoff calculates exponential backoff duration
func (p *Provisioner) CalculateBackoff(attempt int) time.Duration {
	// Exponential backoff: base * 2^(attempt-1) + jitter
	backoffSeconds := p.retryBackoff * (1 << uint(attempt-1))
	
	// Add jitter (±20%)
	jitter := rand.Intn(backoffSeconds/5) - backoffSeconds/10
	backoffSeconds += jitter
	
	// Cap at 5 minutes
	if backoffSeconds > 300 {
		backoffSeconds = 300
	}
	
	return time.Duration(backoffSeconds) * time.Second
}
