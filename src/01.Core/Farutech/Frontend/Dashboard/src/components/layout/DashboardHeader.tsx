import { useIndustry } from '@/contexts/IndustryContext';
import { useAuth } from '@/contexts/AuthContext';
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
import { Search, Bell, Moon, Sun, User as UserIcon, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(()
        => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const userInitials = user?.fullName 
    ? user.fullName.split(' ').map((n: string)
        => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search - Global */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative hidden md:block w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar en todo..." 
            className="w-full pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={()
        => setIsDark(!isDark)}
          className="text-slate-500 hover:text-slate-900"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:text-slate-900"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 ml-2 pl-0 hover:bg-transparent">
              <Avatar className="h-8 w-8 border border-slate-200">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-sm">
                 <span className="font-semibold text-slate-700 leading-none">{user?.fullName || 'Usuario'}</span>
                 <span className="text-xs text-slate-500 leading-none mt-1">{user?.email || ''}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
