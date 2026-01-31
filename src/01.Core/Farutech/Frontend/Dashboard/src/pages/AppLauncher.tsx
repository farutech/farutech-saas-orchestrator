import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFarutech } from '@/contexts/FarutechContext';
import { FarutechLogo } from '@/components/farutech/FarutechLogo';
import { ModuleCard } from '@/components/farutech/ModuleCard';
import { GlobalLoader } from '@/components/farutech/GlobalLoader';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModuleType, moduleConfigs } from '@/types/farutech';
import { Moon, Sun, User, Settings, LogOut } from 'lucide-react';

export default function AppHome() {
  const navigate = useNavigate();
  const { 
    setCurrentModule, 
    user, 
    isDark, 
    toggleTheme, 
    logout,
    isLoading 
  } = useFarutech();

  const handleModuleSelect = (module: ModuleType)
        => {
    setCurrentModule(module);
    setTimeout(()
        => {
      navigate('/dashboard');
    }, 500);
  };

  const handleLogout = ()
        => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <GlobalLoader />
      
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary/5 to-transparent blur-3xl" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <FarutechLogo size="md" animated />

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()
        => navigate('/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()
        => navigate('/settings')}>
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
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bienvenido a{' '}
              <span className="gradient-farutech bg-clip-text text-transparent">
                Farutech
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selecciona el módulo con el que deseas trabajar. Tu ecosistema empresarial 
              integrado te espera.
            </p>
          </motion.div>

          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Object.values(moduleConfigs).map((config, index)
        => (
              <ModuleCard
                key={config.id}
                config={config}
                onClick={handleModuleSelect}
                index={index}
              />
            ))}
          </div>

          {/* Stats/Footer info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Sistema Empresarial Integrado • Versión 1.0.0
            </p>
          </motion.div>
        </main>
      </div>
    </>
  );
}
