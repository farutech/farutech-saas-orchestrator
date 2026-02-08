// ============================================================================
// APPLICATION DETAIL PAGE - App Statistics and Configuration
// ============================================================================

import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronDown,
  Globe, 
  Server, 
  Package, 
  Users, 
  Settings,
  ExternalLink,
  RefreshCw,
  LayoutDashboard,
  FileText,
  Activity
} from 'lucide-react';

import { useCustomer } from '@/hooks/useApi';
import { useOrganizationApplications, useReactivateApplication } from '@/hooks/useApi';
import { applicationsService, type ApplicationSummary } from '@/services/applications.service';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { StatusBadge, mapToStatusType } from '@/components/shared/StatusBadge';
import { ApplicationCard } from '@/components/organizations/ApplicationCard';
import { useState, useMemo } from 'react';

const getAppIcon = (type: string) => {
  const t = (type || '').toLowerCase();
  if (t.includes('billing')) return '💳';
  if (t.includes('report')) return '📊';
  if (t.includes('payment')) return '💰';
  if (t.includes('vet')) return '🐾';
  if (t.includes('erp')) return '🏢';
  if (t.includes('pos')) return '🛒';
  return '📦';
};

export default function ApplicationDetailPage() {
  const { orgId, appId } = useParams<{ orgId: string; appId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { data: customer, isLoading: customerLoading } = useCustomer(orgId || '');
  const { data: apps, isLoading: appsLoading } = useOrganizationApplications(orgId || '');
  const reactivateMutation = useReactivateApplication();

  // Find the specific app
  const app = useMemo(() => {
    if (!apps || !appId) return null;
    return apps.find(a => a.id === appId) || null;
  }, [apps, appId]);

  const isLoading = customerLoading || appsLoading;

  // Handlers
  const handleOpenDashboard = () => {
    if (!app) return;
    const url = applicationsService.getDashboardUrl(app);
    window.open(url, '_blank');
  };

  const handleOpenApp = (targetApp: ApplicationSummary) => {
    const url = applicationsService.getDashboardUrl(targetApp);
    window.open(url, '_blank');
  };

  const handleReactivate = () => {
    if (!orgId || !appId) return;
    reactivateMutation.mutate({ orgId, appId });
  };

  const handleReactivateApp = (targetApp: ApplicationSummary) => {
    if (!orgId) return;
    reactivateMutation.mutate({ orgId, appId: targetApp.id });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <AppHeader title="Cargando..." showBackToHome />
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not found state
  if (!app || !customer) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <AppHeader title="Aplicación" showBackToHome />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 text-slate-300 mx-auto" />
            <h2 className="text-xl font-semibold text-slate-900">Aplicación no encontrada</h2>
            <Button onClick={() => navigate(`/organizations/${orgId}`)}>Volver a la Organización</Button>
          </div>
        </main>
      </div>
    );
  }

  const isActive = app.status === 'Active';

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <AppHeader title={app.name} showBackToHome />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <span className="text-blue-600 font-bold text-lg">Farutech</span>
          <span className="text-slate-300 text-lg">|</span>
          <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 transition-colors" onClick={() => navigate(`/organizations/${orgId}`)}>
            <span className="text-lg font-medium text-slate-500">{customer.companyName}</span>
            <ChevronRight className="h-4 w-4 text-slate-300" />
          </div>
          <div className="flex items-center gap-1 text-slate-900 font-bold text-lg cursor-pointer">
            <span>{app.name}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Tab Headers like in image */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto pb-px">
          <button className="flex items-center gap-2 py-3 px-1 border-b-2 border-violet-600 text-violet-700 font-bold text-sm whitespace-nowrap">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          <button 
             className="flex items-center gap-2 py-3 px-1 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-semibold text-sm whitespace-nowrap"
             onClick={() => setActiveTab('applications')}
          >
            <Package className="h-4 w-4" />
            Aplicaciones
          </button>
          <button className="flex items-center gap-2 py-3 px-1 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-semibold text-sm whitespace-nowrap">
            <Users className="h-4 w-4" />
            Usuarios
          </button>
          <button className="flex items-center gap-2 py-3 px-1 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-semibold text-sm whitespace-nowrap">
            <FileText className="h-4 w-4" />
            Factura
          </button>
          <button className="flex items-center gap-2 py-3 px-1 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-semibold text-sm whitespace-nowrap">
            <Activity className="h-4 w-4" />
            Logs
          </button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="dashboard" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: App Statistics and list */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-100 py-4 px-5">
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                       Estadísticas de la App
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {apps?.map(otherApp => (
                        <div key={otherApp.id} className={cn(
                            "p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors",
                            otherApp.id === appId ? "bg-slate-50/80" : ""
                        )}>
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                              {getAppIcon(otherApp.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                  <h4 className={cn("font-bold text-sm", otherApp.id === appId ? "text-violet-700" : "text-slate-900")}>
                                      {otherApp.name}
                                  </h4>
                                  {otherApp.id === appId && <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-violet-100 text-violet-700 border-none">Actual</Badge>}
                              </div>
                              <p className="text-[11px] text-slate-500 font-mono">Codigo: {otherApp.code}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             {otherApp.status === 'Active' ? (
                               <>
                                 <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-blue-600 font-bold" onClick={() => handleOpenApp(otherApp)}>
                                   Abrir
                                 </Button>
                                 <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 font-bold shadow-sm" onClick={() => navigate(`/organizations/${orgId}/apps/${otherApp.id}`)}>
                                   Gestionar
                                 </Button>
                               </>
                             ) : (
                               <Button variant="outline" size="sm" className="h-8 text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleReactivateApp(otherApp)}>
                                 Reactivar
                               </Button>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-slate-100">
                      <Button variant="ghost" size="sm" className="w-full text-slate-400 border border-dashed border-slate-200 hover:bg-slate-50 hover:text-blue-600 font-bold py-6 transition-all" onClick={() => navigate(`/organizations/${orgId}/provision`)}>
                        + Añadir nueva App
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Sidebar */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* PROTOTYPE: Static "Aplicaciones" Header for the sidebar section to match image visually */}
                <h3 className="font-bold text-xl text-slate-900">Aplicaciones</h3>

                {/* Owner Profile Card */}
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden group hover:border-violet-200 transition-colors cursor-pointer">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-slate-900 text-base">Juan Pérez</p>
                           <span className="text-xs text-slate-400 font-medium">(Owner)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Me la GA!09 <span className="text-slate-300">•</span> (Admin)</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-violet-500 transition-colors" />
                  </CardContent>
                  <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                         <div className="h-2 w-2 rounded-full bg-emerald-500" />
                         <span className="text-xs font-bold text-slate-700">US-East-1</span>
                      </div>
                      <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer">
                         Gestionar perfiles
                      </Badge>
                  </div>
                </Card>

                {/* Configuration Card (Right Panel "Aplicaciones" details) */}
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100 py-4 px-5 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-bold text-slate-900">Configuración</CardTitle>
                    <StatusBadge status={isActive ? 'active' : 'inactive'} />
                  </CardHeader>
                  <CardContent className="p-5 space-y-5">
                    <div className="space-y-4">
                      
                      {/* URL Field */}
                      <div className="flex items-start gap-3 text-sm">
                         <div className="mt-0.5"><Globe className="h-4 w-4 text-slate-400" /></div>
                         <div className="flex-1 min-w-0">
                            <span className="text-slate-900 font-bold mr-2">URL -</span>
                            <a href={app.url || `https://${app.code}.ajptech.farutech.com`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block">
                               {app.url || `https://${app.code}.ajptech.farutech.com`}
                            </a>
                         </div>
                      </div>

                      {/* Environment Field */}
                      <div className="flex items-center gap-3 text-sm">
                        <Server className="h-4 w-4 text-slate-400" />
                        <div>
                           <span className="text-slate-900 font-bold mr-2">Entorno:</span>
                           <span className="text-slate-500 capitalize">{app.environment || 'Producción'}</span>
                        </div>
                      </div>

                      {/* Version Field */}
                      <div className="flex items-center gap-3 text-sm">
                        <Package className="h-4 w-4 text-slate-400" />
                        <div>
                           <span className="text-slate-900 font-bold mr-2">Versión -</span>
                           {/* TODO: Replace hardcoded version with real application version data when available */}
                           <span className="text-slate-500">2.4.1</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />

                    {/* Actions Grid */}
                    <div className="grid grid-cols-1 gap-3 pt-2">
                       <Button variant="outline" className="w-full justify-start text-xs h-9 font-bold bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-violet-200 hover:text-violet-700">
                        <Settings className="h-3 w-3 mr-2" />
                        Cambiar configuración
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="w-full justify-start text-xs h-9 font-bold bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-red-200 hover:text-red-600">
                            <RefreshCw className="h-3 w-3 mr-2" />
                            Reiniciar
                          </Button>
                           <Button variant="outline" className="w-full justify-start text-xs h-9 font-bold bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200">
                            <Activity className="h-3 w-3 mr-2" />
                            Inactivar
                          </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Aplicaciones de la Organización</h2>
            <div className="space-y-2">
              {apps?.map(a => (
                <ApplicationCard
                  key={a.id}
                  app={a}
                  onOpen={(a) => {
                    const url = applicationsService.getDashboardUrl(a);
                    window.open(url, '_blank');
                  }}
                  onManage={(a) => navigate(`/organizations/${orgId}/apps/${a.id}`)}
                  onReactivate={(a) => {
                    if (orgId) {
                      reactivateMutation.mutate({ orgId, appId: a.id });
                    }
                  }}
                  isReactivating={reactivateMutation.isPending}
                />
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Usuarios</h2>
            <Card className="bg-white border-slate-200">
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Gestión de usuarios próximamente</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice Tab */}
          <TabsContent value="invoice" className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Facturación</h2>
            <Card className="bg-white border-slate-200">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Información de facturación próximamente</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Logs de Actividad</h2>
            <Card className="bg-white border-slate-200">
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Logs de actividad próximamente</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
