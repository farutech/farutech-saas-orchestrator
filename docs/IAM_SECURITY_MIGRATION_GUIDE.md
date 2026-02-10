# IAM Security Enhancement - Migration Guide

## Overview
This migration adds critical security features to the Farutech IAM system including:
- Device tracking and management
- Security event auditing
- Tenant-specific security policies
- Enhanced session management

## Prerequisites
- PostgreSQL 12+
- Existing IAM database with Users, Tenants, and Sessions tables
- Database backup completed

## Migration Steps

### 1. Backup Database
```powershell
# Backup current database
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
pg_dump -h localhost -U farutec_admin -d farutec_db -F c -f "backup_iam_$timestamp.dump"
```

### 2. Run Migration Script
```powershell
# Execute migration SQL
psql -h localhost -U farutec_admin -d farutec_db -f scripts/iam-security-enhancement-migration.sql
```

### 3. Verify Migration
```sql
-- Check new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('UserDevices', 'SecurityEvents', 'TenantSecurityPolicies');

-- Check row counts
SELECT 
    (SELECT COUNT(*) FROM "UserDevices") as devices,
    (SELECT COUNT(*) FROM "SecurityEvents") as events,
    (SELECT COUNT(*) FROM "TenantSecurityPolicies") as policies;
```

### 4. Update Application Configuration
Add to `appsettings.json`:
```json
{
  "Security": {
    "PublicId": {
      "SecretKey": "CHANGE-THIS-IN-PRODUCTION-32-BYTES-MINIMUM",
      "Algorithm": "AES-256-GCM",
      "EnableCaching": true
    },
    "Session": {
      "NormalSessionSeconds": 3600,
      "ExtendedSessionSeconds": 86400,
      "MaxDevicesPerUser": 5,
      "AlertOnNewDevice": true
    },
    "RateLimiting": {
      "LoginRequestsPer15Minutes": 5,
      "RegisterRequestsPerHour": 10
    }
  }
}
```

### 5. Update Application Code
The following services need to be registered in DI:
- `IPublicIdService` → `PublicIdService`
- `ISecurityAuditService` → `SecurityAuditService`
- `IDeviceManagementService` → `DeviceManagementService`

## New Tables Schema

### UserDevices
Tracks user devices for security monitoring.
- **Primary Key**: Id (UUID)
- **Foreign Keys**: UserId → Users(Id)
- **Indexes**: UserId, DeviceHash, LastSeen

### SecurityEvents
Audit log for security events.
- **Primary Key**: Id (UUID)
- **Foreign Keys**: UserId → Users(Id), DeviceId → UserDevices(Id), TenantId → Tenants(Id)
- **Indexes**: UserId, TenantId, OccurredAt, EventType

### TenantSecurityPolicies
Tenant-specific security configurations.
- **Primary Key**: Id (UUID)
- **Foreign Keys**: TenantId → Tenants(Id) [UNIQUE]
- **Indexes**: TenantId

## Post-Migration Tasks

### 1. Update Existing Sessions
```sql
-- Backfill LastActivityAt for existing sessions
UPDATE "Sessions" 
SET "LastActivityAt" = "CreatedAt" 
WHERE "LastActivityAt" IS NULL;
```

### 2. Configure Cleanup Job
Schedule periodic cleanup of old security events:
```sql
-- Run daily to clean events older than 90 days
SELECT public.cleanup_old_security_events();
```

### 3. Test Security Features

#### Test Device Tracking
```bash
# Login from different devices/IPs should create device records
curl -X POST https://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  -d '{"email":"test@example.com","password":"password"}'
```

#### Test Rate Limiting
```bash
# Exceed login rate limit (5 attempts in 15 minutes)
for i in {1..10}; do
  curl -X POST https://localhost:7001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

#### Test Security Events
```sql
-- Check security events are being logged
SELECT "EventType", COUNT(*), MAX("OccurredAt")
FROM "SecurityEvents"
GROUP BY "EventType"
ORDER BY COUNT(*) DESC;
```

## Rollback Plan

If issues occur, rollback with:
```powershell
# Restore from backup
pg_restore -h localhost -U farutec_admin -d farutec_db -c backup_iam_TIMESTAMP.dump

# Or drop new tables only
psql -h localhost -U farutec_admin -d farutec_db << 'EOF'
DROP TABLE IF EXISTS "TenantSecurityPolicies" CASCADE;
DROP TABLE IF EXISTS "SecurityEvents" CASCADE;
DROP TABLE IF EXISTS "UserDevices" CASCADE;
DROP FUNCTION IF EXISTS cleanup_old_security_events();
DROP FUNCTION IF EXISTS update_session_activity();
EOF
```

## Performance Considerations

- **Indexes**: All foreign keys and frequently queried columns are indexed
- **Partitioning**: Consider partitioning SecurityEvents by month for large deployments
- **Archival**: Implement archival strategy for SecurityEvents older than 90 days
- **Caching**: PublicId mappings are cached in Redis to reduce database load

## Security Notes

1. **SecretKey**: Must be 32+ bytes and stored securely (Azure Key Vault, AWS Secrets Manager)
2. **Rate Limiting**: Adjust limits based on your traffic patterns
3. **Device Limits**: Default 5 devices per user, configurable per tenant
4. **Session Types**: Normal (1h), Extended (24h), Admin (8h)

## Monitoring

Add monitoring for:
- Failed login attempts per IP
- New device registrations
- High-risk security events
- Rate limit rejections

## Support

For issues or questions:
- Check logs: `SELECT * FROM "SecurityEvents" WHERE "Success" = false ORDER BY "OccurredAt" DESC LIMIT 50;`
- Review device tracking: `SELECT * FROM "UserDevices" WHERE "IsBlocked" = true;`
- Contact: security@farutech.com
