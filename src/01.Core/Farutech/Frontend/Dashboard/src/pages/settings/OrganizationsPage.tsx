// ============================================================================
// ORGANIZATIONS MANAGEMENT PAGE
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Edit, Trash2, Power, PowerOff, Search } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';
import { OrganizationContextDto, UserContextResponse } from '@/types/api';

export default function OrganizationsPage() {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<OrganizationContextDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load organizations
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const response = await apiClient.get<UserContextResponse>('/api/Auth/context');
        setOrganizations(response.data.organizations);
      } catch (error) {
        console.error('Failed to load organizations', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las organizaciones',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadOrganizations();
  }, [toast]);

  // Filter organizations
  const filteredOrgs = organizations.filter(org =>
    org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.organizationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.taxId && org.taxId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Toggle organization active status
  const handleToggleActive = async (orgId: string, currentStatus: boolean) => {
    try {
      // TODO: Implementar endpoint en el backend
      // await apiClient.patch(`/api/Customers/${orgId}/toggle-active`, { isActive: !currentStatus });
      
      toast({
        title: 'Funcionalidad en desarrollo',
        description: 'La activación/desactivación de organizaciones estará disponible próximamente',
      });

      // Actualizar estado local (temporal)
      setOrganizations(orgs =>
        orgs.map(org =>
          org.organizationId === orgId ? { ...org, isActive: !currentStatus } : org
        )
      );
    } catch (error) {
      console.error('Failed to toggle organization status', error);
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado de la organización',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <AppHeader title="Administración de Organizaciones" showBackToHome={true} />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mis Organizaciones</h1>
            <p className="text-slate-500 text-sm mt-1">Administra tus organizaciones y su configuración</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#8B5CF6] transition-colors" />
              <Input
                placeholder="Buscar por nombre, código o RUC..."
                className="pl-10 bg-white border-slate-200 focus-visible:ring-[#8B5CF6] shadow-sm rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-violet-200 whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Organización
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* Organizations List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredOrgs.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No se encontraron organizaciones</h3>
              <p className="text-slate-500 mt-2">
                {searchTerm ? 'Intenta ajustar tu búsqueda' : 'Comienza creando tu primera organización'}
              </p>
            </div>
          ) : (
            filteredOrgs.map(org => (
              <Card
                key={org.organizationId}
                className={`border-slate-200 transition-all ${
                  org.isActive ? 'bg-white' : 'bg-slate-50 opacity-75'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">
                          {org.organizationName}
                        </CardTitle>
                        
                        {org.isOwner && (
                          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider border-none">
                            👑 Owner
                          </Badge>
                        )}
                        
                        {!org.isActive && (
                          <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 text-[10px] font-bold uppercase">
                            Inactiva
                          </Badge>
                        )}
                      </div>
                      
                      <CardDescription className="space-y-1">
                        <div className="flex gap-4 text-xs">
                          <span>
                            <strong>Código:</strong> {org.organizationCode || 'N/A'}
                          </span>
                          {org.taxId && (
                            <span>
                              <strong>RUC:</strong> {org.taxId}
                            </span>
                          )}
                          <span>
                            <strong>Rol:</strong> {org.role}
                          </span>
                        </div>
                        <div className="text-xs">
                          <strong>Instancias:</strong> {org.instances.length}
                        </div>
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      {org.isOwner && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(org.organizationId, org.isActive)}
                            className={org.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                          >
                            {org.isActive ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Activar
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {org.instances.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {org.instances.map(instance => (
                        <Badge
                          key={instance.instanceId}
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          {instance.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
