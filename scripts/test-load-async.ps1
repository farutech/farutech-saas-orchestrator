# Load Testing Script for Farutech Orchestrator Async Processing
# This script performs concurrent provisioning requests to test system scalability

param(
    [string]$ApiUrl = "http://localhost:5000",
    [int]$ConcurrentRequests = 5,
    [int]$TotalRequests = 20,
    [int]$RampUpDelay = 1000  # milliseconds between requests
)

Write-Host "🚀 FARUTECH ORCHESTRATOR - LOAD TESTING" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor White
Write-Host "Concurrent Requests: $ConcurrentRequests" -ForegroundColor White
Write-Host "Total Requests: $TotalRequests" -ForegroundColor White
Write-Host "Ramp-up Delay: $RampUpDelay ms" -ForegroundColor White
Write-Host ""

$startTime = Get-Date
$results = @()
$errors = @()

# Function to perform a single provisioning request
function Invoke-ProvisioningRequest {
    param([int]$RequestId)

    $requestStart = Get-Date

    try {
        $customerId = "load-test-customer-$RequestId-$(Get-Random)"
        $productId = "550e8400-e29b-41d4-a716-446655440001"  # Assuming this exists
        $subscriptionPlanId = "550e8400-e29b-41d4-a716-446655440002"  # Assuming this exists

        $provisionRequest = @{
            customerId = $customerId
            productId = $productId
            subscriptionPlanId = $subscriptionPlanId
            code = "LOADTEST$RequestId"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$ApiUrl/api/provisioning/provision" -Method POST -Body $provisionRequest -ContentType "application/json" -TimeoutSec 30

        $requestEnd = Get-Date
        $duration = ($requestEnd - $requestStart).TotalMilliseconds

        return @{
            RequestId = $RequestId
            Success = $true
            TaskId = $response.taskId
            Status = $response.status
            Duration = $duration
            Error = $null
        }

    } catch {
        $requestEnd = Get-Date
        $duration = ($requestEnd - $requestStart).TotalMilliseconds

        return @{
            RequestId = $RequestId
            Success = $false
            TaskId = $null
            Status = $null
            Duration = $duration
            Error = $_.Exception.Message
        }
    }
}

# Run concurrent requests using PowerShell jobs
Write-Host "📤 Starting load test..." -ForegroundColor Yellow

$jobs = @()
$completedRequests = 0

for ($i = 1; $i -le $TotalRequests; $i++) {
    $job = Start-Job -ScriptBlock ${function:Invoke-ProvisioningRequest} -ArgumentList $i
    $jobs += $job

    # Control concurrency
    if ($jobs.Count -ge $ConcurrentRequests) {
        # Wait for at least one job to complete
        $finishedJob = $null
        while (-not $finishedJob) {
            $finishedJob = $jobs | Where-Object { $_.State -eq "Completed" } | Select-Object -First 1
            Start-Sleep -Milliseconds 100
        }

        $result = Receive-Job -Job $finishedJob
        $results += $result
        $completedRequests++

        # Remove completed job from array
        $jobs = $jobs | Where-Object { $_.Id -ne $finishedJob.Id }
        Remove-Job -Job $finishedJob
    }

    # Ramp-up delay
    if ($RampUpDelay -gt 0) {
        Start-Sleep -Milliseconds $RampUpDelay
    }
}

# Wait for remaining jobs to complete
Write-Host "⏳ Waiting for remaining requests to complete..." -ForegroundColor Yellow
foreach ($job in $jobs) {
    Wait-Job -Job $job -Timeout 60 | Out-Null
    $result = Receive-Job -Job $job
    $results += $result
    $completedRequests++
    Remove-Job -Job $job
}

$endTime = Get-Date
$totalDuration = ($endTime - $startTime).TotalSeconds

# Analyze results
$successfulRequests = $results | Where-Object { $_.Success }
$failedRequests = $results | Where-Object { -not $_.Success }

$successRate = if ($results.Count -gt 0) { [math]::Round(($successfulRequests.Count / $results.Count) * 100, 2) } else { 0 }
$avgResponseTime = if ($successfulRequests.Count -gt 0) { [math]::Round(($successfulRequests | Measure-Object -Property Duration -Average).Average, 2) } else { 0 }
$minResponseTime = if ($successfulRequests.Count -gt 0) { [math]::Round(($successfulRequests | Measure-Object -Property Duration -Minimum).Minimum, 2) } else { 0 }
$maxResponseTime = if ($successfulRequests.Count -gt 0) { [math]::Round(($successfulRequests | Measure-Object -Property Duration -Maximum).Maximum, 2) } else { 0 }

$requestsPerSecond = [math]::Round($TotalRequests / $totalDuration, 2)

Write-Host ""
Write-Host "📊 LOAD TEST RESULTS" -ForegroundColor Cyan
Write-Host "Total Duration: $([math]::Round($totalDuration, 2)) seconds" -ForegroundColor White
Write-Host "Requests per Second: $requestsPerSecond" -ForegroundColor White
Write-Host ""
Write-Host "Request Statistics:" -ForegroundColor White
Write-Host "  Total Requests: $($results.Count)" -ForegroundColor White
Write-Host "  Successful: $($successfulRequests.Count)" -ForegroundColor Green
Write-Host "  Failed: $($failedRequests.Count)" -ForegroundColor Red
Write-Host "  Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 95) { "Green" } elseif ($successRate -ge 80) { "Yellow" } else { "Red" })
Write-Host ""
Write-Host "Response Time Statistics:" -ForegroundColor White
Write-Host "  Average: $avgResponseTime ms" -ForegroundColor White
Write-Host "  Minimum: $minResponseTime ms" -ForegroundColor White
Write-Host "  Maximum: $maxResponseTime ms" -ForegroundColor White

# Show sample successful requests
if ($successfulRequests.Count -gt 0) {
    Write-Host ""
    Write-Host "✅ Sample Successful Requests:" -ForegroundColor Green
    $successfulRequests | Select-Object -First 3 | ForEach-Object {
        Write-Host "  Request $($_.RequestId): Task $($_.TaskId) - $($_.Duration)ms" -ForegroundColor Green
    }
}

# Show failed requests
if ($failedRequests.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Failed Requests:" -ForegroundColor Red
    $failedRequests | ForEach-Object {
        Write-Host "  Request $($_.RequestId): $($_.Error)" -ForegroundColor Red
    }
}

# Performance assessment
Write-Host ""
Write-Host "🎯 PERFORMANCE ASSESSMENT" -ForegroundColor Cyan

$performanceScore = 0
$assessment = @()

if ($successRate -ge 95) {
    $performanceScore += 30
    $assessment += "✅ Excellent success rate ($successRate%)"
} elseif ($successRate -ge 80) {
    $performanceScore += 20
    $assessment += "⚠️  Good success rate ($successRate%)"
} else {
    $performanceScore += 5
    $assessment += "❌ Poor success rate ($successRate%)"
}

if ($avgResponseTime -le 2000) {
    $performanceScore += 30
    $assessment += "✅ Fast average response time ($avgResponseTime ms)"
} elseif ($avgResponseTime -le 5000) {
    $performanceScore += 20
    $assessment += "⚠️  Acceptable response time ($avgResponseTime ms)"
} else {
    $performanceScore += 5
    $assessment += "❌ Slow response time ($avgResponseTime ms)"
}

if ($requestsPerSecond -ge 10) {
    $performanceScore += 40
    $assessment += "✅ High throughput ($requestsPerSecond req/sec)"
} elseif ($requestsPerSecond -ge 5) {
    $performanceScore += 25
    $assessment += "⚠️  Moderate throughput ($requestsPerSecond req/sec)"
} else {
    $performanceScore += 10
    $assessment += "❌ Low throughput ($requestsPerSecond req/sec)"
}

$grade = switch {
    ($performanceScore -ge 90) { "A" }
    ($performanceScore -ge 80) { "B" }
    ($performanceScore -ge 70) { "C" }
    ($performanceScore -ge 60) { "D" }
    default { "F" }
}

Write-Host "Performance Score: $performanceScore/100 (Grade: $grade)" -ForegroundColor $(if ($performanceScore -ge 80) { "Green" } elseif ($performanceScore -ge 60) { "Yellow" } else { "Red" })
$assessment | ForEach-Object { Write-Host $_ -ForegroundColor White }

Write-Host ""
if ($performanceScore -ge 80) {
    Write-Host "🎉 SYSTEM PERFORMANCE: EXCELLENT" -ForegroundColor Green
    Write-Host "The async processing system can handle the expected load." -ForegroundColor Green
} elseif ($performanceScore -ge 60) {
    Write-Host "⚠️  SYSTEM PERFORMANCE: ACCEPTABLE" -ForegroundColor Yellow
    Write-Host "The system works but may need optimization for production load." -ForegroundColor Yellow
} else {
    Write-Host "❌ SYSTEM PERFORMANCE: NEEDS IMPROVEMENT" -ForegroundColor Red
    Write-Host "Significant performance issues detected. Review system configuration." -ForegroundColor Red
}