// ============================================================================
// CUSTOMERS CRUD CONFIG - Table Configuration
// ============================================================================

import type { CrudColumn, CrudAction } from '@farutech/design-system';
import type { Customer } from '../api/customers.api';

export const customersCrudConfig = {
  /**
   * Table columns configuration
   */
  columns: [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      searchable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      searchable: true,
    },
    {
      key: 'phone',
      header: 'Teléfono',
      sortable: false,
    },
    {
      key: 'company',
      header: 'Empresa',
      sortable: true,
      searchable: true,
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      render: (value: string) => {
        const className = `px-2 py-1 text-xs font-medium rounded-full ${
          value === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`;
        return `<span class="${className}">${value === 'active' ? 'Activo' : 'Inactivo'}</span>`;
      },
    },
    {
      key: 'createdAt',
      header: 'Fecha Creación',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
  ] as CrudColumn<Customer>[],

  /**
   * Global actions (top of table)
   */
  globalActions: [
    {
      key: 'create',
      label: 'Nuevo Cliente',
      icon: 'PlusIcon',
      variant: 'primary',
      permissions: ['customers.write'],
    },
    {
      key: 'export',
      label: 'Exportar',
      icon: 'ArrowDownTrayIcon',
      variant: 'secondary',
    },
    {
      key: 'bulk-delete',
      label: 'Eliminar Seleccionados',
      icon: 'TrashIcon',
      variant: 'danger',
      requiresSelection: true,
      permissions: ['customers.delete'],
    },
  ] as CrudAction[],

  /**
   * Row actions (per record)
   */
  rowActions: [
    {
      key: 'edit',
      label: 'Editar',
      icon: 'PencilIcon',
      variant: 'primary',
      permissions: ['customers.write'],
    },
    {
      key: 'view',
      label: 'Ver Detalles',
      icon: 'EyeIcon',
      variant: 'secondary',
    },
    {
      key: 'documents',
      label: 'Documentos',
      icon: 'DocumentIcon',
      variant: 'secondary',
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: 'TrashIcon',
      variant: 'danger',
      requiresConfirmation: true,
      permissions: ['customers.delete'],
    },
  ] as CrudAction[],

  /**
   * Filters configuration
   */
  filters: [
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'active', label: 'Activos' },
        { value: 'inactive', label: 'Inactivos' },
      ],
    },
    {
      key: 'dateRange',
      label: 'Rango de Fechas',
      type: 'dateRange',
    },
  ],

  /**
   * Pagination config
   */
  pagination: {
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
  },
};
