import { useState } from 'react';
import { useIndustry } from '@/contexts/IndustryContext';
import { IndustryMode } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Briefcase,
  Stethoscope,
  PawPrint,
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const industryConfig = {
  erp: {
    label: 'ERP / Negocios',
    icon: Briefcase,
    color: 'bg-erp-primary',
  },
  health: {
    label: 'Salud / Médico',
    icon: Stethoscope,
    color: 'bg-health-primary',
  },
  vet: {
    label: 'Veterinaria',
    icon: PawPrint,
    color: 'bg-vet-primary',
  },
};

const getNavItems = (industry: IndustryMode) => {
  const common = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { title: 'Reportes', icon: BarChart3, href: '/reports' },
    { title: 'Calendario', icon: Calendar, href: '/calendar' },
    { title: 'Configuración', icon: Settings, href: '/settings' },
  ];

  const industrySpecific = {
    erp: [
      { title: 'Transacciones', icon: FileText, href: '/transactions' },
      { title: 'Clientes', icon: Users, href: '/clients' },
    ],
    health: [
      { title: 'Pacientes', icon: Users, href: '/patients' },
      { title: 'Citas', icon: Calendar, href: '/appointments' },
    ],
    vet: [
      { title: 'Mascotas', icon: PawPrint, href: '/pets' },
      { title: 'Dueños', icon: Users, href: '/owners' },
    ],
  };

  return [...common.slice(0, 1), ...industrySpecific[industry], ...common.slice(1)];
};

export function DashboardSidebar() {
  const { industry, setIndustry } = useIndustry();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navItems = getNavItems(industry);
  const IndustryIcon = industryConfig[industry].icon;

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 sticky top-0",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
            industryConfig[industry].color
          )}>
            <IndustryIcon className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg truncate">Dashboard</h1>
              <p className="text-xs text-sidebar-foreground/60 truncate">Multi-Industria</p>
            </div>
          )}
        </div>
      </div>

      {/* Industry Selector */}
      <div className="p-4">
        {!isCollapsed ? (
          <Select value={industry} onValueChange={(value: IndustryMode) => setIndustry(value)}>
            <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {(Object.keys(industryConfig) as IndustryMode[]).map((key) => {
                const config = industryConfig[key];
                const Icon = config.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex flex-col gap-2">
            {(Object.keys(industryConfig) as IndustryMode[]).map((key) => {
              const config = industryConfig[key];
              const Icon = config.icon;
              return (
                <Button
                  key={key}
                  variant={industry === key ? "secondary" : "ghost"}
                  size="icon"
                  className="w-full"
                  onClick={() => setIndustry(key)}
                  title={config.label}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.title}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.title}</span>}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Bell className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Notificaciones</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            isCollapsed && "justify-center px-2"
          )}
        >
          <HelpCircle className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Ayuda</span>}
        </Button>
      </div>

      {/* Collapse Button */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="icon"
          className="w-full text-sidebar-foreground/60 hover:text-sidebar-foreground"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
}
