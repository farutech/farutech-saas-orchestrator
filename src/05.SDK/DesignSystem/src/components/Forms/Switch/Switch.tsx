import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import React, { forwardRef } from 'react';

const switchVariants = cva(
  'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
      color: {
        primary: 'data-[checked]:bg-primary-600',
        success: 'data-[checked]:bg-green-600',
        warning: 'data-[checked]:bg-yellow-500',
        danger: 'data-[checked]:bg-red-600',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
    },
  }
);

const toggleVariants = cva(
  'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[checked]:translate-x-4',
        md: 'h-5 w-5 data-[checked]:translate-x-5',
        lg: 'h-6 w-6 data-[checked]:translate-x-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>,
    VariantProps<typeof switchVariants> {
  label?: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      checked = false,
      onCheckedChange,
      size,
      color,
      disabled,
      className,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="flex items-center justify-between">
        {(label || description) && (
          <div className="flex-1 mr-4">
            {label && (
              <label
                htmlFor={props.id}
                className="block text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
        <button
          role="switch"
          type="button"
          aria-checked={checked}
          data-checked={checked ? 'true' : undefined}
          disabled={disabled}
          onClick={() => !disabled && onCheckedChange?.(!checked)}
          className={clsx(
            switchVariants({ size, color }),
            !checked && 'bg-gray-200 dark:bg-gray-700',
            className
          )}
        >
          <span
            data-checked={checked ? 'true' : undefined}
            className={toggleVariants({ size })}
            style={{
              transform: checked
                ? `translateX(${size === 'sm' ? '1rem' : size === 'lg' ? '1.75rem' : '1.25rem'})`
                : 'translateX(0)',
            }}
          />
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
