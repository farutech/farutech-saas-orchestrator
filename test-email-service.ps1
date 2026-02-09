# Script para ejecutar la API y probar el envío de emails
Write-Host "=== Iniciando prueba del servicio de Email ===" -ForegroundColor Cyan

# 1. Cambiar al directorio de la API
$apiPath = "c:\Users\farid\farutech-saas-orchestrator\src\01.Core\Farutech\IAM\API"
Set-Location $apiPath

# 2. Iniciar la API en segundo plano
Write-Host "`n[1/4] Iniciando API IAM..." -ForegroundColor Yellow
$apiProcess = Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory $apiPath -PassThru -WindowStyle Hidden

# 3. Esperar a que la API esté lista (30 segundos máximo)
Write-Host "[2/4] Esperando que la API esté lista..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$apiReady = $false

while (-not $apiReady -and $attempt -lt $maxAttempts) {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "https://localhost:7001/api/auth/register" `
            -Method GET -SkipCertificateCheck -ErrorAction SilentlyContinue -TimeoutSec 1
        $apiReady = $true
    } catch {
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline
    }
}

if (-not $apiReady) {
    Write-Host "`n❌ La API no respondió después de 30 segundos" -ForegroundColor Red
    $apiProcess | Stop-Process -Force
    exit 1
}

Write-Host "`n✅ API está lista!" -ForegroundColor Green

# 4. Registrar un usuario de prueba
Write-Host "`n[3/4] Registrando usuario de prueba..." -ForegroundColor Yellow
$testEmail = "test.user$(Get-Random -Minimum 1000 -Maximum 9999)@example.com"
$body = @{
    email = $testEmail
    password = "Test123!@#"
    firstName = "Test"
    lastName = "User"
    phoneNumber = "+1234567890"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://localhost:7001/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -SkipCertificateCheck
    
    Write-Host "✅ Usuario registrado exitosamente!" -ForegroundColor Green
    Write-Host "   UserID: $($response.userId)" -ForegroundColor Cyan
    Write-Host "   Email: $($response.email)" -ForegroundColor Cyan
    Write-Host "   Message: $($response.message)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error al registrar usuario:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}

# 5. Esperar un poco para ver los logs
Write-Host "`n[4/4] Esperando logs de envío de email (5 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 6. Detener la API
Write-Host "`n=== Deteniendo API ===" -ForegroundColor Cyan
$apiProcess | Stop-Process -Force

Write-Host "`n✅ Prueba completada!" -ForegroundColor Green
Write-Host "Revisa los logs arriba para ver si el email se envió correctamente." -ForegroundColor Yellow
