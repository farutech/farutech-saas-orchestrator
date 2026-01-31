// ============================================================================
// SEARCHABLE SELECT - Combobox with search functionality
// ============================================================================

import * as React from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No se encontraron resultados.',
  label,
  helperText,
  errorMessage,
  required,
  disabled,
  clearable = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const inputId = React.useId();

  const selectedOption = options.find((option) => option.value === value);
  const hasError = !!errorMessage;

  const handleSelect = (currentValue: string) => {
    onValueChange?.(currentValue === value ? '' : currentValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.('');
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
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              !value && 'text-muted-foreground',
              hasError && 'border-destructive focus-visible:ring-destructive'
            )}
          >
            <span className="flex items-center gap-2 truncate">
              {selectedOption?.icon}
              {selectedOption?.label || placeholder}
            </span>
            
            <div className="flex items-center gap-1">
              {clearable && value && (
                <X
                  className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                  onClick={handleClear}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    disabled={option.disabled}
                    onSelect={() => handleSelect(option.value)}
                    className="flex items-center gap-2"
                  >
                    {option.icon}
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
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
