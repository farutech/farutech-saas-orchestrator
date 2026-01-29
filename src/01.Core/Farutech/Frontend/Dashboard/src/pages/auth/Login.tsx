import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { FarutechLogo } from '@/components/farutech/FarutechLogo';
import { GlobalLoader } from '@/components/farutech/GlobalLoader';
import { CorsErrorAlert } from '@/components/farutech/CorsErrorAlert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showCorsError, setShowCorsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowCorsError(false);
    try {
      await login({ email, password, rememberMe });
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      // Detectar error 405 o Network Error (CORS)
      if (error?.status === 405 || error?.message?.includes('CORS') || error?.message?.includes('Network Error')) {
        setShowCorsError(true);
      }
    }
  };

  return (
    <>
      <GlobalLoader />
      
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        {/* Centered Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-10">
              {/* Logo */}
              <div className="mb-8 text-center flex flex-col items-center">
                <FarutechLogo size="lg" className="justify-center mb-4" />
              </div>

              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Iniciar Sesión</h2>
                <p className="text-slate-500 mt-2">
                  Ingresa tus credenciales para acceder al sistema
                </p>
              </div>

              {/* Alerta de error CORS */}
              {showCorsError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                <CorsErrorAlert />
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Recordarme
                  </Label>
                </div>
                <Link 
                  to="/auth/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-farutech text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </CardContent>
          </Card>
          
          <div className="mt-8 text-center text-xs text-slate-400">
             <p>© 2026 Farutech Ecosistema Empresarial v1.0.0</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
