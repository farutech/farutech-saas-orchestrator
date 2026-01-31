import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  LayoutGrid, 
  LogOut
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
    color: 'bg-medical-primary',
  },
  vet: {
    label: 'Veterinaria',
    icon: PawPrint,
    color: 'bg-vet-primary',
  },
};

const getNavItems = (industry: IndustryMode)
        => {
  const common = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { title: 'Reportes', icon: BarChart3, href: '/dashboard/reports' },
    { title: 'Calendario', icon: Calendar, href: '/dashboard/calendar' },
    { title: 'Configuración', icon: Settings, href: '/dashboard/settings' },
  ];

  const industrySpecific = {
    erp: [
      { title: 'Transacciones', icon: FileText, href: '/dashboard/transactions' },
      { title: 'Clientes', icon: Users, href: '/dashboard/clients' },
    ],
    health: [
      { title: 'Pacientes', icon: Users, href: '/dashboard/patients' },
      { title: 'Citas', icon: Calendar, href: '/dashboard/appointments' },
    ],
    vet: [
      { title: 'Mascotas', icon: PawPrint, href: '/dashboard/pets' },
      { title: 'Dueños', icon: Users, href: '/dashboard/owners' },
    ],
  };

  return [...common.slice(0, 1), ...industrySpecific[industry], ...common.slice(1)];
};

export function DashboardSidebar() {
  const { user, logout, selectContext } = useAuth();
  const navigate = useNavigate();
  // We keep industry context for module demo purposes, but in real app this depends on Tenant App Type
  const { industry, setIndustry } = useIndustry(); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navItems = getNavItems(industry);
  const IndustryIcon = industryConfig[industry].icon;

  const handleBackToHome = ()
        => {
    // Navigate to home. 
    // Ideally we might want to clear the 'current context' in state if needed, 
    // but navigating to /home usually resets the view.
    navigate('/home');
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 sticky top-0 border-r border-sidebar-border shadow-xl z-30",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header - Organization Context */}
      <div className="p-4 border-b border-sidebar-border bg-sidebar-accent/10">
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-inner ring-1 ring-white/10",
            industryConfig[industry].color
          )}>
            <IndustryIcon className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base truncate text-white tracking-wide">
                {user?.companyName || 'Organización'}
              </h1>
              <p className="text-xs text-sidebar-foreground/60 truncate flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Module Selector (Dev/Demo Mode) */}
      <div className="px-3 py-4">
        {!isCollapsed ? (
          <div className="space-y-1">
            <p className="px-2 text-xs font-medium text-sidebar-foreground/40 uppercase tracking-widest mb-2">Módulo</p>
            <Select value={industry} onValueChange={(value: IndustryMode)
        => setIndustry(value)}>
              <SelectTrigger className="w-full bg-sidebar-accent/50 border-sidebar-border/50 text-sidebar-foreground focus:ring-primary/50 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-sidebar border-sidebar-border text-sidebar-foreground">
                {(Object.keys(industryConfig) as IndustryMode[]).map((key)
        => {
                  const config = industryConfig[key];
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key} className="focus:bg-sidebar-accent focus:text-white">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        ) : (
             // Collapsed Icon Mode
             <div className="flex flex-col gap-2 border-b border-sidebar-border/30 pb-4 mb-2">
               {(Object.keys(industryConfig) as IndustryMode[]).map((key)
        => {
                 const config = industryConfig[key];
                 const Icon = config.icon;
                 return (
                   <Button
                     key={key}
                     variant={industry === key ? "secondary" : "ghost"}
                     size="icon"
                     className={cn(
                       "w-full h-10 transition-all", 
                       industry === key ? "bg-sidebar-primary text-white shadow-glow" : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-white"
                     )}
                     onClick={()
        => setIndustry(key)}
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
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item)
        => (
          <Button
            key={item.title}
            variant="ghost"
            onClick={()
        => navigate(item.href)}
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-white hover:bg-white/10 transition-all duration-200",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
          </Button>
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-sidebar-border bg-black/20 space-y-2">
        {/* Back to Home */}
        <Button
          onClick={handleBackToHome}
          variant="secondary"
          className={cn(
            "w-full justify-start gap-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-100 border border-indigo-500/30 transition-all group",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LayoutGrid className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span>Volver al Home</span>}
        </Button>

        {/* User / Logout */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-400/10",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>Cerrar Sesión</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" forceMount>
                 <DropdownMenuItem onClick={logout} className="text-red-500 focus:bg-red-50">
                    Confirmar Salida
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-sidebar-foreground/40 hover:text-white h-6 mt-2"
          onClick={()
        => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
