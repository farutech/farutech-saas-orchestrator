import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'neutral',
  className,
}: KPICardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-card-hover group", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend === 'up' && "text-success",
                trend === 'down' && "text-destructive",
                trend === 'neutral' && "text-muted-foreground"
              )}>
                {trend === 'up' && <TrendingUp className="h-4 w-4" />}
                {trend === 'down' && <TrendingDown className="h-4 w-4" />}
                {trend === 'neutral' && <Minus className="h-4 w-4" />}
                <span>{change}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
