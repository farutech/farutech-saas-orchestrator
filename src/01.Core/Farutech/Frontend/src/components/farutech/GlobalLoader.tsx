import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import { useFarutech } from '@/contexts/FarutechContext';
import { moduleConfigs } from '@/types/farutech';

interface GlobalLoaderProps {
  fullScreen?: boolean;
}

export function GlobalLoader({ fullScreen = true }: GlobalLoaderProps) {
  const { currentModule, isLoading } = useFarutech();
  
  if (!isLoading) return null;

  const moduleColor = currentModule 
    ? moduleConfigs[currentModule].primaryColor 
    : 'hsl(250 89% 60%)';

  const Container = fullScreen ? 'div' : 'div';
  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'
    : 'flex items-center justify-center p-8';

  return (
    <Container className={containerClasses}>
      <div className="relative flex flex-col items-center gap-4">
        {/* Pulsing ring */}
        <div className="absolute">
          <motion.div
            className="rounded-full"
            style={{ 
              width: 100, 
              height: 100,
              border: `3px solid ${moduleColor}`,
            }}
            animate={{
              scale: [1, 1.4],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </div>

        {/* Breathing logo */}
        <motion.div
          className="relative z-10"
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <Hexagon 
              size={64} 
              style={{ color: moduleColor }}
              className="fill-current/20"
              strokeWidth={1.5}
            />
            <span 
              className="absolute inset-0 flex items-center justify-center font-bold text-2xl"
              style={{ color: moduleColor }}
            >
              F
            </span>
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.p
          className="text-muted-foreground text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Cargando...
        </motion.p>
      </div>
    </Container>
  );
}
