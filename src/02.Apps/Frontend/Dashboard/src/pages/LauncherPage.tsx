// ============================================================================
// LAUNCHER PAGE - Unified Dashboard & Instance Selector
// ============================================================================

import { useState, useEffect } from 'react';
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
import apiClient from '@/lib/api-client';
import { UserContextResponse, OrganizationContextDto } from '@/types/api';

// UI Components
import { 
  Button,
  Input,
  Badge,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Separator
} from '@farutech/design-system';
import { AppHeader } from '@/components/layout/AppHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// Helper Functions
// ============================================================================
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
  const { selectContext, availableTenants } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<OrganizationContextDto[]>([]);
  const navigate = useNavigate();

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // First try to use availableTenants if present (from intermediate login)
        if (availableTenants && availableTenants.length > 0) {
             // Map TenantOptionDto[] to OrganizationContextDto[] structure for unified rendering
             const mappedOrgs: OrganizationContextDto[] = availableTenants.map(t => ({
                 organizationId: t.tenantId,
                 organizationName: t.companyName || 'Organización',
                 role: t.role || '',
                 organizationCode: '', // Not available in login response
                 isOwner: t.role === 'Owner',
                 instances: (t.instances || []).map(i => ({
                     instanceId: i.instanceId,
                     code: i.code,
                     name: i.name,
                     applicationType: i.type,
                     status: i.status,
                     url: i.url,
                     hasDirectAssignment: false // Default value
                 }))
             }));
             setOrganizations(mappedOrgs);
        } else {
             // Fallback: Fetch from API context if user is already authenticated
             const token = localStorage.getItem('farutech_access_token');
             if (token) {
                 const response = await apiClient.get<UserContextResponse>('/api/Auth/context');
                 setOrganizations(response.data.organizations);
             }
        }
      } catch (error) {
        console.error('Failed to load launcher data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [availableTenants]);

  // Handle Selection
  const handleInstanceClick = async (tenantId: string, instanceId: string) => {
      // Find the target instance to get its URL
      const targetOrg = organizations.find(o => o.organizationId === tenantId);
      const targetInstance = targetOrg?.instances.find(i => i.instanceId === instanceId);
      
      // Default to /dashboard or the instance URL
      // If URL is absolute, selectContext will redirect to it (if navigate handles it, or we handle it manually)
      // Note: React Router navigate() handles relative paths. Absolute URLs need window.location.
      const url = targetInstance?.url || '/dashboard';
      const isAbsolute = url.startsWith('http');
      
      // Store preferred instance
      sessionStorage.setItem('farutech_last_instance', instanceId);
      
      if (isAbsolute) {
          await selectContext(tenantId, window.location.pathname); // Stay here, then redirect manually
          window.location.href = url;
      } else {
          await selectContext(tenantId, url);
      }
  };

  // Filter Logic
  const filteredOrgs = organizations.map(org => ({
      ...org,
      instances: (org.instances || []).filter(i => 
          i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (i.code && i.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          org.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
      )
  })).filter(org => org.instances.length > 0 || org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()));

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
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-violet-200 whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Instancia
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* Content Grid */}
        <div className="space-y-10">
            {loading ? (
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
                    <h3 className="text-lg font-medium text-slate-900">No se encontraron instancias</h3>
                    <p className="text-slate-500 mt-2">Intenta ajustar los filtros de búsqueda</p>
                    <Button variant="link" onClick={() => setSearchTerm('')} className="text-[#8B5CF6] mt-2">
                        Limpiar filtros
                    </Button>
                </div>
            ) : (
                // Organizations & Instances
                filteredOrgs.map(org => (
                    <div key={org.organizationId} className="space-y-4">
                        {/* Org Title */}
                        {filteredOrgs.length > 1 && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">
                                <Building2 className="h-4 w-4" />
                                {org.organizationName}
                            </div>
                        )}

                        {/* Instances Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {org.instances.map(instance => {
                                const config = getInstanceConfig(instance.applicationType || instance.name);
                                
                                return (
                                    <Card 
                                        key={instance.instanceId}
                                        className="group relative overflow-hidden cursor-pointer border-slate-200 hover:border-[#8B5CF6]/50 bg-white hover:shadow-lg transition-all duration-300"
                                        onClick={() => handleInstanceClick(org.organizationId, instance.instanceId)}
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8B5CF6] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                            <Badge variant="secondary" className={`${config.color} border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md`}>
                                                {config.label}
                                            </Badge>
                                            
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
                                        </CardHeader>

                                        <CardContent className="pt-2 pb-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#8B5CF6] transition-colors">
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
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
      </main>
    </div>
  );
}
