// ============================================================================
// ORGANIZATION DETAIL PAGE - Dashboard with Summary and Applications
// ============================================================================

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Settings, 
  Users, 
  Activity, 
  Plus, 
  ExternalLink,
  DollarSign,
  Briefcase,
  Search,
  Filter,
  Copy,
  Globe,
  Server,
  Package,
  RefreshCw,
  LayoutGrid,
  LayoutDashboard,
  AppWindow,
  Receipt,
  FileText,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  ChevronDown
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/shared/StatusBadge';

import { useCustomer, useOrganizationSummary } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganizationApplications, useReactivateApplication } from '@/hooks/useApi';
import { applicationsService, type ApplicationSummary } from '@/services/applications.service';
import { useInstanceNavigation } from '@/hooks/useInstanceNavigation';
import { useToast } from '@/components/ui/use-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricCard, StatItem } from '@/components/shared/MetricCard';
import { ApplicationCard } from '@/components/organizations/ApplicationCard';
import { cn } from '@/lib/utils';

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

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Role-based permissions
  // For now, allow management for everyone as requested
  const canManage = true;
  
  // Query params for deep linking
  const tabParam = searchParams.get('tab');
  const appParam = searchParams.get('app');
  
  // State
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(appParam || null);
  
  // Data hooks
  const { availableTenants } = useAuth();
  const { data: customerData, isLoading: customerLoading } = useCustomer(id || '');
  const { summary: apiSummary, apps: apiApps, isLoading: summaryLoading } = useOrganizationSummary(id || '');
  const reactivateMutation = useReactivateApplication();
  
  // Logic to handle "Normal Users" who don't have access to Orchestrator API
  // We fall back to availableTenants from AuthContext
  const fallbackOrg = useMemo(() => {
    if (canManage || !id) return null;
    return availableTenants.find(t => t.tenantId === id);
  }, [canManage, id, availableTenants]);

  // Unified Data
  const customer = canManage ? customerData : (fallbackOrg ? {
    id: fallbackOrg.tenantId,
    companyName: fallbackOrg.companyName,
    code: fallbackOrg.companyCode,
    taxId: fallbackOrg.taxId,
    email: '', // Fallback email not available in option dto
    isActive: true // Assume active if available in list
  } : customerData);

  const apps = useMemo(() => {
    if (apiApps && apiApps.length > 0) return apiApps;
    if (fallbackOrg && fallbackOrg.instances) {
      return fallbackOrg.instances.map(i => ({
        id: i.instanceId,
        name: i.name,
        code: i.code,
        type: i.type,
        status: (i.status?.toLowerCase() === 'active' || i.status?.toLowerCase() === 'online') ? 'Active' : 'Inactive',
        url: i.url
      } as ApplicationSummary));
    }
    return apiApps || [];
  }, [apiApps, fallbackOrg]);

  const summary = useMemo(() => {
    // Prioritize calculated summary from apps list to ensure consistency
    if (apps.length > 0) {
      return applicationsService.calculateOrganizationSummary(apps);
    }
    if (apiSummary) return apiSummary;
    return null;
  }, [apiSummary, apps]);

  // Instance navigation for launching apps
  const { navigateToInstance } = useInstanceNavigation();

  const isLoading = customerLoading || (canManage && summaryLoading);

  // Computed values for master-detail view
  const filteredApps = useMemo(() => {
    if (!apps) return [];
    if (!searchTerm) return apps;
    const term = searchTerm.toLowerCase();
    return apps.filter(app => 
      app.name.toLowerCase().includes(term) ||
      app.code.toLowerCase().includes(term) ||
      app.type.toLowerCase().includes(term)
    );
  }, [apps, searchTerm]);

  const selectedApp = useMemo(() => {
    if (!selectedAppId || !apps) return null;
    return apps.find(app => app.id === selectedAppId) || null;
  }, [selectedAppId, apps]);

  // Effect to handle query params for app preselection
  useEffect(() => {
    if (appParam && apps && apps.length > 0) {
      setSelectedAppId(appParam);
    }
  }, [appParam, apps]);

  // Effect to handle navigation back from provision page
  useEffect(() => {
    const lastActiveTab = sessionStorage.getItem('lastActiveTab');
    if (lastActiveTab) {
      setActiveTab(lastActiveTab);
      sessionStorage.removeItem('lastActiveTab');
    }
  }, []);

  // Handlers
  const handleOpenApp = async (app: ApplicationSummary) => {
    // Try to use navigateToInstance for proper session handling
    if (customer && id) {
      try {
        await navigateToInstance(
          id,
          app.id,
          customer.code || '',
          app.code,
          { preserveSession: true, openInNewTab: true, method: 'POST' }
        );
      } catch {
        // Fallback to direct URL
        const url = applicationsService.getDashboardUrl(app);
        window.open(url, '_blank');
      }
    } else {
      const url = applicationsService.getDashboardUrl(app);
      window.open(url, '_blank');
    }
  };

  const handleManageApp = (app: ApplicationSummary) => {
    // Instead of navigating to separate route, switch to applications tab and select app
    setActiveTab('applications');
    setSelectedAppId(app.id);
    setSearchParams({ tab: 'applications', app: app.id });
    
    // Scroll to top to show the selected app in the detail panel
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReactivateApp = (app: ApplicationSummary) => {
    if (!id) return;
    reactivateMutation.mutate({ orgId: id, appId: app.id });
  };

  const handleCreateInstance = () => {
    // Save current tab state for navigation back
    sessionStorage.setItem('lastActiveTab', activeTab);
    navigate(`/organizations/${id}/provision`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <AppHeader title="Cargando..." showBackToHome />
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not found state
  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <AppHeader title="Organización" showBackToHome />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Building2 className="h-16 w-16 text-slate-300 mx-auto" />
            <h2 className="text-xl font-semibold text-slate-900">Organización no encontrada</h2>
            <Button onClick={() => navigate('/organizations')}>Volver a Organizaciones</Button>
          </div>
        </main>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <AppHeader title={customer.companyName || 'Organización'} showBackToHome />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        {/* Navigation and Header */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
           <span className="text-blue-600 font-bold text-lg">Farutech</span>
           <span className="text-slate-300 text-lg">|</span>
           <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900" onClick={() => navigate('/organizations')}>
             <span className="text-lg font-medium text-slate-900">{customer.companyName}</span>
             <ChevronDown className="h-4 w-4 text-slate-400" />
           </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-transparent border-b border-slate-200 rounded-none w-full justify-start h-auto p-0 gap-8">
            <TabsTrigger 
              value="dashboard" 
              className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-violet-700 font-semibold"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-700 font-semibold text-slate-500"
            >
              <AppWindow className="h-4 w-4 mr-2" />
              Aplicaciones
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-700 font-semibold text-slate-500"
            >
              <Users className="h-4 w-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-700 font-semibold text-slate-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-700 font-semibold text-slate-500"
            >
              <Receipt className="h-4 w-4 mr-2" />
              Facturación
            </TabsTrigger>
            <TabsTrigger 
              value="logs" 
              className="px-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-700 font-semibold text-slate-500"
            >
              <FileText className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-slate-200 shadow-sm">
                   <CardContent className="p-5 flex items-center justify-between">
                      <div>
                         <p className="text-sm font-medium text-slate-500">Total Apps</p>
                         <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary?.totalApps || 0}</h3>
                      </div>
                      <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                         <AppWindow className="h-5 w-5 text-indigo-600" />
                      </div>
                   </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                   <CardContent className="p-5 flex items-center justify-between">
                      <div>
                         <p className="text-sm font-medium text-slate-500">Activas</p>
                         <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary?.activeApps || 0}</h3>
                      </div>
                      <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                         <Activity className="h-5 w-5 text-emerald-600" />
                      </div>
                   </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                   <CardContent className="p-5 flex items-center justify-between">
                      <div>
                         <p className="text-sm font-medium text-slate-500">Inactivas</p>
                         <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary?.inactiveApps || 0}</h3>
                      </div>
                      <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center">
                         <Package className="h-5 w-5 text-slate-400" />
                      </div>
                   </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                   <CardContent className="p-5 flex items-center justify-between">
                      <div>
                         <p className="text-sm font-medium text-slate-500">Costo Mensual</p>
                         <h3 className="text-2xl font-bold text-slate-900 mt-1">
                           ${summary?.lastPaymentAmount?.toFixed(2) || '0.00'}
                         </h3>
                      </div>
                      <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                         <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                   </CardContent>
                </Card>
              </div>

              {/* Billing & Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Billing Information */}
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Información de Facturación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Estado</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            summary?.billingStatus === 'Al día' ? "bg-green-500" :
                            summary?.billingStatus === 'Pago Pendiente' ? "bg-red-500" : "bg-yellow-500"
                          )} />
                          <span className="text-sm font-medium text-slate-900">
                            {summary?.billingStatus || 'Sin consumo'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Último Pago</p>
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          {summary?.lastPaymentDate
                            ? new Date(summary.lastPaymentDate).toLocaleDateString('es-ES')
                            : 'Sin pagos'
                          }
                        </p>
                      </div>
                    </div>

                    {summary?.nextBillingDate && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-sm font-medium text-slate-500">Próximo Ciclo</p>
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          {new Date(summary.nextBillingDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Actividad Reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {apps && apps.length > 0 ? (
                      <div className="space-y-3">
                        {apps.slice(0, 5).map((app) => (
                          <div key={app.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center text-sm",
                                app.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"
                              )}>
                                {getAppIcon(app.type)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">{app.name}</p>
                                <p className="text-xs text-slate-500">{app.code}</p>
                              </div>
                            </div>
                            <StatusBadge status={app.status === 'Active' ? 'active' : 'inactive'} />
                          </div>
                        ))}
                        {apps.length > 5 && (
                          <div className="pt-2 border-t border-slate-100">
                            <p className="text-xs text-slate-500 text-center">
                              +{apps.length - 5} aplicaciones más
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">No hay actividad reciente</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>

              {/* Quick Actions */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-lg font-semibold text-slate-900">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      className="h-auto p-4 bg-violet-600 hover:bg-violet-700 flex flex-col items-center gap-2"
                      onClick={handleCreateInstance}
                    >
                      <Plus className="h-6 w-6" />
                      <span className="text-sm font-medium">Nueva Aplicación</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-slate-50"
                      onClick={() => setActiveTab('applications')}
                    >
                      <AppWindow className="h-6 w-6" />
                      <span className="text-sm font-medium">Gestionar Apps</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-slate-50"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="h-6 w-6" />
                      <span className="text-sm font-medium">Configuración</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Aplicaciones</h2>
              {canManage && (
                <Button 
                  className="gap-2 bg-violet-600 hover:bg-violet-700"
                  onClick={handleCreateInstance}
                >
                  <Plus className="h-4 w-4" />
                  Añadir nueva App
                </Button>
              )}
            </div>
            
            {/* Master-Detail Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Applications List (Master) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                    <Search className="h-4 w-4 text-slate-400 ml-2" />
                    <Input 
                      placeholder="Buscar aplicación..." 
                      className="border-none shadow-none focus-visible:ring-0 h-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                  <CardHeader className="py-4 px-5 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-700">Aplicaciones</h3>
                          <span className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded border border-slate-200">
                              {filteredApps?.length || 0} resultados
                          </span>
                      </div>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="divide-y divide-slate-100">
                        {filteredApps?.map(app => (
                           <div 
                              key={app.id}
                              onClick={() => setSelectedAppId(app.id)}
                              className={cn(
                                  "p-4 flex items-center justify-between cursor-pointer transition-all border-l-4 hover:bg-slate-50",
                                  selectedAppId === app.id ? "bg-violet-50 border-l-violet-600" : "bg-white border-l-transparent"
                              )}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={cn(
                                     "h-10 w-10 rounded-lg flex items-center justify-center text-xl transition-colors",
                                     selectedAppId === app.id ? "bg-white shadow-sm text-violet-600" : "bg-slate-100 text-slate-500"
                                 )}>
                                    {getAppIcon(app.type)}
                                 </div>
                                 <div>
                                    <h4 className={cn("font-bold text-sm", selectedAppId === app.id ? "text-violet-900" : "text-slate-900")}>
                                        {app.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                                        <span>{app.code}</span>
                                        {app.status === 'Active' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                        {(!filteredApps || filteredApps.length === 0) && (
                            <div className="py-12 text-center text-slate-400">
                                No se encontraron aplicaciones
                            </div>
                        )}
                     </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Selected App Details (Detail) */}
              <div className="lg:col-span-5 space-y-6">
                 {selectedApp ? (
                    <div className="sticky top-6 space-y-6">
                        {/* Header Card */}
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex flex-col items-center text-center space-y-3 mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-3xl shadow-lg shadow-violet-200 text-white">
                                    {getAppIcon(selectedApp.type)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedApp.name}</h2>
                                    <p className="text-sm text-slate-500 font-mono mt-1">{selectedApp.code}</p>
                                </div>
                                <StatusBadge status={selectedApp.status === 'Active' ? 'active' : 'inactive'} />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <Button 
                                  className="w-full h-11 bg-violet-600 hover:bg-violet-700 font-bold shadow-lg shadow-violet-100"
                                  onClick={() => handleOpenApp(selectedApp)}
                                  disabled={selectedApp.status !== 'Active'}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Abrir Aplicación
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="w-full h-11 font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                                  onClick={() => handleManageApp(selectedApp)}
                                >
                                  Gestionar Detalles
                                </Button>
                            </div>
                        </div>

                        {/* Info Card */}
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 py-3 px-5">
                                <h4 className="font-bold text-slate-800 text-sm">Información de Conexión</h4>
                            </CardHeader>
                            <CardContent className="p-5 space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">URL de Acceso</label>
                                    <div className="flex items-center gap-2 group">
                                        <Globe className="h-4 w-4 text-violet-500" />
                                        <a 
                                          href={applicationsService.getDashboardUrl(selectedApp)}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-sm font-medium text-slate-700 hover:text-violet-600 hover:underline truncate"
                                          onClick={(e) => { e.preventDefault(); handleOpenApp(selectedApp); }}
                                        >
                                            {applicationsService.getDashboardUrl(selectedApp)}
                                        </a>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Entorno</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Server className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700 capitalize">{selectedApp.environment || 'Producción'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Suscripción</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <CreditCard className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">{selectedApp.subscription || 'Standard'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Versión</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Package className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">v2.4.1</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions Card */}
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardContent className="p-2">
                                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-9">
                                    <Activity className="h-4 w-4 mr-2" />
                                    <span className="text-xs font-bold">Inactivar Instancia</span>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[400px]">
                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <LayoutGrid className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Selecciona una App</h3>
                        <p className="text-slate-500 text-sm max-w-[200px] mt-2">
                            Haz clic en una aplicación del listado para ver sus detalles y opciones.
                        </p>
                    </div>
                 )}
              </div>

            </div>
          </TabsContent>

          {/* Users Tab */}
          {canManage && (
            <TabsContent value="users" className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Usuarios</h2>
              <Card className="bg-white border-slate-200">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Gestión de usuarios próximamente</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Settings Tab */}
          {canManage && (
            <TabsContent value="settings" className="space-y-6">

            <h2 className="text-xl font-bold text-slate-900">Configuración</h2>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Nombre</label>
                    <p className="text-slate-900 font-semibold">{customer.companyName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Código</label>
                    <p className="text-slate-900 font-mono">{customer.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">ID Fiscal</label>
                    <p className="text-slate-900 font-mono">{customer.taxId || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Email</label>
                    <p className="text-slate-900">{customer.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </TabsContent>
          )}

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Facturación</h2>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Descargar Facturas
              </Button>
            </div>

            {/* Billing Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Costo Mensual Actual</p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        ${summary?.lastPaymentAmount?.toFixed(2) || '0.00'}
                      </h3>
                    </div>
                    <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Estado de Cuenta</p>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {summary?.billingStatus || 'Sin consumo'}
                      </h3>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Próximo Ciclo</p>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {summary?.nextBillingDate
                          ? new Date(summary.nextBillingDate).toLocaleDateString('es-ES')
                          : 'Sin fecha'
                        }
                      </h3>
                    </div>
                    <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Billing History */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-green-600" />
                  Historial de Pagos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {summary?.lastPaymentDate ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Pago mensual</p>
                          <p className="text-sm text-slate-500">
                            {new Date(summary.lastPaymentDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          ${summary.lastPaymentAmount?.toFixed(2)}
                        </p>
                        <p className="text-sm text-green-600">Pagado</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No hay historial de pagos</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Desglose de Costos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {apps && apps.length > 0 ? (
                    apps.map((app) => (
                      <div key={app.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-sm bg-slate-50">
                            {getAppIcon(app.type)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{app.name}</p>
                            <p className="text-sm text-slate-500">{app.code}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">$29.00</p>
                          <p className="text-sm text-slate-500">mensual</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">No hay aplicaciones activas</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Logs de Actividad</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Actualizar
                </Button>
              </div>
            </div>

            {/* Activity Feed */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {/* Mock activity logs - in real app, this would come from API */}
                  <div className="p-4 hover:bg-slate-50">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          Aplicación activada exitosamente
                        </p>
                        <p className="text-sm text-slate-500">
                          La aplicación <span className="font-medium">Empresa de pruebas 02</span> ha sido activada
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Hace 2 horas</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-50">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Plus className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          Nueva aplicación provisionada
                        </p>
                        <p className="text-sm text-slate-500">
                          Se creó la aplicación <span className="font-medium">TEST02</span> del tipo Billing
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Hace 1 día</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-50">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-orange-50 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          Aplicación en provisionamiento
                        </p>
                        <p className="text-sm text-slate-500">
                          La aplicación <span className="font-medium">Empresa de pruebas 01</span> está siendo configurada
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Hace 2 días</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-50">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          Error en activación
                        </p>
                        <p className="text-sm text-slate-500">
                          Falló la activación de la aplicación <span className="font-medium">TEST01</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Hace 3 días</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Events */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Server className="h-5 w-5 text-purple-600" />
                  Eventos del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="h-6 w-6 bg-green-50 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Backup completado</p>
                      <p className="text-xs text-slate-500">Base de datos respaldada exitosamente</p>
                    </div>
                    <span className="text-xs text-slate-400">Hoy 08:00</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="h-6 w-6 bg-blue-50 rounded-full flex items-center justify-center">
                      <RefreshCw className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Actualización del sistema</p>
                      <p className="text-xs text-slate-500">Versión 2.4.1 instalada</p>
                    </div>
                    <span className="text-xs text-slate-400">Ayer 14:30</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="h-6 w-6 bg-yellow-50 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Alerta de rendimiento</p>
                      <p className="text-xs text-slate-500">Uso de CPU elevado detectado</p>
                    </div>
                    <span className="text-xs text-slate-400">Hace 2 días</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
