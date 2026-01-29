import { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  MoreVertical,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
  instances: Instance[];
}

interface OrganizationCardProps {
  organization: Organization;
  isExpanded: boolean;
  onToggle: () => void;
  onLaunchInstance: (tenantId: string, instanceId: string, isActive: boolean) => void;
  onCreateInstance: (tenantId: string) => void;
}

export function OrganizationCard({ 
  organization, 
  isExpanded, 
  onToggle,
  onLaunchInstance,
  onCreateInstance
}: OrganizationCardProps) {
  
  const instanceCount = organization.instances.length;

  return (
    <Card className={cn(
      "group transition-all duration-300 border-slate-200 hover:border-primary/50 hover:shadow-md bg-white",
      isExpanded && "ring-2 ring-primary/20 shadow-lg"
    )}>
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                {organization.organizationName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 font-medium">
                  {instanceCount} {instanceCount === 1 ? 'Aplicación' : 'Aplicaciones'}
                </span>
                {organization.isActive ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Desactivar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2">
        {/* Short description or metadata could go here */}
        <div className="flex gap-2 mb-2">
           {organization.isOwner && (
             <Badge variant="secondary" className="text-[10px] h-5 bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100">
               Owner
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
        <Button 
          variant={isExpanded ? "secondary" : "outline"}
          className="w-full justify-between group-hover:border-primary/30 group-hover:bg-primary/5 transition-all"
          onClick={onToggle}
        >
          <span className="font-medium text-slate-700 group-hover:text-primary">
            {isExpanded ? 'Ocultar Aplicaciones' : 'Gestionar'}
          </span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Animated Accordion Content */}
        <div className={cn(
          "grid gap-2 w-full overflow-hidden transition-all duration-300",
          isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
        )}>
          <div className="min-h-0 space-y-2">
            
            {/* Instance List */}
            {organization.instances.map(instance => (
              <div 
                key={instance.instanceId}
                onClick={() => onLaunchInstance(organization.organizationId, instance.instanceId, organization.isActive)}
                className="flex items-center justify-between p-3 rounded-md border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all group/item"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("h-2 w-2 rounded-full", 
                    instance.status === 'active' || instance.status === 'online' ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 group-hover/item:text-primary">
                      {instance.name}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {instance.applicationType || 'App'}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-300 group-hover/item:text-primary" />
              </div>
            ))}

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
      </CardFooter>
    </Card>
  );
}
