#Requires -Version 5.1
<#
.SYNOPSIS
    Configura Git y sube a GitHub
#>

param(
    [string]$Org = "farutech",
    [string]$Repo = "farutech-saas-orchestrator",
    [switch]$Private
)

$Root = "D:\farutech_2025"
$ErrorActionPreference = "Stop"

function Write-Step { param($Msg) Write-Host "`n>> $Msg" -ForegroundColor Cyan }
function Write-OK { param($Msg) Write-Host "   [OK] $Msg" -ForegroundColor Green }
function Write-Warn { param($Msg) Write-Host "   [WARN] $Msg" -ForegroundColor Yellow }
function Write-Err { param($Msg) Write-Host "   [ERROR] $Msg" -ForegroundColor Red }

Set-Location $Root

Write-Host "`n========== GIT REPOSITORY SETUP ==========" -ForegroundColor Cyan

# 1. VERIFICAR GH CLI
Write-Step "Verificando GitHub CLI..."
try {
    $null = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Err "No autenticado. Ejecuta: gh auth login"
        exit 1
    }
    Write-OK "GitHub CLI autenticado"
} catch {
    Write-Err "GitHub CLI no encontrado"
    exit 1
}

# 2. INICIALIZAR GIT
Write-Step "Verificando repositorio local..."
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    Write-OK "Repositorio inicializado"
} else {
    Write-OK "Repositorio existe"
}

# 3. STAGING
Write-Step "Preparando archivos..."
git add -A
$status = git status --porcelain
if ($status) {
    Write-OK "$($status.Count) archivos preparados"
} else {
    Write-Warn "No hay cambios"
}

# 4. COMMIT
Write-Step "Creando commit..."
$msg = @"
feat: reestructurar a monorepo Full-Stack con Aspire

- Backend .NET en src/01.Core
- Frontend React en src/02.Apps/Farutech.Frontend
- Orquestación Aspire en src/03.Platform
- Workers Go en src/04.Workers
- SDK Cliente en src/05.SDK

Stack:
- .NET 9 + PostgreSQL + NATS
- React 18 + Vite + TypeScript
- Aspire 9.0 orchestration
- Podman/Docker compose
"@

try {
    git commit -m $msg 2>&1 | Out-Null
    Write-OK "Commit creado"
} catch {
    Write-Warn "Sin cambios para commit"
}

# 5. CREAR REPO REMOTO
Write-Step "Configurando repositorio GitHub..."
$fullName = "$Org/$Repo"
$vis = if ($Private) { "--private" } else { "--public" }

# Verificar si existe
$repoExists = $false
try {
    $ErrorActionPreference = "SilentlyContinue"
    gh repo view $fullName 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $repoExists = $true
    }
    $ErrorActionPreference = "Stop"
} catch {
    # Repo no existe, continuamos
}

# Configurar remoto
if ($repoExists) {
    $remote = git remote get-url origin 2>&1
    if ($LASTEXITCODE -ne 0) {
        git remote add origin "https://github.com/$fullName.git"
        Write-OK "Remoto agregado"
    } else {
        Write-OK "Remoto ya configurado: $remote"
    }
} else {
    # Crear nuevo repo
    $desc = "Multi-tenant SaaS Orchestrator - .NET 9 Aspire + React + PostgreSQL + NATS"
    try {
        gh repo create $fullName $vis --description $desc --source=. --remote=origin
        Write-OK "Repositorio creado: https://github.com/$fullName"
    } catch {
        Write-Err "Error creando repo: $_"
        exit 1
    }
}

# 6. PUSH
Write-Step "Subiendo código..."
try {
    git push -u origin main --force 2>&1 | Out-Null
    Write-OK "Código subido"
} catch {
    Write-Warn "Error en push. Intenta: git push origin main --force"
}

# RESUMEN
Write-Host "`n========== COMPLETADO ==========" -ForegroundColor Green
Write-Host "Repositorio: https://github.com/$fullName" -ForegroundColor Cyan
Write-Host "`nPróximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Verificar: https://github.com/$fullName" -ForegroundColor White
Write-Host "  2. Ejecutar: dotnet run --project src\03.Platform\Farutech.AppHost" -ForegroundColor White
