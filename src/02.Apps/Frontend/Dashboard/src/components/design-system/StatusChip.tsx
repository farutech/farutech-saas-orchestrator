// ============================================================================
// STATUS CHIP - Visual status indicator with multiple variants
// ============================================================================

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export type ChipVariant = 
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'outline';

export type ChipSize = 'sm' | 'md' | 'lg';

interface StatusChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: LucideIcon;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  pulse?: boolean;
}

const variantStyles: Record<ChipVariant, string> = {
  default: 'bg-muted text-muted-foreground border-transparent',
  success: 'bg-success-subtle text-success border-success/20',
  error: 'bg-destructive-subtle text-destructive border-destructive/20',
  warning: 'bg-warning-subtle text-warning border-warning/20',
  info: 'bg-info-subtle text-info border-info/20',
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border-transparent',
  outline: 'bg-transparent border-border text-foreground',
};

const sizeStyles: Record<ChipSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
};

const iconSizes: Record<ChipSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export function StatusChip({
  label,
  variant = 'default',
  size = 'md',
  icon: Icon,
  removable = false,
  onRemove,
  className,
  pulse = false,
}: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              variant === 'success' && 'bg-success',
              variant === 'error' && 'bg-destructive',
              variant === 'warning' && 'bg-warning',
              variant === 'info' && 'bg-info',
              variant === 'primary' && 'bg-primary',
              (variant === 'default' || variant === 'secondary' || variant === 'outline') && 'bg-muted-foreground'
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              variant === 'success' && 'bg-success',
              variant === 'error' && 'bg-destructive',
              variant === 'warning' && 'bg-warning',
              variant === 'info' && 'bg-info',
              variant === 'primary' && 'bg-primary',
              (variant === 'default' || variant === 'secondary' || variant === 'outline') && 'bg-muted-foreground'
            )}
          />
        </span>
      )}
      
      {Icon && <Icon className={iconSizes[size]} />}
      
      <span>{label}</span>
      
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
        >
          <svg className={iconSizes[size]} viewBox="0 0 14 14" fill="none">
            <path
              d="M4 4L10 10M10 4L4 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
