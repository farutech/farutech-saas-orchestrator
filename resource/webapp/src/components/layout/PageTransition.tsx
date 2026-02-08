/**
 * PageTransition - Componente para transiciones suaves entre páginas
 * 
 * Envuelve el contenido de cada página para agregar animaciones de entrada/salida
 * Funciona en conjunto con ContentSuspense para experiencia fluida
 */

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  /**
   * Variant de animación
   * - 'fade': Solo fade in/out
   * - 'slide': Slide desde la derecha + fade
   * - 'scale': Scale up + fade (más dramático)
   */
  variant?: 'fade' | 'slide' | 'scale'
  /**
   * Duración de la animación en segundos
   */
  duration?: number
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
}

/**
 * Wrapper para transiciones suaves de contenido
 * 
 * @example
 * // En tu página
 * export function UsersPage() {
 *   return (
 *     <PageTransition variant="slide">
 *       <div>Contenido de usuarios...</div>
 *     </PageTransition>
 *   )
 * }
 */
export function PageTransition({ 
  children, 
  variant = 'fade',
  duration = 0.3,
}: PageTransitionProps) {
  return (
    <motion.div
      initial={variants[variant].initial}
      animate={variants[variant].animate}
      exit={variants[variant].exit}
      transition={{ 
        duration,
        ease: 'easeInOut',
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
