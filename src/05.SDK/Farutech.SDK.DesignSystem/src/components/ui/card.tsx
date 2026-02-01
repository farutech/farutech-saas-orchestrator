import * as React from "react";

import { cn } from "../../utils/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'outline' | 'filled';
  elevation?: 0 | 1 | 2 | 3;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-card text-card-foreground border',
  outline: 'bg-transparent text-card-foreground border',
  filled: 'bg-primary text-white border-transparent',
};

const elevationClasses: Record<NonNullable<CardProps['elevation']>, string> = {
  0: 'shadow-none',
  1: 'shadow-sm',
  2: 'shadow-md',
  3: 'shadow-lg',
};

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', elevation = 1, padding = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg overflow-hidden',
        variantClasses[variant],
        elevationClasses[elevation],
        paddingClasses[padding],
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col p-2', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pt-2', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
