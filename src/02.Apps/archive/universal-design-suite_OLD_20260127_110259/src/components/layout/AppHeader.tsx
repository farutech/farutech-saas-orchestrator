// ============================================================================
// APP HEADER - Shared Header Component
// ============================================================================

import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Settings, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FarutechLogo } from '@/components/farutech/FarutechLogo';

interface AppHeaderProps {
  title?: string;
  showBackToLauncher?: boolean;
}

export function AppHeader({ title = "Universal Launcher", showBackToLauncher = false }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (user) {
      navigate('/launcher');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-16 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            to={user ? '/launcher' : '/login'} 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <FarutechLogo className="h-7 w-auto" />
          </Link>
          <span className="hidden md:inline-block text-slate-300 mx-2">|</span>
          <span className="hidden md:inline-block text-sm font-medium text-slate-500">{title}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full h-10 w-10 p-0 border border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                  <AvatarFallback className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white text-sm font-bold flex items-center justify-center">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">{user?.fullName}</p>
                  <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {showBackToLauncher && (
                <>
                  <DropdownMenuItem onClick={() => navigate('/launcher')} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Volver al Launcher</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4 text-slate-500" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/organizations')} className="cursor-pointer">
                <Building2 className="mr-2 h-4 w-4 text-slate-500" />
                <span>Administrar Organizaciones</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                <span>Preferencias</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
