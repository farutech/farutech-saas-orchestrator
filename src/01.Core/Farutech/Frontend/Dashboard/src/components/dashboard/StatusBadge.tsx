import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'paid' | 'pending' | 'rejected' | 'high' | 'medium' | 'low' | 
                  'admitted' | 'grooming' | 'surgery' | 'waiting';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  paid: { label: 'Pagado', className: 'bg-success/10 text-success border-success/20' },
  pending: { label: 'Pendiente', className: 'bg-warning/10 text-warning border-warning/20' },
  rejected: { label: 'Rechazado', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  high: { label: 'Alta', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  medium: { label: 'Media', className: 'bg-warning/10 text-warning border-warning/20' },
  low: { label: 'Baja', className: 'bg-success/10 text-success border-success/20' },
  admitted: { label: 'Ingresado', className: 'bg-info/10 text-info border-info/20' },
  grooming: { label: 'Peluquería', className: 'bg-primary/10 text-primary border-primary/20' },
  surgery: { label: 'Cirugía', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  waiting: { label: 'En espera', className: 'bg-warning/10 text-warning border-warning/20' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, 'font-medium', className)}
    >
      {config.label}
    </Badge>
  );
}
