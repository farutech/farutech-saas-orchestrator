import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '../utils/cn';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status?: 'active' | 'inactive' | 'maintenance' | 'beta';
  version?: string;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  animated?: boolean;
}

const statusConfig = {
  active: { variant: 'default' as const, label: 'Activo' },
  inactive: { variant: 'secondary' as const, label: 'Inactivo' },
  maintenance: { variant: 'destructive' as const, label: 'Mantenimiento' },
  beta: { variant: 'outline' as const, label: 'Beta' },
};

export function ModuleCard({
  title,
  description,
  icon: Icon,
  status = 'active',
  version,
  isLoading = false,
  onClick,
  className,
  animated = false
}: ModuleCardProps) {
  const statusInfo = statusConfig[status];

  const cardContent = (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
        onClick && "hover:border-primary/50",
        isLoading && "opacity-50 pointer-events-none",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {animated ? (
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon className="h-8 w-8 text-primary" />
              </motion.div>
            ) : (
              <Icon className="h-8 w-8 text-primary" />
            )}
            <div>
              <CardTitle className="text-lg" style={{ fontFamily: 'var(--ft-font-family, Inter, system-ui, sans-serif)' }}>{title}</CardTitle>
              {version && (
                <span className="text-xs text-muted-foreground">v{version}</span>
              )}
            </div>
          </div>
          <Badge variant={statusInfo.variant} className="text-xs">
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed" style={{ fontFamily: 'var(--ft-font-family, Inter, system-ui, sans-serif)' }}>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}