# ================================================
# MONITOR ASPIRE FRONTEND
# ================================================
# Monitorea el estado del frontend en Aspire

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " MONITOR DE FRONTEND EN ASPIRE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Job de Aspire
Write-Host "[1] Verificando Aspire AppHost..." -ForegroundColor Yellow
$job = Get-Job -Name "AspireHost" -ErrorAction SilentlyContinue
if ($job) {
    if ($job.State -eq "Running") {
        Write-Host "    OK: Aspire AppHost esta ejecutandose" -ForegroundColor Green
        Write-Host "    Job ID: $($job.Id) | Estado: $($job.State)" -ForegroundColor Gray
    } else {
        Write-Host "    ERROR: Aspire AppHost NO esta en estado Running" -ForegroundColor Red
        Write-Host "    Estado actual: $($job.State)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "    ERROR: Job 'AspireHost' no encontrado" -ForegroundColor Red
    Write-Host "    Ejecuta: dotnet run --project src\03.Platform\Farutech.AppHost" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Verificar procesos Node.js (Frontend Vite)
Write-Host "[2] Verificando Frontend (Node.js/Vite)..." -ForegroundColor Yellow
$nodeProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcs) {
    $count = ($nodeProcs | Measure-Object).Count
    Write-Host "    OK: Frontend detectado - $count procesos Node.js activos" -ForegroundColor Green
    
    # Mostrar detalles
    foreach ($proc in $nodeProcs) {
        $memMB = [math]::Round($proc.WorkingSet64/1MB, 2)
        $runtime = ""
        if ($proc.StartTime) {
            $elapsed = (Get-Date) - $proc.StartTime
            $runtime = "$($elapsed.Hours)h $($elapsed.Minutes)m $($elapsed.Seconds)s"
        }
        Write-Host "    - PID: $($proc.Id) | Memoria: ${memMB}MB | Tiempo: $runtime" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "    Frontend probablemente disponible en: http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "    AVISO: Node.js aun no detectado" -ForegroundColor Yellow
    Write-Host "    El frontend puede tardar 30-60 segundos en arrancar por primera vez" -ForegroundColor Yellow
    Write-Host "    (npm install + compilacion inicial de Vite)" -ForegroundColor Gray
}
Write-Host ""

# Verificar puerto 5173
Write-Host "[3] Verificando puerto 5173 (Frontend)..." -ForegroundColor Yellow
$port5173 = netstat -ano | Select-String ":5173"
if ($port5173) {
    Write-Host "    OK: Puerto 5173 esta en uso (Frontend escuchando)" -ForegroundColor Green
    Write-Host "    $port5173" -ForegroundColor Gray
} else {
    Write-Host "    AVISO: Puerto 5173 no esta en uso todavia" -ForegroundColor Yellow
    Write-Host "    Espera a que Node.js arranque completamente" -ForegroundColor Gray
}
Write-Host ""

# URLs de acceso
Write-Host "[4] URLs de Acceso:" -ForegroundColor Yellow
Write-Host "    Dashboard Aspire: https://localhost:17096" -ForegroundColor Cyan
Write-Host "    Frontend:         http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

# Logs recientes
Write-Host "[5] Ultimas lineas de log de Aspire:" -ForegroundColor Yellow
Write-Host "    -------------------------------------" -ForegroundColor Gray
try {
    $logs = Receive-Job -Name AspireHost -Keep 2>$null | Select-Object -Last 5
    if ($logs) {
        foreach ($line in $logs) {
            Write-Host "    $line" -ForegroundColor Gray
        }
    } else {
        Write-Host "    (Sin logs nuevos)" -ForegroundColor Gray
    }
} catch {
    Write-Host "    (No se pudieron obtener logs)" -ForegroundColor Gray
}
Write-Host "    -------------------------------------" -ForegroundColor Gray
Write-Host ""

# Recomendaciones
Write-Host "[6] Recomendaciones:" -ForegroundColor Yellow
Write-Host "    1. Abre el Dashboard en tu navegador: https://localhost:17096" -ForegroundColor White
Write-Host "    2. Navega a la seccion 'Resources' o 'Services'" -ForegroundColor White
Write-Host "    3. Busca el servicio 'frontend' en la lista" -ForegroundColor White
Write-Host "    4. Verifica su estado (Starting/Running/Failed)" -ForegroundColor White
Write-Host "    5. Haz clic en 'frontend' para ver logs detallados" -ForegroundColor White
Write-Host "    6. Una vez en 'Running', accede a: http://localhost:5173" -ForegroundColor White
Write-Host ""

# Comandos utiles
Write-Host "[7] Comandos Utiles:" -ForegroundColor Yellow
Write-Host "    Ver logs completos:" -ForegroundColor Gray
Write-Host "      Receive-Job -Name AspireHost -Keep" -ForegroundColor White
Write-Host ""
Write-Host "    Detener Aspire:" -ForegroundColor Gray
Write-Host "      Get-Job -Name AspireHost | Stop-Job" -ForegroundColor White
Write-Host "      Get-Job -Name AspireHost | Remove-Job" -ForegroundColor White
Write-Host ""
Write-Host "    Reiniciar Aspire:" -ForegroundColor Gray
Write-Host "      Get-Job -Name AspireHost | Stop-Job; Get-Job -Name AspireHost | Remove-Job" -ForegroundColor White
Write-Host "      Start-Job -ScriptBlock { Set-Location 'D:\farutech_2025'; dotnet run --project src\03.Platform\Farutech.AppHost } -Name 'AspireHost'" -ForegroundColor White
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Monitoreo completado" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
