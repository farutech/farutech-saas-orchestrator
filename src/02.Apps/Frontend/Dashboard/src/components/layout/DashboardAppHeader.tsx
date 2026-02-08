// ============================================================================
// APP HEADER WRAPPER - Dashboard Integration
// ============================================================================
// Wrapper del AppHeader del Design System integrado con Dashboard

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeader, Notification, UserInfo } from '@farutech/design-system';
import { useAuthStore } from '../../store/authStore';
import { useFarutech } from '../../contexts/FarutechContext';

// Define BreadcrumbItem locally to match AppHeader expected type
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const DashboardAppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const { currentModule } = useFarutech();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Build breadcrumbs from current route
  const breadcrumbs: BreadcrumbItem[] = React.useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/launcher' }];

    if (currentModule) {
      items.push({ label: getModuleName(currentModule) });
    }

    // Add route-specific breadcrumbs
    if (paths.includes('orchestrator')) {
      items.push({ label: 'Orchestrator', href: '/orchestrator' });
      if (paths.includes('catalog')) items.push({ label: 'Catalog' });
      if (paths.includes('customers')) items.push({ label: 'Customers' });
      if (paths.includes('provisioning')) items.push({ label: 'Provisioning' });
    } else if (paths.includes('app')) {
      items.push({ label: 'Apps', href: '/app-launcher' });
      if (paths.includes('dashboard')) items.push({ label: 'Dashboard' });
      if (paths.includes('design-system')) items.push({ label: 'Design System' });
    } else if (paths.includes('settings')) {
      items.push({ label: 'Settings' });
    } else if (paths.includes('profile')) {
      items.push({ label: 'Profile' });
    }

    return items;
  }, [location.pathname, currentModule]);

  // Mock notifications (replace with real data)
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'success',
      title: 'Tenant provisionado',
      message: 'El tenant "Acme Corp" ha sido provisionado exitosamente',
      time: 'Hace 5 minutos',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Migración pendiente',
      message: 'Tienes 3 migraciones de base de datos pendientes',
      time: 'Hace 1 hora',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'Nueva actualización',
      message: 'Version 2.1.0 disponible con nuevas funcionalidades',
      time: 'Hace 2 horas',
      read: true,
    },
  ];

  // User info from store
  const userInfo: UserInfo = {
    name: user?.fullName || user?.email || 'Usuario',
    email: user?.email || 'usuario@ejemplo.com',
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    // TODO: Integrate with theme context
  };

  const handleOpenSearch = () => {
    // TODO: Implement search modal
    console.log('Open search modal');
  };

  return (
    <AppHeader
      breadcrumbs={breadcrumbs}
      user={userInfo}
      notifications={notifications}
      theme={theme}
      onToggleSidebar={() => {
        // TODO: Integrate with sidebar store if exists
      }}
      onToggleTheme={handleToggleTheme}
      onOpenSearch={handleOpenSearch}
      onLogout={handleLogout}
      onGoToProfile={() => navigate('/profile')}
      onGoToSettings={() => navigate('/settings')}
    />
  );
};

// Helper function to get module display name
function getModuleName(module: string): string {
  const names: Record<string, string> = {
    erp: 'ERP',
    medical: 'Healthcare',
    vet: 'Veterinary',
    pos: 'POS',
  };
  return names[module] || module.toUpperCase();
}
