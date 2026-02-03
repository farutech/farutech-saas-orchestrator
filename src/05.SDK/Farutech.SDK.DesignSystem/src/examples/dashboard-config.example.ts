// ============================================================================
// EJEMPLO DE CONFIGURACIÓN - Dashboard ERP
// ============================================================================

import { Dashboard } from '@farutech/design-system';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  BarChart3,
  Package,
  Calendar,
  MessageSquare,
  HelpCircle,
  Briefcase,
  CreditCard,
  TrendingUp
} from 'lucide-react';

// Componentes de módulos (simulados - en la realidad serían imports dinámicos)
const TransactionsModule = () => <div>Transactions Module Content</div>;
const ClientsModule = () => <div>Clients Module Content</div>;
const ReportsModule = () => <div>Reports Module Content</div>;
const InventoryModule = () => <div>Inventory Module Content</div>;

// Configuración del Dashboard ERP
export const erpDashboardConfig = {
  industry: 'erp' as const,
  title: 'Farutech ERP',
  layout: 'sidebar' as const,
  showBreadcrumb: true,
  showSearch: true,
  theme: 'auto' as const,

  // Módulos disponibles (carga dinámica)
  modules: [
    {
      id: 'transactions',
      name: 'Transacciones',
      icon: CreditCard,
      path: '/transactions',
      component: TransactionsModule,
      permissions: ['transactions.read'],
      industry: ['erp'],
      badge: 'Nuevo',
      description: 'Gestión de transacciones financieras'
    },
    {
      id: 'clients',
      name: 'Clientes',
      icon: Users,
      path: '/clients',
      component: ClientsModule,
      permissions: ['clients.read'],
      industry: ['erp'],
      description: 'Administración de clientes y contactos'
    },
    {
      id: 'reports',
      name: 'Reportes',
      icon: BarChart3,
      path: '/reports',
      component: ReportsModule,
      permissions: ['reports.read'],
      industry: ['erp'],
      description: 'Análisis y reportes financieros'
    },
    {
      id: 'inventory',
      name: 'Inventario',
      icon: Package,
      path: '/inventory',
      component: InventoryModule,
      permissions: ['inventory.read'],
      industry: ['erp'],
      description: 'Control de stock y productos'
    }
  ],

  // Navegación estructurada por secciones
  navigation: [
    {
      id: 'main',
      label: 'Principal',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard
        },
        {
          id: 'analytics',
          label: 'Analytics',
          href: '/analytics',
          icon: TrendingUp,
          badge: 'Pro'
        }
      ]
    },
    {
      id: 'business',
      label: 'Negocios',
      items: [
        {
          id: 'transactions',
          label: 'Transacciones',
          href: '/transactions',
          icon: CreditCard
        },
        {
          id: 'clients',
          label: 'Clientes',
          href: '/clients',
          icon: Users
        },
        {
          id: 'inventory',
          label: 'Inventario',
          href: '/inventory',
          icon: Package
        }
      ]
    },
    {
      id: 'reports',
      label: 'Reportes',
      items: [
        {
          id: 'financial',
          label: 'Financieros',
          href: '/reports/financial',
          icon: BarChart3
        },
        {
          id: 'operational',
          label: 'Operativos',
          href: '/reports/operational',
          icon: FileText
        }
      ]
    },
    {
      id: 'system',
      label: 'Sistema',
      items: [
        {
          id: 'settings',
          label: 'Configuración',
          href: '/settings',
          icon: Settings
        },
        {
          id: 'help',
          label: 'Ayuda',
          href: '/help',
          icon: HelpCircle
        }
      ]
    }
  ]
};

// ============================================================================
// EJEMPLO DE USO EN UNA APLICACIÓN
// ============================================================================

// App.tsx - Uso básico
import React from 'react';
import { Dashboard } from '@farutech/design-system';
import { erpDashboardConfig } from './config/dashboard.config';

function App() {
  return (
    <Dashboard config={erpDashboardConfig}>
      {/* El contenido se renderiza automáticamente basado en la navegación */}
    </Dashboard>
  );
}

// AppAdvanced.tsx - Uso avanzado con customización
import React from 'react';
import { Dashboard, ModuleSelector } from '@farutech/design-system';
import { Button } from '@farutech/design-system';
import { erpDashboardConfig } from './config/dashboard.config';

function AppAdvanced() {
  const [selectedModule, setSelectedModule] = React.useState(null);

  return (
    <Dashboard config={erpDashboardConfig}>
      <Dashboard.Header
        title="ERP Personalizado"
        actions={
          <div className="flex items-center gap-2">
            <ModuleSelector
              modules={erpDashboardConfig.modules}
              currentModule={selectedModule}
              onModuleChange={setSelectedModule}
              placeholder="Seleccionar módulo..."
              className="w-64"
            />
            <Button>Nueva Transacción</Button>
          </div>
        }
      />

      <Dashboard.Content>
        {selectedModule ? (
          <selectedModule.component />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Bienvenido al ERP</h2>
            <p className="text-muted-foreground mb-6">
              Selecciona un módulo para comenzar
            </p>
            <ModuleSelector
              modules={erpDashboardConfig.modules}
              currentModule={selectedModule}
              onModuleChange={setSelectedModule}
              placeholder="Seleccionar módulo..."
              className="w-80 mx-auto"
            />
          </div>
        )}
      </Dashboard.Content>
    </Dashboard>
  );
}

// ============================================================================
// CONFIGURACIÓN PARA DIFERENTES INDUSTRIAS
// ============================================================================

// Dashboard Health
export const healthDashboardConfig = {
  ...erpDashboardConfig,
  industry: 'health' as const,
  title: 'Farutech Health',
  modules: [
    {
      id: 'patients',
      name: 'Pacientes',
      icon: Users,
      path: '/patients',
      component: () => <div>Patients Module</div>,
      industry: ['health'],
      description: 'Gestión de pacientes y historias clínicas'
    },
    // ... más módulos específicos de salud
  ]
};

// Dashboard Veterinary
export const vetDashboardConfig = {
  ...erpDashboardConfig,
  industry: 'vet' as const,
  title: 'Farutech Vet',
  modules: [
    {
      id: 'pets',
      name: 'Mascotas',
      icon: Package, // Usar un icono más apropiado
      path: '/pets',
      component: () => <div>Pets Module</div>,
      industry: ['vet'],
      description: 'Gestión de mascotas y dueños'
    },
    // ... más módulos específicos veterinarios
  ]
};

// ============================================================================
// EJEMPLO DE INTEGRACIÓN CON EXISTING DASHBOARDS
// ============================================================================

// Migración del Dashboard Core existente
import { DashboardLayout } from '@/components/layout/DashboardLayout'; // Antiguo
import { Dashboard } from '@farutech/design-system'; // Nuevo

// Antes (Dashboard Core)
function OldDashboardCore() {
  return (
    <DashboardLayout>
      <HomePage />
    </DashboardLayout>
  );
}

// Después (Dashboard Core migrado)
function NewDashboardCore() {
  return (
    <Dashboard config={erpDashboardConfig}>
      <HomePage />
    </Dashboard>
  );
}

// Migración del Dashboard Apps existente
import { UniversalDashboardLayout } from '@/components/layout/UniversalDashboardLayout'; // Antiguo

// Antes (Dashboard Apps)
function OldDashboardApps() {
  return (
    <UniversalDashboardLayout
      sidebarSections={navigationSections}
      showBreadcrumb={true}
    >
      <AppContent />
    </UniversalDashboardLayout>
  );
}

// Después (Dashboard Apps migrado)
function NewDashboardApps() {
  return (
    <Dashboard config={appDashboardConfig}>
      <AppContent />
    </Dashboard>
  );
}

export {
  erpDashboardConfig,
  healthDashboardConfig,
  vetDashboardConfig
};