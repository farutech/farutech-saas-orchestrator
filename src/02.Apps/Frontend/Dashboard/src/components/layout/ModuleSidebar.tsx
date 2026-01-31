import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFarutech } from '@/contexts/FarutechContext';
import { moduleConfigs } from '@/types/farutech';
import { cn } from '@/lib/utils';
import {
  Users,
  Calendar,
  ClipboardList,
  Package,
  DollarSign,
  BarChart3,
  FileText,
  Settings,
  Home,
  Syringe,
  Scissors,
  PawPrint,
  CreditCard,
  Receipt,
  Warehouse,
  TrendingUp,
  UserPlus,
  LucideIcon
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const moduleNavItems: Record<string, NavItem[]> = {
  medical: [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Pacientes', icon: Users, href: '/dashboard/patients' },
    { label: 'Citas', icon: Calendar, href: '/dashboard/appointments' },
    { label: 'Expedientes', icon: ClipboardList, href: '/dashboard/records' },
    { label: 'Inventario', icon: Package, href: '/dashboard/inventory' },
    { label: 'Facturación', icon: DollarSign, href: '/dashboard/billing' },
    { label: 'Reportes', icon: BarChart3, href: '/dashboard/reports' },
  ],
  vet: [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Mascotas', icon: PawPrint, href: '/dashboard/pets' },
    { label: 'Dueños', icon: Users, href: '/dashboard/owners' },
    { label: 'Vacunas', icon: Syringe, href: '/dashboard/vaccines' },
    { label: 'Peluquería', icon: Scissors, href: '/dashboard/grooming' },
    { label: 'Inventario', icon: Package, href: '/dashboard/inventory' },
    { label: 'Reportes', icon: BarChart3, href: '/dashboard/reports' },
  ],
  erp: [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Clientes', icon: Users, href: '/dashboard/clients' },
    { label: 'Proveedores', icon: UserPlus, href: '/dashboard/suppliers' },
    { label: 'Inventario', icon: Warehouse, href: '/dashboard/inventory' },
    { label: 'Finanzas', icon: TrendingUp, href: '/dashboard/finances' },
    { label: 'Facturas', icon: FileText, href: '/dashboard/invoices' },
    { label: 'Reportes', icon: BarChart3, href: '/dashboard/reports' },
  ],
  pos: [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Ventas', icon: CreditCard, href: '/dashboard/sales' },
    { label: 'Productos', icon: Package, href: '/dashboard/products' },
    { label: 'Clientes', icon: Users, href: '/dashboard/customers' },
    { label: 'Recibos', icon: Receipt, href: '/dashboard/receipts' },
    { label: 'Caja', icon: DollarSign, href: '/dashboard/cash-register' },
    { label: 'Reportes', icon: BarChart3, href: '/dashboard/reports' },
  ],
};

export function ModuleSidebar() {
  const location = useLocation();
  const { currentModule } = useFarutech();

  if (!currentModule) return null;

  const navItems = moduleNavItems[currentModule] || [];
  const moduleConfig = moduleConfigs[currentModule];

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-card border-r border-border hidden lg:block">
      {/* Module Header with gradient */}
      <div className={cn("p-4 bg-gradient-subtle border-b border-border")}>
        <h2 className="font-semibold text-sm text-primary">
          Navegación {moduleConfig.name}
        </h2>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                  "transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom settings */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "transition-all duration-200"
          )}
        >
          <Settings className="h-4 w-4" />
          Configuración
        </NavLink>
      </div>
    </aside>
  );
}
