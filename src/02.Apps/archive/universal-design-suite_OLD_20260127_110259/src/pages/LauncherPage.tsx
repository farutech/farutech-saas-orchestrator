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

  // Debug logs (remove after fixing)
  console.log('[LauncherPage] requiresContextSelection:', requiresContextSelection);
  console.log('[LauncherPage] availableTenants count:', availableTenants?.length || 0);

  // Transform data based on authentication state
  const organizations = useMemo(() => {
    // When user needs to select context, use availableTenants from login response
    if (requiresContextSelection) {
      const tenantOrgs = availableTenants || [];
      console.log('[LauncherPage] Using availableTenants, count:', tenantOrgs.length);
      
      // Debug first tenant to see structure
      if (tenantOrgs.length > 0) {
        console.log('[LauncherPage] First tenant structure:', JSON.stringify(tenantOrgs[0], null, 2));
      }

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
    console.log('[LauncherPage] Using customers API, count:', customerOrgs.length);

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
    console.log('[LauncherPage] handleCreateInstance called with:', organizationId);
    console.log('[LauncherPage] requiresContextSelection:', requiresContextSelection);
    
    // Find organization from correct data source
    let orgData;
    if (requiresContextSelection) {
      // In context selection mode, search in availableTenants
      const tenant = availableTenants?.find(t => t.tenantId === organizationId);
      console.log('[LauncherPage] Found tenant:', tenant);
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
      console.log('[LauncherPage] Found customer:', orgData);
    }

    if (orgData) {
      console.log('[LauncherPage] Opening modal with organization:', orgData);
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

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* 1. Global Header */}
      <AppHeader title="Universal Launcher" />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Instancias Activas</h1>
            <p className="text-slate-500 text-sm mt-1">Selecciona un entorno para comenzar a trabajar</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#8B5CF6] transition-colors" />
              <Input 
                placeholder="Buscar por nombre, código o tipo..." 
                className="pl-10 bg-white border-slate-200 focus-visible:ring-[#8B5CF6] shadow-sm rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* Content Grid */}
        <div className="space-y-10">
            {customersLoading && !requiresContextSelection ? (
                // Loading Skeletons
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredOrgs.length === 0 ? (
                // Empty State
                <div className="text-center py-20">
                    <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <Box className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">
                        {requiresContextSelection
                          ? 'No tienes acceso a organizaciones'
                          : 'No se encontraron instancias'
                        }
                    </h3>
                    <p className="text-slate-500 mt-2 mb-4">
                        {requiresContextSelection
                          ? 'Necesitas iniciar sesión con credenciales válidas para acceder a organizaciones.'
                          : 'Intenta ajustar los filtros de búsqueda'
                        }
                    </p>
                    {requiresContextSelection ? (
                        <Button
                            onClick={() => navigate('/login')}
                            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                        >
                            Ir al Login
                        </Button>
                    ) : (
                        <Button variant="link" onClick={() => setSearchTerm('')} className="text-[#8B5CF6] mt-2">
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            ) : (
                // Organizations & Instances
                filteredOrgs.map(org => {
                    return (
                    <div key={org.organizationId} className="space-y-4">
                        {/* Org Title con Badge de Owner y TaxId */}
                        <div className="flex items-center gap-3 px-1">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                <Building2 className="h-4 w-4" />
                                {org.organizationName}
                            </div>
                                
                            {/* Badge de OWNER */}
                            {org.isOwner && (
                                <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider border-none shadow-sm">
                                    👑 Owner
                                </Badge>
                            )}
                            
                            {/* Identificación Fiscal - Solo si existe */}
                            {org.taxId && org.taxId.trim() !== '' && (
                                <span className="text-xs text-slate-400 font-mono">
                                    <span className="text-slate-500 mr-1">ID Fiscal:</span>
                                    <span className="text-slate-700 font-semibold">{org.taxId}</span>
                                </span>
                            )}

                            {/* Badge de Inactiva */}
                            {!org.isActive && (
                                <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 text-[10px] font-bold uppercase tracking-wider">
                                    Inactiva
                                </Badge>
                            )}
                        </div>

                        {/* Instances Grid */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${!org.isActive ? 'opacity-60' : ''}`}>
                            {org.instances && org.instances.length > 0 ? (
                                org.instances.map(instance => {
                                const config = getInstanceConfig(instance.applicationType || instance.name);
                                const isDisabled = !org.isActive;
                                
                                return (
                                    <div
                                        key={instance.instanceId}
                                        className="relative"
                                        title={isDisabled ? 'Organización inactiva - Contacta al administrador' : ''}
                                    >
                                        <Card 
                                            className={`group relative overflow-hidden border-slate-200 bg-white transition-all duration-300 ${
                                                isDisabled 
                                                    ? 'grayscale cursor-not-allowed pointer-events-none' 
                                                    : 'cursor-pointer hover:border-[#8B5CF6]/50 hover:shadow-lg'
                                            }`}
                                            onClick={() => !isDisabled && handleInstanceClick(org.organizationId, instance.instanceId, org.isActive)}
                                        >
                                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8B5CF6] to-[#7C3AED] opacity-0 transition-opacity ${
                                            !isDisabled && 'group-hover:opacity-100'
                                        }`} />
                                        
                                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                            <Badge variant="secondary" className={`${config.color} border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md`}>
                                                {config.label}
                                            </Badge>
                                            
                                            {!isDisabled && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Configuración</DropdownMenuItem>
                                                        <DropdownMenuItem>Ver Logs</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </CardHeader>

                                        <CardContent className="pt-2 pb-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h3 className={`font-bold text-lg text-slate-900 transition-colors ${
                                                        !isDisabled && 'group-hover:text-[#8B5CF6]'
                                                    }`}>
                                                        {instance.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 font-mono">
                                                        ID: <span className="text-slate-500">{instance.code || 'N/A'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-0 border-t border-slate-50 bg-slate-50/50 p-4 flex items-center justify-between group-hover:bg-white transition-colors">
                                            <div className="flex items-center gap-2">
                                                <span className={`relative flex h-2.5 w-2.5`}>
                                                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatusColor(instance.status)}`}></span>
                                                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${getStatusColor(instance.status)}`}></span>
                                                </span>
                                                <span className="text-xs font-medium text-slate-600 capitalize">
                                                    {instance.status === 'suspended' ? 'Offline' : 'Online'}
                                                </span>
                                            </div>
                                            
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                                <ChevronRight className="h-5 w-5 text-[#8B5CF6]" />
                                            </div>
                                        </CardFooter>
                                    </Card>
                                    </div>
                                );
                            })
                            ) : (
                                <div className="col-span-full text-center py-10">
                                    <p className="text-slate-400 text-sm">No hay instancias disponibles para esta organización</p>
                                </div>
                            )}
                        </div>

                        {/* Add Application Button */}
                        {org.isActive && (
                            <div className="flex justify-center mt-6">
                                <Button
                                    onClick={() => handleCreateInstance(org.organizationId)}
                                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-violet-200 border-2 border-dashed border-slate-300 hover:border-[#8B5CF6] transition-all duration-200"
                                    variant="outline"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Añadir Aplicación
                                </Button>
                            </div>
                        )}
                    </div>
                );
                })
            )}
        </div>
      </main>

      {/* Create Instance Modal */}
      {selectedOrganization && (
        <CreateInstanceModal
          isOpen={createInstanceModalOpen}
          onClose={() => setCreateInstanceModalOpen(false)}
          organization={selectedOrganization}
        />
      )}
    </div>
  );
}
