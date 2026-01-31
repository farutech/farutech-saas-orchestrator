import React from 'react';
import cn from '../../../utils/cn';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  className,
  children,
  ...rest
}) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  const variantClass = variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-primary text-white';
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-4 py-3' : 'px-3 py-2';

  return (
    <button className={cn(base, variantClass, sizeClass, className)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
