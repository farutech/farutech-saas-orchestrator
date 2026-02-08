/**
 * Dashboard del módulo Ventas
 */

import { Card } from '@/components/ui'
import { 
  ShoppingCartIcon, 
  BanknotesIcon, 
  ReceiptPercentIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'

export default function VentasDashboardPage() {
  const stats = [
    { 
      name: 'Ventas del Día', 
      value: '$12,543', 
      change: '+8.2%', 
      icon: ShoppingCartIcon,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    { 
      name: 'Órdenes Activas', 
      value: '27', 
      change: '+12%', 
      icon: ReceiptPercentIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    { 
      name: 'Ingresos del Mes', 
      value: '$342K', 
      change: '+23%', 
      icon: BanknotesIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    { 
      name: 'Crecimiento', 
      value: '18.2%', 
      change: '+2.5%', 
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Ventas</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestión de ventas, órdenes y facturación
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Orders & Invoices */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Órdenes Recientes
            </h3>
            <div className="space-y-3">
              {[
                { id: '#ORD-2543', client: 'María González', amount: '$1,543', status: 'Pendiente' },
                { id: '#ORD-2542', client: 'Juan Pérez', amount: '$2,180', status: 'Procesando' },
                { id: '#ORD-2541', client: 'Ana Martínez', amount: '$950', status: 'Completada' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{order.amount}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Completada' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : order.status === 'Procesando'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Productos Más Vendidos
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Laptop Pro 15"', sold: 145, revenue: '$217,500' },
                { name: 'Mouse Inalámbrico', sold: 328, revenue: '$32,800' },
                { name: 'Teclado Mecánico', sold: 256, revenue: '$51,200' },
              ].map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.sold} unidades vendidas</p>
                  </div>
                  <p className="font-semibold text-primary-600 dark:text-primary-400">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
