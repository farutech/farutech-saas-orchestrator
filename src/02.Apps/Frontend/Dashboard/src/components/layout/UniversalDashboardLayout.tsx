// ============================================================================
// UNIVERSAL DASHBOARD LAYOUT - Main layout wrapper
// ============================================================================

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UniversalSidebar, SidebarSection } from './UniversalSidebar';
import { UniversalTopbar, TopbarUser, TopbarNotification } from './UniversalTopbar';
import { Breadcrumb } from '@/components/design-system/Breadcrumb';
import { FarutechLogo } from '@/components/farutech/FarutechLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
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
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface UniversalDashboardLayoutProps {
  children: React.ReactNode;
  sidebarSections?: SidebarSection[];
  showBreadcrumb?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  headerActions?: React.ReactNode;
  className?: string;
}

// ============================================================================
// Default Navigation (can be overridden via props)
// ============================================================================

const defaultSidebarSections: SidebarSection[] = [
  {
    id: 'main',
    label: 'Principal',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { id: 'calendar', label: 'Calendario', href: '/app/calendar', icon: Calendar },
      { id: 'messages', label: 'Mensajes', href: '/app/messages', icon: MessageSquare, badge: 3 },
    ],
  },
  {
    id: 'management',
    label: 'Gestión',
    items: [
      { id: 'customers', label: 'Clientes', href: '/app/customers', icon: Users },
      { id: 'products', label: 'Productos', href: '/app/products', icon: Package },
      { id: 'orders', label: 'Pedidos', href: '/app/orders', icon: ShoppingCart },
      { id: 'invoices', label: 'Facturas', href: '/app/invoices', icon: FileText },
    ],
  },
  {
    id: 'analytics',
    label: 'Análisis',
    items: [
      { id: 'reports', label: 'Reportes', href: '/app/reports', icon: BarChart3 },
    ],
  },
  {
    id: 'system',
    label: 'Sistema',
    items: [
      { id: 'settings', label: 'Configuración', href: '/settings', icon: Settings, dividerBefore: true },
      { id: 'help', label: 'Ayuda', href: '/app/help', icon: HelpCircle },
    ],
  },
];

// ============================================================================
// Mock notifications (replace with real data)
// ============================================================================

const mockNotifications: TopbarNotification[] = [
  {
    id: '1',
    title: 'Nuevo pedido',
    message: 'Se ha recibido un nuevo pedido #1234',
    time: 'Hace 5 min',
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Pago confirmado',
    message: 'El pago de la factura #5678 ha sido confirmado',
    time: 'Hace 1 hora',
    read: false,
    type: 'success',
  },
  {
    id: '3',
    title: 'Stock bajo',
    message: 'El producto "Widget A" tiene stock bajo',
    time: 'Hace 3 horas',
    read: true,
    type: 'warning',
  },
];

// ============================================================================
// Component
// ============================================================================

export function UniversalDashboardLayout({
  children,
  sidebarSections = defaultSidebarSections,
  showBreadcrumb = true,
  pageTitle,
  pageDescription,
  headerActions,
  className,
}: UniversalDashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const { user, logout, hasRole } = useAuth();
  const { getThemeInfo, appTheme } = useTheme();

  const currentTheme = getThemeInfo(appTheme);

  // Convert auth user to topbar user format
  const topbarUser: TopbarUser | null = user
    ? {
        name: user.fullName || user.email,
        email: user.email,
        role: user.role,
      }
    : null;

  const handleNotificationClick = (notification: TopbarNotification) => {
    console.log('Notification clicked:', notification);
  };

  const handleMarkAllRead = () => {
    console.log('Mark all notifications as read');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <UniversalSidebar
        sections={sidebarSections}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        logo={<FarutechLogo size="sm" showText={!sidebarCollapsed} />}
        hasPermission={(permission) => {
          // Implement permission checking logic
          return true;
        }}
        footer={
          <div className="text-xs text-muted-foreground">
            <p>Farutech v1.0.0</p>
            <p className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: currentTheme.primaryColor }}
              />
              {currentTheme.name}
            </p>
          </div>
        }
      />

      {/* Topbar */}
      <UniversalTopbar
        user={topbarUser}
        notifications={mockNotifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={handleMarkAllRead}
        onLogout={logout}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main content */}
      <main
        className={cn(
          'min-h-[calc(100vh-4rem)] transition-[padding] duration-200',
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn('p-6', className)}
        >
          {/* Page header */}
          {(showBreadcrumb || pageTitle || headerActions) && (
            <div className="mb-6 space-y-4">
              {showBreadcrumb && <Breadcrumb />}
              
              {(pageTitle || headerActions) && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    {pageTitle && (
                      <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
                    )}
                    {pageDescription && (
                      <p className="text-muted-foreground">{pageDescription}</p>
                    )}
                  </div>
                  
                  {headerActions && (
                    <div className="flex items-center gap-2">{headerActions}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Page content */}
          {children}
        </motion.div>
      </main>
    </div>
  );
}
