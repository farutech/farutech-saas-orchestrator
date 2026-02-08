// ============================================================================
// BREADCRUMB NAVIGATION - Auto-generating breadcrumb from route
// ============================================================================

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  homeHref?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
  className?: string;
  // Route label mapping for auto-generation
  routeLabels?: Record<string, string>;
}

// Default route labels (can be overridden via props)
const defaultRouteLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  settings: 'Configuración',
  profile: 'Perfil',
  users: 'Usuarios',
  customers: 'Clientes',
  products: 'Productos',
  orders: 'Pedidos',
  invoices: 'Facturas',
  reports: 'Reportes',
  catalog: 'Catálogo',
  provisioning: 'Provisioning',
  orchestrator: 'Administración',
  launcher: 'Inicio',
};

export function Breadcrumb({
  items,
  homeHref = '/launcher',
  showHome = true,
  separator,
  className,
  routeLabels = {},
}: BreadcrumbProps) {
  const location = useLocation();
  const mergedLabels = { ...defaultRouteLabels, ...routeLabels };

  // Auto-generate breadcrumbs from current route if items not provided
  const breadcrumbItems = React.useMemo(() => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const generated: BreadcrumbItem[] = [];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Skip numeric IDs or UUIDs in breadcrumb labels
      const isId = /^[0-9a-f-]{8,}$/i.test(segment);
      
      generated.push({
        label: isId ? 'Detalle' : (mergedLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)),
        href: isLast ? undefined : currentPath,
      });
    });

    return generated;
  }, [items, location.pathname, mergedLabels]);

  const SeparatorComponent = separator || (
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      {showHome && (
        <>
          <Link
            to={homeHref}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbItems.length > 0 && (
            <span className="flex items-center">{SeparatorComponent}</span>
          )}
        </>
      )}

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-foreground font-medium">
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}

            {!isLast && (
              <span className="flex items-center">{SeparatorComponent}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
