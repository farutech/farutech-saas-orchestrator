# Script de Inicio Limpio de Aspire
# Ejecutar desde: D:\farutech_2025

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ASPIRE - INICIO LIMPIO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Detener procesos anteriores
Write-Host "[1/5] Deteniendo procesos anteriores..." -ForegroundColor Yellow
Get-Job -Name "AspireHost" -ErrorAction SilentlyContinue | Stop-Job
Get-Job -Name "AspireHost" -ErrorAction SilentlyContinue | Remove-Job
Get-Process -Name "Farutech.AppHost" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "dcpctrl" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "      ✓ Procesos detenidos" -ForegroundColor Green
Write-Host ""

# 2. Limpiar contenedores Podman
Write-Host "[2/5] Limpiando contenedores Podman..." -ForegroundColor Yellow
$containers = podman ps -q
if ($containers) {
    podman stop $containers 2>$null
    podman rm $containers 2>$null
    Write-Host "      ✓ Contenedores limpiados" -ForegroundColor Green
} else {
    Write-Host "      ✓ No hay contenedores que limpiar" -ForegroundColor Green
}
Write-Host ""

# 3. Verificar dependencias del frontend
Write-Host "[3/5] Verificando dependencias del frontend..." -ForegroundColor Yellow
$nodeModulesPath = "src\02.Apps\Farutech.Frontend\node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "      ! node_modules no existe, ejecutando npm install..." -ForegroundColor Yellow
    Push-Location "src\02.Apps\Farutech.Frontend"
    npm install --silent
    Pop-Location
    Write-Host "      ✓ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "      ✓ Dependencias ya instaladas" -ForegroundColor Green
}
Write-Host ""

# 4. Iniciar Aspire
Write-Host "[4/5] Iniciando Aspire..." -ForegroundColor Yellow
Write-Host ""
Write-Host "      Ejecutando: dotnet run --project src\03.Platform\Farutech.AppHost" -ForegroundColor Gray
Write-Host "      Esto puede tardar 30-40 segundos..." -ForegroundColor Gray
Write-Host ""

# Iniciar Aspire en foreground (no como Job)
Set-Location "D:\farutech_2025"
Start-Process powershell -ArgumentList "-NoExit","-Command","cd D:\farutech_2025; dotnet run --project src\03.Platform\Farutech.AppHost"

Write-Host "      ✓ Aspire iniciando en nueva ventana..." -ForegroundColor Green
Write-Host ""

# 5. Esperar y verificar
Write-Host "[5/5] Esperando que los servicios arranquen..." -ForegroundColor Yellow
Start-Sleep -Seconds 25

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   VERIFICACIÓN DE SERVICIOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar contenedores
Write-Host "Contenedores Podman:" -ForegroundColor Cyan
$containerCount = (podman ps -q | Measure-Object).Count
if ($containerCount -gt 0) {
    podman ps --format "  ✓ {{.Names}}: {{.Status}}" | Write-Host -ForegroundColor Green
    Write-Host "  Total: $containerCount contenedores" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Aún iniciando... (esperar 10-15 segundos más)" -ForegroundColor Yellow
}
Write-Host ""

# Verificar procesos
Write-Host "Procesos Activos:" -ForegroundColor Cyan
$appHostProcess = Get-Process -Name "Farutech.AppHost" -ErrorAction SilentlyContinue
$dcpctrlProcess = Get-Process -Name "dcpctrl" -ErrorAction SilentlyContinue
$orchestratorProcess = Get-Process -Name "Farutech.Orchestrator.API" -ErrorAction SilentlyContinue
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($appHostProcess) {
    Write-Host "  ✓ Farutech.AppHost (PID: $($appHostProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Farutech.AppHost no detectado" -ForegroundColor Yellow
}

if ($dcpctrlProcess) {
    Write-Host "  ✓ dcpctrl - Aspire Control" -ForegroundColor Green
} else {
    Write-Host "  ⚠ dcpctrl no detectado" -ForegroundColor Yellow
}

if ($orchestratorProcess) {
    Write-Host "  ✓ Orchestrator API" -ForegroundColor Green
}

if ($nodeProcesses) {
    $nodeCount = ($nodeProcesses | Measure-Object).Count
    Write-Host "  ✓ Frontend (Node.js: $nodeCount procesos)" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   URLS DISPONIBLES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  🌐 Dashboard Aspire:" -ForegroundColor White
Write-Host "     https://localhost:17096" -ForegroundColor Yellow
Write-Host ""
Write-Host "  🔌 API Orchestrator:" -ForegroundColor White
Write-Host "     http://localhost:5098" -ForegroundColor Yellow
Write-Host ""
Write-Host "  🎨 Frontend:" -ForegroundColor White
Write-Host "     Ver puerto en Dashboard (dinámico)" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Abrir Dashboard
Start-Process "https://localhost:17096"
Write-Host "✅ Dashboard abierto en navegador" -ForegroundColor Green
Write-Host ""
Write-Host "NOTA: El warning ASPIRE004 es informativo y no afecta la funcionalidad" -ForegroundColor Yellow
Write-Host ""
