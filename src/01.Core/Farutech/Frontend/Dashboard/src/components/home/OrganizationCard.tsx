import { Building2, ChevronDown, ChevronUp, MoreVertical, ExternalLink, Plus, Lock, LayoutDashboard, Settings } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  onLaunchInstance: (tenantId: string, instanceId: string, isActive: boolean, orgCode?: string, instanceCode?: string) => void;
  onCreateInstance: (tenantId: string) => void;
  onEditOrganization: (tenantId: string) => void;
  onToggleStatus: (tenantId: string, currentStatus: boolean) => void;
  onSelectOrganization?: (tenantId: string) => void;
}

export function OrganizationCard({ 
  organization, 
  onLaunchInstance,
  onEditOrganization,
  onToggleStatus,
  onSelectOrganization
}: OrganizationCardProps) {
  
  const instanceCount = organization.instances.length;
  
  // Determinar si la card debe ser clickable para ir al dashboard
  const handleGoToDashboard = () => {
    if (organization.isActive && onSelectOrganization) {
      onSelectOrganization(organization.organizationId);
    }
  };

  return (
    <Card className={cn(
      "group transition-all duration-200 border-slate-200 bg-white relative overflow-hidden w-full hover:shadow-md hover:border-violet-200",
      !organization.isActive && "opacity-75 grayscale-[0.5]"
    )}>
      <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section: Icon and Info */}
        <div className="flex items-center gap-4 w-full md:w-auto flex-1 min-w-0">
          <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
            {organization.organizationCode ? (
               <span className="font-bold text-xs">{organization.organizationCode.substring(0, 2).toUpperCase()}</span>
            ) : (
               <Building2 className="h-5 w-5" />
            )}
          </div>
          
          <div className="min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 group-hover:text-violet-700 transition-colors truncate text-base">
                {organization.organizationName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-mono">{organization.organizationCode}</span>
                {organization.taxId && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{organization.taxId}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge 
                variant={organization.isActive ? "default" : "destructive"} 
                className={cn(
                  "font-medium border-0 px-2 py-0.5 h-auto text-[10px]",
                  organization.isActive ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-red-50 text-red-700 hover:bg-red-100"
                )}
              >
                  {organization.isActive ? (
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>Activa</span>
                  ) : 'Inactiva'}
              </Badge>
              
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline-block">
                {instanceCount} {instanceCount === 1 ? 'aplicación' : 'aplicaciones'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 justify-end">
          <Button 
            variant="secondary" 
            size="sm"
            className="flex-1 md:flex-none justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium h-9 px-4"
            onClick={handleGoToDashboard}
            disabled={!organization.isActive}
          >
            Ir al Dashboard
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="default" 
                size="sm"
                className="flex-1 md:flex-none justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md gap-2 font-medium h-9 px-3"
              >
                + Administrar
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1 rounded-lg">
              <DropdownMenuItem 
                className="rounded-md gap-2 cursor-pointer py-2"
                onClick={handleGoToDashboard}
                disabled={!organization.isActive}
              >
                <LayoutDashboard className="h-4 w-4 text-slate-400" />
                <span>Panel de Control</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="rounded-md gap-2 cursor-pointer py-2"
                onClick={() => onEditOrganization(organization.organizationId)}
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <Separator className="my-1" />
              {organization.isActive ? (
                <DropdownMenuItem 
                  className="rounded-md gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2"
                  onClick={() => onToggleStatus(organization.organizationId, true)}
                >
                  <Lock className="h-4 w-4" />
                  <span>Desactivar Organización</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  className="rounded-md gap-2 text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 cursor-pointer py-2"
                  onClick={() => onToggleStatus(organization.organizationId, false)}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Activar Organización</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

