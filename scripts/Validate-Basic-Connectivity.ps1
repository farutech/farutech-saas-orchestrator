# Script de Validación Simplificado del Flujo de Usuario
# Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# Versión: 1.0 - Validación básica de endpoints

Write-Host "🔐 VALIDACIÓN SIMPLIFICADA DEL FLUJO DE USUARIO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuración de URLs
$IAM_BASE_URL = "http://localhost:5001"
$ORCHESTRATOR_BASE_URL = "http://localhost:8080"

# Función para hacer requests HTTP con manejo de errores
function Invoke-TestRequest {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [string]$Description = ""
    )

    if ($Description) {
        Write-Host "🔍 $Description" -ForegroundColor Blue
    }

    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            Headers = $Headers
        }

        if ($Body) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
            $params.ContentType = "application/json"
        }

        $response = Invoke-RestMethod @params
        Write-Host "  ✅ SUCCESS" -ForegroundColor Green
        return @{ Success = $true; Data = $response }
    }
    catch {
        Write-Host "  ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# ==========================================
# PASO 1: VERIFICAR CONECTIVIDAD DE APIs
# ==========================================
Write-Host "1️⃣ PASO 1: VERIFICACIÓN DE CONECTIVIDAD" -ForegroundColor Magenta

# Verificar IAM API
$result = Invoke-TestRequest -Uri "$IAM_BASE_URL/health" -Description "Verificando conectividad IAM API"
$iam_ok = $result.Success

# Verificar Orchestrator API
$result = Invoke-TestRequest -Uri "$ORCHESTRATOR_BASE_URL/health" -Description "Verificando conectividad Orchestrator API"
$orch_ok = $result.Success

if ($iam_ok -and $orch_ok) {
    Write-Host "✅ AMBAS APIs RESPONDEN CORRECTAMENTE" -ForegroundColor Green
} else {
    Write-Host "❌ UNA O MÁS APIs NO RESPONDEN" -ForegroundColor Red
    Write-Host "   IAM: $(if($iam_ok){'OK'}else{'FAIL'})" -ForegroundColor $(if($iam_ok){'Green'}else{'Red'})
    Write-Host "   Orchestrator: $(if($orch_ok){'OK'}else{'FAIL'})" -ForegroundColor $(if($orch_ok){'Green'}else{'Red'})
    exit 1
}

# ==========================================
# PASO 2: VERIFICAR ENDPOINTS DISPONIBLES
# ==========================================
Write-Host "2️⃣ PASO 2: VERIFICACIÓN DE ENDPOINTS" -ForegroundColor Magenta

$endpoints = @(
    @{ Url = "$IAM_BASE_URL/api/auth/register"; Desc = "IAM Register" },
    @{ Url = "$IAM_BASE_URL/api/auth/login"; Desc = "IAM Login" },
    @{ Url = "$IAM_BASE_URL/api/admin/tenants"; Desc = "IAM Admin Tenants" },
    @{ Url = "$ORCHESTRATOR_BASE_URL/api/customers"; Desc = "Orchestrator Customers" }
)

$endpoint_status = @{}

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Url -Method OPTIONS -TimeoutSec 5
        $endpoint_status[$endpoint.Desc] = $true
        Write-Host "  ✅ $($endpoint.Desc): OK" -ForegroundColor Green
    }
    catch {
        $endpoint_status[$endpoint.Desc] = $false
        Write-Host "  ❌ $($endpoint.Desc): FAIL" -ForegroundColor Red
    }
}

# ==========================================
# RESUMEN FINAL
# ==========================================
Write-Host "" -ForegroundColor White
Write-Host "📊 RESUMEN DE VALIDACIÓN" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

$all_ok = ($iam_ok -and $orch_ok -and -not ($endpoint_status.Values -contains $false))

if ($all_ok) {
    Write-Host "🎉 VALIDACIÓN EXITOSA - SISTEMA LISTO PARA PRUEBAS COMPLETAS" -ForegroundColor Green
} else {
    Write-Host "⚠️ VALIDACIÓN CON PROBLEMAS - REVISAR CONFIGURACIÓN" -ForegroundColor Yellow
}

Write-Host "" -ForegroundColor White
Write-Host "🔗 ENDPOINTS VERIFICADOS:" -ForegroundColor Yellow
foreach ($endpoint in $endpoints) {
    $status = if ($endpoint_status[$endpoint.Desc]) { "✅" } else { "❌" }
    Write-Host "  $status $($endpoint.Desc): $($endpoint.Url)" -ForegroundColor Gray
}

Write-Host "" -ForegroundColor White
Write-Host "💡 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "  1. Iniciar servicios IAM y Orchestrator" -ForegroundColor Gray
Write-Host "  2. Ejecutar script completo de validación" -ForegroundColor Gray
Write-Host "  3. Verificar sincronización tenant IAM-Orchestrator" -ForegroundColor Gray