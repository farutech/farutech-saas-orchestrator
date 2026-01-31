// ============================================================================
// USE PERMISSIONS HOOK - Custom hook for user permissions management
// ============================================================================

import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import type { PermissionDto } from '@/types/api';

export const usePermissions = ()
        => {
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async ()
        => {
    try {
      setLoading(true);
      setError(null);
      const userPermissions = await authService.getMyPermissions();
      setPermissions(userPermissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
      console.error('Error fetching permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permissionCode: string): boolean => {
    return permissions.some(permission => permission.code === permissionCode);
  };

  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    return permissionCodes.some(code => hasPermission(code));
  };

  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    return permissionCodes.every(code => hasPermission(code));
  };

  useEffect(()
        => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refetch: fetchPermissions,
  };
};