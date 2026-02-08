import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const textareaVariants = cva(
  [
    'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-y',
  ],
  {
    variants: {
      variant: {
        default: 'border-input bg-background focus-visible:ring-ring',
        error: 'border-destructive bg-background focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      maxLength,
      showCount = false,
      className,
      variant,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(7)}`;
    const effectiveVariant = error ? 'error' : variant;
    const currentLength = String(value || '').length;

    return (
      <div className={cn('flex flex-col', fullWidth && 'w-full')}>
        <div className="mb-1 flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-sm font-medium text-foreground"
            >
              {label}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-xs text-muted-foreground">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          className={cn(textareaVariants({ variant: effectiveVariant }), className)}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
