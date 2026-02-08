// ============================================================================
// CUSTOMER FORM - Reusable Form Component
// ============================================================================

import { useForm } from 'react-hook-form';
import { Button, Input, Select, Card } from '@farutech/design-system';
import type { CustomerCreateDto } from '../api/customers.api';

interface CustomerFormProps {
  defaultValues?: Partial<CustomerCreateDto>;
  onSubmit: (data: CustomerCreateDto) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const CustomerForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
}: CustomerFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerCreateDto>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Nombre Completo"
              {...register('name', { required: 'El nombre es requerido' })}
              error={errors.name?.message}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
            error={errors.email?.message}
            required
          />

          <Input
            label="Teléfono"
            {...register('phone', { required: 'El teléfono es requerido' })}
            error={errors.phone?.message}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Empresa"
              {...register('company')}
              error={errors.company?.message}
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Guardar
        </Button>
      </div>
    </form>
  );
};
