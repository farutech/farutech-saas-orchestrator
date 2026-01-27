# ================================================
# CHECK ASPIRE SERVICES STATUS
# ================================================
# Verifica el estado de todos los servicios en Aspire

param(
    [string]$DashboardUrl = "https://localhost:17096"
)

Write-Host "🔍 VERIFICACIÓN DE SERVICIOS ASPIRE" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Servicios esperados
$expectedServices = @(
    @{Name="postgres"; Description="Base de datos PostgreSQL"},
    @{Name="nats"; Description="Sistema de mensajería NATS"},
    @{Name="orchestrator-api"; Description="API Backend .NET"},
    @{Name="frontend"; Description="Frontend React + Vite"}
)

Write-Host "📊 Dashboard: $DashboardUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Servicios esperados:" -ForegroundColor Green
foreach ($svc in $expectedServices) {
    Write-Host "   • $($svc.Name.PadRight(20)) - $($svc.Description)" -ForegroundColor White
}
Write-Host ""

# Verificar archivos físicos
Write-Host "📂 Verificación de archivos físicos:" -ForegroundColor Magenta
Write-Host ""

$checks = @(
    @{Path="src\02.Apps\Farutech.Frontend\package.json"; Name="Frontend package.json"},
    @{Path="src\02.Apps\Farutech.Frontend\vite.config.ts"; Name="Frontend vite.config.ts"},
    @{Path="src\03.Platform\Farutech.AppHost\AppHost.cs"; Name="AppHost configuración"}
)

foreach ($check in $checks) {
    $exists = Test-Path $check.Path
    if ($exists) {
        Write-Host "   ✅ $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($check.Name) - NO ENCONTRADO" -ForegroundColor Red
    }
}
Write-Host ""

# Verificar procesos
Write-Host "🔧 Procesos activos:" -ForegroundColor Magenta
Write-Host ""

$aspireProcess = Get-Process | Where-Object {$_.Name -match "Farutech" -or $_.Name -eq "dotnet"} | Where-Object {$_.Path -match "AppHost"}
if ($aspireProcess) {
    Write-Host "   ✅ Aspire AppHost ejecutándose (PID: $($aspireProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Aspire AppHost NO está ejecutándose" -ForegroundColor Yellow
}

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $count = $nodeProcesses.Count
    Write-Host "   OK Node.js ejecutandose ($count procesos)" -ForegroundColor Green
} else {
    Write-Host "   AVISO: Node.js NO esta ejecutandose (Frontend podria no estar iniciado)" -ForegroundColor Yellow
}
Write-Host ""

# Instrucciones finales
Write-Host "📝 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abre el Dashboard: $DashboardUrl" -ForegroundColor White
Write-Host "2. Navega a la sección 'Resources' o 'Services'" -ForegroundColor White
Write-Host "3. Verifica que 'frontend' aparezca en la lista" -ForegroundColor White
Write-Host "4. Si el estado es 'Running', accede a: http://localhost:5173" -ForegroundColor White
Write-Host "5. Si el estado es 'Failed', revisa los logs en el Dashboard" -ForegroundColor White
Write-Host ""
Write-Host ""
Write-Host "TIP: El frontend puede tardar ~30 segundos en arrancar (npm install + vite dev)" -ForegroundColor Yellow
Write-Host ""
