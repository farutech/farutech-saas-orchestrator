# Run Farutech Worker

Write-Host "🚀 Starting Farutech Orchestrator Worker..." -ForegroundColor Cyan
Write-Host ""

# Check if NATS is running
$natsRunning = Test-NetConnection -ComputerName localhost -Port 4222 -WarningAction SilentlyContinue -InformationLevel Quiet

if (-not $natsRunning) {
    Write-Host "⚠️  WARNING: NATS doesn't seem to be running on localhost:4222" -ForegroundColor Yellow
    Write-Host "   Start infrastructure with: .\scripts\start-infra.ps1" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 0
    }
}

# Set environment variables (optional)
# $env:NATS_URL = "nats://localhost:4222"
# $env:WORKER_ID = "worker-001"

# Run worker
go run ./cmd/worker
