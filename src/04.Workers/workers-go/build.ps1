# Build worker binary for Windows

Write-Host "🔨 Building Farutech Worker..." -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# Create bin directory if it doesn't exist
if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

# Build worker
Write-Host "Building worker binary..." -ForegroundColor Yellow
go build -v -o bin/worker.exe ./cmd/worker

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Worker built successfully: bin/worker.exe" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Build publisher (test tool)
Write-Host ""
Write-Host "Building publisher binary..." -ForegroundColor Yellow
go build -v -o bin/publisher.exe ./cmd/publisher

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Publisher built successfully: bin/publisher.exe" -ForegroundColor Green
} else {
    Write-Host "⚠️  Publisher build failed (optional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Build complete!" -ForegroundColor Green
Write-Host "Run with: .\bin\worker.exe" -ForegroundColor Cyan
