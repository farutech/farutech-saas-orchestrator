# Quick Database Validation Script for Farutech Orchestrator
# Fast validation that database migrations work correctly

param(
    [string]$ConnectionString = "Host=localhost;Port=5432;Database=farutec_db;Username=farutec_admin;Password=SuperSecurePassword123"
)

Write-Host "🔍 FARUTECH ORCHESTRATOR - QUICK DATABASE VALIDATION" -ForegroundColor Blue
Write-Host "Connection: $ConnectionString" -ForegroundColor White
Write-Host ""

$ErrorActionPreference = "Stop"

# Function to execute SQL query
function Invoke-SqlQuery {
    param([string]$Query)
    try {
        $result = Invoke-Sqlcmd -ConnectionString $ConnectionString -Query $Query -ErrorAction Stop
        return $result
    } catch {
        return $null
    }
}

# Test database connectivity
Write-Host "🔗 Testing database connection..." -ForegroundColor Yellow
$query = "SELECT 1 as test;"
$result = Invoke-SqlQuery -Query $query

if (-not $result) {
    Write-Host "❌ Cannot connect to database" -ForegroundColor Red
    Write-Host "💡 Make sure infrastructure is running: .\scripts\start-infra.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Database connection successful" -ForegroundColor Green

# Check schemas
Write-Host ""
Write-Host "📁 Checking schemas..." -ForegroundColor Yellow
$schemas = @("identity", "tenants", "catalog", "tasks", "core")
$missingSchemas = @()

foreach ($schema in $schemas) {
    $query = "SELECT 1 FROM information_schema.schemata WHERE schema_name = '$schema';"
    $result = Invoke-SqlQuery -Query $query
    if (-not $result) {
        $missingSchemas += $schema
    }
}

if ($missingSchemas.Count -eq 0) {
    Write-Host "✅ All schemas exist" -ForegroundColor Green
} else {
    Write-Host "❌ Missing schemas: $($missingSchemas -join ', ')" -ForegroundColor Red
    Write-Host "💡 Run the application to execute migrations" -ForegroundColor Yellow
    exit 1
}

# Check extensions
Write-Host ""
Write-Host "🔧 Checking extensions..." -ForegroundColor Yellow
$extensions = @("uuid-ossp", "btree_gin")
$missingExtensions = @()

foreach ($ext in $extensions) {
    $query = "SELECT 1 FROM pg_extension WHERE extname = '$ext';"
    $result = Invoke-SqlQuery -Query $query
    if (-not $result) {
        $missingExtensions += $ext
    }
}

if ($missingExtensions.Count -eq 0) {
    Write-Host "✅ All extensions installed" -ForegroundColor Green
} else {
    Write-Host "❌ Missing extensions: $($missingExtensions -join ', ')" -ForegroundColor Red
    Write-Host "💡 Extensions should be created by DatabaseBootstrapService" -ForegroundColor Yellow
    exit 1
}

# Check key tables
Write-Host ""
Write-Host "📋 Checking key tables..." -ForegroundColor Yellow
$keyTables = @(
    @{ Schema = "identity"; Table = "Users" },
    @{ Schema = "tenants"; Table = "Tenants" },
    @{ Schema = "catalog"; Table = "Products" },
    @{ Schema = "tasks"; Table = "ProvisionTasks" }
)

$missingTables = @()
foreach ($table in $keyTables) {
    $query = "SELECT 1 FROM information_schema.tables WHERE table_schema = '$($table.Schema)' AND table_name = '$($table.Table)';"
    $result = Invoke-SqlQuery -Query $query
    if (-not $result) {
        $missingTables += "$($table.Schema).$($table.Table)"
    }
}

if ($missingTables.Count -eq 0) {
    Write-Host "✅ All key tables exist" -ForegroundColor Green
} else {
    Write-Host "❌ Missing tables: $($missingTables -join ', ')" -ForegroundColor Red
    Write-Host "💡 Tables should be created by EF Core migrations" -ForegroundColor Yellow
    exit 1
}

# Check ProvisionTasks constraints
Write-Host ""
Write-Host "🔒 Checking constraint fixes..." -ForegroundColor Yellow
$query = @"
SELECT COUNT(*) as constraint_count
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE n.nspname = 'tasks'
  AND t.relname = 'provisiontasks'
  AND c.contype = 'c'
  AND pg_get_constraintdef(c.oid) LIKE '%progress%';
"@

$result = Invoke-SqlQuery -Query $query
$constraintCount = if ($result) { $result.constraint_count } else { 0 }

if ($constraintCount -gt 0) {
    Write-Host "✅ ProvisionTasks constraints fixed" -ForegroundColor Green
} else {
    Write-Host "❌ ProvisionTasks constraints not found" -ForegroundColor Red
    Write-Host "💡 Check that migration FixProvisionTaskConstraints was applied" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 DATABASE VALIDATION PASSED!" -ForegroundColor Green
Write-Host "The database is properly initialized with:" -ForegroundColor White
Write-Host "  • All required schemas" -ForegroundColor White
Write-Host "  • PostgreSQL extensions" -ForegroundColor White
Write-Host "  • EF Core tables" -ForegroundColor White
Write-Host "  • Fixed constraints" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to start the application!" -ForegroundColor Green

exit 0