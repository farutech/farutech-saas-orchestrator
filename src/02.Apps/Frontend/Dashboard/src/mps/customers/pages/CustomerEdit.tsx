// ============================================================================
// CUSTOMER EDIT PAGE
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@farutech/design-system';
import { CustomerForm } from '../components/CustomerForm';
import { customersApi, type CustomerCreateDto, type Customer } from '../api/customers.api';

export const CustomerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (id) {
      loadCustomer(id);
    }
  }, [id]);

  const loadCustomer = async (customerId: string) => {
    try {
      setLoadingData(true);
      const data = await customersApi.getById(customerId);
      setCustomer(data);
    } catch (error) {
      console.error('Error loading customer:', error);
      alert('Error al cargar el cliente');
      navigate('/customers');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (data: CustomerCreateDto) => {
    if (!id) return;

    try {
      setLoading(true);
      await customersApi.update(id, data);
      navigate('/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error al actualizar el cliente');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cliente no encontrado</div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="mt-1 text-sm text-gray-500">
            Actualiza la información de {customer.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <CustomerForm
        defaultValues={{
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/customers')}
        loading={loading}
      />
    </div>
  );
};
