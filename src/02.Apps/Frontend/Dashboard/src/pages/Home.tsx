// ============================================================================
// HOME PAGE - Dashboard Landing
// ============================================================================

import { Link } from 'react-router-dom';
import { Card, Button } from '@farutech/design-system';
import {
  UserGroupIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const quickAccessCards: QuickAccessCard[] = [
  {
    id: 'customers',
    title: 'Clientes',
    description: 'Gestión de clientes y contactos',
    href: '/customers',
    icon: UserGroupIcon,
    color: 'bg-blue-500',
  },
  {
    id: 'products',
    title: 'Productos',
    description: 'Catálogo y gestión de productos',
    href: '/products',
    icon: ShoppingBagIcon,
    color: 'bg-green-500',
  },
  {
    id: 'orders',
    title: 'Pedidos',
    description: 'Gestión de órdenes y ventas',
    href: '/orders',
    icon: DocumentTextIcon,
    color: 'bg-purple-500',
  },
  {
    id: 'reports',
    title: 'Reportes',
    description: 'Análisis y reportes empresariales',
    href: '/reports',
    icon: ChartBarIcon,
    color: 'bg-orange-500',
  },
];

const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido a Farutech
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Tu plataforma de gestión empresarial
        </p>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Acceso Rápido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.id} to={card.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vista General
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Activos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
              </div>
              <UserGroupIcon className="h-12 w-12 text-blue-500" />
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">
                +12% este mes
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventas del Mes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$45,678</p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-green-500" />
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">
                +8% vs mes anterior
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">56</p>
              </div>
              <DocumentTextIcon className="h-12 w-12 text-purple-500" />
            </div>
            <div className="mt-4">
              <span className="text-sm text-yellow-600 font-medium">
                Requieren atención
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <Card className="divide-y divide-gray-200">
          {[
            {
              action: 'Nuevo cliente registrado',
              details: 'Juan Pérez se registró en el sistema',
              time: 'Hace 5 minutos',
            },
            {
              action: 'Pedido completado',
              details: 'Pedido #12345 fue marcado como entregado',
              time: 'Hace 1 hora',
            },
            {
              action: 'Producto actualizado',
              details: 'Precio de "Laptop HP" fue modificado',
              time: 'Hace 2 horas',
            },
          ].map((activity, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.details}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
