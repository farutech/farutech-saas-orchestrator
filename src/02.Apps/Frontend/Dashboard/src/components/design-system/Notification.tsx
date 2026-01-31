// ============================================================================
// NOTIFICATION SYSTEM - Toast notifications with actions
// ============================================================================

import * as React from 'react';
import { toast as sonnerToast } from 'sonner';
import { 
  Check, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  LucideIcon 
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline';
}

interface NotificationOptions {
  title: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
  action?: NotificationAction;
  dismissible?: boolean;
  id?: string;
}

// ============================================================================
// Icon mapping
// ============================================================================

const typeIcons: Record<NotificationType, LucideIcon> = {
  success: Check,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const typeColors: Record<NotificationType, string> = {
  success: 'text-success',
  error: 'text-destructive',
  warning: 'text-warning',
  info: 'text-info',
};

// ============================================================================
// Notification Functions
// ============================================================================

export function notify(options: NotificationOptions): string | number {
  const { 
    title, 
    description, 
    type = 'info', 
    duration = 5000,
    action,
    dismissible = true,
    id,
  } = options;

  const Icon = typeIcons[type];
  const colorClass = typeColors[type];

  return sonnerToast.custom(
    (toastId) => (
      <div className="flex items-start gap-3 w-full">
        <div className={colorClass}>
          <Icon className="h-5 w-5 mt-0.5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          
          {action && (
            <button
              onClick={() => {
                action.onClick();
                sonnerToast.dismiss(toastId);
              }}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={() => sonnerToast.dismiss(toastId)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    ),
    {
      duration,
      id,
    }
  );
}

// Convenience methods
export const notification = {
  success: (title: string, description?: string, options?: Partial<NotificationOptions>) =>
    notify({ title, description, type: 'success', ...options }),
    
  error: (title: string, description?: string, options?: Partial<NotificationOptions>) =>
    notify({ title, description, type: 'error', ...options }),
    
  warning: (title: string, description?: string, options?: Partial<NotificationOptions>) =>
    notify({ title, description, type: 'warning', ...options }),
    
  info: (title: string, description?: string, options?: Partial<NotificationOptions>) =>
    notify({ title, description, type: 'info', ...options }),
    
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  
  dismissAll: () => sonnerToast.dismiss(),
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};
