# PowerShell script para iniciar la infraestructura de desarrollo

Write-Host "🚀 Iniciando Farutech Orchestrator Infrastructure..." -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
    exit 1
}

# Levantar servicios
Write-Host "📦 Iniciando contenedores..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar estado
Write-Host ""
Write-Host "✅ Estado de servicios:" -ForegroundColor Green
docker-compose ps

Write-Host ""
Write-Host "📊 Información de conexión:" -ForegroundColor Cyan
Write-Host "  PostgreSQL: localhost:5432"
Write-Host "    - Usuario: farutech_admin"
Write-Host "    - Password: Dev@2026!Secure"
Write-Host "    - Database: farutech_orchestrator"
Write-Host ""
Write-Host "  NATS: nats://localhost:4222"
Write-Host "    - Monitoring: http://localhost:8222"
Write-Host ""
Write-Host "  pgAdmin: http://localhost:5050"
Write-Host "    - Email: admin@farutech.local"
Write-Host "    - Password: Admin@2026"
Write-Host ""
Write-Host "✅ Infraestructura lista!" -ForegroundColor Green
