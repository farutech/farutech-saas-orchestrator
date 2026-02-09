/**
 * Tenant Resolver Utility
 * 
 * Resuelve información del tenant desde el hostname de la URL
 * Formato esperado: {instanceCode}.{organizationCode}.app.farutech.com
 * Ejemplo: 8b571b69.FARU6128.app.farutech.com
 */

export interface TenantResolution {
  instanceCode: string;
  organizationCode: string;
  isValid: boolean;
}

export interface TenantInfo {
  instanceId: string;
  instanceName: string;
  organizationId: string;
  organizationName: string;
  applicationUrl: string;
  status: string;
  requiresAuthentication: boolean;
}

/**
 * Extrae los códigos de tenant desde el hostname actual
 * @returns TenantResolution con instanceCode, organizationCode y validez
 */
export const resolveTenantFromHostname = (): TenantResolution => {
  const hostname = window.location.hostname;
  
  console.log('[TenantResolver] Resolving tenant from hostname:', hostname);
  
  // Formato esperado: {instanceCode}.{organizationCode}.app.farutech.com
  // O en desarrollo: localhost o farutech.local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('[TenantResolver] Development localhost detected');
    return {
      instanceCode: '',
      organizationCode: '',
      isValid: false
    };
  }
  
  // Validar si es dominio local sin subdominios (ej: app.farutech.local sin instancia)
  if (hostname.endsWith('.farutech.local') && hostname.split('.').length < 4) {
    console.log('[TenantResolver] Local domain without tenant subdomain detected');
    return {
      instanceCode: '',
      organizationCode: '',
      isValid: false
    };
  }
  
  const parts = hostname.split('.');
  
  // Necesita al menos 4 partes: instance.org.app.domain
  if (parts.length < 4) {
    console.warn('[TenantResolver] Invalid hostname format. Expected at least 4 parts, got:', parts.length);
    return {
      instanceCode: '',
      organizationCode: '',
      isValid: false
    };
  }
  
  const instanceCode = parts[0]; // e.g., "8b571b69"
  const organizationCode = parts[1]; // e.g., "FARU6128"
  
  // Validar que los códigos no estén vacíos
  if (!instanceCode || !organizationCode) {
    console.warn('[TenantResolver] Empty codes detected:', { instanceCode, organizationCode });
    return {
      instanceCode: '',
      organizationCode: '',
      isValid: false
    };
  }
  
  console.log('[TenantResolver] Tenant resolved:', { instanceCode, organizationCode });
  
  return {
    instanceCode,
    organizationCode,
    isValid: true
  };
};

/**
 * Llama al API de resolución del backend para validar y obtener información del tenant
 * @param hostname Hostname completo a resolver
 * @returns Información del tenant o null si no se encuentra
 */
export const callResolveApi = async (hostname: string): Promise<TenantInfo | null> => {
  try {
    console.log('[TenantResolver] Calling resolve API for hostname:', hostname);
    
    const apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://farutech.local';
    const response = await fetch(
      `${apiUrl}/api/resolve/by-hostname?hostname=${encodeURIComponent(hostname)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.warn('[TenantResolver] API returned error:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log('[TenantResolver] Tenant info retrieved:', data);
    
    return data;
  } catch (error) {
    console.error('[TenantResolver] Error calling resolve API:', error);
    return null;
  }
};

/**
 * Valida que el usuario tenga acceso al tenant actual
 * Se debe llamar después del login exitoso
 */
export const validateTenantAccess = (
  tenantResolution: TenantResolution,
  availableTenants?: Array<{ companyCode: string; instances: Array<{ code: string }> }>
): boolean => {
  if (!tenantResolution.isValid || !availableTenants) {
    return false;
  }
  
  // Buscar si el usuario tiene acceso a este tenant
  const hasAccess = availableTenants.some(tenant =>
    tenant.companyCode === tenantResolution.organizationCode &&
    tenant.instances.some(instance => instance.code === tenantResolution.instanceCode)
  );
  
  console.log('[TenantResolver] Access validation:', {
    tenantResolution,
    hasAccess
  });
  
  return hasAccess;
};
