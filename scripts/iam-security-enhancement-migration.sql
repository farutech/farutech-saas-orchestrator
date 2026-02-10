-- =====================================================
-- IAM Security Enhancement Migration Script
-- Version: 1.0
-- Date: 2026-02-09
-- Description: Adds security tables for device management,
--              security events, and tenant security policies
-- =====================================================

-- Table: UserDevices
-- Purpose: Track devices used by users for security monitoring
CREATE TABLE IF NOT EXISTS public."UserDevices" (
    "Id" UUID PRIMARY KEY,
    "UserId" UUID NOT NULL,
    "DeviceHash" VARCHAR(128) NOT NULL,
    "DeviceName" VARCHAR(100) NOT NULL,
    "DeviceType" VARCHAR(20) NOT NULL,
    "OperatingSystem" VARCHAR(50) NOT NULL,
    "Browser" VARCHAR(50) NOT NULL,
    "LastIpAddress" VARCHAR(45) NOT NULL,
    "GeoLocation" TEXT,
    "FirstSeen" TIMESTAMP NOT NULL,
    "LastSeen" TIMESTAMP NOT NULL,
    "IsTrusted" BOOLEAN DEFAULT false,
    "IsBlocked" BOOLEAN DEFAULT false,
    "BlockReason" TEXT,
    "TrustScore" INTEGER DEFAULT 0,
    "Metadata" TEXT,
    
    CONSTRAINT "FK_UserDevices_Users" FOREIGN KEY ("UserId") 
        REFERENCES public."Users"("Id") ON DELETE CASCADE
);

-- Indexes for UserDevices
CREATE INDEX IF NOT EXISTS "IX_UserDevices_UserId" ON public."UserDevices"("UserId");
CREATE INDEX IF NOT EXISTS "IX_UserDevices_DeviceHash" ON public."UserDevices"("DeviceHash");
CREATE INDEX IF NOT EXISTS "IX_UserDevices_LastSeen" ON public."UserDevices"("LastSeen");
CREATE UNIQUE INDEX IF NOT EXISTS "IX_UserDevices_UserId_DeviceHash" 
    ON public."UserDevices"("UserId", "DeviceHash");

-- Table: SecurityEvents
-- Purpose: Audit log for security-related events
CREATE TABLE IF NOT EXISTS public."SecurityEvents" (
    "Id" UUID PRIMARY KEY,
    "UserId" UUID,
    "AnonymizedUserId" VARCHAR(64),
    "EventType" VARCHAR(50) NOT NULL,
    "IpAddress" VARCHAR(45) NOT NULL,
    "UserAgent" TEXT,
    "DeviceId" UUID,
    "OccurredAt" TIMESTAMP NOT NULL,
    "Success" BOOLEAN NOT NULL,
    "Details" TEXT,
    "GeoLocation" TEXT,
    "RiskScore" INTEGER DEFAULT 0,
    "AlertTriggered" BOOLEAN DEFAULT false,
    "TenantId" UUID,
    
    CONSTRAINT "FK_SecurityEvents_Users" FOREIGN KEY ("UserId") 
        REFERENCES public."Users"("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_SecurityEvents_UserDevices" FOREIGN KEY ("DeviceId") 
        REFERENCES public."UserDevices"("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_SecurityEvents_Tenants" FOREIGN KEY ("TenantId") 
        REFERENCES public."Tenants"("Id") ON DELETE SET NULL
);

-- Indexes for SecurityEvents
CREATE INDEX IF NOT EXISTS "IX_SecurityEvents_UserId" ON public."SecurityEvents"("UserId");
CREATE INDEX IF NOT EXISTS "IX_SecurityEvents_TenantId" ON public."SecurityEvents"("TenantId");
CREATE INDEX IF NOT EXISTS "IX_SecurityEvents_OccurredAt" ON public."SecurityEvents"("OccurredAt" DESC);
CREATE INDEX IF NOT EXISTS "IX_SecurityEvents_EventType" ON public."SecurityEvents"("EventType");
CREATE INDEX IF NOT EXISTS "IX_SecurityEvents_IpAddress" ON public."SecurityEvents"("IpAddress");
CREATE INDEX IF NOT EXISTS "IX_SecurityEvents_Success" ON public."SecurityEvents"("Success");

-- Table: TenantSecurityPolicies
-- Purpose: Tenant-specific security configuration
CREATE TABLE IF NOT EXISTS public."TenantSecurityPolicies" (
    "Id" UUID PRIMARY KEY,
    "TenantId" UUID NOT NULL UNIQUE,
    "MaxConcurrentSessions" INTEGER DEFAULT 3,
    "MaxDevicesPerUser" INTEGER DEFAULT 5,
    "ForceLogoutOnPasswordChange" BOOLEAN DEFAULT true,
    "NotifyOnNewDevice" BOOLEAN DEFAULT true,
    "RequireReauthenticationForSensitiveOperations" BOOLEAN DEFAULT true,
    "SessionInactivityTimeoutSeconds" INTEGER DEFAULT 1800,
    "AllowedCountries" TEXT DEFAULT '[]',
    "BlockedIpRanges" TEXT DEFAULT '[]',
    "Require2FA" BOOLEAN DEFAULT false,
    "MinPasswordLength" INTEGER DEFAULT 8,
    "RequirePasswordComplexity" BOOLEAN DEFAULT true,
    "PasswordExpirationDays" INTEGER DEFAULT 0,
    "PasswordHistoryCount" INTEGER DEFAULT 5,
    "MaxFailedLoginAttempts" INTEGER DEFAULT 5,
    "AccountLockoutDurationMinutes" INTEGER DEFAULT 30,
    "CreatedAt" TIMESTAMP NOT NULL,
    "UpdatedAt" TIMESTAMP NOT NULL,
    
    CONSTRAINT "FK_TenantSecurityPolicies_Tenants" FOREIGN KEY ("TenantId") 
        REFERENCES public."Tenants"("Id") ON DELETE CASCADE
);

-- Index for TenantSecurityPolicies
CREATE INDEX IF NOT EXISTS "IX_TenantSecurityPolicies_TenantId" 
    ON public."TenantSecurityPolicies"("TenantId");

-- Add new columns to existing Sessions table (if not exists)
DO $$
BEGIN
    -- Add SessionType column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'Sessions' 
        AND column_name = 'SessionType'
    ) THEN
        ALTER TABLE public."Sessions" ADD COLUMN "SessionType" VARCHAR(20) DEFAULT 'Normal';
    END IF;

    -- Add DeviceId column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'Sessions' 
        AND column_name = 'DeviceId'
    ) THEN
        ALTER TABLE public."Sessions" ADD COLUMN "DeviceId" UUID;
        ALTER TABLE public."Sessions" ADD CONSTRAINT "FK_Sessions_UserDevices" 
            FOREIGN KEY ("DeviceId") REFERENCES public."UserDevices"("Id") ON DELETE SET NULL;
    END IF;

    -- Add LastActivityAt column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'Sessions' 
        AND column_name = 'LastActivityAt'
    ) THEN
        ALTER TABLE public."Sessions" ADD COLUMN "LastActivityAt" TIMESTAMP;
        UPDATE public."Sessions" SET "LastActivityAt" = "CreatedAt" WHERE "LastActivityAt" IS NULL;
    END IF;
END $$;

-- Create default security policies for existing tenants
INSERT INTO public."TenantSecurityPolicies" (
    "Id",
    "TenantId",
    "MaxConcurrentSessions",
    "MaxDevicesPerUser",
    "ForceLogoutOnPasswordChange",
    "NotifyOnNewDevice",
    "RequireReauthenticationForSensitiveOperations",
    "SessionInactivityTimeoutSeconds",
    "AllowedCountries",
    "BlockedIpRanges",
    "Require2FA",
    "MinPasswordLength",
    "RequirePasswordComplexity",
    "PasswordExpirationDays",
    "PasswordHistoryCount",
    "MaxFailedLoginAttempts",
    "AccountLockoutDurationMinutes",
    "CreatedAt",
    "UpdatedAt"
)
SELECT 
    gen_random_uuid(),
    t."Id",
    3, -- MaxConcurrentSessions
    5, -- MaxDevicesPerUser
    true, -- ForceLogoutOnPasswordChange
    true, -- NotifyOnNewDevice
    true, -- RequireReauthenticationForSensitiveOperations
    1800, -- SessionInactivityTimeoutSeconds (30 minutes)
    '[]', -- AllowedCountries
    '[]', -- BlockedIpRanges
    false, -- Require2FA
    8, -- MinPasswordLength
    true, -- RequirePasswordComplexity
    0, -- PasswordExpirationDays (0 = never)
    5, -- PasswordHistoryCount
    5, -- MaxFailedLoginAttempts
    30, -- AccountLockoutDurationMinutes
    NOW(),
    NOW()
FROM public."Tenants" t
WHERE NOT EXISTS (
    SELECT 1 FROM public."TenantSecurityPolicies" tsp
    WHERE tsp."TenantId" = t."Id"
);

-- Grant permissions (adjust as needed for your setup)
GRANT SELECT, INSERT, UPDATE, DELETE ON public."UserDevices" TO farutec_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."SecurityEvents" TO farutec_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."TenantSecurityPolicies" TO farutec_admin;

-- Add comments for documentation
COMMENT ON TABLE public."UserDevices" IS 'Tracks devices used by users for security monitoring and anomaly detection';
COMMENT ON TABLE public."SecurityEvents" IS 'Audit log for all security-related events in the system';
COMMENT ON TABLE public."TenantSecurityPolicies" IS 'Tenant-specific security policies and configurations';

COMMENT ON COLUMN public."UserDevices"."DeviceHash" IS 'SHA256 hash of IP + UserAgent for device identification';
COMMENT ON COLUMN public."UserDevices"."TrustScore" IS 'Trust score from 0-100, increases with usage over time';
COMMENT ON COLUMN public."SecurityEvents"."AnonymizedUserId" IS 'Hashed user ID for privacy-compliant logging';
COMMENT ON COLUMN public."SecurityEvents"."RiskScore" IS 'Calculated risk score from 0-100 for this event';

-- Create function to clean old security events (retention policy)
CREATE OR REPLACE FUNCTION public.cleanup_old_security_events()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Keep security events for 90 days
    DELETE FROM public."SecurityEvents"
    WHERE "OccurredAt" < NOW() - INTERVAL '90 days';
END;
$$;

-- Create function to automatically update LastActivityAt on sessions
CREATE OR REPLACE FUNCTION public.update_session_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW."LastActivityAt" = NOW();
    RETURN NEW;
END;
$$;

-- Create trigger for session activity updates (if Sessions table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'Sessions'
    ) THEN
        DROP TRIGGER IF EXISTS trigger_update_session_activity ON public."Sessions";
        CREATE TRIGGER trigger_update_session_activity
            BEFORE UPDATE ON public."Sessions"
            FOR EACH ROW
            EXECUTE FUNCTION public.update_session_activity();
    END IF;
END $$;

-- Verification queries (for logging/debugging)
DO $$
DECLARE
    device_count INTEGER;
    event_count INTEGER;
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO device_count FROM public."UserDevices";
    SELECT COUNT(*) INTO event_count FROM public."SecurityEvents";
    SELECT COUNT(*) INTO policy_count FROM public."TenantSecurityPolicies";
    
    RAISE NOTICE 'Migration completed successfully:';
    RAISE NOTICE '  - UserDevices: % rows', device_count;
    RAISE NOTICE '  - SecurityEvents: % rows', event_count;
    RAISE NOTICE '  - TenantSecurityPolicies: % rows', policy_count;
END $$;
