import React from 'react';
import { cn } from '../../../utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'default' | 'ghost';
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', style, ...rest }, ref) => {
    const base = 'px-3 py-2 rounded-md text-sm transition-colors outline-none';
    const variantClass =
      variant === 'ghost'
        ? 'bg-transparent border-0'
        : 'border border-[var(--ft-color-muted)] bg-[var(--ft-color-surface)] text-[var(--ft-color-text)]';

    const focusStyle: React.CSSProperties = {
      boxShadow: '0 0 0 2px rgba(14,165,164,0.12)',
      borderColor: 'var(--ft-color-primary)',
    };

    return (
      <input
        ref={ref}
        className={cn(base, variantClass, className)}
        style={{ ...(rest.disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}), ...style }}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
