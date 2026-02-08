// ============================================================================
// CUSTOMERS LIST PAGE
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '@farutech/design-system';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { customersApi, type Customer } from '../api/customers.api';
import { customersCrudConfig } from '../crud/customers.crud';

export const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersApi.getAll({ search });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string, customerId?: string) => {
    switch (action) {
      case 'create':
        navigate('/customers/create');
        break;
      case 'edit':
        navigate(`/customers/${customerId}/edit`);
        break;
      case 'view':
        navigate(`/customers/${customerId}`);
        break;
      case 'delete':
        if (customerId) handleDelete(customerId);
        break;
      case 'bulk-delete':
        handleBulkDelete();
        break;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await customersApi.delete(id);
        loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`¿Eliminar ${selectedIds.size} clientes seleccionados?`)) {
      try {
        await customersApi.bulkDelete(Array.from(selectedIds));
        setSelectedIds(new Set());
        loadCustomers();
      } catch (error) {
        console.error('Error bulk deleting:', error);
      }
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === customers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(customers.map((c) => c.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de clientes y contactos
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<PlusIcon className="h-5 w-5" />}
          onClick={() => handleAction('create')}
        >
          Nuevo Cliente
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, email o empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          {selectedIds.size > 0 && (
            <Button variant="danger" onClick={() => handleAction('bulk-delete')}>
              Eliminar {selectedIds.size} seleccionados
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === customers.length && customers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                {customersCrudConfig.columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={customersCrudConfig.columns.length + 2} className="px-6 py-4 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={customersCrudConfig.columns.length + 2} className="px-6 py-4 text-center text-gray-500">
                    No hay clientes
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(customer.id)}
                        onChange={() => toggleSelection(customer.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    {customersCrudConfig.columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm">
                        {col.render ? col.render(customer[col.key as keyof Customer]) : customer[col.key as keyof Customer]}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAction('edit', customer.id)}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
