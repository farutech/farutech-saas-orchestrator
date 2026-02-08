# Database Reset Script for Farutech Orchestrator
# This script completely resets the database for testing purposes

param(
    [string]$ConnectionString = "Host=localhost;Port=5432;Database=farutec_db;Username=farutec_admin;Password=SuperSecurePassword123",
    [switch]$Force
)

Write-Host "🗑️  FARUTECH ORCHESTRATOR - DATABASE RESET" -ForegroundColor Red
Write-Host "Connection: $ConnectionString" -ForegroundColor White
Write-Host ""

if (-not $Force) {
    $confirmation = Read-Host "⚠️  This will DROP and RECREATE the database. Are you sure? (type 'YES' to confirm)"
    if ($confirmation -ne "YES") {
        Write-Host "❌ Operation cancelled" -ForegroundColor Yellow
        exit 1
    }
}

try {
    # Extract database name from connection string
    $dbName = ($ConnectionString -split ';Database=')[1] -split ';')[0]
    $adminConnectionString = $ConnectionString -replace "Database=$dbName", "Database=postgres"

    Write-Host "🔄 Connecting to PostgreSQL..." -ForegroundColor Yellow

    # Terminate active connections to the database
    $terminateQuery = @"
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = '$dbName' AND pid <> pg_backend_pid();
"@

    # Drop and recreate database
    $dropQuery = "DROP DATABASE IF EXISTS `"$dbName`";"
    $createQuery = "CREATE DATABASE `"$dbName`";"

    # Execute commands
    Write-Host "🔄 Terminating active connections..." -ForegroundColor Yellow
    $null = Invoke-Sqlcmd -ConnectionString $adminConnectionString -Query $terminateQuery -ErrorAction Stop

    Write-Host "🗑️  Dropping database '$dbName'..." -ForegroundColor Red
    $null = Invoke-Sqlcmd -ConnectionString $adminConnectionString -Query $dropQuery -ErrorAction Stop

    Write-Host "🏗️  Creating database '$dbName'..." -ForegroundColor Green
    $null = Invoke-Sqlcmd -ConnectionString $adminConnectionString -Query $createQuery -ErrorAction Stop

    Write-Host ""
    Write-Host "✅ Database '$dbName' reset successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start the application to run migrations automatically" -ForegroundColor White
    Write-Host "2. Or run: dotnet ef database update" -ForegroundColor White

} catch {
    Write-Host "❌ Error resetting database: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}