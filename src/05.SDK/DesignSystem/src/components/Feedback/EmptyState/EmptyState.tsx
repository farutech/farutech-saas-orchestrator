import { clsx } from 'clsx';
import React from 'react';
import { Button } from '../../../components/Button';

const variantStyles = {
  primary: 'text-primary-400 dark:text-primary-500',
  gray: 'text-gray-400 dark:text-gray-500',
  info: 'text-blue-400 dark:text-blue-500',
  warning: 'text-yellow-400 dark:text-yellow-500',
  danger: 'text-red-400 dark:text-red-500',
  success: 'text-green-400 dark:text-green-500',
};

const sizeStyles = {
  sm: {
    icon: 'h-12 w-12',
    title: 'text-base',
    description: 'text-sm',
    padding: 'py-8',
  },
  md: {
    icon: 'h-16 w-16',
    title: 'text-lg',
    description: 'text-base',
    padding: 'py-12',
  },
  lg: {
    icon: 'h-20 w-20',
    title: 'text-xl',
    description: 'text-lg',
    padding: 'py-16',
  },
};

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success';
  icon?: React.ReactNode;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: Omit<EmptyStateAction, 'variant'>;
  variant?: 'primary' | 'gray' | 'info' | 'warning' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'gray',
  size = 'md',
  className,
}) => {
  const styles = sizeStyles[size];
  const iconColor = variantStyles[variant];

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center px-4 text-center',
        styles.padding,
        className
      )}
    >
      {icon && <div className={clsx('mb-4', iconColor, styles.icon)}>{icon}</div>}

      <h3
        className={clsx('font-semibold text-gray-900 dark:text-white mb-2', styles.title)}
      >
        {title}
      </h3>

      {description && (
        <p
          className={clsx(
            'text-gray-500 dark:text-gray-400 max-w-md mb-6',
            styles.description
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex gap-3 flex-wrap justify-center">
          {action && (
            <Button variant={action.variant || 'primary'} onClick={action.onClick}>
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.icon && <span className="mr-2">{secondaryAction.icon}</span>}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
