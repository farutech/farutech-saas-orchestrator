import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCreateCustomer } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrganizationModal({ isOpen, onClose }: CreateOrganizationModalProps) {
  const { user, refreshAvailableTenants, requiresContextSelection } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    code: '',
    email: '',
    phone: '',
    address: ''
  });

  const { mutate: createCustomer, status } = useCreateCustomer({
    onSuccess: async () => {
      toast.success('Organización creada exitosamente');
      
      // Refresh logic based on context
      if (requiresContextSelection) {
        await refreshAvailableTenants();
      } else {
        await queryClient.invalidateQueries({ queryKey: ['customers'] });
      }
      
      onClose();
      // Reset form
      setFormData({
        name: '',
        taxId: '',
        code: '',
        email: '',
        phone: '',
        address: ''
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear la organización');
    }
  });

  const isLoading = status === 'pending';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('No se pudo identificar el usuario actual');
      return;
    }

    createCustomer({
      companyName: formData.name,
      taxId: formData.taxId,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      adminUserId: user.id
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nueva Organización</DialogTitle>
          <DialogDescription>
            Crea una nueva organización para gestionar tus aplicaciones.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            
            {/* Basic Info */}
            {/* <div className="grid grid-cols-2 gap-4"> */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Organización *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Mi Empresa S.A."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">RUT/NIT/Tax ID</Label>
                 <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="Ej. 12345678-9"
                />
              </div>
            {/* </div> */}

            {/* Contact Info */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contacto@empresa.com"
                required
              />
            </div>

            {/* <div className="grid grid-cols-2 gap-4"> */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+57 300 123 4567"
                    />
                </div>
                <div className="space-y-2">
                     <Label htmlFor="address">Dirección</Label>
                    <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Calle 123 # 45-67"
                    />
                </div>
            {/* </div> */}

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white">
              {isLoading ? 'Creando...' : 'Crear Organización'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
