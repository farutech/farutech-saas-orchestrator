/**
 * Página principal del Dashboard
 */

import { Card, CardHeader } from '@/components/ui/Card'
import {
  UsersIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const stats = [
  {
    name: 'Total Usuarios',
    value: '2,345',
    change: '+12.5%',
    icon: UsersIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Ingresos',
    value: '$45,231',
    change: '+8.2%',
    icon: CurrencyDollarIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Pedidos',
    value: '1,234',
    change: '+4.3%',
    icon: ShoppingCartIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'Crecimiento',
    value: '23.5%',
    change: '+2.1%',
    icon: ArrowTrendingUpIcon,
    color: 'bg-orange-500',
  },
]

const chartData = [
  { name: 'Ene', ventas: 4000, usuarios: 2400 },
  { name: 'Feb', ventas: 3000, usuarios: 1398 },
  { name: 'Mar', ventas: 2000, usuarios: 9800 },
  { name: 'Abr', ventas: 2780, usuarios: 3908 },
  { name: 'May', ventas: 1890, usuarios: 4800 },
  { name: 'Jun', ventas: 2390, usuarios: 3800 },
]

const recentActivity = [
  { user: 'Juan Pérez', action: 'Creó un nuevo usuario', time: 'Hace 5 minutos' },
  { user: 'María García', action: 'Actualizó configuración', time: 'Hace 15 minutos' },
  { user: 'Carlos López', action: 'Ejecutó proceso de respaldo', time: 'Hace 1 hora' },
  { user: 'Ana Martínez', action: 'Eliminó 3 registros', time: 'Hace 2 horas' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} hover>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {stat.change}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader title="Ventas Mensuales" subtitle="Últimos 6 meses" />
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tw-bg-opacity)',
                    border: '1px solid var(--tw-border-opacity)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="ventas" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader title="Crecimiento de Usuarios" subtitle="Últimos 6 meses" />
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tw-bg-opacity)',
                    border: '1px solid var(--tw-border-opacity)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line type="monotone" dataKey="usuarios" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Actividad Reciente" subtitle="Últimas acciones del sistema" />
        <div className="mt-4 space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {activity.user.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.user}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.action}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
