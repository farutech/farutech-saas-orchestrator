import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const dividerVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
    variant: {
      solid: 'bg-border',
      dashed: 'border-t border-dashed border-border',
      dotted: 'border-t border-dotted border-border',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
  },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  label?: string;
}

export function Divider({
  orientation = 'horizontal',
  variant,
  label,
  className,
  ...props
}: DividerProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-4', className)} {...props}>
        <div className={cn(dividerVariants({ orientation, variant }), 'flex-1')} />
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={cn(dividerVariants({ orientation, variant }), 'flex-1')} />
      </div>
    );
  }

  return (
    <div
      className={cn(dividerVariants({ orientation, variant }), className)}
      role="separator"
      {...(orientation && { 'aria-orientation': orientation })}
      {...props}
    />
  );
}
