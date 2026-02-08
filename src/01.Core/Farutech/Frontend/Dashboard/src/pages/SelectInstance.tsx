import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInstanceNavigation } from '@/hooks/useInstanceNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Store, ShoppingBag, Warehouse, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const getInstanceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pos':
      return <Store className="h-12 w-12" />;
    case 'ecommerce':
      return <ShoppingBag className="h-12 w-12" />;
    case 'inventory':
      return <Warehouse className="h-12 w-12" />;
    default:
      return <Store className="h-12 w-12" />;
  }
};

const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'active' || statusLower === 'running') {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Activo
      </span>
    );
  }
  
  if (statusLower === 'pending' || statusLower === 'provisioning') {
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
        En configuración
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
      {status}
    </span>
  );
};

export default function SelectInstance() {
  const navigate = useNavigate();
  const { 
    availableInstances, 
    selectedTenant,
    isLoading,
    requiresInstanceSelection,
  } = useAuth();

  const { navigateToInstance, navigateToInstanceSelection } = useInstanceNavigation();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstances = useMemo(() => {
    if (!searchTerm.trim()) return availableInstances;
    const q = searchTerm.toLowerCase().trim();
    return availableInstances.filter(i =>
      (i.name || '').toLowerCase().includes(q) ||
      (i.code || '').toLowerCase().includes(q) ||
      (i.type || '').toLowerCase().includes(q)
    );
  }, [availableInstances, searchTerm]);

  useEffect(() => {
    // Si no hay instancias disponibles o no hay tenant seleccionado, redirigir
    if (!requiresInstanceSelection || availableInstances.length === 0) {
      navigate('/');
    }
  }, [requiresInstanceSelection, availableInstances, navigate]);

  const handleSelectInstance = async (instance: typeof availableInstances[0]) => {
    console.log('🖱️ Seleccionando instancia en select-instance:', instance);
    
    if (!selectedTenant || !instance) {
      console.error('❌ No hay tenant o instancia seleccionada');
      return;
    }

    const isActive = instance.status.toLowerCase() === 'active' || 
                    instance.status.toLowerCase() === 'running';
    
    if (!isActive) {
      toast.info('Esta aplicación está siendo configurada');
      return;
    }

    try {
      console.log('🚀 Navegando a instancia desde select-instance:', {
        tenantId: selectedTenant.tenantId,
        instanceId: instance.instanceId,
        orgCode: selectedTenant.companyCode,
        instanceCode: instance.code
      });

      await navigateToInstance(
        selectedTenant.tenantId,
        instance.instanceId,
        selectedTenant.companyCode || '',
        instance.code,
        { 
          preserveSession: true, 
          openInNewTab: false,
          method: 'POST'
        }
      );
    } catch (error) {
      console.error('❌ Error selecting instance:', error);
      toast.error('Error al cargar la aplicación');
    }
  };

  const handleBack = () => {
    // Volver a la selección de organización
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando aplicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a organizaciones
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Selecciona una Aplicación
            </h1>
            <p className="text-lg text-gray-600">
              {selectedTenant?.companyName || 'Tu organización'} tiene múltiples aplicaciones disponibles
            </p>
          </div>
        </div>

        {/* Instances Grid */}
        <div className="mb-4 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar aplicación por nombre, código o tipo..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstances.map((instance) => {
            const isActive = instance.status.toLowerCase() === 'active' || instance.status.toLowerCase() === 'running';
            
            return (
              <Card 
                key={instance.instanceId}
                className={`
                  relative overflow-hidden transition-all duration-300 hover:shadow-xl
                  ${!isActive ? 'opacity-75' : 'hover:scale-105 cursor-pointer'}
                `}
                onClick={() => isActive && handleSelectInstance(instance)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-bl-full opacity-50" />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg">
                      {getInstanceIcon(instance.type)}
                    </div>
                    {getStatusBadge(instance.status)}
                  </div>
                  
                  <CardTitle className="text-xl">
                    {instance.name}
                  </CardTitle>
                  
                  <CardDescription className="text-sm">
                    <span className="font-medium text-gray-700">{instance.type}</span>
                    {instance.code && (
                      <span className="ml-2 text-gray-500">· {instance.code}</span>
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  {isActive ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectInstance(instance);
                      }}
                    >
                      Ingresar
                    </Button>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-500">
                        Esta aplicación está siendo configurada
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredInstances.length === 0 && (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>No hay aplicaciones disponibles</CardTitle>
              <CardDescription>
                Contacta con soporte para activar aplicaciones en tu organización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleBack}
                className="w-full"
              >
                Volver
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
