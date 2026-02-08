import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import React, { forwardRef } from 'react';

const radioGroupVariants = cva('', {
  variants: {
    orientation: {
      vertical: 'space-y-2',
      horizontal: 'flex gap-2',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

const radioItemVariants = cva('cursor-pointer focus:outline-none', {
  variants: {
    variant: {
      default: 'flex items-start',
      card: 'relative flex rounded-xl border-2 p-4 transition-all duration-200',
      button: 'flex-1 text-center rounded-lg border-2 px-4 py-2 transition-all duration-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof radioGroupVariants> {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  error?: string;
  variant?: 'default' | 'card' | 'button';
  name?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value,
      onValueChange,
      label,
      error,
      variant = 'default',
      orientation,
      className,
      name,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {label}
          </label>
        )}
        <div className={radioGroupVariants({ orientation })}>
          {options.map((option) => {
            const checked = value === option.value;
            
            return (
              <label
                key={option.value}
                className={clsx(
                  radioItemVariants({ variant }),
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  variant === 'card' && [
                    checked
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400',
                  ],
                  variant === 'button' && [
                    checked
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-primary-600',
                  ]
                )}
              >
                {variant === 'default' && (
                  <>
                    <div className="flex items-center h-5">
                      <div
                        className={clsx(
                          'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                          checked
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300 dark:border-gray-600'
                        )}
                      >
                        {checked && (
                          <div className="h-2 w-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="block text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      {option.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {variant === 'card' && (
                  <>
                    <div className="flex-1">
                      <div
                        className={clsx(
                          'block text-sm font-semibold',
                          checked
                            ? 'text-primary-900 dark:text-primary-100'
                            : 'text-gray-900 dark:text-white'
                        )}
                      >
                        {option.label}
                      </div>
                      {option.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      )}
                    </div>
                    {checked && (
                      <svg
                        className="h-6 w-6 text-primary-600 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </>
                )}

                {variant === 'button' && (
                  <span className="text-sm font-medium">{option.label}</span>
                )}

                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={checked}
                  disabled={option.disabled}
                  onChange={() => !option.disabled && onValueChange?.(option.value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
