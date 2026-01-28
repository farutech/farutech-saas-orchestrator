import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FarutechLogo } from '@/components/farutech/FarutechLogo';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const userId = searchParams.get('userId');
      const code = searchParams.get('code');

      if (!userId || !code) {
        setStatus('error');
        setMessage('El enlace de confirmación es inválido');
        return;
      }

      try {
        const result = await authService.confirmEmail(userId, code);
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message);
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        setStatus('error');
        setMessage(err.message || 'Error al confirmar el email');
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-farutech relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <FarutechLogo size="xl" showText={false} className="justify-center mb-8" />
            <h1 className="text-5xl font-bold mb-4">Confirmación de Email</h1>
            <p className="text-xl text-white/80">Estamos verificando tu cuenta</p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md text-center space-y-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden">
            <FarutechLogo size="lg" className="justify-center" />
          </div>

          {/* Loading State */}
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Confirmando tu email...</h2>
                <p className="text-muted-foreground">
                  Por favor espera mientras verificamos tu cuenta
                </p>
              </div>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">¡Email Confirmado!</h2>
                <p className="text-muted-foreground">{message}</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full gradient-farutech text-white"
                >
                  Ir al Login
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Ya puedes iniciar sesión con tus credenciales
                </p>
              </div>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto"
              >
                <XCircle className="w-12 h-12 text-red-500" />
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Error de Confirmación</h2>
                <p className="text-muted-foreground">{message}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  El enlace de confirmación es inválido o ha expirado
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="flex-1"
                  >
                    Ir al Login
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="flex-1 gradient-farutech text-white"
                  >
                    Registrarse de Nuevo
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Help Link */}
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda?{' '}
            <Link to="/contact" className="text-primary font-medium hover:underline">
              Contacta con soporte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
