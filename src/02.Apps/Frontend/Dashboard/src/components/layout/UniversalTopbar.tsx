// ============================================================================
// UNIVERSAL TOPBAR - Configurable header with search, notifications, profile
// ============================================================================

import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Monitor,
  Palette,
  ChevronDown,
  Command,
  X,
  Check,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface TopbarNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface TopbarUser {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface UniversalTopbarProps {
  user?: TopbarUser | null;
  notifications?: TopbarNotification[];
  onNotificationClick?: (notification: TopbarNotification) => void;
  onMarkAllRead?: () => void;
  onLogout?: () => void;
  showSearch?: boolean;
  showThemeSwitcher?: boolean;
  showAppSwitcher?: boolean;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  sidebarCollapsed?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function UniversalTopbar({
  user,
  notifications = [],
  onNotificationClick,
  onMarkAllRead,
  onLogout,
  showSearch = true,
  showThemeSwitcher = true,
  showAppSwitcher = true,
  leftContent,
  rightContent,
  className,
  sidebarCollapsed = false,
}: UniversalTopbarProps) {
  const { appTheme, setAppTheme, colorMode, setColorMode, isDark, availableThemes, getThemeInfo } = useTheme();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentTheme = getThemeInfo(appTheme);

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        sidebarCollapsed ? 'pl-20' : 'pl-64',
        'transition-[padding] duration-200',
        className
      )}
    >
      <div className="flex flex-1 items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {leftContent}
          
          {/* Search trigger */}
          {showSearch && (
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2 text-muted-foreground w-64"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Buscar...</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {rightContent}

          {/* App/Theme Switcher */}
          {showAppSwitcher && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: currentTheme.primaryColor }}
                  />
                  <span className="hidden sm:inline">{currentTheme.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Aplicación</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableThemes.map((theme) => (
                  <DropdownMenuItem
                    key={theme.id}
                    onClick={() => setAppTheme(theme.id)}
                    className="gap-2"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <span className="flex-1">{theme.name}</span>
                    {appTheme === theme.id && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Theme mode switcher */}
          {showThemeSwitcher && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isDark ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setColorMode('light')} className="gap-2">
                  <Sun className="h-4 w-4" />
                  <span>Claro</span>
                  {colorMode === 'light' && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorMode('dark')} className="gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Oscuro</span>
                  {colorMode === 'dark' && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorMode('system')} className="gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>Sistema</span>
                  {colorMode === 'system' && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h4 className="font-semibold">Notificaciones</h4>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={onMarkAllRead}
                  >
                    Marcar todo leído
                  </Button>
                )}
              </div>
              <ScrollArea className="h-72">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Sin notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        className={cn(
                          'w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors',
                          !notification.read && 'bg-primary/5'
                        )}
                        onClick={() => onNotificationClick?.(notification)}
                      >
                        <div className="flex items-start gap-2">
                          {!notification.read && (
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-sm">
                    <span className="font-medium">{user.name}</span>
                    {user.role && (
                      <span className="text-xs text-muted-foreground">{user.role}</span>
                    )}
                  </div>
                  <ChevronDown className="h-3 w-3 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="gap-2">
                    <User className="h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-lg border bg-background shadow-lg">
                <div className="flex items-center border-b px-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en toda la aplicación..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Escribe para buscar...
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
