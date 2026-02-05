# End-to-End Testing Script for Farutech Orchestrator Async Processing
# This script tests the complete async provisioning workflow

param(
    [string]$ApiUrl = "http://localhost:5000",
    [string]$WorkerId = "test-worker-$(Get-Random)",
    [int]$TestDuration = 60  # seconds
)

Write-Host "🧪 FARUTECH ORCHESTRATOR - END-TO-END ASYNC TESTING" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor White
Write-Host "Worker ID: $WorkerId" -ForegroundColor White
Write-Host "Test Duration: $TestDuration seconds" -ForegroundColor White
Write-Host ""

# Test counters
$testsRun = 0
$testsPassed = 0
$testsFailed = 0

function Test-Result {
    param([string]$TestName, [bool]$Result, [string]$Details = "")

    $global:testsRun++
    if ($Result) {
        $global:testsPassed++
        Write-Host "✅ $TestName" -ForegroundColor Green
        if ($Details) { Write-Host "   $Details" -ForegroundColor Gray }
    } else {
        $global:testsFailed++
        Write-Host "❌ $TestName" -ForegroundColor Red
        if ($Details) { Write-Host "   $Details" -ForegroundColor Red }
    }
}

# 1. Test Infrastructure Health
Write-Host "🏗️  Testing Infrastructure..." -ForegroundColor Yellow

# Test API Health
try {
    $healthResponse = Invoke-RestMethod -Uri "$ApiUrl/api/health" -Method GET -TimeoutSec 10
    Test-Result "API Health Check" ($healthResponse.status -eq "Healthy") "Status: $($healthResponse.status)"
} catch {
    Test-Result "API Health Check" $false "Error: $($_.Exception.Message)"
}

# Test Database Connection (via health check)
try {
    $detailedHealth = Invoke-RestMethod -Uri "$ApiUrl/api/health/detailed" -Method GET -TimeoutSec 10
    $dbHealthy = $detailedHealth.services | Where-Object { $_.Key -eq "postgresql" } | Select-Object -ExpandProperty Value
    Test-Result "Database Connection" ($dbHealthy.status -eq "Healthy") "PostgreSQL: $($dbHealthy.status)"
} catch {
    Test-Result "Database Connection" $false "Error: $($_.Exception.Message)"
}

# 2. Test Service Authentication
Write-Host ""
Write-Host "🔐 Testing Service Authentication..." -ForegroundColor Yellow

$serviceToken = $null
try {
    $authRequest = @{
        serviceId = $WorkerId
        serviceType = "provisioning-worker"
        permissions = @("tasks:read", "tasks:write", "provisioning:execute")
    } | ConvertTo-Json

    $authResponse = Invoke-RestMethod -Uri "$ApiUrl/api/serviceauth/token" -Method POST -Body $authRequest -ContentType "application/json"
    $serviceToken = $authResponse.token
    Test-Result "Service Token Generation" ($authResponse.token -and $authResponse.serviceId -eq $WorkerId) "Token generated for $($authResponse.serviceId)"
} catch {
    Test-Result "Service Token Generation" $false "Error: $($_.Exception.Message)"
}

# Test Token Validation
if ($serviceToken) {
    try {
        $validateRequest = @{ token = $serviceToken } | ConvertTo-Json
        $validateResponse = Invoke-RestMethod -Uri "$ApiUrl/api/serviceauth/validate" -Method POST -Body $validateRequest -ContentType "application/json"
        Test-Result "Service Token Validation" $validateResponse.isValid "Token valid for service: $($validateResponse.serviceId)"
    } catch {
        Test-Result "Service Token Validation" $false "Error: $($_.Exception.Message)"
    }
}

# 3. Test Async Provisioning Flow
Write-Host ""
Write-Host "⚙️  Testing Async Provisioning Flow..." -ForegroundColor Yellow

$taskId = $null
$tenantCode = $null

# Create test customer first (if needed)
$customerId = "test-customer-$(Get-Random)"
$productId = "550e8400-e29b-41d4-a716-446655440001"  # Assuming this exists from seeds
$subscriptionPlanId = "550e8400-e29b-41d4-a716-446655440002"  # Assuming this exists

try {
    # Note: In a real test, you'd need to create customer/product first
    # For now, we'll test with assumed existing IDs
    $provisionRequest = @{
        customerId = $customerId
        productId = $productId
        subscriptionPlanId = $subscriptionPlanId
        code = "TEST$(Get-Random)"
    } | ConvertTo-Json

    $provisionResponse = Invoke-RestMethod -Uri "$ApiUrl/api/provisioning/provision" -Method POST -Body $provisionRequest -ContentType "application/json"
    $taskId = $provisionResponse.taskId
    $tenantCode = $provisionResponse.tenantCode

    Test-Result "Async Provisioning Request" ($provisionResponse.status -eq "QUEUED" -and $taskId) "Task ID: $taskId, Status: $($provisionResponse.status)"
} catch {
    Test-Result "Async Provisioning Request" $false "Error: $($_.Exception.Message)"
    # If provisioning fails due to missing customer/product, that's expected in a clean test environment
    Write-Host "   Note: This may fail if test data doesn't exist. This is normal for E2E testing." -ForegroundColor Yellow
}

# 4. Test Task Status Monitoring
if ($taskId) {
    Write-Host ""
    Write-Host "📊 Testing Task Status Monitoring..." -ForegroundColor Yellow

    try {
        $statusResponse = Invoke-RestMethod -Uri "$ApiUrl/api/provisioning/tasks/$taskId/status" -Method GET
        Test-Result "Task Status Retrieval" ($statusResponse.taskId -eq $taskId) "Status: $($statusResponse.status), Progress: $($statusResponse.progress)%"
    } catch {
        Test-Result "Task Status Retrieval" $false "Error: $($_.Exception.Message)"
    }
}

# 5. Test Worker Callback Simulation
if ($taskId -and $serviceToken) {
    Write-Host ""
    Write-Host "🔄 Testing Worker Callbacks..." -ForegroundColor Yellow

    # Simulate worker progress updates
    $progressSteps = @(
        @{ step = "Initializing tenant database"; progress = 10 },
        @{ step = "Creating database schema"; progress = 30 },
        @{ step = "Setting up security policies"; progress = 50 },
        @{ step = "Configuring modules"; progress = 70 },
        @{ step = "Finalizing setup"; progress = 90 }
    )

    foreach ($step in $progressSteps) {
        try {
            $updateRequest = @{
                status = "IN_PROGRESS"
                progress = $step.progress
                currentStep = $step.step
            } | ConvertTo-Json

            $updateResponse = Invoke-RestMethod -Uri "$ApiUrl/api/provisioning/tasks/$taskId/status" -Method POST -Body $updateRequest -ContentType "application/json" -Headers @{ "Authorization" = "Bearer $serviceToken" }
            Test-Result "Worker Progress Update ($($step.progress)%)" ($updateResponse.message -eq "Task status updated successfully") "Step: $($step.step)"
        } catch {
            Test-Result "Worker Progress Update ($($step.progress)%)" $false "Error: $($_.Exception.Message)"
        }
        Start-Sleep -Milliseconds 500
    }

    # Simulate task completion
    try {
        $completeResponse = Invoke-RestMethod -Uri "$ApiUrl/api/provisioning/tasks/$taskId/complete" -Method POST -Headers @{ "Authorization" = "Bearer $serviceToken" }
        Test-Result "Task Completion" ($completeResponse.message -eq "Task marked as completed") "Task $taskId completed successfully"
    } catch {
        Test-Result "Task Completion" $false "Error: $($_.Exception.Message)"
    }
}

# 6. Test Metrics Collection
Write-Host ""
Write-Host "📈 Testing Metrics Collection..." -ForegroundColor Yellow

try {
    $metricsResponse = Invoke-WebRequest -Uri "$ApiUrl/metrics" -Method GET
    $metricsContent = $metricsResponse.Content

    $expectedMetrics = @(
        "farutech_http_requests_total",
        "farutech_tasks_created_total",
        "farutech_service_auth_tokens_generated_total",
        "farutech_service_auth_tokens_validated_total"
    )

    $metricsFound = 0
    foreach ($metric in $expectedMetrics) {
        if ($metricsContent -match $metric) {
            $metricsFound++
        }
    }

    Test-Result "Prometheus Metrics" ($metricsFound -eq $expectedMetrics.Count) "Found $metricsFound/$($expectedMetrics.Count) expected metrics"
} catch {
    Test-Result "Prometheus Metrics" $false "Error: $($_.Exception.Message)"
}

# 7. Test Final Task Status
if ($taskId) {
    Write-Host ""
    Write-Host "🏁 Testing Final Task Status..." -ForegroundColor Yellow

    try {
        $finalStatusResponse = Invoke-RestMethod -Uri "$ApiUrl/api/provisioning/tasks/$taskId/status" -Method GET
        $isCompleted = $finalStatusResponse.status -eq "COMPLETED"
        Test-Result "Final Task Status" $isCompleted "Final status: $($finalStatusResponse.status), Progress: $($finalStatusResponse.progress)%"
    } catch {
        Test-Result "Final Task Status" $false "Error: $($_.Exception.Message)"
    }
}

# 8. Performance Test Summary
Write-Host ""
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "Tests Run: $testsRun" -ForegroundColor White
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor Red

$successRate = if ($testsRun -gt 0) { [math]::Round(($testsPassed / $testsRun) * 100, 1) } else { 0 }
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 60) { "Yellow" } else { "Red" })

if ($testsFailed -eq 0) {
    Write-Host ""
    Write-Host "🎉 ALL TESTS PASSED! The async processing system is working correctly." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Some tests failed. Check the output above for details." -ForegroundColor Yellow
    Write-Host "This may be expected if running against a clean database without test data." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔗 Useful URLs:" -ForegroundColor White
Write-Host "  API: $ApiUrl" -ForegroundColor White
Write-Host "  Health: $ApiUrl/api/health" -ForegroundColor White
Write-Host "  Metrics: $ApiUrl/metrics" -ForegroundColor White
if ($taskId) {
    Write-Host "  Task Status: $ApiUrl/api/provisioning/tasks/$taskId/status" -ForegroundColor White
}