#!/usr/bin/env pwsh
# ============================================================================
# START DASHBOARD - Quick Development Script
# ============================================================================
# Inicia el Dashboard con Design System v1.1.0 integrado
#
# Requisitos:
# - Node.js 18+
# - npm o pnpm
# - Design System construido
#
# Uso:
#   .\scripts\start-dashboard.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Farutech Dashboard - Starting Development Server" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# Variables
$DesignSystemPath = "src\05.SDK\DesignSystem"
$DashboardPath = "src\02.Apps\Frontend\Dashboard"

# Step 1: Verificar que Design System está construido
Write-Host "`n📦 Step 1: Checking Design System build..." -ForegroundColor Yellow
if (!(Test-Path "$DesignSystemPath\dist\index.mjs")) {
    Write-Host "   ⚠️  Design System not built. Building now..." -ForegroundColor Yellow
    Push-Location $DesignSystemPath
    npm run build
    Pop-Location
    Write-Host "   ✅ Design System built successfully" -ForegroundColor Green
} else {
    Write-Host "   ✅ Design System already built" -ForegroundColor Green
}

# Step 2: Verificar node_modules del Dashboard
Write-Host "`n📦 Step 2: Checking Dashboard dependencies..." -ForegroundColor Yellow
if (!(Test-Path "$DashboardPath\node_modules")) {
    Write-Host "   ⚠️  Dependencies not installed. Installing now..." -ForegroundColor Yellow
    Push-Location $DashboardPath
    npm install
    Pop-Location
    Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "   ✅ Dependencies already installed" -ForegroundColor Green
}

# Step 3: Verificar infraestructura (opcional)
Write-Host "`n🐳 Step 3: Checking infrastructure..." -ForegroundColor Yellow
$PostgresRunning = podman ps --filter "name=farutech_postgres" --format "{{.Names}}" 2>$null
if ($PostgresRunning -eq "farutech_postgres") {
    Write-Host "   ✅ PostgreSQL running" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  PostgreSQL not running. Start with: podman compose up -d" -ForegroundColor Yellow
}

# Step 4: Iniciar Dashboard
Write-Host "`n🌐 Step 4: Starting Dashboard..." -ForegroundColor Yellow
Write-Host "   📍 URL: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   📍 Network: http://192.168.1.x:5173" -ForegroundColor Cyan
Write-Host "`n   Press Ctrl+C to stop`n" -ForegroundColor DarkGray

Push-Location $DashboardPath
npm run dev
Pop-Location
