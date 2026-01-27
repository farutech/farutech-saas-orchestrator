#Requires -Version 5.1

<#
.SYNOPSIS
    Reorganiza la estructura del proyecto Farutech Orchestrator
    
.DESCRIPTION
    Script completo de reorganizacion que:
    - Elimina repositorios Git anidados
    - Limpia archivos temporales y documentacion obsoleta
    - Reorganiza proyectos en estructura monorepo
    - Regenera la solucion con nuevas rutas
    
.PARAMETER RootPath
    Ruta raiz del proyecto (default: D:\farutech_2025)
    
.PARAMETER DryRun
    Modo simulacion - muestra cambios sin aplicarlos
    
.EXAMPLE
    .\Organize-Project.ps1 -DryRun
    .\Organize-Project.ps1
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$RootPath = "D:\farutech_2025",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host " FARUTECH PROJECT REORGANIZATION SCRIPT" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN MODE] - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

#region Helper Functions

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host ">> $Message" -ForegroundColor Green
}

function Write-Action {
    param([string]$Message)
    Write-Host "   -> $Message" -ForegroundColor White
}

function Write-Success {
    param([string]$Message)
    Write-Host "   [OK] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "   [WARN] $Message" -ForegroundColor Yellow
}

function Remove-NestedGitRepos {
    param([string]$Path)
    
    Write-Step "Searching for nested .git repositories..."
    
    $rootGit = Join-Path $Path ".git"
    $gitDirs = Get-ChildItem -Path $Path -Directory -Recurse -Force -Filter ".git" -ErrorAction SilentlyContinue |
               Where-Object { $_.FullName -ne $rootGit }
    
    if ($gitDirs.Count -eq 0) {
        Write-Success "No nested .git repositories found"
        return
    }
    
    foreach ($gitDir in $gitDirs) {
        Write-Warning "Found nested Git repo: $($gitDir.FullName)"
        if (-not $DryRun) {
            Remove-Item -Path $gitDir.FullName -Recurse -Force
            Write-Success "Removed: $($gitDir.FullName)"
        }
    }
}

function Clear-BuildArtifacts {
    param([string]$Path)
    
    Write-Step "Cleaning build artifacts..."
    
    $foldersToDelete = @("bin", "obj", ".vs", "node_modules")
    $count = 0
    
    foreach ($folder in $foldersToDelete) {
        $found = Get-ChildItem -Path $Path -Directory -Recurse -Force -Filter $folder -ErrorAction SilentlyContinue
        
        foreach ($item in $found) {
            Write-Action "Deleting: $($item.FullName)"
            if (-not $DryRun) {
                Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction SilentlyContinue
                $count++
            }
        }
    }
    
    Write-Success "Build artifacts cleaned ($count folders removed)"
}

function Remove-UnnecessaryFiles {
    param([string]$Path)
    
    Write-Step "Removing unnecessary documentation and legacy files..."
    
    # MD files en raiz
    $unnecessaryMdFiles = @(
        "AUTH_AND_FILTER_FIX.md",
        "CORRECCIONES_BUILD.md",
        "DATABASE_SETUP.md",
        "DEPLOYMENT_INFRASTRUCTURE.md",
        "DEPLOYMENT_TYPE_MODEL.md",
        "ENTREGABLES_SESION.md",
        "IMPLEMENTATION_SUMMARY.md",
        "INFRASTRUCTURE.md",
        "INFRASTRUCTURE_DECOUPLING_COMPLETE.md",
        "ORGANIZATIONS_MANAGEMENT_IMPLEMENTATION.md",
        "PASSWORD_RECOVERY_IMPLEMENTATION.md",
        "RESUMEN_EJECUTIVO.md",
        "SEED_DATA_MIGRATION_COMPLETE.md",
        "START_SERVICES.md",
        "TEST_PLAN.md",
        "TROUBLESHOOTING_URLS_FIXED.md",
        "URL_ARCHITECTURE.md"
    )
    
    $removedCount = 0
    
    foreach ($file in $unnecessaryMdFiles) {
        $fullPath = Join-Path $Path $file
        if (Test-Path $fullPath) {
            Write-Action "Removing: $file"
            if (-not $DryRun) {
                Remove-Item -Path $fullPath -Force
                $removedCount++
            }
        }
    }
    
    # Test scripts
    $testScriptsPath = Join-Path $Path "scripts\tests"
    if (Test-Path $testScriptsPath) {
        Write-Action "Removing obsolete test scripts folder"
        if (-not $DryRun) {
            Remove-Item -Path $testScriptsPath -Recurse -Force
            $removedCount++
        }
    }
    
    # SQL temporales
    $sqlScripts = @(
        "scripts\add-code-column.sql",
        "scripts\seed-catalog-data.sql",
        "scripts\update-instance-urls-to-localhost.sql"
    )
    
    foreach ($script in $sqlScripts) {
        $fullPath = Join-Path $Path $script
        if (Test-Path $fullPath) {
            Write-Action "Removing: $script"
            if (-not $DryRun) {
                Remove-Item -Path $fullPath -Force
                $removedCount++
            }
        }
    }
    
    # DbChecker
    $dbCheckerPath = Join-Path $Path "scripts\DbChecker"
    if (Test-Path $dbCheckerPath) {
        Write-Action "Removing DbChecker utility"
        if (-not $DryRun) {
            Remove-Item -Path $dbCheckerPath -Recurse -Force
            $removedCount++
        }
    }
    
    # check-db.cs
    $checkDbPath = Join-Path $Path "scripts\check-db.cs"
    if (Test-Path $checkDbPath) {
        Write-Action "Removing check-db.cs"
        if (-not $DryRun) {
            Remove-Item -Path $checkDbPath -Force
            $removedCount++
        }
    }
    
    # Scripts legacy
    $legacyScripts = @(
        "scripts\start-infra-universal.ps1",
        "scripts\start-infra-universal.sh",
        "scripts\refactor-app01-to-pos.ps1"
    )
    
    foreach ($script in $legacyScripts) {
        $fullPath = Join-Path $Path $script
        if (Test-Path $fullPath) {
            Write-Action "Removing: $script"
            if (-not $DryRun) {
                Remove-Item -Path $fullPath -Force
                $removedCount++
            }
        }
    }
    
    # Docs frontend redundantes
    $frontendDocsToRemove = @(
        "universal-design-suite\API_CONFIG.md",
        "universal-design-suite\API_SETUP_COMPLETE.md",
        "universal-design-suite\BUILD_VALIDATION.md",
        "universal-design-suite\CORS_ERROR_405.md",
        "universal-design-suite\CORS_SOLUTION_SUMMARY.md",
        "universal-design-suite\DESIGN_SYSTEM_SPEC.md",
        "universal-design-suite\IMPLEMENTATION_COMPLETE.md",
        "universal-design-suite\PROVISIONING_REDESIGN_IMPLEMENTATION.md",
        "universal-design-suite\TESTING_GUIDE.md",
        "universal-design-suite\UX_SPEC_COMPLIANCE_CHECK.md"
    )
    
    foreach ($doc in $frontendDocsToRemove) {
        $fullPath = Join-Path $Path $doc
        if (Test-Path $fullPath) {
            Write-Action "Removing: $doc"
            if (-not $DryRun) {
                Remove-Item -Path $fullPath -Force
                $removedCount++
            }
        }
    }
    
    Write-Success "Unnecessary files cleaned ($removedCount items removed)"
}

function New-DirectoryStructure {
    param([string]$BasePath)
    
    Write-Step "Creating new directory structure..."
    
    $directories = @(
        "src\01.Core",
        "src\02.Apps",
        "src\03.Platform",
        "src\04.Workers",
        "src\05.SDK",
        "tests\Unit",
        "tests\Integration",
        "docs\architecture",
        "docs\api",
        "scripts\deployment",
        "scripts\maintenance"
    )
    
    foreach ($dir in $directories) {
        $fullPath = Join-Path $BasePath $dir
        if (-not (Test-Path $fullPath)) {
            Write-Action "Creating: $dir"
            if (-not $DryRun) {
                New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
            }
        }
    }
    
    Write-Success "Directory structure created"
}

function Move-Projects {
    param([string]$BasePath)
    
    Write-Step "Moving projects to new structure..."
    
    $srcPath = Join-Path $BasePath "src\backend-core"
    
    if (-not (Test-Path $srcPath)) {
        Write-Warning "Source path not found: $srcPath"
        return
    }
    
    # Mapeo: Old -> New
    $projectMappings = @{
        "Farutech.Orchestrator.Domain" = "src\01.Core\Farutech.Orchestrator.Domain"
        "Farutech.Orchestrator.Application" = "src\01.Core\Farutech.Orchestrator.Application"
        "Farutech.Orchestrator.Infrastructure" = "src\01.Core\Farutech.Orchestrator.Infrastructure"
        "Farutech.Orchestrator.API" = "src\01.Core\Farutech.Orchestrator.API"
        "Farutech.App01.POS.API" = "src\02.Apps\Farutech.POS.API"
        "Farutech.AppHost" = "src\03.Platform\Farutech.AppHost"
        "Farutech.ServiceDefaults" = "src\03.Platform\Farutech.ServiceDefaults"
    }
    
    # SDK client
    $sdkPath = Join-Path $BasePath "src\sdk-client\Farutech.Orchestrator.SDK"
    if (Test-Path $sdkPath) {
        $projectMappings["sdk-client\Farutech.Orchestrator.SDK"] = "src\05.SDK\Farutech.Orchestrator.SDK"
    }
    
    # Workers Go
    $workersPath = Join-Path $BasePath "src\workers-go"
    if (Test-Path $workersPath) {
        $projectMappings["workers-go"] = "src\04.Workers\workers-go"
    }
    
    foreach ($project in $projectMappings.Keys) {
        $oldPath = Join-Path $srcPath $project
        if (-not (Test-Path $oldPath)) {
            # Try alternative paths
            $oldPath = Join-Path $BasePath "src\$project"
        }
        
        $newPath = Join-Path $BasePath $projectMappings[$project]
        
        if (Test-Path $oldPath) {
            Write-Action "Moving: $project -> $($projectMappings[$project])"
            
            if (-not $DryRun) {
                $parentDir = Split-Path $newPath -Parent
                if (-not (Test-Path $parentDir)) {
                    New-Item -Path $parentDir -ItemType Directory -Force | Out-Null
                }
                
                Move-Item -Path $oldPath -Destination $newPath -Force
                Write-Success "Moved: $project"
            }
        } else {
            Write-Warning "Project not found: $oldPath"
        }
    }
    
    # Cleanup old backend-core if empty
    if ((Test-Path $srcPath) -and (-not $DryRun)) {
        $remaining = Get-ChildItem -Path $srcPath
        if ($remaining.Count -eq 0) {
            Remove-Item -Path $srcPath -Force
            Write-Success "Removed empty src\backend-core folder"
        }
    }
}

function Update-Solution {
    param([string]$BasePath)
    
    Write-Step "Regenerating solution file..."
    
    $slnPath = Join-Path $BasePath "Farutech.Orchestrator.sln"
    
    # Backup
    if (Test-Path $slnPath) {
        $backupPath = "$slnPath.backup"
        Write-Action "Backing up existing solution to: $backupPath"
        if (-not $DryRun) {
            Copy-Item -Path $slnPath -Destination $backupPath -Force
            Remove-Item -Path $slnPath -Force
        }
    }
    
    Write-Action "Creating new solution..."
    if (-not $DryRun) {
        Push-Location $BasePath
        dotnet new sln -n Farutech.Orchestrator -o . --force | Out-Null
        
        # Add all .csproj
        $projects = Get-ChildItem -Path (Join-Path $BasePath "src") -Recurse -Filter "*.csproj"
        
        foreach ($project in $projects) {
            Write-Action "Adding: $($project.Name)"
            dotnet sln add $project.FullName | Out-Null
        }
        
        Pop-Location
        Write-Success "Solution regenerated with $($projects.Count) projects"
    }
}

function Update-Gitignore {
    param([string]$BasePath)
    
    Write-Step "Updating .gitignore..."
    
    $gitignorePath = Join-Path $BasePath ".gitignore"
    
    $content = @"
# Visual Studio
.vs/
*.suo
*.user
*.userosscache
*.sln.docstates

# Build results
[Dd]ebug/
[Rr]elease/
x64/
x86/
[Bb]in/
[Oo]bj/
[Ll]og/

# .NET Core
project.lock.json
artifacts/

# ASP.NET Scaffolding
ScaffoldingReadMe.txt

# Files built by Visual Studio
*.obj
*.pdb
*.log

# ReSharper
_ReSharper*/

# Rider
.idea/

# VS Code
.vscode/
!.vscode/settings.json
!.vscode/tasks.json

# Node.js
node_modules/
npm-debug.log*

# Python
__pycache__/
*.py[cod]

# Go
*.exe
*.test
*.out

# Mac
.DS_Store

# Aspire
*.binlog
"@

    if (-not $DryRun) {
        Set-Content -Path $gitignorePath -Value $content -Encoding UTF8
        Write-Success ".gitignore updated"
    } else {
        Write-Action "Would update .gitignore"
    }
}

#endregion

#region Main Execution

try {
    if (-not (Test-Path $RootPath)) {
        throw "Root path not found: $RootPath"
    }
    
    Write-Host "Working directory: $RootPath" -ForegroundColor Cyan
    Write-Host ""
    
    # Execute steps
    Remove-NestedGitRepos -Path $RootPath
    Clear-BuildArtifacts -Path $RootPath
    Remove-UnnecessaryFiles -Path $RootPath
    New-DirectoryStructure -BasePath $RootPath
    Move-Projects -BasePath $RootPath
    Update-Solution -BasePath $RootPath
    Update-Gitignore -BasePath $RootPath
    
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host " REORGANIZATION COMPLETED SUCCESSFULLY" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    
    if ($DryRun) {
        Write-Host "[DRY RUN] No changes were made" -ForegroundColor Yellow
        Write-Host "Run without -DryRun to apply changes" -ForegroundColor Yellow
    } else {
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. dotnet restore" -ForegroundColor White
        Write-Host "  2. dotnet build" -ForegroundColor White
        Write-Host "  3. dotnet run --project src\03.Platform\Farutech.AppHost" -ForegroundColor White
    }
    
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor Gray
    exit 1
}

#endregion
