import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const checkboxVariants = cva(
  [
    'flex items-center justify-center border-2 transition-all duration-200',
    'peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-ring',
    'peer-checked:bg-primary peer-checked:border-primary',
    'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      shape: {
        square: 'rounded',
        circle: 'rounded-full',
      },
      variant: {
        default: 'border-input',
        error: 'border-destructive',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'square',
      variant: 'default',
    },
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      size,
      shape,
      variant,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substring(7)}`;
    const effectiveVariant = error ? 'error' : variant;

    return (
      <div className={className}>
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <div className="relative">
              <input
                ref={ref}
                type="checkbox"
                id={inputId}
                className="peer sr-only"
                {...props}
              />
              <label
                htmlFor={inputId}
                className={cn(
                  checkboxVariants({ size, shape, variant: effectiveVariant }),
                  'cursor-pointer'
                )}
              >
                <svg
                  className={cn(
                    'text-white transition-all duration-200',
                    'scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100',
                    size === 'sm' && 'h-3 w-3',
                    size === 'md' && 'h-4 w-4',
                    size === 'lg' && 'h-5 w-5'
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </label>
            </div>
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label
                  htmlFor={inputId}
                  className="cursor-pointer font-medium text-foreground"
                >
                  {label}
                </label>
              )}
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
