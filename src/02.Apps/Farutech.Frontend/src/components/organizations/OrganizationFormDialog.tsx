// ============================================================================
// ORGANIZATION FORM DIALOG COMPONENT
// ============================================================================

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';

interface OrganizationFormData {
  companyName: string;
  taxId: string;
  email: string;
}

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  organization?: {
    id: string;
    companyName: string;
    taxId?: string;
    email: string;
  } | null;
  onSuccess: () => void;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  isEditing,
  organization,
  onSuccess
}: OrganizationFormDialogProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    companyName: '',
    taxId: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens/closes or organization changes
  useEffect(() => {
    if (open) {
      if (isEditing && organization) {
        setFormData({
          companyName: organization.companyName,
          taxId: organization.taxId || '',
          email: organization.email
        });
      } else {
        setFormData({
          companyName: '',
          taxId: '',
          email: ''
        });
      }
    }
  }, [open, isEditing, organization]);

  const handleSubmit = async () => {
    if (!formData.companyName.trim() || !formData.taxId.trim()) {
      toast({
        title: 'Error de validación',
        description: 'Nombre de empresa e ID Fiscal son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && organization) {
        // Update organization
        await apiClient.put(`/api/Customers/${organization.id}`, {
          companyName: formData.companyName.trim(),
          taxId: formData.taxId.trim(),
          email: formData.email.trim(),
          phone: '',
          address: ''
        });

        toast({
          title: 'Éxito',
          description: 'Organización actualizada correctamente',
        });
      } else {
        // Create organization
        await apiClient.post('/api/Customers', {
          companyName: formData.companyName.trim(),
          taxId: formData.taxId.trim(),
          email: formData.email.trim(),
          phone: '',
          address: ''
        });

        toast({
          title: 'Éxito',
          description: 'Organización creada correctamente',
        });
      }

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Failed to save organization', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo guardar la organización',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Organización' : 'Nueva Organización'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica los datos de la organización seleccionada.'
              : 'Crea una nueva organización. Serás asignado automáticamente como propietario.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="companyName">Nombre de Empresa *</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Ej: Mi Empresa S.A.S."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="taxId">ID Fiscal / NIT *</Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
              placeholder="Ej: 901234567-8"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email de Contacto</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="contacto@empresa.com"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}