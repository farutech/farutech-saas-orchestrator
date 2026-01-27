# Farutech Orchestrator Workers - Makefile

.PHONY: help build run test clean docker

# Variables
BINARY_WORKER=bin/worker
BINARY_PUBLISHER=bin/publisher
GO=go
GOFLAGS=-v

help: ## Show this help message
	@echo "Farutech Orchestrator Workers - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build worker binary
	@echo "Building worker..."
	$(GO) build $(GOFLAGS) -o $(BINARY_WORKER).exe ./cmd/worker
	@echo "✅ Worker built successfully"

build-publisher: ## Build publisher binary for testing
	@echo "Building publisher..."
	$(GO) build $(GOFLAGS) -o $(BINARY_PUBLISHER).exe ./cmd/publisher
	@echo "✅ Publisher built successfully"

build-all: build build-publisher ## Build all binaries

run: ## Run worker (requires NATS running)
	@echo "Starting worker..."
	$(GO) run ./cmd/worker

run-publisher: ## Run publisher to send test tasks
	$(GO) run ./cmd/publisher -count 5

test: ## Run tests
	$(GO) test -v ./...

clean: ## Clean build artifacts
	@echo "Cleaning..."
	rm -rf bin/
	@echo "✅ Clean complete"

mod-download: ## Download Go module dependencies
	$(GO) mod download

mod-tidy: ## Tidy Go modules
	$(GO) mod tidy

fmt: ## Format Go code
	$(GO) fmt ./...

vet: ## Run go vet
	$(GO) vet ./...

lint: fmt vet ## Run all linters

# Default target
.DEFAULT_GOAL := help
