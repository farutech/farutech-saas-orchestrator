import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullScreen?: boolean;
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
  fullScreen = false
}: LoadingSpinnerProps) {
  const spinnerSize = sizes[size];

  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className={cn("flex items-center justify-center", className)}
    >
      <Loader2 size={spinnerSize} className="text-primary" />
      {text && (
        <span className="ml-2 text-sm text-muted-foreground">{text}</span>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}