/**
 * Dashboard del módulo CRM
 */

import { Card } from '@/components/ui'
import { 
  UserGroupIcon, 
  PhoneIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

export default function CrmDashboardPage() {
  const stats = [
    { 
      name: 'Clientes Totales', 
      value: '2,543', 
      change: '+12%', 
      icon: UserGroupIcon,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    { 
      name: 'Leads Activos', 
      value: '127', 
      change: '+23%', 
      icon: PhoneIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    { 
      name: 'Oportunidades', 
      value: '45', 
      change: '+8%', 
      icon: ChartBarIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    { 
      name: 'Ingresos Proyectados', 
      value: '$428K', 
      change: '+18%', 
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard CRM</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestión de relaciones con clientes
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Leads Recientes
            </h3>
            <div className="space-y-3">
              {[
                { name: 'María González', company: 'Tech Corp', status: 'Nuevo', priority: 'Alta' },
                { name: 'Juan Pérez', company: 'Innovate SA', status: 'Contactado', priority: 'Media' },
                { name: 'Ana Martínez', company: 'Global Inc', status: 'Calificado', priority: 'Alta' },
              ].map((lead, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {lead.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.priority === 'Alta' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {lead.priority}
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
              Próximas Actividades
            </h3>
            <div className="space-y-3">
              {[
                { type: 'Llamada', client: 'Tech Corp', time: 'Hoy 10:00 AM' },
                { type: 'Reunión', client: 'Innovate SA', time: 'Hoy 2:30 PM' },
                { type: 'Seguimiento', client: 'Global Inc', time: 'Mañana 9:00 AM' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.type}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.client}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
