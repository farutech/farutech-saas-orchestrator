// ============================================================================
// APPLICATIONS SERVICE - API calls for application management
// ============================================================================

import { apiClient } from '@/lib/api-client';
import type { TenantInstance } from '@/types/api';

export interface ApplicationSummary {
  id: string;
  name: string;
  code: string;
  tenantCode: string; // Internal tenant code for URL construction
  type: string;
  status: 'Active' | 'Inactive' | 'Provisioning';
  url?: string;
  environment?: string;
  subscription?: string; // Plan de suscripción activo
}

export interface OrganizationSummary {
  totalApps: number;
  activeApps: number;
  inactiveApps: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  billingStatus: 'Al día' | 'Pago Pendiente' | 'Próximo Vencimiento' | 'Sin consumo';
  nextBillingDate?: string;
}

export const applicationsService = {
  /**
   * Get applications for an organization
   * Uses existing tenant instances from customer data
   */
  getApplicationsByOrganization: async (orgId: string): Promise<ApplicationSummary[]> => {
    const { data } = await apiClient.get<{ tenantInstances: TenantInstance[] }>(
      `/api/Customers/${orgId}`
    );
    
    return (data.tenantInstances || []).map((instance): ApplicationSummary => ({
      id: instance.id,
      name: instance.name || instance.tenantCode || 'Sin nombre',
      code: instance.code || instance.tenantCode || '', // Display code (user selected)
      tenantCode: instance.tenantCode || '', // Internal code
      type: instance.environment || 'Production',
      status: mapInstanceStatus(instance.status),
      url: instance.apiBaseUrl,
      environment: instance.environment,
      subscription: getSubscriptionPlan(instance), // Plan de suscripción
    }));
  },

  /**
   * Get single application details
   */
  getApplication: async (orgId: string, appId: string): Promise<ApplicationSummary | null> => {
    const apps = await applicationsService.getApplicationsByOrganization(orgId);
    return apps.find(app => app.id === appId) || null;
  },

  /**
   * Calculate organization summary from applications
   */
  calculateOrganizationSummary: (apps: ApplicationSummary[]): OrganizationSummary => {
    const totalApps = apps.length;
    const activeApps = apps.filter(app => app.status === 'Active').length;
    const inactiveApps = apps.filter(app => app.status === 'Inactive').length;
    
    // Proportional Billing Calculation (Mock Logic)
    const COST_PER_APP = 29.00;
    const estimatedCost = activeApps * COST_PER_APP;
    
    const today = new Date();
    const lastPaymentDate = new Date();
    if (today.getDate() > 15) {
        lastPaymentDate.setDate(15);
    } else {
        lastPaymentDate.setMonth(today.getMonth() - 1);
        lastPaymentDate.setDate(15);
    }

    const nextBillingDate = new Date(lastPaymentDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    return {
      totalApps,
      activeApps,
      inactiveApps,
      billingStatus: activeApps > 0 ? 'Al día' : 'Sin consumo',
      lastPaymentDate: activeApps > 0 ? lastPaymentDate.toISOString() : undefined,
      lastPaymentAmount: activeApps > 0 ? estimatedCost : 0,
      nextBillingDate: activeApps > 0 ? nextBillingDate.toISOString() : undefined,
    };
  },

  /**
   * Construct dashboard URL for an application
   * Logic: https://<instance_part>.<org_part>.<domain>
   */
  getDashboardUrl: (app: ApplicationSummary): string => {
    if (app.url && app.url.startsWith('http')) {
      return app.url;
    }
    
    // Pattern: STOR57EF-Shared-c7aa2670
    // Parts: [Organization]-[Type]-[InstanceSuffix]
    // Desired URL: https://<InstanceSuffix>.<Organization>.<Domain>
    const tenantCode = app.tenantCode;
    if (!tenantCode) return '#';

    const parts = tenantCode.split('-');
    if (parts.length >= 3) {
        const orgPart = parts[0];
        const instanceSuffix = parts[parts.length - 1]; // Last part is usually the unique hash
        
        // Get current domain parts
        const currentHost = window.location.hostname; // e.g. dashboard.pepito.com
        const domainParts = currentHost.split('.');
        const domain = domainParts.length > 2 ? domainParts.slice(1).join('.') : currentHost;

        return `https://${instanceSuffix}.${orgPart}.${domain}`;
    }

    return '#'; 
  },

  /**
   * Reactivate an inactive application
   */
  reactivateApplication: async (orgId: string, appId: string): Promise<void> => {
    await apiClient.patch(`/api/Customers/${orgId}/instances/${appId}/status`, {
      status: 'Active',
    });
  },

  /**
   * Deactivate an application
   */
  deactivateApplication: async (orgId: string, appId: string): Promise<void> => {
    await apiClient.patch(`/api/Customers/${orgId}/instances/${appId}/status`, {
      status: 'Inactive',
    });
  },
};

/**
 * Map API status string to typed status
 */
function mapInstanceStatus(status?: string): 'Active' | 'Inactive' | 'Provisioning' {
  if (!status) return 'Inactive';
  const normalized = status.toLowerCase();
  if (normalized === 'active') return 'Active';
  if (normalized === 'provisioning') return 'Provisioning';
  return 'Inactive';
}

/**
 * Get subscription plan for an instance
 * TODO: This should be fetched from the API based on actual subscription data
 */
function getSubscriptionPlan(instance: TenantInstance): string {
  // Mock logic: determine subscription based on instance properties
  // In a real implementation, this would query the subscription API
  const type = (instance.environment || '').toLowerCase();
  
  if (type.includes('premium') || type.includes('enterprise')) {
    return 'Enterprise Plus';
  } else if (type.includes('professional') || type.includes('pro')) {
    return 'Professional';
  } else if (type.includes('basic') || type.includes('starter')) {
    return 'Basic';
  } else {
    return 'Standard'; // Default plan
  }
}
