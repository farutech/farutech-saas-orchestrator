// ============================================================================
// ORGANIZATIONS MANAGEMENT PAGE
// ============================================================================

import { useState } from 'react';
import { Building2, Edit, Power, PowerOff, Trash2, AlertCircle, Plus } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { DataOrchestrator, FetchParams } from '@/components/data/DataOrchestrator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';
import { OrganizationFormDialog } from '@/components/organizations/OrganizationFormDialog';

// ============================================================================
// Types
// ============================================================================

interface OrganizationDto {
  id: string;
  companyName: string;
  email: string;
  taxId?: string;
  code?: string;
  isActive: boolean;
  createdAt: string;
  instanceCount: number;
}

interface OrganizationFormData {
  companyName: string;
  taxId: string;
  email: string;
}

// ============================================================================
// Main Component
// ============================================================================

export default function OrganizationsManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDto | null>(null);
  const [createEditDialogOpen, setCreateEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Fetch data function
  const fetchOrganizations = async (params: FetchParams)
        => {
    const response = await apiClient.get<{
      organizations: OrganizationDto[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>('/api/Customers', {
      params: {
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        filter: params.filter,
      },
    });
    return response.data;
  };

  // Toggle status
  const handleToggleStatus = async (org: OrganizationDto)
        => {
    try {
      await apiClient.patch(`/api/Customers/${org.id}/status`, {
        isActive: !org.isActive,
      });

      toast({
        title: 'Éxito',
        description: `Organización ${!org.isActive ? 'activada' : 'inactivada'} correctamente`,
      });

      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.error('Failed to toggle status', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo cambiar el estado',
        variant: 'destructive',
      });
    }
  };

  // Delete organization
  const handleDelete = async ()
        => {
    if (!selectedOrg) return;

    try {
      await apiClient.delete(`/api/Customers/${selectedOrg.id}`);

      toast({
        title: 'Éxito',
        description: 'Organización eliminada correctamente',
      });

      setDeleteDialogOpen(false);
      setSelectedOrg(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.error('Failed to delete organization', error);
      
      // Check for conflict (has instances)
      if (error.response?.status === 409) {
        toast({
          title: 'No se puede eliminar',
          description: error.response?.data?.message || 'La organización tiene instancias activas',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'No se pudo eliminar la organización',
          variant: 'destructive',
        });
      }
    }
  };

  // Open create dialog
  const handleCreateOrganization = ()
        => {
    setIsEditing(false);
    setSelectedOrg(null);
    setCreateEditDialogOpen(true);
  };

  // Open edit dialog
  const handleEditOrganization = (org: OrganizationDto)
        => {
    setIsEditing(true);
    setSelectedOrg(org);
    setCreateEditDialogOpen(true);
  };

  // Handle successful form submission
  const handleFormSuccess = ()
        => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Render each organization as a card
  const renderOrganizationCard = (org: OrganizationDto)
        => {
    const canDelete = org.instanceCount === 0;

    return (
      <Card className={`group transition-all duration-300 ${
        !org.isActive ? 'opacity-60 grayscale' : ''
      }`}>
        <CardHeader className="space-y-2 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm">
                {org.companyName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 truncate">
                  {org.companyName}
                </h3>
                {org.code && (
                  <p className="text-xs text-slate-500 font-mono">{org.code}</p>
                )}
              </div>
            </div>
            
            <Badge className="flex-shrink-0 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider border-none">
              👑 Owner
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Tax ID */}
          {org.taxId && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">ID Fiscal:</span>
              <span className="text-slate-900 font-mono font-semibold">{org.taxId}</span>
            </div>
          )}

          {/* Email */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 font-medium">Email:</span>
            <span className="text-slate-700 truncate">{org.email}</span>
          </div>

          {/* Footer with horizontal layout */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
            {/* Left side: Instance count and status badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 className="h-4 w-4" />
                <span>{org.instanceCount} {org.instanceCount === 1 ? 'instancia' : 'instancias'}</span>
              </div>
              <Badge
                variant={org.isActive ? 'default' : 'secondary'}
                className={org.isActive 
                  ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                  : 'bg-red-100 text-red-700 hover:bg-red-100'
                }
              >
                {org.isActive ? '✓ Activa' : '✗ Inactiva'}
              </Badge>
            </div>

            {/* Right side: Inactive warning */}
            {!org.isActive && (
              <p className="text-xs text-slate-400 max-w-[50%] text-right truncate">
                Esta organización está inactiva. Los usuarios no podrán acceder a sus instancias.
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-3 border-t border-slate-100">
          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={()
        => handleEditOrganization(org)}
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>

          {/* Toggle Status Button */}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={()
        => handleToggleStatus(org)}
          >
            {org.isActive ? (
              <>
                <PowerOff className="h-4 w-4" />
                Inactivar
              </>
            ) : (
              <>
                <Power className="h-4 w-4" />
                Activar
              </>
            )}
          </Button>

          {/* Delete Button */}
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 ${canDelete ? 'text-red-600 hover:bg-red-50 hover:text-red-700' : ''}`}
            disabled={!canDelete}
            onClick={()
        => {
              if (canDelete) {
                setSelectedOrg(org);
                setDeleteDialogOpen(true);
              }
            }}
            title={!canDelete ? 'No se puede eliminar: tiene instancias activas' : 'Eliminar organización'}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <AppHeader title="Gestión de Organizaciones" showBackToHome />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Mis Organizaciones
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gestiona las organizaciones donde eres propietario
            </p>
          </div>
          
          <Button onClick={handleCreateOrganization} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Organización
          </Button>
        </div>

        {/* Data Grid with Orchestrator */}
        <DataOrchestrator
          fetchData={fetchOrganizations}
          renderItem={renderOrganizationCard}
          searchPlaceholder="Buscar por nombre, email o ID fiscal..."
          emptyMessage="No tienes organizaciones creadas"
          skeletonCount={6}
          refreshTrigger={refreshTrigger}
          containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        />
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar organización?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la organización{' '}
              <span className="font-semibold text-slate-900">
                {selectedOrg?.companyName}
              </span>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Organization Dialog */}
      <OrganizationFormDialog
        open={createEditDialogOpen}
        onOpenChange={setCreateEditDialogOpen}
        isEditing={isEditing}
        organization={selectedOrg}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
