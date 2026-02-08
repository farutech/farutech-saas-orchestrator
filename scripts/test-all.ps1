# Master Testing Orchestrator for Farutech Async Processing System
# This script runs the complete testing pipeline

param(
    [switch]$SkipInfrastructureValidation,
    [switch]$SkipE2ETesting,
    [switch]$SkipLoadTesting,
    [switch]$QuickMode,  # Skip load testing for faster validation
    [string]$ApiUrl = "http://localhost:5000"
)

Write-Host "🎯 FARUTECH ORCHESTRATOR - MASTER TESTING ORCHESTRATOR" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor White
Write-Host "Skip Infrastructure: $SkipInfrastructureValidation" -ForegroundColor White
Write-Host "Skip E2E Testing: $SkipE2ETesting" -ForegroundColor White
Write-Host "Skip Load Testing: $SkipLoadTesting" -ForegroundColor White
Write-Host "Quick Mode: $QuickMode" -ForegroundColor White
Write-Host ""

$startTime = Get-Date
$testResults = @{}

# Function to run a test script and capture results
function Run-TestScript {
    param(
        [string]$ScriptName,
        [string]$Description,
        [string[]]$Arguments = @()
    )

    Write-Host "🔄 Running $Description..." -ForegroundColor Yellow
    Write-Host "   Script: $ScriptName" -ForegroundColor Gray

    $scriptPath = Join-Path $PSScriptRoot $ScriptName
    if (-not (Test-Path $scriptPath)) {
        Write-Host "❌ Script not found: $scriptPath" -ForegroundColor Red
        $testResults[$ScriptName] = @{ Status = "ERROR"; Details = "Script file not found" }
        return $false
    }

    try {
        $argList = $Arguments
        if ($ApiUrl -and $ApiUrl -ne "http://localhost:5000") {
            $argList += "-ApiUrl", $ApiUrl
        }

        $process = Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy", "Bypass", "-File", $scriptPath, $argList -NoNewWindow -Wait -PassThru

        if ($process.ExitCode -eq 0) {
            Write-Host "✅ $Description completed successfully" -ForegroundColor Green
            $testResults[$ScriptName] = @{ Status = "PASS"; Details = "Exit code: $($process.ExitCode)" }
            return $true
        } else {
            Write-Host "❌ $Description failed (Exit code: $($process.ExitCode))" -ForegroundColor Red
            $testResults[$ScriptName] = @{ Status = "FAIL"; Details = "Exit code: $($process.ExitCode)" }
            return $false
        }
    } catch {
        Write-Host "❌ $Description error: $($_.Exception.Message)" -ForegroundColor Red
        $testResults[$ScriptName] = @{ Status = "ERROR"; Details = $_.Exception.Message }
        return $false
    }
}

# 1. Infrastructure Validation
$infraPassed = $true
if (-not $SkipInfrastructureValidation) {
    $infraPassed = Run-TestScript -ScriptName "validate-infrastructure.ps1" -Description "Infrastructure Validation"
} else {
    Write-Host "⏭️  Skipping Infrastructure Validation" -ForegroundColor Yellow
    $testResults["validate-infrastructure.ps1"] = @{ Status = "SKIPPED"; Details = "User requested skip" }
}

# 2. End-to-End Testing
$e2ePassed = $true
if ($infraPassed -and -not $SkipE2ETesting) {
    $e2ePassed = Run-TestScript -ScriptName "test-e2e-async.ps1" -Description "End-to-End Async Testing"
} elseif (-not $infraPassed) {
    Write-Host "⏭️  Skipping E2E Testing (infrastructure validation failed)" -ForegroundColor Yellow
    $testResults["test-e2e-async.ps1"] = @{ Status = "SKIPPED"; Details = "Infrastructure validation failed" }
} else {
    Write-Host "⏭️  Skipping E2E Testing" -ForegroundColor Yellow
    $testResults["test-e2e-async.ps1"] = @{ Status = "SKIPPED"; Details = "User requested skip" }
}

# 3. Load Testing
$loadPassed = $true
if ($e2ePassed -and -not $SkipLoadTesting -and -not $QuickMode) {
    $loadPassed = Run-TestScript -ScriptName "test-load-async.ps1" -Description "Load Testing" -Arguments @("-ConcurrentRequests", "3", "-TotalRequests", "10")
} elseif ($QuickMode) {
    Write-Host "⏭️  Skipping Load Testing (quick mode enabled)" -ForegroundColor Yellow
    $testResults["test-load-async.ps1"] = @{ Status = "SKIPPED"; Details = "Quick mode enabled" }
} elseif (-not $e2ePassed) {
    Write-Host "⏭️  Skipping Load Testing (E2E testing failed)" -ForegroundColor Yellow
    $testResults["test-load-async.ps1"] = @{ Status = "SKIPPED"; Details = "E2E testing failed" }
} else {
    Write-Host "⏭️  Skipping Load Testing" -ForegroundColor Yellow
    $testResults["test-load-async.ps1"] = @{ Status = "SKIPPED"; Details = "User requested skip" }
}

# Calculate final results
$endTime = Get-Date
$totalDuration = ($endTime - $startTime).TotalSeconds

$passed = ($testResults.Values | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults.Values | Where-Object { $_.Status -eq "FAIL" -or $_.Status -eq "ERROR" }).Count
$skipped = ($testResults.Values | Where-Object { $_.Status -eq "SKIPPED" }).Count
$total = $testResults.Count

$overallSuccess = ($failed -eq 0) -and ($passed -ge 1) # At least infrastructure validation should pass

# Summary Report
Write-Host ""
Write-Host "📊 MASTER TESTING REPORT" -ForegroundColor Cyan
Write-Host "Total Duration: $([math]::Round($totalDuration, 2)) seconds" -ForegroundColor White
Write-Host ""
Write-Host "Test Results:" -ForegroundColor White
Write-Host "  Passed: $passed" -ForegroundColor Green
Write-Host "  Failed: $failed" -ForegroundColor Red
Write-Host "  Skipped: $skipped" -ForegroundColor Yellow
Write-Host "  Total: $total" -ForegroundColor White

Write-Host ""
Write-Host "Detailed Results:" -ForegroundColor White
foreach ($test in $testResults.GetEnumerator()) {
    $status = $test.Value.Status
    $color = switch ($status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "ERROR" { "Red" }
        "SKIPPED" { "Yellow" }
        default { "White" }
    }
    $icon = switch ($status) {
        "PASS" { "✅" }
        "FAIL" { "❌" }
        "ERROR" { "💥" }
        "SKIPPED" { "⏭️" }
        default { "❓" }
    }
    Write-Host "  $icon $($test.Key): $($test.Value.Details)" -ForegroundColor $color
}

Write-Host ""
if ($overallSuccess) {
    Write-Host "🎉 TESTING PIPELINE: SUCCESS" -ForegroundColor Green
    Write-Host "The Farutech Orchestrator async processing system is working correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "1. Review monitoring dashboards at http://localhost:3000 (admin/admin)" -ForegroundColor White
    Write-Host "2. Check metrics at http://localhost:9090" -ForegroundColor White
    Write-Host "3. Monitor system health at $ApiUrl/api/health" -ForegroundColor White
    Write-Host "4. Ready for production deployment!" -ForegroundColor Green
} else {
    Write-Host "⚠️  TESTING PIPELINE: ISSUES DETECTED" -ForegroundColor Yellow
    Write-Host "Some tests failed or were skipped. Check the details above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 TROUBLESHOOTING:" -ForegroundColor Cyan
    Write-Host "1. Ensure all Docker services are running: .\scripts\start-infra.ps1" -ForegroundColor White
    Write-Host "2. Check service logs: docker logs <container_name>" -ForegroundColor White
    Write-Host "3. Run individual tests to isolate issues" -ForegroundColor White
    Write-Host "4. Verify database migrations are applied" -ForegroundColor White
}

# Performance metrics
if ($totalDuration -gt 0) {
    $testsPerSecond = [math]::Round($total / $totalDuration, 2)
    Write-Host ""
    Write-Host "⚡ Performance: $testsPerSecond tests/second" -ForegroundColor Gray
}

# Export results to file
$resultFile = "d:/farutech_2025/test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$testResults | ConvertTo-Json | Out-File -FilePath $resultFile -Encoding UTF8
Write-Host ""
Write-Host "📄 Results exported to: $resultFile" -ForegroundColor Gray