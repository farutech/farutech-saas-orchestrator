# ================================================
# SWITCH ORCHESTRATION MODE
# ================================================
# Cambia entre Aspire, Podman-Compose, o modo Hibrido

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("aspire", "compose", "hybrid", "status")]
    [string]$Mode = "status"
)

$ErrorActionPreference = "SilentlyContinue"

# Colores
function Write-Title { param($Text) Write-Host "`n$Text" -ForegroundColor Cyan }
function Write-Success { param($Text) Write-Host "  OK: $Text" -ForegroundColor Green }
function Write-Warning { param($Text) Write-Host "  AVISO: $Text" -ForegroundColor Yellow }
function Write-Error { param($Text) Write-Host "  ERROR: $Text" -ForegroundColor Red }
function Write-Info { param($Text) Write-Host "  - $Text" -ForegroundColor White }

# ========================================
# STATUS MODE
# ========================================
if ($Mode -eq "status") {
    Write-Title "========================================="
    Write-Host " ESTADO ACTUAL DE ORQUESTACION" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    
    Write-Title "[1] Contenedores Podman (docker-compose):"
    $podmanContainers = podman ps --format "{{.Names}}" 2>$null
    if ($podmanContainers) {
        foreach ($container in $podmanContainers) {
            $status = podman ps --filter "name=$container" --format "{{.Status}}"
            Write-Info "$container - $status"
        }
    } else {
        Write-Warning "No hay contenedores de podman-compose corriendo"
    }
    
    Write-Title "[2] Job de Aspire:"
    $aspireJob = Get-Job -Name "AspireHost" 2>$null
    if ($aspireJob) {
        Write-Info "Estado: $($aspireJob.State)"
        Write-Info "Tiene datos: $($aspireJob.HasMoreData)"
        if ($aspireJob.State -eq "Running") {
            Write-Success "Aspire esta ejecutandose"
        }
    } else {
        Write-Warning "No hay Job de Aspire activo"
    }
    
    Write-Title "[3] Analisis:"
    $hasPodman = $podmanContainers -ne $null
    $hasAspire = $aspireJob -and $aspireJob.State -eq "Running"
    
    if ($hasPodman -and $hasAspire) {
        Write-Error "DUPLICACION: Ambos sistemas estan corriendo simultaneamente"
        Write-Warning "Esto causa desperdicio de recursos y confusion"
        Write-Info "Recomendacion: Ejecuta este script con -Mode aspire o -Mode compose"
    } elseif ($hasPodman) {
        Write-Success "Solo podman-compose esta activo"
    } elseif ($hasAspire) {
        Write-Success "Solo Aspire esta activo (RECOMENDADO para desarrollo)"
    } else {
        Write-Warning "Ningun sistema de orquestacion esta activo"
    }
    
    Write-Title "[4] URLs de acceso:"
    if ($hasPodman) {
        Write-Info "PostgreSQL: localhost:5432 (podman)"
        Write-Info "NATS: localhost:4222 (podman)"
        Write-Info "pgAdmin: http://localhost:5050 (podman)"
    }
    if ($hasAspire) {
        Write-Info "Dashboard Aspire: https://localhost:17096"
        Write-Info "PostgreSQL: Puerto dinamico (ver Dashboard)"
        Write-Info "NATS: Puerto dinamico (ver Dashboard)"
        Write-Info "Frontend: http://localhost:5173"
    }
    
    Write-Host "`n=========================================" -ForegroundColor Cyan
    Write-Host "Para cambiar de modo, ejecuta:" -ForegroundColor Yellow
    Write-Host "  .\scripts\switch-mode.ps1 -Mode aspire" -ForegroundColor White
    Write-Host "  .\scripts\switch-mode.ps1 -Mode compose" -ForegroundColor White
    Write-Host "  .\scripts\switch-mode.ps1 -Mode hybrid" -ForegroundColor White
    Write-Host "=========================================`n" -ForegroundColor Cyan
    exit
}

# ========================================
# ASPIRE MODE
# ========================================
if ($Mode -eq "aspire") {
    Write-Title "========================================="
    Write-Host " MODO: ASPIRE COMPLETO" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    
    Write-Title "[1] Deteniendo podman-compose..."
    podman-compose -f docker-compose.yml down 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Contenedores de podman-compose detenidos"
    } else {
        Write-Warning "No habia contenedores de podman-compose corriendo"
    }
    
    Write-Title "[2] Verificando Job de Aspire..."
    $aspireJob = Get-Job -Name "AspireHost" 2>$null
    if ($aspireJob) {
        if ($aspireJob.State -eq "Running") {
            Write-Success "Aspire ya esta ejecutandose"
            Write-Info "Dashboard: https://localhost:17096"
            Write-Info "Frontend: http://localhost:5173"
        } else {
            Write-Warning "Job de Aspire existe pero no esta corriendo"
            Write-Info "Limpiando Job anterior..."
            $aspireJob | Stop-Job 2>$null
            $aspireJob | Remove-Job 2>$null
        }
    }
    
    if (-not ($aspireJob -and $aspireJob.State -eq "Running")) {
        Write-Title "[3] Iniciando Aspire..."
        Start-Job -ScriptBlock {
            Set-Location "D:\farutech_2025"
            dotnet run --project src\03.Platform\Farutech.AppHost
        } -Name "AspireHost" | Out-Null
        
        Write-Info "Esperando que Aspire inicie..."
        Start-Sleep -Seconds 10
        
        $newJob = Get-Job -Name "AspireHost"
        if ($newJob.State -eq "Running") {
            Write-Success "Aspire iniciado correctamente"
        } else {
            Write-Error "Aspire no pudo iniciar"
            Write-Info "Revisa los logs: Receive-Job -Name AspireHost -Keep"
            exit 1
        }
    }
    
    Write-Title "[4] Estado final:"
    Write-Success "Modo ASPIRE activo"
    Write-Info "Dashboard: https://localhost:17096"
    Write-Info "Frontend: http://localhost:5173"
    Write-Info "Todos los servicios orquestados por Aspire"
    
    Write-Title "Comandos utiles:"
    Write-Info "Ver logs: Receive-Job -Name AspireHost -Keep"
    Write-Info "Detener: Get-Job -Name AspireHost | Stop-Job"
    Write-Info "Estado: .\scripts\switch-mode.ps1 -Mode status"
    
    Write-Host "`n=========================================" -ForegroundColor Green
}

# ========================================
# COMPOSE MODE
# ========================================
if ($Mode -eq "compose") {
    Write-Title "========================================="
    Write-Host " MODO: PODMAN-COMPOSE" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    
    Write-Title "[1] Deteniendo Aspire..."
    $aspireJob = Get-Job -Name "AspireHost" 2>$null
    if ($aspireJob) {
        $aspireJob | Stop-Job 2>$null
        $aspireJob | Remove-Job 2>$null
        Write-Success "Aspire detenido"
    } else {
        Write-Warning "No habia Job de Aspire corriendo"
    }
    
    Write-Title "[2] Iniciando podman-compose..."
    podman-compose -f docker-compose.yml up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Contenedores de podman-compose iniciados"
    } else {
        Write-Error "Error al iniciar podman-compose"
        exit 1
    }
    
    Write-Title "[3] Verificando contenedores..."
    Start-Sleep -Seconds 3
    $containers = podman ps --format "{{.Names}}"
    foreach ($container in $containers) {
        Write-Info "$container corriendo"
    }
    
    Write-Title "[4] Estado final:"
    Write-Success "Modo PODMAN-COMPOSE activo"
    Write-Info "PostgreSQL: localhost:5432"
    Write-Info "NATS: localhost:4222"
    Write-Info "pgAdmin: http://localhost:5050"
    
    Write-Warning "NOTA: Dashboard de Aspire NO disponible en este modo"
    Write-Warning "Para iniciar Backend + Frontend manualmente:"
    Write-Info "  dotnet run --project src\01.Core\Farutech.Orchestrator.API"
    Write-Info "  cd src\02.Apps\Farutech.Frontend && npm run dev"
    
    Write-Host "`n=========================================" -ForegroundColor Green
}

# ========================================
# HYBRID MODE
# ========================================
if ($Mode -eq "hybrid") {
    Write-Title "========================================="
    Write-Host " MODO: HIBRIDO" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    
    Write-Title "[1] Iniciando SOLO infraestructura con podman-compose..."
    podman-compose -f docker-compose.yml up -d postgres nats
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Infraestructura (postgres + nats) iniciada"
    } else {
        Write-Error "Error al iniciar infraestructura"
        exit 1
    }
    
    Write-Title "[2] Esperando que contenedores esten listos..."
    Start-Sleep -Seconds 5
    
    Write-Title "[3] Iniciando Aspire (solo aplicaciones)..."
    Write-Warning "NOTA: Debes modificar AppHost.cs para usar contenedores existentes"
    Write-Info "Ver: ASPIRE_VS_DOCKER_COMPOSE.md - Opcion 2"
    
    Write-Title "[4] Estado final:"
    Write-Info "PostgreSQL: localhost:5432 (podman)"
    Write-Info "NATS: localhost:4222 (podman)"
    Write-Warning "Modo hibrido requiere configuracion adicional en AppHost.cs"
    
    Write-Host "`n=========================================" -ForegroundColor Yellow
}
