import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Plus, Globe, Server, Activity } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useCustomers } from '@/hooks/useApi';
import { useQueryModal } from '@/hooks/useQueryModal';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateInstanceModal } from '@/components/CreateInstanceModal';

export default function OrganizationAppsPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const { selectContext, availableTenants, requiresContextSelection } = useAuth();
  
  const { data: customers, isLoading } = useCustomers({
    enabled: !requiresContextSelection
  });

  const [searchTerm, setSearchTerm] = useState('');
  const modal = useQueryModal();

  // Find the current organization data
  const organization = useMemo(() => {
    if (requiresContextSelection) {
      const tenant = availableTenants?.find(t => t.tenantId === orgId);
      if (!tenant) return null;
      return {
        id: tenant.tenantId,
        name: tenant.companyName || 'Organización',
        code: tenant.companyCode,
        instances: (tenant.instances || []).map(i => ({
          id: i.instanceId,
          code: i.code,
          name: i.name,
          type: i.type,
          status: i.status || 'Active',
          url: i.url
        }))
      };
    } else {
      const customer = customers?.find(c => c.id === orgId);
      if (!customer) return null;
      return {
        id: customer.id,
        name: customer.companyName || 'Organización',
        code: customer.code,
        instances: (customer.tenantInstances || []).map(i => ({
          id: i.id,
          code: i.tenantCode,
          name: i.tenantCode, 
          type: i.environment,
          status: i.status || 'Active',
          url: i.apiBaseUrl
        }))
      };
    }
  }, [orgId, customers, availableTenants, requiresContextSelection]);

  // Filter instances
  const filteredInstances = useMemo(() => {
    if (!organization) return [];
    if (!searchTerm.trim()) return organization.instances;
    
    const search = searchTerm.toLowerCase();
    return organization.instances.filter(i => 
      i.name.toLowerCase().includes(search) || 
      i.code.toLowerCase().includes(search) ||
      i.type.toLowerCase().includes(search)
    );
  }, [organization, searchTerm]);

  // Helper for instance visual config
  const getInstanceConfig = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('vet')) return { color: 'bg-orange-100 text-orange-600 border-orange-200', label: 'Veterinaria' };
    if (t.includes('erp')) return { color: 'bg-blue-100 text-blue-600 border-blue-200', label: 'ERP' };
    if (t.includes('pos')) return { color: 'bg-purple-100 text-purple-600 border-purple-200', label: 'POS' };
    if (t.includes('med') || t.includes('doc')) return { color: 'bg-emerald-100 text-emerald-600 border-emerald-200', label: 'Médico' };
    return { color: 'bg-slate-100 text-slate-600 border-slate-200', label: t || 'App' };
  };

  const handleLaunch = async (instanceId: string, url: string) => {
      if (!organization) return;
      
      const isExternalUrl = url && url.startsWith('http') && 
                           !url.includes('localhost') &&
                           !url.includes(window.location.hostname);
      
      if (isExternalUrl) {
          await selectContext(organization.id, window.location.pathname);
          window.location.href = url;
      } else {
          await selectContext(organization.id, `/app/${instanceId}`);
      }
  };

  if (isLoading) {
      return <div className="p-10 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!organization) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Organización no encontrada</h2>
            <Button onClick={() => navigate('/home')}>Volver al Inicio</Button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
            </Button>
        </div>

        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{organization.name}</h1>
                <Badge variant="outline" className="font-mono text-xs">{organization.code}</Badge>
            </div>
            <p className="text-slate-500">Todas las aplicaciones disponibles</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar aplicación..." 
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => modal.open('new-instance')}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva App
            </Button>
          </div>
        </div>

        <Separator />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInstances.map(instance => {
                const config = getInstanceConfig(instance.type);
                return (
                    <Card key={instance.id} className="hover:shadow-md transition-all cursor-pointer border-slate-200" onClick={() => handleLaunch(instance.id, instance.url)}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className={`${config.color} border border-current/20`}>
                                    {config.label}
                                </Badge>
                                <div className={`h-2.5 w-2.5 rounded-full ${instance.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} title={instance.status} />
                            </div>
                            <CardTitle className="text-lg mt-2">{instance.name}</CardTitle>
                            <CardDescription className="font-mono text-xs">{instance.code}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2 text-xs text-slate-400 flex items-center gap-2">
                            {instance.url ? <Globe className="h-3 w-3" /> : <Server className="h-3 w-3" />}
                            {instance.url || 'Interno'}
                        </CardFooter>
                    </Card>
                );
            })}
            
            {/* Empty State in Grid */}
            {filteredInstances.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                    No se encontraron aplicaciones con ese criterio.
                </div>
            )}
        </div>
      </main>

      {/* Instance Modal - Reusing the component but we need to adapt props or logic */}
      {modal.isOpen('new-instance') && (
        <CreateInstanceModal 
            isOpen={true} 
            onClose={modal.close} 
            organization={{
                 id: organization.id,
                 companyName: organization.name,
                 // mapping minimalistic structure expected by modal might be needed
            } as any}
        />
      )}
    </div>
  );
}
