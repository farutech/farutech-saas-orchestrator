// ============================================================================
// REDIRECT TO ORGANIZATION APPS - Handle old app detail route redirect
// ============================================================================

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * @deprecated Component to handle redirect from old route structure
 * Redirects: /organizations/:orgId/apps/:appId → /organizations/:orgId?tab=applications&app=:appId
 * Redirects: /dashboard/:orgId/apps/:appId → /dashboard/:orgId?tab=applications&app=:appId
 */
export function RedirectToOrganizationApps() {
  const { orgId, appId } = useParams<{ orgId: string; appId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (orgId) {
      // Build the new URL with query params
      const newPath = `/dashboard/${orgId}?tab=applications${appId ? `&app=${appId}` : ''}`;
      navigate(newPath, { replace: true });
    }
  }, [orgId, appId, navigate]);

  return null; // This component doesn't render anything
}
