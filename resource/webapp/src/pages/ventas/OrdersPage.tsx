/**
 * Página de Órdenes - Ventas
 * Demuestra: Table, Badge, Button, Modal, Tabs
 */

import { useState } from 'react'
import { Card, Button, Badge, Modal, StatsCard } from '@/components/ui'
import {
  ShoppingCartIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Order {
  id: string
  customer: string
  email: string
  date: string
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  items: number
}

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  const orders: Order[] = [
    {
      id: 'ORD-2024-001',
      customer: 'Juan Pérez',
      email: 'juan@empresa.com',
      date: '2024-01-15',
      total: 1250.00,
      status: 'completed',
      items: 3
    },
    {
      id: 'ORD-2024-002',
      customer: 'María García',
      email: 'maria@startup.com',
      date: '2024-01-16',
      total: 2480.00,
      status: 'processing',
      items: 5
    },
    {
      id: 'ORD-2024-003',
      customer: 'Carlos Rodríguez',
      email: 'carlos@company.com',
      date: '2024-01-17',
      total: 890.00,
      status: 'pending',
      items: 2
    },
    {
      id: 'ORD-2024-004',
      customer: 'Ana Martínez',
      email: 'ana@corp.com',
      date: '2024-01-18',
      total: 3200.00,
      status: 'completed',
      items: 8
    },
    {
      id: 'ORD-2024-005',
      customer: 'Luis González',
      email: 'luis@tech.com',
      date: '2024-01-19',
      total: 560.00,
      status: 'cancelled',
      items: 1
    }
  ]

  const statusConfig = {
    pending: { label: 'Pendiente', variant: 'warning' as const, icon: ClockIcon },
    processing: { label: 'Procesando', variant: 'primary' as const, icon: ShoppingCartIcon },
    completed: { label: 'Completado', variant: 'success' as const, icon: CheckCircleIcon },
    cancelled: { label: 'Cancelado', variant: 'danger' as const, icon: XCircleIcon }
  }

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab)

  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  }

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0)

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Órdenes de Venta
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Gestiona todas las órdenes de venta
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-5 h-5 mr-2" />
          Nueva Orden
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Órdenes"
          value={stats.all.toString()}
          icon={<ShoppingCartIcon className="h-6 w-6" />}
          description="Este mes"
        />
        <StatsCard
          title="Completadas"
          value={stats.completed.toString()}
          icon={<CheckCircleIcon className="h-6 w-6" />}
          variant="success"
          description={`${((stats.completed / stats.all) * 100).toFixed(0)}% del total`}
        />
        <StatsCard
          title="Pendientes"
          value={(stats.pending + stats.processing).toString()}
          icon={<ClockIcon className="h-6 w-6" />}
          variant="warning"
          description="Requieren atención"
        />
        <StatsCard
          title="Ingresos"
          value={`$${(totalRevenue / 1000).toFixed(1)}K`}
          icon={<ShoppingCartIcon className="h-6 w-6" />}
          variant="primary"
          description="De órdenes completadas"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeTab === 'all' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('all')}
        >
          Todas ({stats.all})
        </Button>
        <Button
          variant={activeTab === 'pending' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('pending')}
        >
          Pendientes ({stats.pending})
        </Button>
        <Button
          variant={activeTab === 'processing' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('processing')}
        >
          Procesando ({stats.processing})
        </Button>
        <Button
          variant={activeTab === 'completed' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('completed')}
        >
          Completadas ({stats.completed})
        </Button>
        <Button
          variant={activeTab === 'cancelled' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('cancelled')}
        >
          Canceladas ({stats.cancelled})
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{order.customer}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(order.date).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{order.items}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusConfig[order.status].variant}>
                        <StatusIcon className="w-4 h-4 mr-1 inline" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewOrder(order)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay órdenes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron órdenes en esta categoría
            </p>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Orden ${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
              <Badge variant={statusConfig[selectedOrder.status].variant}>
                {statusConfig[selectedOrder.status].label}
              </Badge>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Información del Cliente
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nombre:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedOrder.customer}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {selectedOrder.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedOrder.date).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Items ({selectedOrder.items})
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cerrar
              </Button>
              <Button variant="primary">
                Imprimir
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
