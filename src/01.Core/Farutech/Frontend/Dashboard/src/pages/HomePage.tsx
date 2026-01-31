// ============================================================================
// LAUNCHER PAGE - Unified Dashboard & Instance Selector
// ============================================================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Box
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useCustomers, useUpdateCustomer } from '@/hooks/useApi';
import { useQueryModal } from '@/hooks/useQueryModal';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AppHeader } from '@/components/layout/AppHeader';
import { CreateInstanceModal } from '@/components/CreateInstanceModal';
import { OrganizationCard } from '@/components/home/OrganizationCard';
import { CreateOrganizationModal } from '@/components/modals/CreateOrganizationModal';
import { EditOrganizationModal } from '@/components/modals/EditOrganizationModal';

// Helper Functions
// ============================================================================

// Normalizar texto para búsqueda (sin acentos, sin espacios extra)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
};

const getInstanceConfig = (type: string) => {
  const t = (type || '').toLowerCase();
  if (t.includes('vet')) return { color: 'bg-orange-100 text-orange-600 border-orange-200', label: 'Veterinaria' };
  if (t.includes('erp')) return { color: 'bg-blue-100 text-blue-600 border-blue-200', label: 'ERP' };
  if (t.includes('pos')) return { color: 'bg-purple-100 text-purple-600 border-purple-200', label: 'POS' };
  if (t.includes('med') || t.includes('doc')) return { color: 'bg-emerald-100 text-emerald-600 border-emerald-200', label: 'Médico' };
  return { color: 'bg-slate-100 text-slate-600 border-slate-200', label: t || 'App' };
};

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'online':
        case 'active':
            return 'bg-emerald-500';
        case 'offline':
        case 'suspended':
            return 'bg-red-500';
        case 'maintenance':
            return 'bg-amber-500';
        default:
            return 'bg-slate-400';
    }
};

// ============================================================================
// Main Component
// ============================================================================

export default function HomePage() {
  const { selectContext, availableTenants, requiresContextSelection, user } = useAuth();
  const { data: customersData, isLoading: customersLoading } = useCustomers({
    enabled: !requiresContextSelection 
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State Management via URL
  const modal = useQueryModal();
  
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  
  const navigate = useNavigate();

  // Transform data based on authentication state
  const organizations = useMemo(() => {
    // When user needs to select context, use availableTenants from login response
    if (requiresContextSelection) {
      const tenantOrgs = availableTenants || [];

      return tenantOrgs.map(t => ({
        organizationId: t.tenantId,
        organizationName: t.companyName || 'Organización',
        organizationCode: t.companyCode || '',
        taxId: t.taxId || '',
        role: t.role || '',
        isOwner: t.isOwner || false,
        isActive: t.isActive !== false,
        instances: (t.instances || []).map(i => ({
          instanceId: i.instanceId,
          code: i.code,
          name: i.name,
          applicationType: i.type,
          status: i.status,
          url: i.url,
          hasDirectAssignment: false
        }))
      }));
    }

    // When user has selected context, use customers API data
    const customerOrgs = customersData?.organizations || [];

    if (customerOrgs && customerOrgs.length > 0) {
      return customerOrgs.map(c => {
        const instances = (c.tenantInstances || []).map(i => ({
          instanceId: i.id,
          code: i.tenantCode || '',
          name: i.tenantCode || 'Instancia',
          applicationType: i.environment || 'App',
          status: i.status || 'Unknown',
          url: i.apiBaseUrl || '',
          hasDirectAssignment: false
        }));

        // Find user's membership to determine role
        const membership = c.userMemberships?.find(m => m.user?.id === user?.id || m.userId === user?.id);
        const role = membership?.role || 'User';
        const isOwner = role === 'Owner' || role === 'Admin';

        return {
          organizationId: c.id,
          organizationName: c.companyName || 'Organización',
          organizationCode: c.code || '',
          taxId: c.taxId || '',
          role: role,
          isOwner: isOwner,
          isActive: c.isActive,
          instances: instances
        };
      });
    }

    return [];
  }, [customersData, availableTenants, requiresContextSelection, user]);

  // Handle Selection
  const handleInstanceClick = async (tenantId: string, instanceId: string, isActive: boolean) => {
      // Prevenir selección de organizaciones inactivas
      if (!isActive) {
        return;
      }

      // Find the target instance to get its URL
      const targetOrg = organizations.find(o => o.organizationId === tenantId);
      const targetInstance = targetOrg?.instances.find(i => i.instanceId === instanceId);
      
      // Default to /app/:instanceId or the instance URL
      const url = targetInstance?.url || `/app/${instanceId}`;
      
      // Check if URL is external (different domain/origin)
      const isExternalUrl = url.startsWith('http') && 
                           !url.includes('localhost') &&
                           !url.includes('127.0.0.1') &&
                           !url.includes(window.location.hostname);
      
      // Store preferred instance
      sessionStorage.setItem('farutech_last_instance', instanceId);
      
      if (isExternalUrl) {
          // External URL (production subdomain): Full redirect
          await selectContext(tenantId, window.location.pathname);
          window.location.href = url;
      } else {
          // Local URL or relative path: Navigate within this app
          await selectContext(tenantId, `/app/${instanceId}`);
      }
  };

  // Handle Create Instance - Open modal instead of navigating
  const handleCreateInstance = (organizationId: string) => {
    // Find organization from correct data source
    let orgData;
    if (requiresContextSelection) {
      // In context selection mode, search in availableTenants
      const tenant = availableTenants?.find(t => t.tenantId === organizationId);
      if (tenant) {
        // Create a Customer-like object from TenantOptionDto
        orgData = {
          id: tenant.tenantId,
          code: tenant.companyCode || '',
          companyName: tenant.companyName || 'Organización',
          taxId: tenant.taxId || '',
          isActive: tenant.isActive !== false,
          tenantInstances: (tenant.instances || []).map(i => ({
            id: i.instanceId,
            tenantCode: i.code,
            environment: i.type,
            status: i.status,
            apiBaseUrl: i.url
          }))
        };
      }
    } else {
      // In authenticated mode, search in customers
      orgData = customersData?.organizations?.find(c => c.id === organizationId);
    }

    if (orgData) {
      setSelectedOrganization(orgData);
      modal.open('new-instance'); // Open modal via URL
    } else {
      console.error('[HomePage] Organization not found for ID:', organizationId);
    }
  };

  // Handle Edit Organization
  const handleEditOrganization = (organizationId: string) => {
    let orgData;
    if (requiresContextSelection) {
      const tenant = availableTenants?.find(t => t.tenantId === organizationId);
      if (tenant) {
        orgData = {
          id: tenant.tenantId,
          companyName: tenant.companyName || '',
          taxId: tenant.taxId || '',
          email: '', // Not available in tenant options
          phone: '',
          address: '',
        } as any;
      }
    } else {
      orgData = customersData?.organizations?.find(c => c.id === organizationId);
    }

    if (orgData) {
      setSelectedOrganization(orgData);
      modal.open('edit-org');
    } else {
      console.error('[HomePage] Organization not found for ID:', organizationId);
    }
  };


  // ============================================================================
  // Filtrado Simple y Eficiente
  // ============================================================================
  const filteredOrgs = useMemo(() => {
    if (!searchTerm.trim()) return organizations;

    const search = searchTerm.toLowerCase().trim();

    return organizations.filter(org => {
      // Buscar en nombre de organización
      if (org.organizationName.toLowerCase().includes(search)) return true;

      // Buscar en código de organización
      if (org.organizationCode.toLowerCase().includes(search)) return true;

      // Buscar en tax ID
      if (org.taxId && org.taxId.toLowerCase().includes(search)) return true;

      // Buscar en instancias
      return org.instances.some(instance =>
        instance.name.toLowerCase().includes(search) ||
        instance.code.toLowerCase().includes(search) ||
        instance.applicationType.toLowerCase().includes(search)
      );
    });
  }, [organizations, searchTerm]);

  // State for Accordion
  const [expandedOrgId, setExpandedOrgId] = useState<string | null>(null);

  // Handle Accordion Toggle
  const toggleOrg = (orgId: string) => {
    setExpandedOrgId(prev => prev === orgId ? null : orgId);
  };

  // Handle Toggle Status (Activate/Deactivate)
  const { mutate: updateCustomerStatus } = useUpdateCustomer();

  const handleToggleStatus = (organizationId: string, currentIsActive: boolean) => {
    // If we are deactivating, collapse the card
    if (currentIsActive && expandedOrgId === organizationId) {
      setExpandedOrgId(null);
    }

    updateCustomerStatus({
      id: organizationId,
      data: {
        isActive: !currentIsActive
      }
    });
  };


  // Handle View All Apps
  const handleViewAll = (orgId: string) => {
    // If the organization has more than 3 instances, open the instance selector
    const org = organizations.find(o => o.organizationId === orgId);
    const instancesCount = org?.instances?.length ?? 0;

    if (instancesCount > 3) {
      navigate('/select-instance');
      return;
    }

    // Otherwise navigate to the organization apps page (preserves existing behavior)
    navigate(`/organizations/${orgId}/apps`);
  };


  // Handle Create Organization
  const handleCreateOrganization = () => {
    modal.open('new-org');
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mis Organizaciones</h1>
            <p className="text-slate-500 mt-1">Gestiona tus empresas y accede a sus aplicaciones</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Buscar organización..." 
                className="pl-10 bg-white border-slate-200 focus-visible:ring-primary shadow-sm rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateOrganization} className="flex-shrink-0">
               <Plus className="mr-2 h-4 w-4" />
               Nueva Organización
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full">
            {customersLoading && !requiresContextSelection ? (
                // Loading Skeletons
                [1,2,3].map(i => (
                    <div key={i} className="h-48 bg-white rounded-xl border border-slate-200 shadow-sm animate-pulse" />
                ))
            ) : filteredOrgs.length === 0 ? (
                // Empty State
                <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <div className="bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <Box className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">
                        {requiresContextSelection
                          ? 'No tienes acceso a organizaciones'
                          : 'No se encontraron organizaciones'
                        }
                    </h3>
                    <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">
                        {requiresContextSelection
                          ? 'Contacta al administrador para que te asigne a una.'
                          : 'Crea una nueva organización o ajusta tu búsqueda.'
                        }
                    </p>
                    <div className="flex justify-center gap-4">
                        {requiresContextSelection ? (
                            <Button
                                onClick={() => navigate('/login')}
                                variant="outline"
                            >
                                Ir al Login
                            </Button>
                        ) : (
                             <Button onClick={handleCreateOrganization}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Organización
                             </Button>
                        )}
                    </div>
                </div>
            ) : (
                // Organization Cards
                <>
                  {filteredOrgs.map(org => (
                    <OrganizationCard
                      key={org.organizationId}
                      organization={org}
                      isExpanded={expandedOrgId === org.organizationId}
                      onToggle={() => toggleOrg(org.organizationId)}
                      onLaunchInstance={handleInstanceClick}
                      onCreateInstance={handleCreateInstance}
                      onEditOrganization={handleEditOrganization}
                      onToggleStatus={handleToggleStatus}
                      limitApps={3}
                      onViewAll={handleViewAll}
                    />
                  ))}

                  {/* 'Create New' Placeholder Card */}
                  <div 
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-slate-50 transition-colors cursor-pointer group min-h-[240px]"
                    onClick={handleCreateOrganization}
                  >
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-3">
                      <Plus className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary">Nueva Organización</h3>
                    <p className="text-sm text-slate-500 mt-1">Registrar una nueva empresa</p>
                  </div>
                </>
            )}
        </div>
      </main>

      <CreateOrganizationModal 
        isOpen={modal.isOpen('new-org')}
        onClose={modal.close}
      />

      {/* Create Instance Modal */}
      {(selectedOrganization || modal.isOpen('new-instance')) && (
        <CreateInstanceModal
          isOpen={modal.isOpen('new-instance')}
          onClose={() => {
            modal.close();
            setSelectedOrganization(null);
          }}
          organization={selectedOrganization || filteredOrgs[0]} 
        />
      )}

      {/* Edit Organization Modal */}
      {selectedOrganization && (
        <EditOrganizationModal
          isOpen={modal.isOpen('edit-org')}
          onClose={() => {
            modal.close();
            setSelectedOrganization(null);
          }}
          organization={selectedOrganization}
        />
      )}
    </div>
  );
}
