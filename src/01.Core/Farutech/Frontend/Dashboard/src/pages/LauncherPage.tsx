// ============================================================================
// LAUNCHER PAGE - Unified Dashboard & Instance Selector
// ============================================================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Building2, 
  LogOut, 
  User, 
  Settings,
  ChevronRight,
  Box
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useCustomers } from '@/hooks/useApi';
import apiClient from '@/lib/api-client';
import { UserContextResponse, OrganizationContextDto } from '@/types/api';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AppHeader } from '@/components/layout/AppHeader';
import { CreateInstanceModal } from '@/components/CreateInstanceModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationCard } from '@/components/launcher/OrganizationCard';

// ============================================================================
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

export default function LauncherPage() {
  const { selectContext, availableTenants, requiresContextSelection } = useAuth();
  const { data: customers, isLoading: customersLoading } = useCustomers({
    enabled: !requiresContextSelection // Only fetch customers when not in context selection mode
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [createInstanceModalOpen, setCreateInstanceModalOpen] = useState(false);
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
    const customerOrgs = customers || [];

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

        return {
          organizationId: c.id,
          organizationName: c.companyName || 'Organización',
          organizationCode: c.code || '',
          taxId: c.taxId || '',
          role: '', // Role comes from tenant context when selected
          isOwner: false, // This would need to be determined differently
          isActive: c.isActive,
          instances: instances
        };
      });
    }

    return [];
  }, [customers, availableTenants, requiresContextSelection]);

  // Handle Selection
  const handleInstanceClick = async (tenantId: string, instanceId: string, isActive: boolean) => {
      // Prevenir selección de organizaciones inactivas
      if (!isActive) {
        return;
      }

      // Find the target instance to get its URL
      const targetOrg = organizations.find(o => o.organizationId === tenantId);
      const targetInstance = targetOrg?.instances.find(i => i.instanceId === instanceId);
      
      // Default to /dashboard or the instance URL
      const url = targetInstance?.url || '/dashboard';
      
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
          await selectContext(tenantId, '/dashboard');
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
      orgData = customers?.find(c => c.id === organizationId);
    }

    if (orgData) {
      setSelectedOrganization(orgData);
      setCreateInstanceModalOpen(true);
    } else {
      console.error('[LauncherPage] Organization not found for ID:', organizationId);
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

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* 1. Global Header */}
      <AppHeader title="Launcher" />

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
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          : 'Intenta ajustar los términos de búsqueda.'
                        }
                    </p>
                    {requiresContextSelection && (
                        <Button
                            onClick={() => navigate('/login')}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            Ir al Login
                        </Button>
                    )}
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
                    />
                  ))}

                  {/* 'Create New' Placeholder Card - Only shown if active */}
                  <div 
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-slate-50 transition-colors cursor-pointer group min-h-[240px]"
                    onClick={() => setCreateInstanceModalOpen(true)} // Or handle logic
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

      {/* Create Instance Modal */}
      {/* Note: This modal logic might need adjustment if users want to create ORGS vs APPS. 
          Currently it creates APPS within an Org. 
          Assuming 'Create New' card creates APPS for now or triggers a different flow. 
          For now, linking to CreateInstanceModal which requires an ORG context. 
          Will adjust to just show modal if needed. 
      */}
      {(selectedOrganization || createInstanceModalOpen) && (
        <CreateInstanceModal
          isOpen={createInstanceModalOpen}
          onClose={() => {
            setCreateInstanceModalOpen(false);
            setSelectedOrganization(null);
          }}
          organization={selectedOrganization || filteredOrgs[0]} // Fallback or handle differently logic for new org
        />
      )}
    </div>
  );
}
