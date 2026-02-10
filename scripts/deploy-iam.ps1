#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Farutech IAM - Docker Deployment Script
    
.DESCRIPTION
    Script para desplegar el sistema IAM con Docker o Podman
    
.PARAMETER Action
    Acción a realizar: start, stop, restart, build, logs, status
    
.PARAMETER Tool
    Herramienta a usar: docker o podman (default: docker)
    
.PARAMETER Monitoring
    Incluir servicios de monitoreo (Prometheus + Grafana)
    
.EXAMPLE
    .\deploy-iam.ps1 -Action start
    .\deploy-iam.ps1 -Action start -Tool podman
    .\deploy-iam.ps1 -Action start -Monitoring
    .\deploy-iam.ps1 -Action logs -Service iam-api
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('start', 'stop', 'restart', 'build', 'logs', 'status', 'clean')]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet('docker', 'podman')]
    [string]$Tool = 'docker',
    
    [Parameter(Mandatory=$false)]
    [switch]$Monitoring,
    
    [Parameter(Mandatory=$false)]
    [string]$Service
)

# Colors
$InfoColor = "Cyan"
$SuccessColor = "Green"
$ErrorColor = "Red"
$WarningColor = "Yellow"

function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor $InfoColor
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor $SuccessColor
}

function Write-ErrorMsg($message) {
    Write-Host "[ERROR] $message" -ForegroundColor $ErrorColor
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor $WarningColor
}

# Detect OS
$IsWindowsOS = $IsWindows -or ($PSVersionTable.PSVersion.Major -le 5)

# Check if tool is available
$composeTool = if ($Tool -eq 'docker') { 'docker-compose' } else { 'podman-compose' }

try {
    & $composeTool --version | Out-Null
} catch {
    Write-ErrorMsg "$composeTool no está instalado. Por favor instálelo primero."
    exit 1
}

# Compose file
$composeFile = "docker-compose.iam.yml"
$profile = if ($Monitoring) { "--profile monitoring" } else { "" }

# Check .env file
if (-not (Test-Path ".env")) {
    Write-Warning "Archivo .env no encontrado. Creando desde .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Info "Archivo .env creado. Por favor, revise y ajuste los valores."
    } else {
        Write-ErrorMsg "Archivo .env.example no encontrado."
        exit 1
    }
}

# Execute action
Write-Info "Ejecutando: $Action con $Tool"

switch ($Action) {
    'start' {
        Write-Info "Iniciando servicios IAM..."
        & $composeTool -f $composeFile $profile up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Servicios iniciados correctamente"
            Write-Info ""
            Write-Info "Servicios disponibles:"
            Write-Info "  - IAM API:       http://localhost:5001"
            Write-Info "  - Swagger:       http://localhost:5001/swagger"
            Write-Info "  - PostgreSQL:    localhost:5432"
            Write-Info "  - Redis:         localhost:6379"
            Write-Info "  - NATS:          localhost:4222"
            Write-Info "  - MailHog UI:    http://localhost:8025"
            
            if ($Monitoring) {
                Write-Info "  - Prometheus:    http://localhost:9090"
                Write-Info "  - Grafana:       http://localhost:3000"
            }
        } else {
            Write-ErrorMsg "Error al iniciar servicios"
            exit 1
        }
    }
    
    'stop' {
        Write-Info "Deteniendo servicios IAM..."
        & $composeTool -f $composeFile $profile down
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Servicios detenidos correctamente"
        } else {
            Write-ErrorMsg "Error al detener servicios"
            exit 1
        }
    }
    
    'restart' {
        Write-Info "Reiniciando servicios IAM..."
        & $composeTool -f $composeFile $profile restart
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Servicios reiniciados correctamente"
        } else {
            Write-ErrorMsg "Error al reiniciar servicios"
            exit 1
        }
    }
    
    'build' {
        Write-Info "Construyendo imágenes..."
        & $composeTool -f $composeFile build --no-cache
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Imágenes construidas correctamente"
        } else {
            Write-ErrorMsg "Error al construir imágenes"
            exit 1
        }
    }
    
    'logs' {
        if ($Service) {
            Write-Info "Mostrando logs de $Service..."
            & $composeTool -f $composeFile logs -f $Service
        } else {
            Write-Info "Mostrando logs de todos los servicios..."
            & $composeTool -f $composeFile logs -f
        }
    }
    
    'status' {
        Write-Info "Estado de los servicios:"
        & $composeTool -f $composeFile ps
    }
    
    'clean' {
        Write-Warning "Esto eliminará todos los contenedores, volúmenes y redes. ¿Continuar? (S/N)"
        $response = Read-Host
        
        if ($response -eq 'S' -or $response -eq 's') {
            Write-Info "Limpiando todo..."
            & $composeTool -f $composeFile down -v --remove-orphans
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Limpieza completada"
            } else {
                Write-ErrorMsg "Error durante la limpieza"
                exit 1
            }
        } else {
            Write-Info "Operación cancelada"
        }
    }
}

Write-Info ""
Write-Info "Operación completada"
