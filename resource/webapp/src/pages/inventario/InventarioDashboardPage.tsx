/**
 * Dashboard del módulo Inventario
 */

import { Card } from '@/components/ui'
import { 
  CubeIcon, 
  ArchiveBoxIcon, 
  TruckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function InventarioDashboardPage() {
  const stats = [
    { 
      name: 'Productos en Stock', 
      value: '1,234', 
      change: '+5.2%', 
      icon: CubeIcon,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    { 
      name: 'Valor del Inventario', 
      value: '$542K', 
      change: '+12%', 
      icon: ArchiveBoxIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    { 
      name: 'Órdenes en Tránsito', 
      value: '23', 
      change: '-5%', 
      icon: TruckIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    { 
      name: 'Stock Bajo', 
      value: '8', 
      change: '+2', 
      icon: ExclamationTriangleIcon,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Inventario</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Control de stock y movimientos de productos
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
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.change.startsWith('+') 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
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

      {/* Low Stock & Recent Movements */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              Productos con Stock Bajo
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Laptop Pro 15"', sku: 'LAP-001', current: 3, min: 10 },
                { name: 'Mouse Inalámbrico', sku: 'MOU-045', current: 5, min: 20 },
                { name: 'Monitor 27"', sku: 'MON-023', current: 2, min: 8 },
              ].map((product) => (
                <div key={product.sku} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/30">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {product.current} / {product.min}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Actual / Mínimo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Movimientos Recientes
            </h3>
            <div className="space-y-3">
              {[
                { type: 'Entrada', product: 'Teclado Mecánico', qty: '+50', date: 'Hace 2 horas' },
                { type: 'Salida', product: 'Mouse Inalámbrico', qty: '-15', date: 'Hace 5 horas' },
                { type: 'Ajuste', product: 'Monitor 27"', qty: '+5', date: 'Ayer' },
              ].map((movement, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        movement.type === 'Entrada' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : movement.type === 'Salida'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {movement.type}
                      </span>
                      <p className="font-medium text-gray-900 dark:text-white">{movement.product}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{movement.date}</p>
                  </div>
                  <p className={`text-lg font-semibold ${
                    movement.qty.startsWith('+') 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {movement.qty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
