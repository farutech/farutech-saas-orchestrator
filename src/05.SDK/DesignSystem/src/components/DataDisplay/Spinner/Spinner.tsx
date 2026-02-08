import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const spinnerVariants = cva('animate-spin rounded-full border-2 border-current', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    variant: {
      default: 'border-t-transparent',
      primary: 'border-primary border-t-transparent',
      white: 'border-white border-t-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({
  size,
  variant,
  label,
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn('inline-flex flex-col items-center gap-2', className)}
      role="status"
      {...props}
    >
      <div className={cn(spinnerVariants({ size, variant }))} />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
