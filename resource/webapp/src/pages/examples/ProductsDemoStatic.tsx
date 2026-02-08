/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                    DEMO PAGE - STATIC DATA EXAMPLE                         ║
 * ║                                                                            ║
 * ║  Ejemplo completo de página con datos estáticos                           ║
 * ║  Demuestra:                                                               ║
 * ║  - Data source local con filtrado/paginación                              ║
 * ║  - DataTable con todas las features                                       ║
 * ║  - Controles avanzados                                                    ║
 * ║  - Theming dinámico                                                       ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo } from 'react'
import { useLocalDataSource } from '@/hooks/useDataSource'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AdvancedSelect, MultiSelect } from '@/components/ui/AdvancedSelect'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useAppTheme } from '@/store/applicationStore'
import {
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import type { ColumnDef } from '@tanstack/react-table'

// ============================================================================
// MOCK DATA
// ============================================================================

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  supplier: string
  rating: number
  image: string
  createdAt: string
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laptop Dell XPS 15',
    category: 'electronics',
    price: 1299.99,
    stock: 15,
    status: 'active',
    supplier: 'Dell Inc.',
    rating: 4.5,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Mouse Logitech MX Master 3',
    category: 'electronics',
    price: 99.99,
    stock: 45,
    status: 'active',
    supplier: 'Logitech',
    rating: 4.8,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 3,
    name: 'Teclado Mecánico Keychron K8',
    category: 'electronics',
    price: 89.99,
    stock: 0,
    status: 'out_of_stock',
    supplier: 'Keychron',
    rating: 4.6,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 4,
    name: 'Monitor LG UltraWide 34"',
    category: 'electronics',
    price: 499.99,
    stock: 8,
    status: 'active',
    supplier: 'LG Electronics',
    rating: 4.7,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-02-05T11:45:00Z'
  },
  {
    id: 5,
    name: 'Webcam Logitech C920',
    category: 'electronics',
    price: 79.99,
    stock: 30,
    status: 'active',
    supplier: 'Logitech',
    rating: 4.4,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-02-10T16:20:00Z'
  },
  {
    id: 6,
    name: 'Auriculares Sony WH-1000XM5',
    category: 'electronics',
    price: 349.99,
    stock: 20,
    status: 'active',
    supplier: 'Sony',
    rating: 4.9,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-02-12T13:30:00Z'
  },
  {
    id: 7,
    name: 'Hub USB-C Anker 7 en 1',
    category: 'accessories',
    price: 49.99,
    stock: 50,
    status: 'active',
    supplier: 'Anker',
    rating: 4.3,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-02-15T08:00:00Z'
  },
  {
    id: 8,
    name: 'SSD Samsung 970 EVO 1TB',
    category: 'storage',
    price: 129.99,
    stock: 25,
    status: 'active',
    supplier: 'Samsung',
    rating: 4.8,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-02-18T10:15:00Z'
  },
  {
    id: 9,
    name: 'Router WiFi 6 TP-Link AX3000',
    category: 'networking',
    price: 149.99,
    stock: 12,
    status: 'active',
    supplier: 'TP-Link',
    rating: 4.5,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-02-20T15:45:00Z'
  },
  {
    id: 10,
    name: 'Adaptador Ethernet USB-C',
    category: 'accessories',
    price: 24.99,
    stock: 0,
    status: 'out_of_stock',
    supplier: 'Cable Matters',
    rating: 4.2,
    image: 'https://via.placeholder.com/100',
    createdAt: '2024-02-22T12:00:00Z'
  }
]

const CATEGORIES = [
  { label: 'Electrónicos', value: 'electronics' },
  { label: 'Accesorios', value: 'accessories' },
  { label: 'Almacenamiento', value: 'storage' },
  { label: 'Redes', value: 'networking' }
]

const STATUS_OPTIONS = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
  { label: 'Agotado', value: 'out_of_stock' }
]

// ============================================================================
// COMPONENT
// ============================================================================

export default function ProductsDemoPage() {
  const { theme, gradients } = useAppTheme()
  const [showFilters, setShowFilters] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Data source local con filtrado y paginación
  const {
    data,
    total,
    totalPages,
    params,
    updateParams,
    isEmpty
  } = useLocalDataSource<Product>(
    MOCK_PRODUCTS,
    {
      page: 1,
      perPage: 5,
      sortBy: 'name',
      sortOrder: 'asc',
      filters: {}
    },
    ['name', 'supplier', 'category']
  )

  // Columnas de la tabla
  const columns: ColumnDef<Product>[] = useMemo(() => [
    {
      header: 'Producto',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="h-10 w-10 rounded object-cover"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {row.original.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.original.supplier}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Categoría',
      accessorKey: 'category',
      cell: ({ row }) => {
        const category = CATEGORIES.find(c => c.value === row.original.category)
        return (
          <Badge variant="default">
            {category?.label || row.original.category}
          </Badge>
        )
      }
    },
    {
      header: 'Precio',
      accessorKey: 'price',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          ${row.original.price.toFixed(2)}
        </span>
      )
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className={row.original.stock === 0 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}>
            {row.original.stock}
          </span>
          {row.original.stock < 10 && row.original.stock > 0 && (
            <Badge variant="warning" size="sm">Bajo</Badge>
          )}
        </div>
      )
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }) => {
        const statusMap = {
          active: { label: 'Activo', variant: 'success' as const },
          inactive: { label: 'Inactivo', variant: 'default' as const },
          out_of_stock: { label: 'Agotado', variant: 'danger' as const }
        }
        const status = statusMap[row.original.status]
        return <Badge variant={status.variant}>{status.label}</Badge>
      }
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="text-sm font-medium">{row.original.rating.toFixed(1)}</span>
        </div>
      )
    }
  ], [])

  // Acciones por fila
  const rowActions = [
    {
      label: 'Ver',
      icon: <EyeIcon className="h-4 w-4" />,
      variant: 'ghost' as const,
      onClick: (product: Product) => {
        setSelectedProduct(product)
        setShowModal(true)
      }
    },
    {
      label: 'Editar',
      icon: <PencilIcon className="h-4 w-4" />,
      variant: 'ghost' as const,
      onClick: (product: Product) => {
        console.log('Editar producto:', product)
      }
    },
    {
      label: 'Eliminar',
      icon: <TrashIcon className="h-4 w-4" />,
      variant: 'danger' as const,
      onClick: (product: Product) => {
        if (window.confirm(`¿Eliminar ${product.name}?`)) {
          console.log('Eliminado:', product.id)
        }
      }
    }
  ]

  // Acciones globales
  const globalActions = [
    {
      label: 'Nuevo Producto',
      icon: <PlusIcon className="h-5 w-5" />,
      variant: 'primary' as const,
      onClick: () => console.log('Crear nuevo producto')
    },
    {
      label: 'Exportar',
      icon: <ArrowDownTrayIcon className="h-5 w-5" />,
      variant: 'secondary' as const,
      onClick: () => console.log('Exportar datos')
    },
    {
      label: 'Eliminar Seleccionados',
      icon: <TrashIcon className="h-5 w-5" />,
      variant: 'danger' as const,
      onClick: (selectedIds: (string | number)[]) => {
        if (window.confirm(`¿Eliminar ${selectedIds.length} productos?`)) {
          console.log('Eliminados:', selectedIds)
        }
      },
      requiresSelection: true
    }
  ]

  // Stats
  const stats = useMemo(() => ({
    total: MOCK_PRODUCTS.length,
    active: MOCK_PRODUCTS.filter(p => p.status === 'active').length,
    outOfStock: MOCK_PRODUCTS.filter(p => p.status === 'out_of_stock').length,
    totalValue: MOCK_PRODUCTS.reduce((sum, p) => sum + (p.price * p.stock), 0)
  }), [])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Productos - Datos Estáticos
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ejemplo completo con datos locales, filtrado y paginación
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Productos
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  {stats.total}
                </p>
              </div>
              <div
                className="rounded-full p-3"
                style={{ background: gradients.primary }}
              >
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Activos
                </p>
                <p className="mt-2 text-3xl font-semibold text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Agotados
                </p>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {stats.outOfStock}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Valor Inventario
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  ${stats.totalValue.toFixed(0)}
                </p>
              </div>
              <div
                className="rounded-full p-3"
                style={{ background: gradients.success }}
              >
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FunnelIcon className="h-5 w-5" />
              Filtros
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                placeholder="Buscar productos..."
                value={params.search || ''}
                onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
              />

              <AdvancedSelect
                options={[{ label: 'Todas', value: '' }, ...CATEGORIES]}
                value={params.filters?.category || ''}
                onChange={(val) => updateParams({
                  filters: { ...params.filters, category: val || undefined },
                  page: 1
                })}
                placeholder="Categoría"
                clearable
              />

              <AdvancedSelect
                options={[{ label: 'Todos', value: '' }, ...STATUS_OPTIONS]}
                value={params.filters?.status || ''}
                onChange={(val) => updateParams({
                  filters: { ...params.filters, status: val || undefined },
                  page: 1
                })}
                placeholder="Estado"
                clearable
              />
            </div>
          )}
        </div>
      </Card>

      {/* DataTable */}
      <Card>
        <DataTable
          data={data}
          columns={columns}
          actions={rowActions}
          globalActions={globalActions}
          pagination={{
            page: params.page || 1,
            perPage: params.perPage || 5,
            total,
            totalPages,
            onPageChange: (page) => updateParams({ page }),
            onPerPageChange: (perPage) => updateParams({ perPage, page: 1 })
          }}
          selectable
          loading={false}
          emptyMessage={isEmpty ? 'No se encontraron productos' : undefined}
        />
      </Card>

      {/* Modal de Detalle */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedProduct(null)
        }}
        title="Detalle del Producto"
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedProduct.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedProduct.supplier}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Badge variant="default">
                    {CATEGORIES.find(c => c.value === selectedProduct.category)?.label}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    {selectedProduct.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Precio</p>
                <p className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                  ${selectedProduct.price.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedProduct.stock}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
              <Button variant="primary">
                Editar Producto
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
