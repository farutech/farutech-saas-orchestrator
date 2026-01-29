import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFarutech } from '@/contexts/FarutechContext';
import { FarutechLogo } from '@/components/farutech/FarutechLogo';
import { GlobalLoader } from '@/components/farutech/GlobalLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { ModuleType, moduleConfigs } from '@/types/farutech';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  LogOut,
  Stethoscope,
  PawPrint,
  Building2,
  ShoppingCart,
  LayoutGrid,
  ChevronDown,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  PawPrint,
  Building2,
  ShoppingCart,
};

interface DashboardHeaderProps {
  children?: React.ReactNode;
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { 
    currentModule, 
    setCurrentModule,
    user, 
    isDark, 
    toggleTheme, 
    logout,
    notifications,
    unreadCount,
    markAsRead
  } = useFarutech();

  const [commandOpen, setCommandOpen] = useState(false);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleModuleSwitch = (module: ModuleType) => {
    setCurrentModule(module);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToHome = () => {
    setCurrentModule(null);
    navigate('/');
  };

  const CurrentIcon = currentModule ? iconMap[moduleConfigs[currentModule].icon] : LayoutGrid;

  return (
    <>
      <GlobalLoader />
      
      <header className="h-16 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        {/* Left: Logo + Module Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackToHome}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <FarutechLogo size="sm" showText={false} />
            <span className="font-bold text-lg hidden sm:inline">Farutech</span>
          </button>
          
          {currentModule && (
            <>
              <span className="text-muted-foreground hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <CurrentIcon className="h-5 w-5 text-primary" />
                <span className="font-medium hidden sm:inline">
                  {moduleConfigs[currentModule].name}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground bg-muted/50 border-0"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Buscar...
            <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Module Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden lg:inline">Módulos</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Cambiar Módulo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.values(moduleConfigs).map((config) => {
                const Icon = iconMap[config.icon];
                return (
                  <DropdownMenuItem
                    key={config.id}
                    onClick={() => handleModuleSwitch(config.id)}
                    className={cn(
                      "gap-2",
                      currentModule === config.id && "bg-primary/10"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {config.name}
                    {currentModule === config.id && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        Activo
                      </Badge>
                    )}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleBackToHome} className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Ver todos los módulos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No hay notificaciones
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <span className="font-medium text-sm">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.message}</span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 ml-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline font-medium">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Command Palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Buscar módulos, acciones, configuración..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup heading="Módulos">
            {Object.values(moduleConfigs).map((config) => {
              const Icon = iconMap[config.icon];
              return (
                <CommandItem
                  key={config.id}
                  onSelect={() => {
                    handleModuleSwitch(config.id);
                    setCommandOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {config.name}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Acciones">
            <CommandItem onSelect={() => { navigate('/settings'); setCommandOpen(false); }}>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </CommandItem>
            <CommandItem onSelect={() => { handleBackToHome(); setCommandOpen(false); }}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Ir al Home
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {children}
    </>
  );
}
