// ============================================================================
// STATUS BADGE - Reusable status indicator component
// ============================================================================

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'pending-payment' 
  | 'provisioning' 
  | 'al-dia'
  | 'pago-pendiente';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showDot?: boolean;
}

const statusConfig: Record<StatusType, { label: string; className: string; dotColor: string }> = {
  'active': {
    label: 'Activa',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    dotColor: 'bg-emerald-500',
  },
  'inactive': {
    label: 'Inactiva',
    className: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100',
    dotColor: 'bg-slate-400',
  },
  'pending-payment': {
    label: 'Pago Pendiente',
    className: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100',
    dotColor: 'bg-amber-500',
  },
  'provisioning': {
    label: 'Aprovisionando',
    className: 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-100',
    dotColor: 'bg-blue-500',
  },
  'al-dia': {
    label: 'Al día',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    dotColor: 'bg-emerald-500',
  },
  'pago-pendiente': {
    label: 'Pago Pendiente',
    className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
    dotColor: 'bg-red-500',
  },
};

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  if (!config) {
    return (
      <Badge variant="secondary" className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-medium gap-1.5 border',
        config.className,
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      )}
      {config.label}
    </Badge>
  );
}

/**
 * Helper to convert API status to StatusType
 */
export function mapToStatusType(status: string | undefined, type: 'app' | 'billing' = 'app'): StatusType {
  if (!status) return 'inactive';
  
  const normalized = status.toLowerCase();
  
  if (type === 'billing') {
    if (normalized === 'al día' || normalized === 'al dia') return 'al-dia';
    if (normalized.includes('pendiente')) return 'pago-pendiente';
    return 'al-dia';
  }
  
  if (normalized === 'active') return 'active';
  if (normalized === 'provisioning') return 'provisioning';
  if (normalized.includes('payment') || normalized.includes('pago')) return 'pending-payment';
  return 'inactive';
}
