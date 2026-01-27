#Requires -Version 5.1

<#
.SYNOPSIS
    Reorganiza el proyecto Farutech SaaS a estructura de monorepo full-stack.

.DESCRIPTION
    Este script realiza:
    - Mueve el frontend React a src/02.Apps/Farutech.Frontend
    - Limpia repositorios .git anidados
    - Elimina carpetas de build (bin, obj, node_modules, dist)
    - Prepara la estructura para orquestación con Aspire

.EXAMPLE
    .\scripts\Organize-FullStack.ps1
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"
$rootPath = Split-Path -Parent $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FARUTECH FULL-STACK REORGANIZATION   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "⚠️  DRY RUN MODE - No se realizarán cambios reales" -ForegroundColor Yellow
    Write-Host ""
}

# ========================================
# PASO 1: LIMPIEZA DE REPOSITORIOS GIT ANIDADOS
# ========================================
function Remove-NestedGitRepos {
    Write-Host ">> Buscando repositorios Git anidados..." -ForegroundColor Cyan
    
    $nestedGitDirs = Get-ChildItem -Path $rootPath -Directory -Recurse -Force -Filter ".git" -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -ne "$rootPath\.git" }
    
    if ($nestedGitDirs.Count -eq 0) {
        Write-Host "   [OK] No se encontraron repos Git anidados" -ForegroundColor Green
        return
    }
    
    foreach ($gitDir in $nestedGitDirs) {
        Write-Host "   [WARN] Repositorio Git anidado encontrado: $($gitDir.FullName)" -ForegroundColor Yellow
        
        if (-not $DryRun) {
            Remove-Item -Path $gitDir.FullName -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "   [OK] Eliminado: $($gitDir.FullName)" -ForegroundColor Green
        } else {
            Write-Host "   [DRY RUN] Se eliminaría: $($gitDir.FullName)" -ForegroundColor Yellow
        }
    }
}

# ========================================
# PASO 2: LIMPIEZA DE ARTEFACTOS DE BUILD
# ========================================
function Clear-BuildArtifacts {
    Write-Host "`n>> Limpiando artefactos de build..." -ForegroundColor Cyan
    
    $artifactFolders = @("bin", "obj", "node_modules", "dist", ".vite", ".turbo")
    $count = 0
    
    foreach ($folder in $artifactFolders) {
        $paths = Get-ChildItem -Path $rootPath -Directory -Recurse -Force -Filter $folder -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch "\\\.git\\" }
        
        foreach ($path in $paths) {
            Write-Host "   -> Eliminando: $($path.FullName.Replace($rootPath, '.'))" -ForegroundColor DarkGray
            
            if (-not $DryRun) {
                Remove-Item -Path $path.FullName -Recurse -Force -ErrorAction SilentlyContinue
                $count++
            }
        }
    }
    
    Write-Host "   [OK] Limpieza completada ($count carpetas eliminadas)" -ForegroundColor Green
}

# ========================================
# PASO 3: MOVER FRONTEND A ESTRUCTURA MONOREPO
# ========================================
function Move-FrontendToMonorepo {
    Write-Host "`n>> Moviendo Frontend a src/02.Apps..." -ForegroundColor Cyan
    
    $frontendSource = Join-Path $rootPath "universal-design-suite"
    $frontendDest = Join-Path $rootPath "src\02.Apps\Farutech.Frontend"
    
    if (-not (Test-Path $frontendSource)) {
        Write-Host "   [SKIP] Frontend no encontrado en: $frontendSource" -ForegroundColor Yellow
        return
    }
    
    if (Test-Path $frontendDest) {
        Write-Host "   [INFO] El destino ya existe: $frontendDest" -ForegroundColor Yellow
        Write-Host "   [INFO] ¿Desea sobrescribir? (s/n): " -NoNewline -ForegroundColor Yellow
        
        if (-not $DryRun) {
            $response = Read-Host
            if ($response -ne 's') {
                Write-Host "   [SKIP] Operación cancelada por el usuario" -ForegroundColor Yellow
                return
            }
            
            Write-Host "   [INFO] Eliminando destino existente..." -ForegroundColor Yellow
            Remove-Item -Path $frontendDest -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Crear directorio destino
    $destParent = Split-Path -Parent $frontendDest
    if (-not (Test-Path $destParent)) {
        Write-Host "   [INFO] Creando directorio: $destParent" -ForegroundColor Cyan
        if (-not $DryRun) {
            New-Item -Path $destParent -ItemType Directory -Force | Out-Null
        }
    }
    
    Write-Host "   [INFO] Moviendo: $frontendSource -> $frontendDest" -ForegroundColor Cyan
    
    if (-not $DryRun) {
        Move-Item -Path $frontendSource -Destination $frontendDest -Force
        Write-Host "   [OK] Frontend movido exitosamente" -ForegroundColor Green
    } else {
        Write-Host "   [DRY RUN] Se movería el frontend" -ForegroundColor Yellow
    }
}

# ========================================
# PASO 4: VERIFICAR ESTRUCTURA BACKEND
# ========================================
function Verify-BackendStructure {
    Write-Host "`n>> Verificando estructura Backend..." -ForegroundColor Cyan
    
    $expectedProjects = @(
        "src\01.Core\Farutech.Orchestrator.API",
        "src\01.Core\Farutech.Orchestrator.Application",
        "src\01.Core\Farutech.Orchestrator.Domain",
        "src\01.Core\Farutech.Orchestrator.Infrastructure",
        "src\03.Platform\Farutech.AppHost",
        "src\03.Platform\Farutech.ServiceDefaults",
        "src\05.SDK\Farutech.Orchestrator.SDK"
    )
    
    $allFound = $true
    foreach ($project in $expectedProjects) {
        $fullPath = Join-Path $rootPath $project
        if (Test-Path $fullPath) {
            Write-Host "   [✓] $project" -ForegroundColor Green
        } else {
            Write-Host "   [✗] $project (NO ENCONTRADO)" -ForegroundColor Red
            $allFound = $false
        }
    }
    
    if ($allFound) {
        Write-Host "   [OK] Estructura Backend verificada" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] Algunos proyectos Backend no se encontraron" -ForegroundColor Yellow
    }
}

# ========================================
# PASO 5: CREAR ESTRUCTURA DE DIRECTORIOS
# ========================================
function Ensure-DirectoryStructure {
    Write-Host "`n>> Asegurando estructura de directorios..." -ForegroundColor Cyan
    
    $directories = @(
        "src\01.Core",
        "src\02.Apps",
        "src\03.Platform",
        "src\04.Workers",
        "src\05.SDK",
        "tests",
        "docs",
        "scripts"
    )
    
    foreach ($dir in $directories) {
        $fullPath = Join-Path $rootPath $dir
        if (-not (Test-Path $fullPath)) {
            Write-Host "   [INFO] Creando: $dir" -ForegroundColor Cyan
            if (-not $DryRun) {
                New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
            }
        }
    }
    
    Write-Host "   [OK] Estructura de directorios verificada" -ForegroundColor Green
}

# ========================================
# PASO 6: GENERAR DOCUMENTACIÓN DE ESTRUCTURA
# ========================================
function Generate-StructureDoc {
    Write-Host "`n>> Generando documentación de estructura..." -ForegroundColor Cyan
    
    $docContent = @"
# Farutech SaaS - Estructura de Monorepo

Generado: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 📁 Estructura de Carpetas

``````
D:\farutech_2025/
│
├── src/
│   ├── 01.Core/                    # Backend Core (.NET 9)
│   │   ├── Farutech.Orchestrator.API/
│   │   ├── Farutech.Orchestrator.Application/
│   │   ├── Farutech.Orchestrator.Domain/
│   │   └── Farutech.Orchestrator.Infrastructure/
│   │
│   ├── 02.Apps/                    # Aplicaciones Full-Stack
│   │   └── Farutech.Frontend/      # React + Vite (Dashboard)
│   │       ├── src/
│   │       │   ├── apps/           # Micro-frontends modulares
│   │       │   ├── packages/       # UI Kit compartido
│   │       │   ├── components/     # Componentes React
│   │       │   ├── features/       # Lógica de negocio
│   │       │   └── services/       # API clients
│   │       └── package.json
│   │
│   ├── 03.Platform/                # Orquestación Aspire
│   │   ├── Farutech.AppHost/       # Aspire Host
│   │   └── Farutech.ServiceDefaults/
│   │
│   ├── 04.Workers/                 # Background Jobs
│   │   └── workers-go/             # Workers en Go
│   │
│   └── 05.SDK/                     # Client SDKs
│       └── Farutech.Orchestrator.SDK/
│
├── tests/                          # Tests unitarios e integración
├── docs/                           # Documentación técnica
├── scripts/                        # Scripts de automatización
│
├── docker-compose.yml              # Servicios base (Postgres, NATS)
├── Farutech.sln                    # Solución .NET
└── README.md
``````

## 🚀 Comandos Principales

### Backend (.NET)
``````bash
# Restaurar dependencias
dotnet restore

# Compilar solución
dotnet build

# Iniciar con Aspire (Backend + Frontend orquestados)
dotnet run --project src/03.Platform/Farutech.AppHost
``````

### Frontend (React)
``````bash
cd src/02.Apps/Farutech.Frontend

# Instalar dependencias
npm install

# Desarrollo local (sin Aspire)
npm run dev

# Build producción
npm run build
``````

### Infraestructura (Podman/Docker)
``````bash
# Levantar servicios base
podman-compose up -d

# Verificar contenedores
podman ps
``````

## 🏗️ Arquitectura Frontend (Micro-Frontend Ready)

La estructura actual de React está preparada para migración futura a Micro-Frontends:

### Estructura Recomendada (dentro de `src/02.Apps/Farutech.Frontend/src`):

``````
src/
├── apps/                           # Módulos de aplicación independientes
│   ├── pos/                        # Módulo POS (Punto de Venta)
│   │   ├── pages/
│   │   ├── components/
│   │   └── index.tsx
│   │
│   ├── erp/                        # Módulo ERP
│   │   ├── pages/
│   │   ├── components/
│   │   └── index.tsx
│   │
│   └── orchestrator/               # Dashboard de Orquestador
│       ├── pages/
│       ├── components/
│       └── index.tsx
│
├── packages/                       # Paquetes compartidos
│   ├── ui/                         # UI Kit (shadcn/ui components)
│   │   ├── button/
│   │   ├── dialog/
│   │   └── index.ts
│   │
│   ├── utils/                      # Utilidades compartidas
│   │   ├── api-client.ts
│   │   ├── auth.ts
│   │   └── index.ts
│   │
│   └── types/                      # TypeScript types compartidos
│       ├── api.types.ts
│       └── index.ts
│
└── main.tsx                        # Entry point
``````

### Migración Futura a Module Federation (Webpack 5) o Nx

Cuando el proyecto crezca, considera:
- **Nx Monorepo:** Para gestión avanzada de monorepos con caching inteligente
- **Module Federation:** Para cargar módulos remotos dinámicamente
- **Turborepo:** Alternativa ligera a Nx

## 📦 Variables de Entorno

### Frontend (.env)
``````env
VITE_API_URL=http://localhost:5098
VITE_NATS_URL=ws://localhost:4222
``````

### Backend (appsettings.json)
Configurado automáticamente por Aspire en tiempo de ejecución.

---

**Estructura generada por:** Organize-FullStack.ps1
"@

    $docPath = Join-Path $rootPath "MONOREPO_STRUCTURE.md"
    
    if (-not $DryRun) {
        $docContent | Out-File -FilePath $docPath -Encoding UTF8
        Write-Host "   [OK] Documentación generada: MONOREPO_STRUCTURE.md" -ForegroundColor Green
    } else {
        Write-Host "   [DRY RUN] Se generaría documentación" -ForegroundColor Yellow
    }
}

# ========================================
# EJECUCIÓN PRINCIPAL
# ========================================
try {
    Write-Host "Iniciando reorganización Full-Stack..`n" -ForegroundColor White
    
    # Paso 1: Limpiar repos anidados
    Remove-NestedGitRepos
    
    # Paso 2: Limpiar builds
    Clear-BuildArtifacts
    
    # Paso 3: Mover frontend
    Move-FrontendToMonorepo
    
    # Paso 4: Verificar backend
    Verify-BackendStructure
    
    # Paso 5: Asegurar estructura
    Ensure-DirectoryStructure
    
    # Paso 6: Generar documentación
    Generate-StructureDoc
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "   ✅ REORGANIZACIÓN COMPLETADA" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    if (-not $DryRun) {
        Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
        Write-Host "   1. Ejecutar: .\scripts\Setup-Git-Repo.ps1" -ForegroundColor White
        Write-Host "   2. Compilar: dotnet restore && dotnet build" -ForegroundColor White
        Write-Host "   3. Iniciar: dotnet run --project src\03.Platform\Farutech.AppHost" -ForegroundColor White
        Write-Host ""
    }
    
} catch {
    Write-Host "`n❌ ERROR: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    exit 1
}
