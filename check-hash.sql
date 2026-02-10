SELECT "Email", substring("PasswordHash", 1, 30) as hash_preview 
FROM iam.users 
WHERE "Email" = 'admin@farutech.com';
