# Script de Validacion Basica de Conectividad
# Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Write-Host "VALIDACION BASICA DE CONECTIVIDAD" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Configuracion de URLs
$IAM_BASE_URL = "http://localhost:5001"
$ORCHESTRATOR_BASE_URL = "http://localhost:8080"

# Funcion para hacer requests HTTP
function Invoke-TestRequest {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [string]$Description = ""
    )

    if ($Description) {
        Write-Host "Testing: $Description" -ForegroundColor Blue
    }

    try {
        $response = Invoke-WebRequest -Uri $Uri -Method $Method -TimeoutSec 10
        Write-Host "  SUCCESS: $($response.StatusCode)" -ForegroundColor Green
        return @{ Success = $true; StatusCode = $response.StatusCode }
    }
    catch {
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# PASO 1: Verificar conectividad IAM
Write-Host "PASO 1: Verificando IAM API" -ForegroundColor Magenta
$result = Invoke-TestRequest -Uri "$IAM_BASE_URL/health" -Description "IAM Health Check"
$iam_ok = $result.Success

# PASO 2: Verificar conectividad Orchestrator
Write-Host "PASO 2: Verificando Orchestrator API" -ForegroundColor Magenta
$result = Invoke-TestRequest -Uri "$ORCHESTRATOR_BASE_URL/health" -Description "Orchestrator Health Check"
$orch_ok = $result.Success

# RESUMEN
Write-Host "" -ForegroundColor White
Write-Host "RESUMEN:" -ForegroundColor Cyan
Write-Host "IAM API: $(if($iam_ok){'OK'}else{'FAIL'})" -ForegroundColor $(if($iam_ok){'Green'}else{'Red'})
Write-Host "Orchestrator API: $(if($orch_ok){'OK'}else{'FAIL'})" -ForegroundColor $(if($orch_ok){'Green'}else{'Red'})

if ($iam_ok -and $orch_ok) {
    Write-Host "SISTEMA LISTO PARA VALIDACION COMPLETA" -ForegroundColor Green
} else {
    Write-Host "REVISAR CONFIGURACION DE SERVICIOS" -ForegroundColor Yellow
}