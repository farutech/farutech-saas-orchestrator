// ============================================================================
// AUTO-RESIZE TEXTAREA - Textarea that grows with content
// ============================================================================

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  minRows?: number;
  maxRows?: number;
}

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      required,
      minRows = 3,
      maxRows = 10,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const inputId = id || React.useId();
    
    const lineHeight = 24; // Approximate line height in pixels
    const minHeight = minRows * lineHeight;
    const maxHeight = maxRows * lineHeight;

    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        // Set the height to the scrollHeight, constrained by min/max
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        textarea.style.height = `${newHeight}px`;
      }
    }, [value, minHeight, maxHeight]);

    const handleRef = React.useCallback(
      (element: HTMLTextAreaElement | null) => {
        textareaRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [ref]
    );

    const hasError = !!errorMessage;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        
        <textarea
          ref={handleRef}
          id={inputId}
          value={value}
          onChange={onChange}
          className={cn(
            'flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none overflow-hidden transition-[height] duration-150',
            hasError 
              ? 'border-destructive focus-visible:ring-destructive' 
              : 'border-input',
            className
          )}
          style={{ minHeight: `${minHeight}px` }}
          {...props}
        />
        
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
        
        {!errorMessage && helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

export { AutoResizeTextarea };
