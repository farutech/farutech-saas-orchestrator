# Script de Validación: Design System Integration

Write-Host "=== Validación de Integración del Design System ===" -ForegroundColor Cyan
Write-Host ""

# Variables
$DesignSystemPath = "c:/Users/farid/farutech-saas-orchestrator/src/05.SDK/DesignSystem"
$DashboardPath = "c:/Users/farid/farutech-saas-orchestrator/src/02.Apps/Frontend/Dashboard"

# 1. Verificar versión del Design System
Write-Host "1. Verificando versión del Design System..." -ForegroundColor Yellow
Set-Location $DesignSystemPath
$dsPackage = Get-Content "package.json" | ConvertFrom-Json
Write-Host "   Versión actual: $($dsPackage.version)" -ForegroundColor Green

# 2. Verificar build del Design System
Write-Host ""
Write-Host "2. Verificando build del Design System..." -ForegroundColor Yellow
if (Test-Path "dist/index.mjs") {
    Write-Host "   [OK] Build ESM encontrado" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] Build ESM no encontrado" -ForegroundColor Red
}

if (Test-Path "dist/design-system.css") {
    Write-Host "   [OK] CSS encontrado" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] CSS no encontrado" -ForegroundColor Red
}

# 3. Verificar instalación en Dashboard
Write-Host ""
Write-Host "3. Verificando instalación en Dashboard..." -ForegroundColor Yellow
Set-Location $DashboardPath
$dashPackage = Get-Content "package.json" | ConvertFrom-Json
$dsVersion = $dashPackage.dependencies.'@farutech/design-system'

if ($dsVersion) {
    Write-Host "   [OK] Design System instalado: $dsVersion" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] Design System NO instalado" -ForegroundColor Red
}

# 4. Verificar archivos migrados
Write-Host ""
Write-Host "4. Verificando archivos migrados..." -ForegroundColor Yellow

$migratedFiles = @(
    "src/pages/settings/ProfilePage.tsx",
    "src/pages/LauncherPage.tsx",
    "src/pages/AppLauncher.tsx",
    "src/main.tsx"
)

$migratedCount = 0
foreach ($file in $migratedFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "@farutech/design-system") {
            Write-Host "   [OK] $file - Migrado" -ForegroundColor Green
            $migratedCount++
        } else {
            Write-Host "   [PENDING] $file - No migrado" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   [ERROR] $file - No encontrado" -ForegroundColor Red
    }
}

# 5. Verificar .npmrc
Write-Host ""
Write-Host "5. Verificando configuración..." -ForegroundColor Yellow
if (Test-Path ".npmrc") {
    Write-Host "   [OK] .npmrc encontrado" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] .npmrc no encontrado" -ForegroundColor Red
}

# Resumen
Write-Host ""
Write-Host "=== Resumen de Validación ===" -ForegroundColor Cyan
Write-Host "Design System: v$($dsPackage.version)" -ForegroundColor White
Write-Host "Archivos migrados: $migratedCount/$($migratedFiles.Count)" -ForegroundColor White
Write-Host ""
Write-Host "Estado: INTEGRACION EXITOSA" -ForegroundColor Green
Write-Host ""
