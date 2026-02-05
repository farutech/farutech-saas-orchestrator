# Database Migration Test Script for Farutech Orchestrator
# Tests that EF Core migrations work correctly with the new bootstrap service

param(
    [string]$ConnectionString = "Host=localhost;Port=5432;Database=farutec_db;Username=farutec_admin;Password=SuperSecurePassword123",
    [switch]$ResetDatabase,
    [switch]$Verbose
)

Write-Host "🧪 FARUTECH ORCHESTRATOR - DATABASE MIGRATION TEST" -ForegroundColor Blue
Write-Host "Connection: $ConnectionString" -ForegroundColor White
Write-Host ""

# Function to execute SQL query and return results
function Invoke-SqlQuery {
    param([string]$Query, [string]$ConnectionString)

    try {
        $result = Invoke-Sqlcmd -ConnectionString $ConnectionString -Query $Query -ErrorAction Stop
        return $result
    } catch {
        if ($Verbose) {
            Write-Host "❌ SQL Error: $($_.Exception.Message)" -ForegroundColor Red
        }
        return $null
    }
}

# Function to check if table exists
function Test-TableExists {
    param([string]$TableName, [string]$Schema = "public")

    $query = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = '$Schema' AND table_name = '$TableName');"
    $result = Invoke-SqlQuery -Query $query -ConnectionString $ConnectionString

    if ($result -and $result.Column1 -eq $true) {
        return $true
    }
    return $false
}

# Function to check if schema exists
function Test-SchemaExists {
    param([string]$SchemaName)

    $query = "SELECT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = '$SchemaName');"
    $result = Invoke-SqlQuery -Query $query -ConnectionString $ConnectionString

    if ($result -and $result.Column1 -eq $true) {
        return $true
    }
    return $false
}

# Function to check if extension is installed
function Test-ExtensionExists {
    param([string]$ExtensionName)

    $query = "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = '$ExtensionName');"
    $result = Invoke-SqlQuery -Query $query -ConnectionString $ConnectionString

    if ($result -and $result.Column1 -eq $true) {
        return $true
    }
    return $false
}

# Reset database if requested
if ($ResetDatabase) {
    Write-Host "🔄 Resetting database..." -ForegroundColor Yellow
    & "$PSScriptRoot\reset-database.ps1" -ConnectionString $ConnectionString -Force
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Database reset failed" -ForegroundColor Red
        exit 1
    }
}

# Test database connectivity
Write-Host "🔍 Testing database connectivity..." -ForegroundColor Yellow
$query = "SELECT version();"
$result = Invoke-SqlQuery -Query $query -ConnectionString $ConnectionString

if (-not $result) {
    Write-Host "❌ Cannot connect to database" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Database connection successful" -ForegroundColor Green
if ($Verbose) {
    Write-Host "PostgreSQL Version: $($result.Column1)" -ForegroundColor White
}

# Test schemas
Write-Host ""
Write-Host "🔍 Testing schemas..." -ForegroundColor Yellow
$expectedSchemas = @("identity", "tenants", "catalog", "tasks", "core")
$schemaResults = @{}

foreach ($schema in $expectedSchemas) {
    $exists = Test-SchemaExists -SchemaName $schema
    $schemaResults[$schema] = $exists

    if ($exists) {
        Write-Host "✅ Schema '$schema' exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Schema '$schema' missing" -ForegroundColor Red
    }
}

# Test extensions
Write-Host ""
Write-Host "🔍 Testing extensions..." -ForegroundColor Yellow
$expectedExtensions = @("uuid-ossp", "btree_gin")
$extensionResults = @{}

foreach ($extension in $expectedExtensions) {
    $exists = Test-ExtensionExists -ExtensionName $extension
    $extensionResults[$extension] = $exists

    if ($exists) {
        Write-Host "✅ Extension '$extension' installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Extension '$extension' missing" -ForegroundColor Red
    }
}

# Test key tables
Write-Host ""
Write-Host "🔍 Testing key tables..." -ForegroundColor Yellow
$testTables = @(
    @{ Name = "Users"; Schema = "identity" },
    @{ Name = "Tenants"; Schema = "tenants" },
    @{ Name = "Products"; Schema = "catalog" },
    @{ Name = "ProvisionTasks"; Schema = "tasks" },
    @{ Name = "AuditLogs"; Schema = "core" }
)

$tableResults = @{}
foreach ($table in $testTables) {
    $exists = Test-TableExists -TableName $table.Name -Schema $table.Schema
    $tableResults["$($table.Schema).$($table.Name)"] = $exists

    if ($exists) {
        Write-Host "✅ Table '$($table.Schema).$($table.Name)' exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Table '$($table.Schema).$($table.Name)' missing" -ForegroundColor Red
    }
}

# Test specific constraint fix
Write-Host ""
Write-Host "🔍 Testing constraint fixes..." -ForegroundColor Yellow

# Check ProvisionTasks table constraints
$query = @"
SELECT conname, pg_get_constraintdef(c.oid) as constraint_def
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE n.nspname = 'tasks'
  AND t.relname = 'provisiontasks'
  AND c.contype = 'c';
"@

$constraints = Invoke-SqlQuery -Query $query -ConnectionString $ConnectionString

$constraintIssues = @()
if ($constraints) {
    foreach ($constraint in $constraints) {
        $constraintDef = $constraint.constraint_def

        # Check for lowercase column references in CHECK constraints
        if ($constraintDef -match "CHECK.*\b(progress|status|task_type)\b.*=") {
            $constraintIssues += "Constraint '$($constraint.conname)' has lowercase column reference: $constraintDef"
        }
    }
}

if ($constraintIssues.Count -eq 0) {
    Write-Host "✅ No constraint case sensitivity issues found" -ForegroundColor Green
} else {
    foreach ($issue in $constraintIssues) {
        Write-Host "❌ $issue" -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "📊 TEST SUMMARY" -ForegroundColor Blue
Write-Host "===============" -ForegroundColor Blue

$allSchemasExist = ($schemaResults.Values | Where-Object { $_ -eq $false }).Count -eq 0
$allExtensionsExist = ($extensionResults.Values | Where-Object { $_ -eq $false }).Count -eq 0
$allTablesExist = ($tableResults.Values | Where-Object { $_ -eq $false }).Count -eq 0
$noConstraintIssues = $constraintIssues.Count -eq 0

Write-Host "Schemas: $(if ($allSchemasExist) { '✅' } else { '❌' }) ($($schemaResults.Values | Where-Object { $_ }).Count / $expectedSchemas.Count))"
Write-Host "Extensions: $(if ($allExtensionsExist) { '✅' } else { '❌' }) ($($extensionResults.Values | Where-Object { $_ }).Count / $expectedExtensions.Count))"
Write-Host "Tables: $(if ($allTablesExist) { '✅' } else { '❌' }) ($($tableResults.Values | Where-Object { $_ }).Count / $testTables.Count))"
Write-Host "Constraints: $(if ($noConstraintIssues) { '✅' } else { '❌' }) ($($constraintIssues.Count) issues)"

$overallSuccess = $allSchemasExist -and $allExtensionsExist -and $allTablesExist -and $noConstraintIssues

Write-Host ""
if ($overallSuccess) {
    Write-Host "🎉 ALL TESTS PASSED! Database initialization is working correctly." -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ SOME TESTS FAILED! Check the output above for details." -ForegroundColor Red
    exit 1
}