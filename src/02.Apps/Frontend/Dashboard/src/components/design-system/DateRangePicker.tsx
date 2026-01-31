// ============================================================================
// DATE RANGE PICKER - Select a range of dates
// ============================================================================

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
  numberOfMonths?: number;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Seleccionar fechas',
  label,
  helperText,
  errorMessage,
  required,
  disabled,
  clearable = true,
  className,
  align = 'start',
  numberOfMonths = 2,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const inputId = React.useId();
  const hasError = !!errorMessage;

  const formatDateRange = () => {
    if (!value?.from) return null;
    
    if (value.to) {
      return `${format(value.from, 'dd MMM yyyy', { locale: es })} - ${format(value.to, 'dd MMM yyyy', { locale: es })}`;
    }
    
    return format(value.from, 'dd MMM yyyy', { locale: es });
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={inputId} className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              hasError && 'border-destructive focus-visible:ring-destructive'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange() || <span>{placeholder}</span>}
            
            {clearable && value && (
              <X
                className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={numberOfMonths}
            locale={es}
          />
        </PopoverContent>
      </Popover>
      
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      
      {!errorMessage && helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
