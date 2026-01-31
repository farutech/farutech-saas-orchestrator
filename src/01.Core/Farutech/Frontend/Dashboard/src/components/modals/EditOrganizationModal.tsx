import { useState, useEffect } from 'react';
import { Building2, Loader2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUpdateCustomer, useCustomer, queryKeys } from '@/hooks/useApi';
import type { Customer } from '@/types/api';

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: ()
        => void;
  organization: Customer | null | any; // Accept initial data
}

export function EditOrganizationModal({ isOpen, onClose, organization }: EditOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    email: '',
    phone: '',
    address: ''
  });

  // Fetch full organization data if ID is available
  const { data: fullOrg, isLoading: isFetching } = useCustomer(organization?.organizationId || organization?.id || '', {
    queryKey: queryKeys.customer(organization?.organizationId || organization?.id || ''), // Explicitly provide queryKey if required by custom wrapper
    enabled: isOpen && !!(organization?.organizationId || organization?.id),
  });


  // Load organization data when it changes
  useEffect(()
        => {
    const data = fullOrg || organization;
    if (data) {
      setFormData({
        name: data.companyName || data.organizationName || '',
        taxId: data.taxId || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || ''
      });
    }
  }, [fullOrg, organization, isOpen]);

  const { mutate: updateCustomer, isPending } = useUpdateCustomer({
    onSuccess: ()
        => {
      onClose();
    },
    onError: (error)
        => {
      // toast is already handled in useUpdateCustomer but we can add more if needed
      console.error('[EditOrganizationModal] Update error:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent)
        => {
    e.preventDefault();
    
    if (!organization?.id || isPending) return;

    updateCustomer({
      id: organization.id,
      data: {
        companyName: formData.name,
        taxId: formData.taxId,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      }
    });
  };

  if (!organization) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="h-6 w-6" />
             </div>
             <div>
                <DialogTitle>Editar Organización</DialogTitle>
                <DialogDescription>
                  Actualice los detalles de {organization.companyName}.
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre Organización *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e)
        => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Mi Empresa S.A."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-taxId">RUT/NIT/Tax ID</Label>
                 <Input
                  id="edit-taxId"
                  value={formData.taxId}
                  onChange={(e)
        => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="Ej. 12345678-9"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Corporativo *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e)
        => setFormData({ ...formData, email: e.target.value })}
                placeholder="contacto@empresa.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-phone">Teléfono</Label>
                    <Input
                        id="edit-phone"
                        value={formData.phone}
                        onChange={(e)
        => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+57 300 123 4567"
                    />
                </div>
                <div className="space-y-2">
                     <Label htmlFor="edit-address">Dirección</Label>
                    <Input
                        id="edit-address"
                        value={formData.address}
                        onChange={(e)
        => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Calle 123 # 45-67"
                    />
                </div>
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || isFetching} 
              className="bg-primary hover:bg-primary/90 text-white min-w-[150px]"
            >
              {isPending || isFetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isFetching ? 'Cargando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
