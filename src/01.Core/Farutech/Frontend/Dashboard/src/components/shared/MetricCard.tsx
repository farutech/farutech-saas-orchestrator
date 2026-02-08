// ============================================================================
// METRIC CARD - Display metrics with icon and optional subtext
// ============================================================================

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
  valueClassName,
  className,
  onClick,
}: MetricCardProps) {
  return (
    <Card 
      className={cn(
        'bg-white border-slate-200 transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:border-slate-300',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5 flex items-start gap-4">
        {Icon && (
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-violet-500 to-violet-600',
            iconClassName
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className={cn(
            'text-2xl font-bold text-slate-900 leading-tight',
            valueClassName
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatItemProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatItem({ label, value, className }: StatItemProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
