-- ============================================================================
-- SCRIPT DE CORRECCIÓN: Fix Instance Codes to Match URL Structure
-- ============================================================================
-- 
-- PROBLEMA: 
-- - Las instancias tienen Code="TEST01", "TEST02" (user-defined)
-- - Pero las URLs usan el último segmento del TenantCode como instanceCode
-- - Ejemplo: TenantCode="FARU6128-Shared-8b571b69" → URL usa "8b571b69"
--
-- SOLUCIÓN:
-- - Actualizar Code para que coincida con el último segmento del TenantCode
-- - Esto asegura que la URL resolverá correctamente la instancia
-- ============================================================================

-- Ver estado actual ANTES de la corrección
SELECT 
    "Id",
    "TenantCode",
    "Code" as "Code_Actual",
    SPLIT_PART("TenantCode", '-', 3) as "Code_Correcto",
    "Name",
    "Status",
    "ApiBaseUrl"
FROM tenants."TenantInstances"
ORDER BY "CreatedAt" DESC;

-- CORRECCIÓN: Actualizar Code para que coincida con el instanceCode de la URL
UPDATE tenants."TenantInstances"
SET "Code" = SPLIT_PART("TenantCode", '-', 3)
WHERE "TenantCode" LIKE '%-%-%';

-- Ver estado DESPUÉS de la corrección
SELECT 
    "Id",
    "TenantCode",
    "Code" as "Code_Actualizado",
    "Name",
    "Status",
    "ApiBaseUrl"
FROM tenants."TenantInstances"
ORDER BY "CreatedAt" DESC;

-- Opcional: Actualizar Status a "active" si quieres que estén disponibles inmediatamente
-- UPDATE tenants."TenantInstances" SET "Status" = 'active' WHERE "Status" IN ('provisioning', 'PENDING_PROVISION');
