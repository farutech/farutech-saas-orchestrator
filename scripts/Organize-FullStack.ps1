#Requires -Version 5.1
<#
.SYNOPSIS
    Reorganiza Farutech SaaS a monorepo Full-Stack
#>

param([switch]$DryRun)

$Root = "D:\farutech_2025"
$ErrorActionPreference = "Stop"

function Write-Step { param($Msg) Write-Host "`n>> $Msg" -ForegroundColor Cyan }
function Write-OK { param($Msg) Write-Host "   [OK] $Msg" -ForegroundColor Green }
function Write-Warn { param($Msg) Write-Host "   [WARN] $Msg" -ForegroundColor Yellow }

Write-Host "`n========== FARUTECH FULL-STACK REORGANIZATION ==========" -ForegroundColor Cyan

# 1. DETENER PROCESOS
Write-Step "Deteniendo procesos..."
Get-Process -Name "*node*","*vite*","*Farutech*" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 2
Write-OK "Procesos detenidos"

# 2. LIMPIAR GIT ANIDADO
Write-Step "Limpiando repositorios Git anidados..."
$gitDirs = Get-ChildItem -Path $Root -Recurse -Hidden -Filter ".git" -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -ne "$Root\.git" }
foreach ($dir in $gitDirs) {
    if (-not $DryRun) { Remove-Item $dir.FullName -Recurse -Force }
    Write-OK "Eliminado: $($dir.FullName)"
}

# 3. CREAR ESTRUCTURA
Write-Step "Creando estructura de carpetas..."
$dirs = @("src\02.Apps", "src\02.Apps\archive")
foreach ($d in $dirs) {
    $path = Join-Path $Root $d
    if (-not (Test-Path $path)) {
        if (-not $DryRun) { New-Item -Path $path -ItemType Directory -Force | Out-Null }
        Write-OK "Creado: $d"
    }
}

# 4. MOVER FRONTEND
Write-Step "Moviendo Frontend..."
$frontSrc = Join-Path $Root "universal-design-suite"
$frontDst = Join-Path $Root "src\02.Apps\Farutech.Frontend"

if (Test-Path $frontSrc) {
    if (Test-Path $frontDst) {
        $ts = Get-Date -Format "yyyyMMdd_HHmmss"
        $archive = "$Root\src\02.Apps\archive\Frontend_$ts"
        if (-not $DryRun) { Move-Item $frontDst $archive -Force }
        Write-Warn "Destino existente archivado"
    }
    
    if (-not $DryRun) {
        # Robocopy es más robusto para archivos bloqueados
        $result = robocopy $frontSrc $frontDst /E /MT:8 /R:1 /W:1 /NFL /NDL /NJH /NJS
        if ($LASTEXITCODE -lt 8) {
            Write-OK "Frontend copiado exitosamente"
        } else {
            Write-Warn "Robocopy exit code: $LASTEXITCODE (puede haber errores)"
        }
    }
} else {
    Write-Warn "Frontend no encontrado: $frontSrc"
}

# 5. LIMPIAR BUILD ARTIFACTS
Write-Step "Limpiando artefactos de build..."
$patterns = @("bin", "obj", "node_modules", ".vite", "dist")
foreach ($pattern in $patterns) {
    $folders = Get-ChildItem -Path $Root -Recurse -Directory -Filter $pattern -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\.git" }
    $count = 0
    foreach ($folder in $folders) {
        if (-not $DryRun) { Remove-Item $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue }
        $count++
    }
    if ($count -gt 0) { Write-OK "Eliminadas $count carpetas '$pattern'" }
}

# 6. ACTUALIZAR .gitignore
Write-Step "Actualizando .gitignore..."
$gitignore = @"
**/bin/
**/obj/
**/node_modules/
**/dist/
**/.vite/
.vs/
.vscode/
.idea/
*.user
.DS_Store
*.log
appsettings.Local.json
.env.local
"@

if (-not $DryRun) {
    Set-Content -Path "$Root\.gitignore" -Value $gitignore -Force
}
Write-OK ".gitignore actualizado"

# RESUMEN
Write-Host "`n========== COMPLETADO ==========" -ForegroundColor Green
Write-Host "Estructura:" -ForegroundColor Cyan
Write-Host "  src/01.Core/              → Backend .NET" -ForegroundColor White
Write-Host "  src/02.Apps/Frontend/     → React + Vite" -ForegroundColor White
Write-Host "  src/03.Platform/AppHost/  → Aspire Orchestration" -ForegroundColor White
Write-Host "`nPróximos pasos:" -ForegroundColor Yellow
Write-Host "  1. .\scripts\Setup-Git-Repo.ps1" -ForegroundColor White
Write-Host "  2. dotnet run --project src\03.Platform\Farutech.AppHost" -ForegroundColor White
