import { Building2, ChevronDown, ChevronUp, MoreVertical, ExternalLink, Plus, Lock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface Instance {
  instanceId: string;
  name: string;
  code: string;
  applicationType: string;
  status: string;
  url: string;
}

interface Organization {
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  isOwner: boolean;
  isActive: boolean;
  taxId?: string;
  role?: string;
  instances: Instance[];
}

interface OrganizationCardProps {
  organization: Organization;
  isExpanded: boolean;
  onToggle: () => void;
  onLaunchInstance: (tenantId: string, instanceId: string, isActive: boolean, orgCode?: string, instanceCode?: string) => void;
  onCreateInstance: (tenantId: string) => void;
  onEditOrganization: (tenantId: string) => void;
  onToggleStatus: (tenantId: string, currentStatus: boolean) => void;
  limitApps?: number;
  onViewAll?: (tenantId: string) => void;
}

export function OrganizationCard({ 
  organization, 
  isExpanded, 
  onToggle,
  onLaunchInstance,
  onCreateInstance,
  onEditOrganization,
  onToggleStatus,
  limitApps = 3,
  onViewAll
}: OrganizationCardProps) {
  
  const instanceCount = organization.instances.length;
  const displayInstances = (limitApps > 0 && instanceCount > limitApps) 
    ? organization.instances.slice(0, limitApps) 
    : organization.instances;
  
  const hasMore = instanceCount > displayInstances.length;
  const remainingCount = instanceCount - displayInstances.length;

  return (
    <Card className={cn(
      "group transition-all duration-300 border-slate-200 bg-white relative overflow-hidden w-full min-w-0 flex flex-col",
      isExpanded && organization.isActive ? "ring-2 ring-primary/20 shadow-lg" : "hover:border-primary/50 hover:shadow-md",
      !organization.isActive && "opacity-75 grayscale-[0.5]"
    )}>
      {!organization.isActive && (
        <div className="absolute top-0 right-0 p-2 z-10">
          <Badge variant="destructive" className="text-[9px] px-1.5 py-0">Inactiva</Badge>
        </div>
      )}
      
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">
                {organization.organizationName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  {instanceCount} {instanceCount === 1 ? 'Aplicación' : 'Aplicaciones'}
                </span>
                {organization.isActive ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 ml-2 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {organization.isActive ? (
                <>
                  <DropdownMenuItem onClick={() => onEditOrganization(organization.organizationId)}>
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500"
                    onClick={() => onToggleStatus(organization.organizationId, true)}
                  >
                    Desactivar
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem 
                  className="text-emerald-600"
                  onClick={() => onToggleStatus(organization.organizationId, false)}
                >
                  Activar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2">
        <div className="flex flex-wrap gap-2 mb-2">
           {organization.isOwner && (
             <Badge variant="secondary" className="text-[10px] h-5 bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100">
               Owner
             </Badge>
           )}
           {!organization.isOwner && organization.role === 'Admin' && (
             <Badge variant="secondary" className="text-[10px] h-5 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100">
               Admin
             </Badge>
           )}
           {organization.taxId && (
             <Badge variant="outline" className="text-[10px] h-5 text-slate-400 border-slate-200">
               {organization.taxId}
             </Badge>
           )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex flex-col gap-3">
        {organization.isActive ? (
          <Button 
            variant={isExpanded ? "secondary" : "outline"}
            className="w-full justify-between group-hover:border-primary/30 group-hover:bg-primary/5 transition-all text-xs h-9"
            onClick={onToggle}
          >
            <span className="font-medium text-slate-700 group-hover:text-primary">
              {isExpanded ? 'Ocultar Aplicaciones' : 'Gestionar Aplicaciones'}
            </span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        ) : (
           <div className="flex items-center justify-center text-slate-400 text-xs italic py-2 border border-dashed border-slate-200 rounded-md bg-slate-50/50">
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              Gestión deshabilitada
           </div>
        )}

        {/* Animated Accordion Content */}
        {organization.isActive && (
          <div className={cn(
            "grid gap-2 w-full overflow-hidden transition-all duration-300 min-w-0",
            isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
          )}>
            <div className="min-h-0 space-y-2 w-full min-w-0">
              
              {/* Instance List */}
              {displayInstances.map(instance => (
                <div 
                  key={instance.instanceId}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchInstance(
                      organization.organizationId,
                      instance.instanceId,
                      organization.isActive,
                      organization.organizationCode,
                      (instance as any).code
                    );
                  }}
                  className="flex items-center justify-between p-3 rounded-md border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all group/item min-w-0 w-full"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn("h-2 w-2 rounded-full flex-shrink-0", 
                      (instance.status === 'active' || instance.status === 'online') ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                    <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm font-medium text-slate-700 group-hover/item:text-primary truncate block w-full">
                              {instance.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{instance.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate block">
                        {instance.applicationType || 'App'}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-300 flex-shrink-0 group-hover/item:text-primary ml-2" />
                </div>
              ))}
              
              {/* View All Action */}
              {hasMore && onViewAll && (
                 <Button 
                    variant="ghost" 
                    className="w-full text-slate-500 text-xs h-8 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewAll(organization.organizationId);
                    }}
                 >
                    Ver las {remainingCount} aplicaciones restantes...
                 </Button>
              )}

              {/* Create New Instance Action */}
              <Button 
                variant="ghost" 
                className="w-full text-slate-500 border-dashed border border-slate-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary h-10"
                onClick={() => onCreateInstance(organization.organizationId)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Aplicación
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
