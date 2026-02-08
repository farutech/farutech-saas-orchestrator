import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import React, { useState, useRef, useEffect } from 'react';

const dropdownVariants = cva(
  'relative w-full flex items-center justify-between gap-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
        outlined:
          'bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
        ghost: 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps extends VariantProps<typeof dropdownVariants> {
  items: DropdownItem[];
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  label,
  placeholder = 'Seleccionar',
  value,
  onChange,
  className,
  variant,
  size,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => item.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={dropdownVariants({ variant, size })}
      >
        <span className="flex items-center gap-2 flex-1 text-left">
          {selectedItem?.icon && selectedItem.icon}
          <span className={clsx(!selectedItem && 'text-gray-500 dark:text-gray-400')}>
            {selectedItem?.label || placeholder}
          </span>
        </span>
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full min-w-[200px] origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none z-50 max-h-60 overflow-auto">
          <div className="p-1">
            {items.map((item) =>
              item.divider ? (
                <div
                  key={item.value}
                  className="my-1 border-t border-gray-200 dark:border-gray-700"
                />
              ) : (
                <button
                  key={item.value}
                  onClick={() => {
                    if (!item.disabled) {
                      onChange?.(item.value);
                      item.onClick?.();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    !item.disabled && 'hover:bg-gray-100 dark:hover:bg-gray-700',
                    value === item.value &&
                      'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                  )}
                >
                  {item.icon && item.icon}
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.displayName = 'Dropdown';
