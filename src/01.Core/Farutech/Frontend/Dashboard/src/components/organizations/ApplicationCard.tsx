// ============================================================================
// APPLICATION CARD - Display individual application with actions
// ============================================================================

import { ExternalLink, Settings, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, mapToStatusType } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';
import type { ApplicationSummary } from '@/services/applications.service';

interface ApplicationCardProps {
  app: ApplicationSummary;
  onOpen?: (app: ApplicationSummary) => void;
  onManage?: (app: ApplicationSummary) => void;
  onReactivate?: (app: ApplicationSummary) => void;
  isReactivating?: boolean;
  className?: string;
}

// App type visual configuration
const getAppTypeConfig = (type: string) => {
  const t = (type || '').toLowerCase();
  if (t.includes('billing')) return { icon: '💳', color: 'bg-blue-100 text-blue-600' };
  if (t.includes('report')) return { icon: '📊', color: 'bg-purple-100 text-purple-600' };
  if (t.includes('payment')) return { icon: '💰', color: 'bg-green-100 text-green-600' };
  if (t.includes('vet')) return { icon: '🐾', color: 'bg-orange-100 text-orange-600' };
  if (t.includes('erp')) return { icon: '🏢', color: 'bg-indigo-100 text-indigo-600' };
  if (t.includes('pos')) return { icon: '🛒', color: 'bg-pink-100 text-pink-600' };
  return { icon: '📦', color: 'bg-slate-100 text-slate-600' };
};

export function ApplicationCard({
  app,
  onOpen,
  onManage,
  onReactivate,
  isReactivating = false,
  className,
}: ApplicationCardProps) {
  const isActive = app.status === 'Active';
  const isProvisioning = app.status === 'Provisioning';
  const typeConfig = getAppTypeConfig(app.type);

  return (
    <Card 
      className={cn(
        'bg-white border-slate-200 transition-all duration-200',
        !isActive && 'opacity-75',
        className
      )}
    >
      <CardContent className="p-4 flex items-center justify-between gap-4">
        {/* App Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg',
            typeConfig.color
          )}>
            {typeConfig.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-900 truncate">{app.name}</h4>
            <p className="text-xs text-slate-500 font-mono">Código: {app.code}</p>
          </div>
        </div>

        {/* Status Badge (for inactive/provisioning) */}
        {!isActive && (
          <StatusBadge 
            status={mapToStatusType(app.status)} 
            className="flex-shrink-0"
          />
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isActive && (
            <>
              <Button
                variant="default"
                size="sm"
                className="gap-1.5 bg-violet-600 hover:bg-violet-700"
                onClick={() => onOpen?.(app)}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Abrir
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => onManage?.(app)}
              >
                <Settings className="h-3.5 w-3.5" />
                Gestionar
              </Button>
            </>
          )}
          
          {!isActive && !isProvisioning && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50"
              onClick={() => onReactivate?.(app)}
              disabled={isReactivating}
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isReactivating && 'animate-spin')} />
              Reactivar
            </Button>
          )}
          
          {isProvisioning && (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Aprovisionando...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
