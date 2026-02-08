# Full Integration Test Script for Farutech Orchestrator
# Tests the complete application startup with .NET Aspire and database initialization

param(
    [switch]$ResetDatabase,
    [switch]$SkipInfrastructure,
    [switch]$Verbose,
    [int]$TimeoutMinutes = 5
)

Write-Host "🚀 FARUTECH ORCHESTRATOR - FULL INTEGRATION TEST" -ForegroundColor Blue
Write-Host "Testing complete application startup with .NET Aspire" -ForegroundColor White
Write-Host ""

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

# Function to wait for service to be ready
function Wait-ForService {
    param(
        [string]$Url,
        [string]$ServiceName,
        [int]$TimeoutSeconds = 60
    )

    Write-Host "⏳ Waiting for $ServiceName at $Url..." -ForegroundColor Yellow

    $startTime = Get-Date
    while ((Get-Date) - $startTime).TotalSeconds -lt $TimeoutSeconds) {
        try {
            $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $ServiceName is ready!" -ForegroundColor Green
                return $true
            }
        } catch {
            # Service not ready yet
        }
        Start-Sleep -Seconds 2
    }

    Write-Host "❌ $ServiceName failed to start within $TimeoutSeconds seconds" -ForegroundColor Red
    return $false
}

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)

    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connections.Count -gt 0
}

# Step 1: Reset database if requested
if ($ResetDatabase) {
    Write-Host "🔄 Step 1: Resetting database..." -ForegroundColor Yellow
    & "$scriptDir\reset-database.ps1" -Force
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Database reset failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Database reset complete" -ForegroundColor Green
    Write-Host ""
}

# Step 2: Start infrastructure
if (-not $SkipInfrastructure) {
    Write-Host "🏗️  Step 2: Starting infrastructure..." -ForegroundColor Yellow

    # Check if infrastructure is already running
    $infraRunning = Test-PortInUse -Port 5432  # PostgreSQL
    if ($infraRunning) {
        Write-Host "ℹ️  Infrastructure appears to be already running" -ForegroundColor Cyan
    } else {
        & "$scriptDir\start-infra.ps1"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to start infrastructure" -ForegroundColor Red
            exit 1
        }

        # Wait for PostgreSQL to be ready
        $dbReady = Wait-ForService -Url "http://localhost:5432" -ServiceName "PostgreSQL" -TimeoutSeconds 30
        if (-not $dbReady) {
            Write-Host "❌ PostgreSQL failed to start" -ForegroundColor Red
            exit 1
        }
    }

    Write-Host "✅ Infrastructure ready" -ForegroundColor Green
    Write-Host ""
}

# Step 3: Start .NET Aspire application
Write-Host "🚀 Step 3: Starting .NET Aspire application..." -ForegroundColor Yellow

$aspireJob = Start-Job -ScriptBlock {
    param($projectRoot, $Verbose)
    Set-Location $projectRoot
    if ($Verbose) {
        & dotnet run --project src/03.Platform/Farutech.AppHost/Farutech.AppHost.csproj
    } else {
        & dotnet run --project src/03.Platform/Farutech.AppHost/Farutech.AppHost.csproj 2>$null
    }
} -ArgumentList $projectRoot, $Verbose

# Wait for Aspire dashboard to be ready
$dashboardReady = Wait-ForService -Url "http://localhost:15888" -ServiceName ".NET Aspire Dashboard" -TimeoutSeconds 60
if (-not $dashboardReady) {
    Write-Host "❌ .NET Aspire Dashboard failed to start" -ForegroundColor Red
    Stop-Job $aspireJob -ErrorAction SilentlyContinue
    exit 1
}

# Wait for API to be ready (adjust URL as needed)
$apiReady = Wait-ForService -Url "http://localhost:5000/health" -ServiceName "Orchestrator API" -TimeoutSeconds 120
if (-not $apiReady) {
    Write-Host "❌ Orchestrator API failed to start" -ForegroundColor Red
    Stop-Job $aspireJob -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "✅ Application started successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Run database migration tests
Write-Host "🧪 Step 4: Running database migration tests..." -ForegroundColor Yellow

& "$scriptDir\test-database-migration.ps1" -Verbose:$Verbose
$testResult = $LASTEXITCODE

if ($testResult -eq 0) {
    Write-Host "✅ Database migration tests passed" -ForegroundColor Green
} else {
    Write-Host "❌ Database migration tests failed" -ForegroundColor Red
}

Write-Host ""

# Step 5: Test API endpoints
Write-Host "🔍 Step 5: Testing API endpoints..." -ForegroundColor Yellow

$apiTests = @(
    @{ Url = "http://localhost:5000/health"; ExpectedStatus = 200; Name = "Health Check" },
    @{ Url = "http://localhost:5000/api/v1/tenants"; ExpectedStatus = 401; Name = "Tenants API (requires auth)" }
)

$apiTestResults = @()
foreach ($test in $apiTests) {
    try {
        $response = Invoke-WebRequest -Uri $test.Url -Method GET -TimeoutSec 10 -ErrorAction Stop
        $status = $response.StatusCode

        if ($status -eq $test.ExpectedStatus) {
            Write-Host "✅ $($test.Name): $status" -ForegroundColor Green
            $apiTestResults += $true
        } else {
            Write-Host "❌ $($test.Name): Expected $($test.ExpectedStatus), got $status" -ForegroundColor Red
            $apiTestResults += $false
        }
    } catch {
        Write-Host "❌ $($test.Name): $($_.Exception.Message)" -ForegroundColor Red
        $apiTestResults += $false
    }
}

$apiTestsPassed = ($apiTestResults | Where-Object { $_ -eq $false }).Count -eq 0

Write-Host ""

# Cleanup
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
Stop-Job $aspireJob -ErrorAction SilentlyContinue

if (-not $SkipInfrastructure) {
    Write-Host "Stopping infrastructure..." -ForegroundColor Yellow
    # Note: You might want to add a stop-infra.ps1 script
    # & "$scriptDir\stop-infra.ps1"
}

# Final summary
Write-Host ""
Write-Host "📊 INTEGRATION TEST SUMMARY" -ForegroundColor Blue
Write-Host "===========================" -ForegroundColor Blue

Write-Host "Database Tests: $(if ($testResult -eq 0) { '✅' } else { '❌' })"
Write-Host "API Tests: $(if ($apiTestsPassed) { '✅' } else { '❌' })"

$overallSuccess = ($testResult -eq 0) -and $apiTestsPassed

Write-Host ""
if ($overallSuccess) {
    Write-Host "🎉 ALL INTEGRATION TESTS PASSED!" -ForegroundColor Green
    Write-Host "The application starts correctly with .NET Aspire and database initialization works." -ForegroundColor White
    exit 0
} else {
    Write-Host "❌ SOME INTEGRATION TESTS FAILED!" -ForegroundColor Red
    Write-Host "Check the output above for details." -ForegroundColor White
    exit 1
}