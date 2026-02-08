// ============================================================================
// CUSTOMER CREATE PAGE
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@farutech/design-system';
import { CustomerForm } from '../components/CustomerForm';
import { customersApi, type CustomerCreateDto } from '../api/customers.api';

export const CustomerCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CustomerCreateDto) => {
    try {
      setLoading(true);
      await customersApi.create(data);
      navigate('/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Error al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={() => navigate('/customers')}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Cliente</h1>
          <p className="mt-1 text-sm text-gray-500">
            Completa la información del nuevo cliente
          </p>
        </div>
      </div>

      {/* Form */}
      <CustomerForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/customers')}
        loading={loading}
      />
    </div>
  );
};
