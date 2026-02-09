-- Update Code field to match instanceCode in TenantCode
UPDATE tenants."TenantInstances"
SET "Code" = SPLIT_PART("TenantCode", '-', 3), "UpdatedAt" = NOW()
WHERE "TenantCode" LIKE '%-%-%' AND "Code" != SPLIT_PART("TenantCode", '-', 3);

-- Show updated records  
SELECT "Id", "TenantCode", "Code", "Name", "Status" FROM tenants."TenantInstances" ORDER BY "CreatedAt" DESC LIMIT 10;
