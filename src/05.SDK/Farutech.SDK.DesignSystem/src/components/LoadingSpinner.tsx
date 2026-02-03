import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullScreen?: boolean;
  /**
   * When true, uses a 3D vortex/coin-like spin (rotateX + rotateY).
   */
  vortex?: boolean;
  /**
   * Optional logo path (relative to public) to draw on the spinner center.
   * Defaults to '/logo.png' when provided as `true` via `logoSrc`.
   */
  logoSrc?: string;
  /** Speed multiplier (1 = default). Higher => faster.
   */
  speed?: number;
  /**
   * Orientation of the spin axis. 'vertical' rotates around Y axis (coin stands vertical),
   * 'horizontal' rotates around X axis (coin lies flat). Defaults to 'vertical'.
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Show text next to the spinner when provided. Defaults to false (no text).
   */
  showText?: boolean;
  /**
   * Position of the optional text relative to the spinner. Defaults to 'right'.
   */
  textPosition?: 'left' | 'right';
}

const sizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export function LoadingSpinner({
  size = 'md',
  className,
  text,
  fullScreen = false,
  vortex = true,
  logoSrc,
  speed = 1,
  orientation = 'vertical',
  showText = false,
  textPosition = 'right'
}: LoadingSpinnerProps) {
  const spinnerSize = sizes[size];

  const parentStyle: React.CSSProperties = {
    perspective: 800,
  };

  const commonStyle: React.CSSProperties = {
    transformStyle: 'preserve-3d'
  };

  const transition = {
    rotate: { duration: 1 / speed, repeat: Infinity, ease: 'linear' },
    rotateY: { duration: 1.6 / speed, repeat: Infinity, ease: 'linear' },
    rotateX: { duration: 1.6 / speed, repeat: Infinity, ease: 'linear' }
  } as const;

  const vortexAnimate = {
    rotate: [0, 360],
    rotateY: [0, 360],
    rotateX: [0, 60, 0, -60, 0]
  };

  // Simple directional spin depending on orientation
  const simpleAnimate = orientation === 'horizontal' ? { rotateX: 360 } : { rotateY: 360 };

  const spinnerElement = (
    <motion.div
      style={commonStyle}
      animate={vortex ? vortexAnimate : simpleAnimate}
      transition={transition}
      className="flex items-center justify-center"
      aria-hidden={!text}
    >
      {logoSrc ? (
        <motion.img
          src={logoSrc}
          alt="spinner-logo"
          style={{ width: spinnerSize * 1.6, height: spinnerSize * 1.6, objectFit: 'contain', borderRadius: '50%' }}
          className="block"
        />
      ) : (
        <Loader2 size={spinnerSize} className="text-primary" />
      )}
    </motion.div>
  );

  const content = (
    <div data-testid="loading-spinner" style={parentStyle} className={cn('flex items-center justify-center', className)}>
      {text && textPosition === 'left' && (
        <span className="mr-2 text-sm text-muted-foreground">{text}</span>
      )}

      {spinnerElement}

      {text && textPosition === 'right' && (
        <span className="ml-2 text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}