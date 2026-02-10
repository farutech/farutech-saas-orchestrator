SELECT 
    u."Email",
    t."Code" as "TenantCode",
    t."Name" as "TenantName",
    r."Name" as "RoleName",
    tm."IsActive"
FROM iam.users u
JOIN iam.tenant_memberships tm ON u."Id" = tm."UserId"
JOIN iam.tenants t ON tm."TenantId" = t."Id"
JOIN iam.roles r ON tm."RoleId" = r."Id"
WHERE u."Email" = 'webmaster@farutech.com';
