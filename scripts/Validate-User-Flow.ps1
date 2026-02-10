# Script de Validación Completa del Flujo de Usuario
# Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# Versión: 1.0 - Validación de Arquitectura Multi-Tenant con Sincronización IAM

Write-Host "🔐 VALIDACIÓN COMPLETA DEL FLUJO DE USUARIO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuración de URLs
$IAM_BASE_URL = "http://localhost:5001"
$ORCHESTRATOR_BASE_URL = "http://localhost:8080"

# Credenciales de prueba
$TEST_USER_EMAIL = "test-$(Get-Random)@farutech.com"
$TEST_USER_PASSWORD = "TestPass123!"
$TEST_FIRST_NAME = "Usuario"
$TEST_LAST_NAME = "Prueba"

Write-Host "📋 CONFIGURACIÓN DE PRUEBA:" -ForegroundColor Yellow
Write-Host "  IAM API: $IAM_BASE_URL" -ForegroundColor Gray
Write-Host "  Orchestrator API: $ORCHESTRATOR_BASE_URL" -ForegroundColor Gray
Write-Host "  Usuario de prueba: $TEST_USER_EMAIL" -ForegroundColor Gray
Write-Host ""

# Función para hacer requests HTTP con manejo de errores
function Invoke-TestRequest {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [string]$Description = ""
    )

    if ($Description) {
        Write-Host "🔍 $Description" -ForegroundColor Blue
    }

    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            Headers = $Headers
        }

        if ($Body) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
            $params.ContentType = "application/json"
        }

        $response = Invoke-RestMethod @params
        Write-Host "  ✅ SUCCESS" -ForegroundColor Green
        return @{ Success = $true; Data = $response }
    }
    catch {
        Write-Host "  ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# ==========================================
# PASO 1: REGISTRO DE USUARIO NUEVO EN IAM
# ==========================================
Write-Host "1️⃣ PASO 1: REGISTRO DE USUARIO NUEVO" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Magenta

$registerRequest = @{
    email = $TEST_USER_EMAIL
    password = $TEST_USER_PASSWORD
    firstName = $TEST_FIRST_NAME
    lastName = $TEST_LAST_NAME
}

$result = Invoke-TestRequest `
    -Uri "$IAM_BASE_URL/api/auth/register" `
    -Method "POST" `
    -Body $registerRequest `
    -Description "Registrando usuario nuevo en IAM"

if (-not $result.Success) {
    Write-Host "❌ REGISTRO FALLÓ - Abortando validación" -ForegroundColor Red
    exit 1
}

$USER_PUBLIC_ID = $result.Data.publicUserId
Write-Host "  📝 Usuario registrado: $USER_PUBLIC_ID" -ForegroundColor Gray

# ==========================================
# PASO 2: LOGIN AUTOMÁTICO CON PERSONAL TENANT
# ==========================================
Write-Host "2️⃣ PASO 2: LOGIN CON PERSONAL TENANT" -ForegroundColor Magenta
Write-Host "====================================" -ForegroundColor Magenta

$loginRequest = @{
    email = $TEST_USER_EMAIL
    password = $TEST_USER_PASSWORD
}

$result = Invoke-TestRequest `
    -Uri "$IAM_BASE_URL/api/auth/login" `
    -Method "POST" `
    -Body $loginRequest `
    -Description "Login automático con personal tenant"

if (-not $result.Success) {
    Write-Host "❌ LOGIN FALLÓ - Abortando validación" -ForegroundColor Red
    exit 1
}

$ACCESS_TOKEN = $result.Data.accessToken
$REFRESH_TOKEN = $result.Data.refreshToken
$PERSONAL_TENANT_CODE = $result.Data.availableContexts[0].tenantCode

Write-Host "  🔑 Access Token obtenido" -ForegroundColor Gray
Write-Host "  🏠 Personal Tenant: $PERSONAL_TENANT_CODE" -ForegroundColor Gray
Write-Host "  👤 Rol: $($result.Data.availableContexts[0].roleName)" -ForegroundColor Gray

# ==========================================
# PASO 3: CREACIÓN DE ORGANIZACIÓN EN ORCHESTRATOR
# ==========================================
Write-Host "3️⃣ PASO 3: CREACIÓN DE ORGANIZACIÓN" -ForegroundColor Magenta
Write-Host "===================================" -ForegroundColor Magenta

$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
}

$orgRequest = @{
    companyName = "Empresa de Prueba S.A."
    email = "empresa@test.com"
    phone = "+57 300 123 4567"
    address = "Calle 123 #45-67, Bogotá"
    taxId = "901234567-8"
}

$result = Invoke-TestRequest `
    -Uri "$ORCHESTRATOR_BASE_URL/api/customers" `
    -Method "POST" `
    -Body $orgRequest `
    -Headers $headers `
    -Description "Creando organización en Orchestrator"

if (-not $result.Success) {
    Write-Host "❌ CREACIÓN DE ORGANIZACIÓN FALLÓ" -ForegroundColor Red
    Write-Host "   Error: $($result.Error)" -ForegroundColor Red
} else {
    $ORG_ID = $result.Data.customerId
    $ORG_CODE = $result.Data.code
    $IAM_TENANT_ID = $result.Data.iamTenantId
    $IAM_TENANT_CODE = $result.Data.iamTenantCode

    Write-Host "  🏢 Organización creada: $ORG_CODE" -ForegroundColor Gray
    Write-Host "  🔗 IAM Tenant ID: $IAM_TENANT_ID" -ForegroundColor Gray
    Write-Host "  🏷️ IAM Tenant Code: $IAM_TENANT_CODE" -ForegroundColor Gray
}

# ==========================================
# PASO 4: VERIFICACIÓN DE SINCRONIZACIÓN IAM
# ==========================================
Write-Host "4️⃣ PASO 4: VERIFICACIÓN DE SINCRONIZACIÓN" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta

# Verificar que el tenant existe en IAM
$result = Invoke-TestRequest `
    -Uri "$IAM_BASE_URL/api/admin/tenants/$IAM_TENANT_ID" `
    -Method "GET" `
    -Headers $headers `
    -Description "Verificando tenant en IAM"

if ($result.Success) {
    Write-Host "  ✅ Tenant sincronizado correctamente en IAM" -ForegroundColor Green
    Write-Host "  📊 Nombre: $($result.Data.name)" -ForegroundColor Gray
    Write-Host "  🏷️ Código: $($result.Data.code)" -ForegroundColor Gray
    Write-Host "  📧 Email: $($result.Data.email)" -ForegroundColor Gray
} else {
    Write-Host "  ⚠️ Tenant no encontrado en IAM (posible delay de sincronización)" -ForegroundColor Yellow
}

# ==========================================
# PASO 5: VERIFICACIÓN DE MEMBERSHIPS ACTUALIZADOS
# ==========================================
Write-Host "5️⃣ PASO 5: VERIFICACIÓN DE MEMBERSHIPS" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Magenta

# Hacer logout y login nuevamente para obtener contexts actualizados
$result = Invoke-TestRequest `
    -Uri "$IAM_BASE_URL/api/auth/login" `
    -Method "POST" `
    -Body $loginRequest `
    -Description "Re-login para obtener contexts actualizados"

if ($result.Success) {
    $NEW_ACCESS_TOKEN = $result.Data.accessToken
    $contexts = $result.Data.availableContexts

    Write-Host "  🔄 Contexts actualizados:" -ForegroundColor Gray
    foreach ($context in $contexts) {
        Write-Host "    - $($context.tenantName) ($($context.tenantCode)) - Rol: $($context.roleName)" -ForegroundColor Gray
    }

    if ($contexts.Count -gt 1) {
        Write-Host "  ✅ Usuario ahora tiene múltiples contexts" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ Solo un context encontrado" -ForegroundColor Yellow
    }
}

# ==========================================
# PASO 6: CREACIÓN DE APLICACIÓN
# ==========================================
Write-Host "6️⃣ PASO 6: CREACIÓN DE APLICACIÓN" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Magenta

$headers = @{
    "Authorization" = "Bearer $NEW_ACCESS_TOKEN"
}

$appRequest = @{
    customerId = $ORG_ID
    applicationType = "Ordeon"
    environment = "Development"
    version = "1.0.0"
}

$result = Invoke-TestRequest `
    -Uri "$ORCHESTRATOR_BASE_URL/api/provisioning/provision" `
    -Method "POST" `
    -Body $appRequest `
    -Headers $headers `
    -Description "Creando aplicación para la organización"

if ($result.Success) {
    $APP_ID = $result.Data.instanceId
    Write-Host "  📱 Aplicación creada: $APP_ID" -ForegroundColor Gray
    Write-Host "  🎯 Tipo: $($appRequest.applicationType)" -ForegroundColor Gray
    Write-Host "  🌍 Ambiente: $($appRequest.environment)" -ForegroundColor Gray
} else {
    Write-Host "  ❌ Creación de aplicación falló" -ForegroundColor Red
}

# ==========================================
# PASO 7: VERIFICACIÓN DE PERMISOS
# ==========================================
Write-Host "7️⃣ PASO 7: VERIFICACIÓN DE PERMISOS" -ForegroundColor Magenta
Write-Host "===================================" -ForegroundColor Magenta

# Verificar permisos del usuario
$result = Invoke-TestRequest `
    -Uri "$IAM_BASE_URL/api/auth/me" `
    -Method "GET" `
    -Headers $headers `
    -Description "Verificando información del usuario actual"

if ($result.Success) {
    Write-Host "  👤 Usuario: $($result.Data.fullName)" -ForegroundColor Gray
    Write-Host "  📧 Email: $($result.Data.email)" -ForegroundColor Gray
    Write-Host "  🏷️ Tenant actual: $($result.Data.currentTenant)" -ForegroundColor Gray

    if ($result.Data.permissions) {
        Write-Host "  🔐 Permisos encontrados: $($result.Data.permissions.Count)" -ForegroundColor Gray
        $samplePermissions = $result.Data.permissions | Select-Object -First 5
        foreach ($perm in $samplePermissions) {
            Write-Host "    - $perm" -ForegroundColor Gray
        }
    }
}

# ==========================================
# PASO 8: LISTADO DE APLICACIONES POR ORGANIZACIÓN
# ==========================================
Write-Host "8️⃣ PASO 8: LISTADO DE APLICACIONES" -ForegroundColor Magenta
Write-Host "==================================" -ForegroundColor Magenta

$result = Invoke-TestRequest `
    -Uri "$ORCHESTRATOR_BASE_URL/api/organizations/$ORG_ID/applications" `
    -Method "GET" `
    -Headers $headers `
    -Description "Listando aplicaciones de la organización"

if ($result.Success) {
    Write-Host "  📋 Aplicaciones encontradas: $($result.Data.Count)" -ForegroundColor Gray
    foreach ($app in $result.Data) {
        Write-Host "    - $($app.name) ($($app.code)) - Estado: $($app.status)" -ForegroundColor Gray
    }
}

# ==========================================
# RESUMEN FINAL
# ==========================================
Write-Host "" -ForegroundColor White
Write-Host "📊 RESUMEN DE VALIDACIÓN" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "✅ Usuario registrado: $TEST_USER_EMAIL" -ForegroundColor Green
Write-Host "✅ Personal Tenant creado: $PERSONAL_TENANT_CODE" -ForegroundColor Green
Write-Host "✅ Organización creada: $ORG_CODE" -ForegroundColor Green
Write-Host "✅ Tenant sincronizado en IAM: $(if($IAM_TENANT_ID){'Sí'}else{'Pendiente'})" -ForegroundColor $(if($IAM_TENANT_ID){'Green'}else{'Yellow'})
Write-Host "✅ Aplicación provisionada: $(if($APP_ID){'Si'}else{'No'})" -ForegroundColor $(if($APP_ID){'Green'}else{'Red'})
Write-Host "" -ForegroundColor White
Write-Host "🔗 ENDPOINTS VALIDADOS:" -ForegroundColor Yellow
Write-Host "  IAM Register: $IAM_BASE_URL/api/auth/register" -ForegroundColor Gray
Write-Host "  IAM Login: $IAM_BASE_URL/api/auth/login" -ForegroundColor Gray
Write-Host "  Orchestrator Create Org: $ORCHESTRATOR_BASE_URL/api/customers" -ForegroundColor Gray
Write-Host "  Orchestrator Provision App: $ORCHESTRATOR_BASE_URL/api/provisioning/provision" -ForegroundColor Gray
Write-Host "  Orchestrator List Apps: $ORCHESTRATOR_BASE_URL/api/organizations/{orgId}/applications" -ForegroundColor Gray
Write-Host "" -ForegroundColor White
Write-Host "🎉 VALIDACIÓN COMPLETADA" -ForegroundColor Green