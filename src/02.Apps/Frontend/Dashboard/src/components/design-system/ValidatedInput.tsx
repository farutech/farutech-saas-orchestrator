// ============================================================================
// VALIDATED INPUT - Input with visual validation states
// ============================================================================

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, AlertCircle, Info, Eye, EyeOff, LucideIcon } from 'lucide-react';

export type ValidationState = 'default' | 'success' | 'error' | 'warning';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  validationState?: ValidationState;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  showPasswordToggle?: boolean;
  required?: boolean;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      successMessage,
      validationState = 'default',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      showPasswordToggle = false,
      type,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const stateStyles: Record<ValidationState, string> = {
      default: 'border-input focus-visible:ring-ring',
      success: 'border-success focus-visible:ring-success bg-success-subtle/50',
      error: 'border-destructive focus-visible:ring-destructive bg-destructive-subtle/50',
      warning: 'border-warning focus-visible:ring-warning bg-warning-subtle/50',
    };

    const stateIcons: Record<ValidationState, React.ReactNode> = {
      default: null,
      success: <Check className="h-4 w-4 text-success" />,
      error: <AlertCircle className="h-4 w-4 text-destructive" />,
      warning: <Info className="h-4 w-4 text-warning" />,
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <LeftIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          
          <Input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              stateStyles[validationState],
              LeftIcon && 'pl-10',
              (RightIcon || showPasswordToggle || validationState !== 'default') && 'pr-10',
              className
            )}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {validationState !== 'default' && stateIcons[validationState]}
            
            {showPasswordToggle && isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            
            {RightIcon && !showPasswordToggle && validationState === 'default' && (
              <RightIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        
        {/* Helper / Error / Success messages */}
        {validationState === 'error' && errorMessage && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errorMessage}
          </p>
        )}
        
        {validationState === 'success' && successMessage && (
          <p className="text-sm text-success flex items-center gap-1">
            <Check className="h-3 w-3" />
            {successMessage}
          </p>
        )}
        
        {validationState === 'default' && helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';

export { ValidatedInput };
