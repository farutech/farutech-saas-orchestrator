// ============================================================================
// ORGANIZATIONS MANAGEMENT SHEET
// ============================================================================

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Power, PowerOff, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';
import { OrganizationContextDto } from '@/types/api';

interface OrganizationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: OrganizationContextDto[];
  onOrganizationsChange: () => void;
}

export function OrganizationsSheet({ 
  open, 
  onOpenChange, 
  organizations,
  onOrganizationsChange 
}: OrganizationsSheetProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    taxId: '',
  });
  const { toast } = useToast();



  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la organización es obligatorio',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Error',
        description: 'El email de la organización es obligatorio',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      // El backend extraerá el Owner del token JWT automáticamente
      await apiClient.post('/api/Customers', {
        companyName: formData.companyName.trim(),
        email: formData.email.trim(),
        taxId: formData.taxId.trim() || null,
      });

      toast({
        title: 'Éxito',
        description: 'Organización creada correctamente. Refresca para verla en el home.',
      });

      // Limpiar formulario
      setFormData({ companyName: '', email: '', taxId: '' });
      setShowCreateForm(false);
      
      // Recargar organizaciones
      onOrganizationsChange();
    } catch (error: any) {
      console.error('Failed to create organization', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo crear la organización',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (orgId: string, currentStatus: boolean) => {
    try {
      // TODO: Implementar endpoint de toggle
      await apiClient.patch(`/api/Customers/${orgId}/toggle-active`);
      
      toast({
        title: 'Éxito',
        description: `Organización ${currentStatus ? 'desactivada' : 'activada'} correctamente`,
      });
      
      onOrganizationsChange();
    } catch (error) {
      toast({
        title: 'En desarrollo',
        description: 'Esta funcionalidad estará disponible próximamente',
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Administrar Organizaciones
          </SheetTitle>
          <SheetDescription>
            Gestiona tus organizaciones, crea nuevas o modifica las existentes
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Botón Crear Nueva Organización */}
          {!showCreateForm && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Organización
            </Button>
          )}

          {/* Formulario de Creación */}
          {showCreateForm && (
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Nueva Organización</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ companyName: '', email: '', taxId: '' });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    Nombre de la Organización <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Ej: Mi Empresa S.A."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Corporativo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contacto@miempresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">
                    ID Fiscal (NIT/RUC/RFC)
                  </Label>
                  <Input
                    id="taxId"
                    placeholder="Ej: 20123456789"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">
                    Identificación tributaria de la empresa (opcional)
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED]"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Organización
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormData({ companyName: '', email: '', taxId: '' });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          <Separator />

          {/* Listado de Organizaciones */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
              Tus Organizaciones ({organizations.length})
            </h3>
            
            {organizations.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">
                  No tienes organizaciones todavía
                </p>
              </div>
            ) : (
              organizations.map(org => (
                <div
                  key={org.organizationId}
                  className={`border rounded-lg p-4 transition-all ${
                    org.isActive 
                      ? 'bg-white border-slate-200' 
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">
                          {org.organizationName}
                        </h4>
                        
                        {org.isOwner && (
                          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[9px] font-bold uppercase border-none">
                            👑 Owner
                          </Badge>
                        )}
                        
                        {!org.isActive && (
                          <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 text-[9px]">
                            Inactiva
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-xs text-slate-500">
                        {org.organizationCode && (
                          <div>
                            <strong>Código:</strong> {org.organizationCode}
                          </div>
                        )}
                        {org.taxId && (
                          <div>
                            <strong>ID Fiscal:</strong> {org.taxId}
                          </div>
                        )}
                        <div>
                          <strong>Instancias:</strong> {org.instances.length}
                        </div>
                      </div>
                    </div>

                    {org.isOwner && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(org.organizationId, org.isActive)}
                          className="h-8"
                        >
                          {org.isActive ? (
                            <PowerOff className="h-3.5 w-3.5 text-red-500" />
                          ) : (
                            <Power className="h-3.5 w-3.5 text-green-500" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {org.instances.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {org.instances.map(instance => (
                          <Badge
                            key={instance.instanceId}
                            variant="secondary"
                            className="text-[10px] bg-slate-100 text-slate-700"
                          >
                            {instance.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
