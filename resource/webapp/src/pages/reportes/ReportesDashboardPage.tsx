/**
 * Dashboard del módulo Reportes
 */

import { Card } from '@/components/ui'
import { 
  ChartBarIcon, 
  DocumentChartBarIcon, 
  PresentationChartLineIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'

export default function ReportesDashboardPage() {
  const stats = [
    { 
      name: 'Reportes Generados', 
      value: '143', 
      change: '+12%', 
      icon: DocumentChartBarIcon,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    { 
      name: 'Analíticas Activas', 
      value: '28', 
      change: '+5%', 
      icon: ChartBarIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    { 
      name: 'Dashboards', 
      value: '12', 
      change: '+3', 
      icon: PresentationChartLineIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    { 
      name: 'ROI Promedio', 
      value: '24.8%', 
      change: '+2.1%', 
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Centro de Reportes</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Analíticas y reportes avanzados del sistema
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

      {/* Report Categories */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 rounded-md p-3 bg-green-50 dark:bg-green-900/20">
                <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Reportes Financieros
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Balance General</span>
                <span className="text-gray-900 dark:text-white font-medium">15 reportes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Estado de Resultados</span>
                <span className="text-gray-900 dark:text-white font-medium">12 reportes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Flujo de Caja</span>
                <span className="text-gray-900 dark:text-white font-medium">8 reportes</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-50 dark:bg-blue-900/20">
                <PresentationChartLineIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Reportes Operativos
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Ventas por Período</span>
                <span className="text-gray-900 dark:text-white font-medium">24 reportes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Top Productos</span>
                <span className="text-gray-900 dark:text-white font-medium">18 reportes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Clientes</span>
                <span className="text-gray-900 dark:text-white font-medium">16 reportes</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 rounded-md p-3 bg-purple-50 dark:bg-purple-900/20">
                <DocumentChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Reportes de Inventario
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Valoración Stock</span>
                <span className="text-gray-900 dark:text-white font-medium">10 reportes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Rotación</span>
                <span className="text-gray-900 dark:text-white font-medium">8 reportes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Stock Muerto</span>
                <span className="text-gray-900 dark:text-white font-medium">5 reportes</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Reportes Recientes
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Ventas Mensuales - Octubre 2024', type: 'Operativo', generated: 'Hace 2 horas', status: 'Completado' },
              { name: 'Balance General Q3 2024', type: 'Financiero', generated: 'Hace 5 horas', status: 'Completado' },
              { name: 'Rotación de Inventario', type: 'Inventario', generated: 'Ayer', status: 'Procesando' },
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{report.type}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{report.generated}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  report.status === 'Completado' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
