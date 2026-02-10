-- Eliminar usuario webmaster y sus datos relacionados
DELETE FROM iam.tenant_memberships WHERE "UserId" IN (SELECT "Id" FROM iam.users WHERE "Email" = 'webmaster@farutech.com');
DELETE FROM iam.user_devices WHERE "UserId" IN (SELECT "Id" FROM iam.users WHERE "Email" = 'webmaster@farutech.com');
DELETE FROM iam.sessions WHERE "UserId" IN (SELECT "Id" FROM iam.users WHERE "Email" = 'webmaster@farutech.com');
DELETE FROM iam.security_events WHERE "UserId" IN (SELECT "Id" FROM iam.users WHERE "Email" = 'webmaster@farutech.com');
DELETE FROM iam.refresh_tokens WHERE "UserId" IN (SELECT "Id" FROM iam.users WHERE "Email" = 'webmaster@farutech.com');
DELETE FROM iam.users WHERE "Email" = 'webmaster@farutech.com';
