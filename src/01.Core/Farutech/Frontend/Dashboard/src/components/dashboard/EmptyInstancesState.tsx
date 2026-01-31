import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Rocket, PlusCircle, Package, ArrowRight } from 'lucide-react';

interface EmptyInstancesStateProps {
  isOwner?: boolean;
  onCreateInstance?: ()
        => void;
}

export function EmptyInstancesState({ isOwner = false, onCreateInstance }: EmptyInstancesStateProps) {
  const navigate = useNavigate();

  const handleCreateInstance = ()
        => {
    if (onCreateInstance) {
      onCreateInstance();
    } else {
      navigate('/orchestrator/provisioning');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-12 text-center shadow-xl border-2">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              {isOwner ? (
                <Rocket className="h-12 w-12 text-primary" />
              ) : (
                <Package className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-4"
          >
            {isOwner ? '¡Bienvenido a Farutech!' : 'No hay aplicaciones activas'}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8 max-w-md mx-auto"
          >
            {isOwner
              ? 'Comienza tu viaje empresarial creando tu primera instancia de aplicación. Nuestro ecosistema está listo para potenciar tu negocio.'
              : 'No tienes acceso a ninguna instancia de aplicación en este momento. Contacta con el administrador de tu organización.'}
          </motion.p>

          {/* Features (solo para owners) */}
          {isOwner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              <div className="p-4 rounded-lg bg-muted/50">
                <PlusCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Fácil Configuración</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Módulos Integrados</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <Rocket className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Listo en Minutos</p>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          {isOwner && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                className="gradient-farutech text-white group"
                onClick={handleCreateInstance}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Crear Mi Primera Instancia
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <p className="mt-4 text-sm text-muted-foreground">
                Selecciona el módulo que necesitas y configúralo en segundos
              </p>
            </motion.div>
          )}

          {/* Help link for non-owners */}
          {!isOwner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <Button variant="outline" onClick={()
        => navigate('/settings')}>
                Ver Configuración
              </Button>
            </motion.div>
          )}
        </Card>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          ¿Necesitas ayuda? Visita nuestra{' '}
          <a href="#" className="text-primary hover:underline">
            documentación
          </a>{' '}
          o{' '}
          <a href="#" className="text-primary hover:underline">
            contacta soporte
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
