# Infrastructure Validation Script for Farutech Orchestrator
# This script validates that all required services are running and healthy

param(
    [string]$ApiUrl = "http://localhost:5000",
    [string]$NatsUrl = "http://localhost:4222",
    [string]$PrometheusUrl = "http://localhost:9090",
    [string]$GrafanaUrl = "http://localhost:3000",
    [int]$TimeoutSeconds = 30
)

Write-Host "VALIDATION: FARUTECH ORCHESTRATOR - INFRASTRUCTURE VALIDATION" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor White
Write-Host "Timeout: $TimeoutSeconds seconds" -ForegroundColor White
Write-Host ""

$validationResults = @{}

# Function to test service availability
function Test-Service {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [int]$ExpectedStatusCode = 200,
        [scriptblock]$CustomValidation = $null
    )

    Write-Host "Testing $Name..." -ForegroundColor Yellow -NoNewline

    try {
        $response = Invoke-WebRequest -Uri $Url -Method $Method -TimeoutSec $TimeoutSeconds -ErrorAction Stop

        if ($response.StatusCode -eq $ExpectedStatusCode) {
            if ($CustomValidation) {
                $customResult = & $CustomValidation $response
                if ($customResult) {
                    Write-Host " OK" -ForegroundColor Green
                    $validationResults[$Name] = @{ Status = "PASS"; Details = "Service responding correctly" }
                    return $true
                } else {
                    Write-Host " FAIL" -ForegroundColor Red
                    $validationResults[$Name] = @{ Status = "FAIL"; Details = "Custom validation failed" }
                    return $false
                }
            } else {
                Write-Host " OK" -ForegroundColor Green
                $validationResults[$Name] = @{ Status = "PASS"; Details = "HTTP $($response.StatusCode)" }
                return $true
            }
        } else {
            Write-Host " FAIL" -ForegroundColor Red
            $validationResults[$Name] = @{ Status = "FAIL"; Details = "Unexpected status: $($response.StatusCode)" }
            return $false
        }
    } catch {
        Write-Host " FAIL" -ForegroundColor Red
        $validationResults[$Name] = @{ Status = "FAIL"; Details = $_.Exception.Message }
        return $false
    }
}

# Test API Health
Test-Service -Name "API Service" -Url "$ApiUrl/api/health" -CustomValidation {
    param($response)
    try {
        $health = $response.Content | ConvertFrom-Json
        return $health.status -eq "Healthy"
    } catch {
        return $false
    }
}

# Test Docker Services
Write-Host "Testing Docker Services..." -ForegroundColor Yellow -NoNewline
try {
    $dockerPs = docker ps --format "table {{.Names}}\t{{.Status}}" 2>$null
    if ($LASTEXITCODE -eq 0) {
        $services = $dockerPs | Where-Object { $_ -match "^(farutech-|nats|postgres|prometheus|grafana)" }
        $runningServices = ($services | Where-Object { $_ -match "Up" }).Count
        $totalServices = $services.Count

        if ($runningServices -ge 3) {
            Write-Host " OK ($runningServices/$totalServices running)" -ForegroundColor Green
            $validationResults["Docker Services"] = @{ Status = "PASS"; Details = "$runningServices/$totalServices services running" }
        } else {
            Write-Host " WARNING ($runningServices/$totalServices running)" -ForegroundColor Yellow
            $validationResults["Docker Services"] = @{ Status = "WARN"; Details = "Only $runningServices/$totalServices services running" }
        }
    } else {
        Write-Host " FAIL" -ForegroundColor Red
        $validationResults["Docker Services"] = @{ Status = "FAIL"; Details = "Docker not accessible" }
    }
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $validationResults["Docker Services"] = @{ Status = "FAIL"; Details = $_.Exception.Message }
}

# Summary
Write-Host ""
Write-Host "VALIDATION SUMMARY" -ForegroundColor Cyan

$passed = ($validationResults.Values | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($validationResults.Values | Where-Object { $_.Status -eq "FAIL" }).Count
$warned = ($validationResults.Values | Where-Object { $_.Status -eq "WARN" }).Count
$total = $validationResults.Count

Write-Host "Total Services Checked: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Warnings: $warned" -ForegroundColor Yellow

$overallSuccess = ($failed -eq 0) -and ($passed -ge ($total * 0.7))

Write-Host ""
Write-Host "Service Details:" -ForegroundColor White
foreach ($service in $validationResults.GetEnumerator()) {
    $status = $service.Value.Status
    $color = switch ($status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "WARN" { "Yellow" }
        default { "White" }
    }
    $icon = switch ($status) {
        "PASS" { "[OK]" }
        "FAIL" { "[FAIL]" }
        "WARN" { "[WARN]" }
        default { "[?]" }
    }
    Write-Host "  $icon $($service.Key): $($service.Value.Details)" -ForegroundColor $color
}

Write-Host ""
if ($overallSuccess) {
    Write-Host "SUCCESS: INFRASTRUCTURE VALIDATION PASSED" -ForegroundColor Green
    Write-Host "All critical services are running and healthy." -ForegroundColor Green
} else {
    Write-Host "ISSUES: INFRASTRUCTURE VALIDATION DETECTED PROBLEMS" -ForegroundColor Yellow
    Write-Host "Some services are not running or have issues." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "RECOMMENDATIONS:" -ForegroundColor Cyan
Write-Host "1. Start the infrastructure: .\scripts\start-infra.ps1" -ForegroundColor White
Write-Host "2. Check Docker services: docker ps -a" -ForegroundColor White
Write-Host "3. Then proceed with: .\scripts\test-e2e-async.ps1" -ForegroundColor White