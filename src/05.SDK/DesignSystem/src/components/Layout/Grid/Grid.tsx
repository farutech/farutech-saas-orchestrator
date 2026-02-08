import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    },
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      5: 'gap-5',
      6: 'gap-6',
      8: 'gap-8',
      10: 'gap-10',
      12: 'gap-12',
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 4,
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  as?: React.ElementType;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function Grid({
  cols,
  gap,
  responsive,
  as: Component = 'div',
  className,
  ...props
}: GridProps) {
  const responsiveClasses = responsive
    ? Object.entries(responsive)
        .map(([breakpoint, value]) => `${breakpoint}:grid-cols-${value}`)
        .join(' ')
    : '';

  return (
    <Component
      className={cn(
        gridVariants({ cols, gap }),
        responsiveClasses,
        className
      )}
      {...props}
    />
  );
}
