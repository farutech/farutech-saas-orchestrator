# Test script for Farutech Orchestrator monitoring and metrics
# Run this after starting the infrastructure and API

Write-Host "🧪 Testing Farutech Orchestrator Monitoring & Metrics" -ForegroundColor Cyan
Write-Host ""

# Test health endpoints
Write-Host "🏥 Testing Health Endpoints..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
    Write-Host "✅ Health check: $($healthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $detailedHealthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health/detailed" -Method GET
    Write-Host "✅ Detailed health check: $($detailedHealthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Detailed health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Prometheus metrics endpoint
Write-Host ""
Write-Host "📊 Testing Prometheus Metrics..." -ForegroundColor Yellow

try {
    $metricsResponse = Invoke-WebRequest -Uri "http://localhost:5000/metrics" -Method GET
    $metricsContent = $metricsResponse.Content

    # Check for our custom metrics
    $customMetrics = @(
        "farutech_http_requests_total",
        "farutech_tasks_created_total",
        "farutech_service_auth_tokens_generated_total"
    )

    foreach ($metric in $customMetrics) {
        if ($metricsContent -match $metric) {
            Write-Host "✅ Metric found: $metric" -ForegroundColor Green
        } else {
            Write-Host "❌ Metric missing: $metric" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ Metrics endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test service authentication
Write-Host ""
Write-Host "🔐 Testing Service Authentication..." -ForegroundColor Yellow

try {
    $authRequest = @{
        serviceId = "test-worker"
        serviceType = "provisioning-worker"
        permissions = @("tasks:read", "tasks:write")
    } | ConvertTo-Json

    $authResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/serviceauth/token" -Method POST -Body $authRequest -ContentType "application/json"
    Write-Host "✅ Service token generated for: $($authResponse.serviceId)" -ForegroundColor Green

    # Test token validation
    $validateRequest = @{ token = $authResponse.token } | ConvertTo-Json
    $validateResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/serviceauth/validate" -Method POST -Body $validateRequest -ContentType "application/json"

    if ($validateResponse.isValid) {
        Write-Host "✅ Service token validated successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Service token validation failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Service authentication test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Check infrastructure services
Write-Host ""
Write-Host "🏗️  Checking Infrastructure Services..." -ForegroundColor Yellow

$services = @(
    @{ Name = "PostgreSQL"; Url = "http://localhost:5432" },
    @{ Name = "NATS"; Url = "http://localhost:8222" },
    @{ Name = "Prometheus"; Url = "http://localhost:9090" },
    @{ Name = "Grafana"; Url = "http://localhost:3000" }
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -Method GET -TimeoutSec 5
        Write-Host "✅ $($service.Name): Available" -ForegroundColor Green
    } catch {
        Write-Host "❌ $($service.Name): Not available" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Monitoring & Metrics Test Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📈 Access your dashboards:" -ForegroundColor White
Write-Host "  - Prometheus: http://localhost:9090"
Write-Host "  - Grafana: http://localhost:3000 (admin/admin123)"
Write-Host "  - API Metrics: http://localhost:5000/metrics"