package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

// Client handles HTTP communication with the Orchestrator API
type Client struct {
	baseURL    string
	httpClient *http.Client
	authToken  string
	serviceId  string
}

// NewClient creates a new API client
func NewClient(baseURL, serviceId string) *Client {
	return &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		serviceId: serviceId,
	}
}

// AuthenticateService authenticates the service and obtains a JWT token
func (c *Client) AuthenticateService(serviceType string, permissions []string) error {
	payload := map[string]interface{}{
		"serviceId":   c.serviceId,
		"serviceType": serviceType,
		"permissions": permissions,
	}

	var response struct {
		Token     string    `json:"token"`
		ServiceId string    `json:"serviceId"`
		ExpiresAt time.Time `json:"expiresAt"`
	}

	err := c.postWithResponse("/api/serviceauth/token", payload, &response)
	if err != nil {
		return fmt.Errorf("failed to authenticate service: %w", err)
	}

	c.authToken = response.Token
	log.Printf("🔐 Service authenticated successfully. Token expires at: %s", response.ExpiresAt)

	return nil
}

// postWithResponse makes a POST request and unmarshals the response
func (c *Client) postWithResponse(endpoint string, payload interface{}, response interface{}) error {
	url := c.baseURL + endpoint

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal payload: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode >= 400 {
		log.Printf("⚠️  API call failed: %s %s -> %d: %s", req.Method, url, resp.StatusCode, string(body))
		return fmt.Errorf("API call failed with status %d: %s", resp.StatusCode, string(body))
	}

	err = json.Unmarshal(body, response)
	if err != nil {
		return fmt.Errorf("failed to unmarshal response: %w", err)
	}

	log.Printf("✅ API call successful: %s %s -> %d", req.Method, url, resp.StatusCode)
	return nil
}

// UpdateTaskStatus updates the status of a task in the orchestrator
func (c *Client) UpdateTaskStatus(taskID, status string, progress int, currentStep, errorMsg *string) error {
	payload := map[string]interface{}{
		"status":    status,
		"progress":  progress,
		"timestamp": time.Now().UTC(),
	}

	if currentStep != nil {
		payload["currentStep"] = *currentStep
	}

	if errorMsg != nil {
		payload["errorMessage"] = *errorMsg
	}

	return c.post(fmt.Sprintf("/api/tasks/%s/status", taskID), payload)
}

// AddCompletedStep adds a completed step to the task
func (c *Client) AddCompletedStep(taskID, step string) error {
	payload := map[string]interface{}{
		"step":      step,
		"timestamp": time.Now().UTC(),
	}

	return c.post(fmt.Sprintf("/api/tasks/%s/steps", taskID), payload)
}

// MarkTaskCompleted marks a task as completed
func (c *Client) MarkTaskCompleted(taskID string) error {
	payload := map[string]interface{}{
		"completedAt": time.Now().UTC(),
	}

	return c.post(fmt.Sprintf("/api/tasks/%s/complete", taskID), payload)
}

// MarkTaskFailed marks a task as failed
func (c *Client) MarkTaskFailed(taskID, errorMsg string) error {
	payload := map[string]interface{}{
		"errorMessage": errorMsg,
		"failedAt":     time.Now().UTC(),
	}

	return c.post(fmt.Sprintf("/api/tasks/%s/fail", taskID), payload)
}

// post makes a POST request to the API
func (c *Client) post(endpoint string, payload interface{}) error {
	url := c.baseURL + endpoint

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal payload: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	if c.authToken != "" {
		req.Header.Set("Authorization", "Bearer "+c.authToken)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body for debugging
	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 400 {
		log.Printf("⚠️  API call failed: %s %s -> %d: %s", req.Method, url, resp.StatusCode, string(body))
		return fmt.Errorf("API call failed with status %d: %s", resp.StatusCode, string(body))
	}

	log.Printf("✅ API call successful: %s %s -> %d", req.Method, url, resp.StatusCode)
	return nil
}