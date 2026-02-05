// ============================================================================
// ORGANIZATIONS MANAGEMENT PAGE
// ============================================================================

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Building2, 
  Trash2, 
  MoreVertical,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useCustomers, useDeleteCustomer, useUpdateCustomer } from '@/hooks/useApi';
import { OrganizationCard } from '@/components/home/OrganizationCard';
import type { Customer, TenantInstance } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { CreateOrganizationModal } from '@/components/modals/CreateOrganizationModal';
import { AppHeader } from '@/components/layout/AppHeader';

export default function OrganizationsManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrgs, setExpandedOrgs] = useState<Record<string, boolean>>({});
  
  const { data: customersData, isLoading: customersLoading } = useCustomers();
  const deleteMutation = useDeleteCustomer();
  const updateMutation = useUpdateCustomer();

  // Dialog states
  const [createEditDialogOpen, setCreateEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const orgs = customersData?.organizations || [];

  const handleToggleExpand = (id: string) => {
    setExpandedOrgs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({ id, data: { isActive: !currentStatus, companyName: '', email: '' } });
  };

  const handleLaunchInstance = (orgId: string, instanceId: string) => {
    // This could redirect to the internal dashboard view or open in new tab
    navigate(`/organizations/${orgId}/apps/${instanceId}`);
  };

  const handleCreateInstance = (orgId: string) => {
    navigate(`/organizations/${orgId}?modal=new-instance`);
  };

  const handleViewAll = (orgId: string) => {
    navigate(`/organizations/${orgId}`);
  };

  const filteredOrgs = orgs.filter(org => 
    org.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.taxId?.toLowerCase().includes(searchTerm.toLowerCase())
  );    
  
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <AppHeader title="Mis Organizaciones" showBackToHome={false} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Organizaciones</h1>
            <p className="text-slate-500 mt-1">Administre las empresas y sus instancias activas.</p>
          </div>
          <Button 
            className="bg-violet-600 hover:bg-violet-700 shadow-sm"
            onClick={() => {
              setIsEditing(false);
              setSelectedOrg(null);
              setCreateEditDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Organización
          </Button>
        </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por nombre, código o ID fiscal..." 
            className="pl-10 bg-white border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {customersLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-[90px] animate-pulse bg-slate-100/50" />
          ))}
        </div>
      ) : filteredOrgs.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredOrgs.map(org => {
            const mappedOrg = {
              organizationId: org.id,
              organizationName: org.companyName || 'Sin Nombre',
              organizationCode: org.code || '',
              isOwner: true, // For management view, we assume admin has full rights
              isActive: org.isActive,
              taxId: org.taxId,
              role: 'Admin',
              instances: (org.tenantInstances || []).map(inst => ({
                instanceId: inst.id,
                name: inst.tenantCode || 'App',
                code: inst.tenantCode || '',
                applicationType: inst.environment || 'App',
                status: inst.status || 'inactive',
                url: inst.apiBaseUrl || ''
              }))
            };

            return (
              <OrganizationCard
                key={org.id}
                organization={mappedOrg}
                onLaunchInstance={() => handleLaunchInstance(org.id, '')}
                onCreateInstance={() => handleCreateInstance(org.id)}
                onEditOrganization={() => {
                  setSelectedOrg(org);
                  setIsEditing(true);
                  setCreateEditDialogOpen(true);
                }}
                onToggleStatus={() => handleToggleStatus(org.id, org.isActive)}
                onSelectOrganization={() => navigate(`/organizations/${org.id}`)}
              />
            );
          })}
        </div>
      ) : (
        <Card className="bg-white border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="h-16 w-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900">No se encontraron organizaciones</h3>
            <p className="text-slate-500 mt-2 max-w-sm">
              Intente ajustar su búsqueda o cree una nueva organización para comenzar.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => setSearchTerm('')}
            >
              Limpiar búsqueda
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CreateOrganizationModal
        isOpen={createEditDialogOpen}
        onClose={() => setCreateEditDialogOpen(false)}
        onSuccess={() => {
          setCreateEditDialogOpen(false);
          // Query will refresh automatically via tag invalidation in useApi hooks if implemented, 
          // or we can manually refresh if needed.
        }}
        organization={selectedOrg}
        isEditing={isEditing}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Está absolutamente seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la organización 
              <strong> {selectedOrg?.companyName}</strong> y todos sus datos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedOrg) {
                  deleteMutation.mutate(selectedOrg.id);
                  setDeleteDialogOpen(false);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar Organización'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>
    </div>
  );
}
