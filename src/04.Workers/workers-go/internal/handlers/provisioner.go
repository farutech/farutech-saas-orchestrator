package handlers

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/farutech/orchestrator-workers/internal/api"
	"github.com/farutech/orchestrator-workers/internal/models"
)

// Provisioner handles provisioning tasks
type Provisioner struct {
	maxRetries   int
	retryBackoff int // base backoff in seconds
	apiClient    *api.Client
}

// NewProvisioner creates a new provisioner handler
func NewProvisioner(maxRetries, retryBackoff int, apiClient *api.Client) *Provisioner {
	return &Provisioner{
		maxRetries:   maxRetries,
		retryBackoff: retryBackoff,
		apiClient:    apiClient,
	}
}

// Process executes a provisioning task with retry logic
func (p *Provisioner) Process(task *models.ProvisioningTask) (*models.TaskResult, error) {
	start := time.Now()
	
	log.Printf("Processing task %s (attempt %d/%d)", task.TaskID, task.Attempt, task.MaxRetries)
	
	// Update task status to PROCESSING
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 0, stringPtr("Initializing task"), nil); err != nil {
		log.Printf("⚠️  Failed to update task status: %v", err)
	}
	
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
		
		// Update task status to FAILED
		if apiErr := p.apiClient.UpdateTaskStatus(task.TaskID, "FAILED", 0, nil, &result.Error); apiErr != nil {
			log.Printf("⚠️  Failed to update task failure status: %v", apiErr)
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
	
	// Mark task as completed
	if err := p.apiClient.MarkTaskCompleted(task.TaskID); err != nil {
		log.Printf("⚠️  Failed to mark task as completed: %v", err)
	}
	
	return result, nil
}

// provision handles provisioning logic
func (p *Provisioner) provision(task *models.ProvisioningTask) error {
	log.Printf("🚀 Provisioning tenant %s for module %s", task.TenantID, task.ModuleID)
	
	// Update progress: Starting
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 10, stringPtr("Validating tenant configuration"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	
	// Simulate validation
	time.Sleep(time.Duration(rand.Intn(200)+100) * time.Millisecond)
	
	// Update progress: Creating database
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 30, stringPtr("Creating tenant database"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Validated tenant configuration"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
	// Simulate database creation
	time.Sleep(time.Duration(rand.Intn(300)+200) * time.Millisecond)
	
	// Update progress: Configuring application
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 70, stringPtr("Configuring application settings"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Created tenant database"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
	// Simulate configuration
	time.Sleep(time.Duration(rand.Intn(200)+100) * time.Millisecond)
	
	// Simulate 20% failure rate on first attempt (for testing retry logic)
	if task.Attempt == 1 && rand.Float32() < 0.2 {
		return fmt.Errorf("simulated provisioning failure (network timeout)")
	}
	
	// Update progress: Finalizing
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 100, stringPtr("Finalizing tenant setup"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Configured application settings"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
	time.Sleep(time.Duration(rand.Intn(100)+50) * time.Millisecond)
	
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Finalized tenant setup"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
	log.Printf("✅ Tenant %s provisioned successfully", task.TenantID)
	return nil
}

// deprovision handles deprovisioning logic
func (p *Provisioner) deprovision(task *models.ProvisioningTask) error {
	log.Printf("🗑️  Deprovisioning tenant %s for module %s", task.TenantID, task.ModuleID)
	
	// Update progress: Starting
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 20, stringPtr("Archiving tenant data"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	
	// Simulate archiving
	time.Sleep(time.Duration(rand.Intn(200)+100) * time.Millisecond)
	
	// Update progress: Removing resources
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 60, stringPtr("Removing tenant resources"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Archived tenant data"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
	// Simulate resource removal
	time.Sleep(time.Duration(rand.Intn(200)+100) * time.Millisecond)
	
	// Update progress: Finalizing
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 100, stringPtr("Cleaning up tenant records"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Removed tenant resources"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
	time.Sleep(time.Duration(rand.Intn(100)+50) * time.Millisecond)
	
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Cleaned up tenant records"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
	log.Printf("✅ Tenant %s deprovisioned successfully", task.TenantID)
	return nil
}

// update handles update logic
func (p *Provisioner) update(task *models.ProvisioningTask) error {
	log.Printf("🔄 Updating tenant %s configuration", task.TenantID)
	
	// Update progress: Starting
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 25, stringPtr("Applying configuration changes"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	
	// Simulate configuration changes
	time.Sleep(time.Duration(rand.Intn(200)+100) * time.Millisecond)
	
	// Update progress: Updating features
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 75, stringPtr("Updating feature flags"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Applied configuration changes"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
	// Simulate feature updates
	time.Sleep(time.Duration(rand.Intn(200)+100) * time.Millisecond)
	
	// Update progress: Finalizing
	if err := p.apiClient.UpdateTaskStatus(task.TaskID, "PROCESSING", 100, stringPtr("Restarting services"), nil); err != nil {
		log.Printf("⚠️  Failed to update progress: %v", err)
	}
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Updated feature flags"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
	time.Sleep(time.Duration(rand.Intn(100)+50) * time.Millisecond)
	
	if err := p.apiClient.AddCompletedStep(task.TaskID, "Restarted services"); err != nil {
		log.Printf("⚠️  Failed to add completed step: %v", err)
	}
	
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

// stringPtr returns a pointer to a string
func stringPtr(s string) *string {
	return &s
}
