# ===================================================================
# SCRIPT DE LIMPIEZA NUCLEAR Y PUBLICACIÓN GIT
# ===================================================================
# ADVERTENCIA: Este script eliminará TODOS los repositorios .git 
# existentes y creará un monorepo limpio desde cero.
#
# USO:
#   .\Reset-And-Push-Git.ps1 -DryRun        # Muestra qué se eliminará
#   .\Reset-And-Push-Git.ps1 -Execute       # Ejecuta la limpieza real
#   .\Reset-And-Push-Git.ps1 -Execute -Push # Limpia y publica a GitHub
#
# REQUISITOS:
#   - Git instalado
#   - GitHub CLI (gh) instalado y autenticado
#   - PowerShell 7+ recomendado
# ===================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Execute = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Push = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "farutech-saas-platform",
    
    [Parameter(Mandatory=$false)]
    [string]$Organization = "farutech",
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = "dev"
)

# ===================================================================
# CONFIGURACIÓN
# ===================================================================
$RootPath = "D:\farutech_2025"
$BackupPath = "D:\farutech_2025_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$ErrorActionPreference = "Stop"

# ===================================================================
# FUNCIONES AUXILIARES
# ===================================================================

function Write-Header {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host " $Message" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Confirm-Action {
    param([string]$Message)
    
    Write-Warning $Message
    $response = Read-Host "¿Continuar? (yes/no)"
    
    if ($response -ne "yes") {
        Write-Error "Operación cancelada por el usuario"
        exit 0
    }
}

# ===================================================================
# VALIDACIONES INICIALES
# ===================================================================

Write-Header "VALIDACIONES INICIALES"

# Verificar que existe la ruta root
if (-not (Test-Path $RootPath)) {
    Write-Error "La ruta $RootPath no existe"
    exit 1
}

Write-Success "Ruta root encontrada: $RootPath"

# Verificar Git instalado
try {
    $gitVersion = git --version
    Write-Success "Git instalado: $gitVersion"
} catch {
    Write-Error "Git no está instalado o no está en el PATH"
    exit 1
}

# Verificar GitHub CLI instalado (solo si se va a hacer push)
if ($Push) {
    try {
        $ghVersion = gh --version
        Write-Success "GitHub CLI instalado: $($ghVersion -split "`n" | Select-Object -First 1)"
        
        # Verificar autenticación
        $ghAuth = gh auth status 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Error "GitHub CLI no está autenticado. Ejecuta: gh auth login"
            exit 1
        }
        Write-Success "GitHub CLI autenticado correctamente"
    } catch {
        Write-Error "GitHub CLI no está instalado. Descarga desde: https://cli.github.com/"
        exit 1
    }
}

# ===================================================================
# FASE 1: BÚSQUEDA DE REPOSITORIOS .GIT
# ===================================================================

Write-Header "FASE 1: BÚSQUEDA DE REPOSITORIOS .GIT"

Write-Info "Buscando carpetas .git en $RootPath..."
$gitFolders = Get-ChildItem -Path $RootPath -Hidden -Recurse -Directory -Filter ".git" -ErrorAction SilentlyContinue

if ($gitFolders.Count -eq 0) {
    Write-Warning "No se encontraron carpetas .git"
} else {
    Write-Warning "Se encontraron $($gitFolders.Count) repositorio(s) .git:"
    foreach ($folder in $gitFolders) {
        $relativePath = $folder.FullName.Replace($RootPath, "")
        Write-Host "   📁 $relativePath" -ForegroundColor Yellow
    }
}

# ===================================================================
# FASE 2: BÚSQUEDA DE ARTEFACTOS DE BUILD
# ===================================================================

Write-Header "FASE 2: BÚSQUEDA DE ARTEFACTOS DE BUILD"

Write-Info "Buscando carpetas de artefactos (bin, obj, node_modules)..."

$artifactFolders = @(
    Get-ChildItem -Path $RootPath -Recurse -Directory -Filter "bin" -ErrorAction SilentlyContinue
    Get-ChildItem -Path $RootPath -Recurse -Directory -Filter "obj" -ErrorAction SilentlyContinue
    Get-ChildItem -Path $RootPath -Recurse -Directory -Filter "node_modules" -ErrorAction SilentlyContinue
)

if ($artifactFolders.Count -eq 0) {
    Write-Success "No se encontraron artefactos de build"
} else {
    Write-Warning "Se encontraron $($artifactFolders.Count) carpeta(s) de artefactos:"
    $artifactFolders | Select-Object -First 10 | ForEach-Object {
        $relativePath = $_.FullName.Replace($RootPath, "")
        Write-Host "   📦 $relativePath" -ForegroundColor Yellow
    }
    if ($artifactFolders.Count -gt 10) {
        Write-Host "   ... y $($artifactFolders.Count - 10) más" -ForegroundColor Yellow
    }
}

# ===================================================================
# MODO DRY-RUN
# ===================================================================

if ($DryRun) {
    Write-Header "MODO DRY-RUN COMPLETADO"
    Write-Info "Se ejecutó en modo dry-run. No se realizaron cambios."
    Write-Info "Para ejecutar la limpieza real, usa: .\Reset-And-Push-Git.ps1 -Execute"
    exit 0
}

# ===================================================================
# CONFIRMACIONES DE SEGURIDAD
# ===================================================================

if (-not $Execute) {
    Write-Error "Debes usar -Execute para confirmar la ejecución"
    Write-Info "Uso: .\Reset-And-Push-Git.ps1 -Execute"
    exit 0
}

Write-Header "CONFIRMACIONES DE SEGURIDAD"

Confirm-Action "⚠️  ESTA OPERACIÓN ES IRREVERSIBLE ⚠️`nSe eliminarán TODOS los repositorios .git y artefactos de build.`nSe creará un backup en: $BackupPath"

if ($Push) {
    Confirm-Action "Se publicará el repositorio en GitHub como: $Organization/$RepoName"
}

# ===================================================================
# FASE 3: CREAR BACKUP
# ===================================================================

Write-Header "FASE 3: CREANDO BACKUP"

Write-Info "Creando backup de repositorios .git existentes..."

try {
    if ($gitFolders.Count -gt 0) {
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
        
        foreach ($gitFolder in $gitFolders) {
            $relativePath = $gitFolder.FullName.Replace($RootPath, "")
            $backupTarget = Join-Path $BackupPath $relativePath
            
            Write-Info "Respaldando: $relativePath"
            
            $backupDir = Split-Path -Parent $backupTarget
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
            
            Copy-Item -Path $gitFolder.FullName -Destination $backupTarget -Recurse -Force
        }
        
        Write-Success "Backup creado en: $BackupPath"
    } else {
        Write-Info "No hay repositorios para respaldar"
    }
} catch {
    Write-Error "Error creando backup: $_"
    exit 1
}

# ===================================================================
# FASE 4: LIMPIEZA NUCLEAR
# ===================================================================

Write-Header "FASE 4: LIMPIEZA NUCLEAR"

# Eliminar carpetas .git
Write-Info "Eliminando repositorios .git..."
foreach ($gitFolder in $gitFolders) {
    $relativePath = $gitFolder.FullName.Replace($RootPath, "")
    Write-Host "   🗑️  Eliminando: $relativePath" -ForegroundColor Red
    Remove-Item -Path $gitFolder.FullName -Recurse -Force
}
Write-Success "Repositorios .git eliminados"

# Eliminar artefactos de build
Write-Info "Eliminando artefactos de build..."
$deletedCount = 0
foreach ($artifactFolder in $artifactFolders) {
    try {
        Remove-Item -Path $artifactFolder.FullName -Recurse -Force -ErrorAction SilentlyContinue
        $deletedCount++
    } catch {
        # Ignorar errores de archivos bloqueados
    }
}
Write-Success "Eliminados $deletedCount carpeta(s) de artefactos"

# ===================================================================
# FASE 5: CREAR .GITIGNORE ROBUSTO
# ===================================================================

Write-Header "FASE 5: CREANDO .GITIGNORE"

$gitignoreContent = @"
# ===================================================================
# GITIGNORE MONOREPO FARUTECH
# ===================================================================

# ===================================================================
# .NET / C#
# ===================================================================
[Bb]in/
[Oo]bj/
[Dd]ebug/
[Rr]elease/
x64/
x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Ll]og/
[Ll]ogs/

# Visual Studio
.vs/
.vscode/
*.user
*.suo
*.userosscache
*.sln.docstates
*.userprefs
*.sln.iml

# Rider
.idea/
*.sln.iml
.idea/**
.idea/**/workspace.xml
.idea/**/tasks.xml

# User-specific files
*.rsuser
*.suo
*.user
*.userosscache
*.sln.docstates

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/
[Ll]ogs/

# .NET Core
project.lock.json
project.fragment.lock.json
artifacts/

# Aspire DCP
.aspire/

# ===================================================================
# CONFIGURACIONES SENSIBLES (EXCEPTO DEVELOPMENT)
# ===================================================================
appsettings.json
appsettings.*.json
!appsettings.Development.json
!appsettings.Example.json

*.secrets.json
*.config.json
.env
.env.local
.env.production

# ===================================================================
# NODE / FRONTEND
# ===================================================================
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

dist/
dist-ssr/
*.local

# Vite
.vite/

# Bun
.bun/

# ===================================================================
# GOLANG / WORKERS
# ===================================================================
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work

# Compiled Object files
*.o
*.a

# ===================================================================
# PYTHON
# ===================================================================
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
env.bak/
venv.bak/
*.egg-info/
dist/
build/

# ===================================================================
# DOCKER / INFRAESTRUCTURA
# ===================================================================
*.log
.dockerignore
docker-compose.override.yml

# Podman
podman-volumes/

# ===================================================================
# BASES DE DATOS
# ===================================================================
*.db
*.sqlite
*.sqlite3

# PostgreSQL
pgdata/
postgres-data/

# ===================================================================
# SISTEMAS OPERATIVOS
# ===================================================================
# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/

# macOS
.DS_Store
.AppleDouble
.LSOverride
._*

# Linux
*~
.directory

# ===================================================================
# TEMPORALES Y BACKUPS
# ===================================================================
*.tmp
*.temp
*.bak
*.swp
*~.nib
*.backup
*.old

# ===================================================================
# REPORTES Y DOCUMENTOS INTERNOS
# ===================================================================
progress/
progreso/
*.draft.md

# ===================================================================
# TESTING
# ===================================================================
coverage/
*.coverage
.nyc_output/
TestResults/
test-results/
playwright-report/

# ===================================================================
# SECRETS MANAGER
# ===================================================================
secrets/
.secrets/
credentials/
keys/
*.pem
*.key
*.crt
*.p12
*.pfx

"@

$gitignorePath = Join-Path $RootPath ".gitignore"
Set-Content -Path $gitignorePath -Value $gitignoreContent -Encoding UTF8
Write-Success "Archivo .gitignore creado"

# ===================================================================
# FASE 6: INICIALIZAR REPOSITORIO MONOREPO
# ===================================================================

Write-Header "FASE 6: INICIALIZANDO REPOSITORIO GIT"

Set-Location $RootPath

Write-Info "Inicializando repositorio git..."
git init
Write-Success "Repositorio inicializado"

Write-Info "Creando rama $Branch..."
git checkout -b $Branch
Write-Success "Rama $Branch creada"

Write-Info "Configurando usuario Git..."
git config user.name "Farid Maloof"
git config user.email "faridmaloof@gmail.com"
Write-Success "Usuario configurado"

# ===================================================================
# FASE 7: COMMIT INICIAL
# ===================================================================

Write-Header "FASE 7: COMMIT INICIAL"

Write-Info "Agregando archivos al staging area..."
git add .

Write-Info "Verificando archivos a commitear..."
$statusOutput = git status --short
$fileCount = ($statusOutput | Measure-Object).Count
Write-Success "$fileCount archivo(s) listos para commit"

Write-Info "Creando commit inicial..."
$commitMessage = @"
feat: Initial monorepo structure with .NET Aspire orchestration

ARQUITECTURA:
- .NET Aspire 9.0 AppHost orchestration
- Farutech.Orchestrator.API (Core backend)
- Farutech.Frontend (React + Vite)
- PostgreSQL 17 + pgAdmin
- NATS JetStream messaging
- Go workers

CARACTERÍSTICAS:
- Multi-tenancy con Organizations/Instances
- Identity con JWT authentication
- Entity Framework Core con migraciones automáticas
- CORS configurado para desarrollo
- Docker/Podman ready

ESTRUCTURA:
- src/01.Core: Backend .NET
- src/02.Apps: Frontend y aplicaciones
- src/03.Platform: Aspire AppHost
- scripts: Herramientas de desarrollo
- requerimientos: Documentación técnica
"@

git commit -m "$commitMessage"
Write-Success "Commit inicial creado"

# ===================================================================
# FASE 8: PUBLICAR EN GITHUB (OPCIONAL)
# ===================================================================

if ($Push) {
    Write-Header "FASE 8: PUBLICANDO EN GITHUB"
    
    Write-Info "Verificando si el repositorio ya existe..."
    $repoExists = gh repo view "$Organization/$RepoName" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Warning "El repositorio $Organization/$RepoName ya existe"
        Confirm-Action "¿Deseas forzar el push (esto sobrescribirá el repositorio remoto)?"
        
        Write-Info "Agregando remote origin..."
        git remote add origin "https://github.com/$Organization/$RepoName.git" 2>$null
        
        Write-Info "Forzando push..."
        git push -u origin $Branch --force
        Write-Success "Push forzado completado"
    } else {
        Write-Info "Creando repositorio en GitHub..."
        gh repo create "$Organization/$RepoName" --private --source=. --remote=origin --description "Farutech SaaS Platform - Multi-tenant POS system with .NET Aspire"
        
        Write-Info "Pusheando código..."
        git push -u origin $Branch
        Write-Success "Repositorio creado y código publicado"
    }
    
    $repoUrl = "https://github.com/$Organization/$RepoName"
    Write-Success "Repositorio disponible en: $repoUrl"
    
    # Abrir en navegador
    Start-Process $repoUrl
}

# ===================================================================
# REPORTE FINAL
# ===================================================================

Write-Header "✅ LIMPIEZA COMPLETADA EXITOSAMENTE"

Write-Host @"

📊 RESUMEN DE OPERACIONES:
──────────────────────────────────────────────────────────────

✅ Repositorios .git eliminados: $($gitFolders.Count)
✅ Artefactos de build eliminados: $deletedCount
✅ Backup creado en: $BackupPath
✅ Archivo .gitignore creado
✅ Repositorio git inicializado en rama: $Branch
✅ Commit inicial creado con $fileCount archivos

"@ -ForegroundColor Green

if ($Push) {
    Write-Host @"
✅ Repositorio publicado en GitHub:
   🔗 https://github.com/$Organization/$RepoName

"@ -ForegroundColor Green
} else {
    Write-Host @"
ℹ️  SIGUIENTE PASO: Publicar en GitHub
   Ejecuta: .\Reset-And-Push-Git.ps1 -Execute -Push

"@ -ForegroundColor Cyan
}

Write-Host @"
📝 SIGUIENTES PASOS RECOMENDADOS:
──────────────────────────────────────────────────────────────

1. Verificar el estado del repositorio:
   git status

2. Ver el historial:
   git log --oneline

3. Si necesitas publicar ahora:
   git remote add origin https://github.com/$Organization/$RepoName.git
   git push -u origin $Branch

4. Restaurar desde backup (si es necesario):
   Backup disponible en: $BackupPath

"@ -ForegroundColor White

Write-Success "Script completado exitosamente"
