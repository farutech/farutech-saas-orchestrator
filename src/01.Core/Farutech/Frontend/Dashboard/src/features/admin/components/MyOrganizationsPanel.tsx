import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Search, ArrowRight, Settings, Plus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function MyOrganizationsPanel() {
  const { availableTenants, selectContext, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter tenants based on search term
  const filteredTenants = availableTenants
    .filter((t) => 
      t.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5); // Show max 5

  const handleSwitch = async (tenantId: string) => {
    await selectContext(tenantId);
  };

  // Lógica de Empty State (Usuario Nuevo / Sin Organización)
  if (availableTenants.length === 0) {
      // Si el usuario es Owner (o asumimos que es nuevo owner si no tiene rol definido aún)
      // La lógica exacta de roles puede variar, aquí priorizamos el flujo de activación.
      const isOwner = user?.role === 'Owner' || !user?.role; 

      if (isOwner) {
        return (
            <Card className="col-span-1 border-none shadow-md bg-white/50 backdrop-blur-sm border-dashed border-2 border-primary/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-primary">
                        Bienvenido a tu Espacio de Trabajo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <LayoutDashboard className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm text-center text-muted-foreground leading-relaxed max-w-xs mx-auto">
                            Aún no has desplegado ninguna aplicación (ERP, Médico, etc.). <br/>
                            Comienza ahora para activar tu organización.
                        </p>
                        <Button 
                            onClick={() => navigate('/provisioning')}
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg transition-all hover:scale-[1.02]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Nueva Instancia
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
      } else {
          return (
            <Card className="col-span-1 border-none shadow-md bg-white/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full text-center">
                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                        <Building2 className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Sin Acceso</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        No tienes organizaciones asignadas. Contacta a soporte o a tu administrador.
                    </p>
                </CardContent>
            </Card>
          );
      }
  }

  return (
    <Card className="col-span-1 border-none shadow-md bg-white/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Mis Organizaciones
        </CardTitle>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {availableTenants.length > 5 && (
            <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Buscar organización..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
        )}

        <div className="space-y-3">
          {filteredTenants.map((tenant) => (
            <div
              key={tenant.tenantId}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => handleSwitch(tenant.tenantId)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md group-hover:bg-primary/20">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {tenant.companyName || 'Organización sin nombre'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] h-5 px-2">
                      {tenant.role || 'Member'}
                    </Badge>
                    {tenant.tenantId === user?.tenantId && (
                        <span className="text-[10px] text-green-600 font-medium">● Activo</span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {filteredTenants.length === 0 && (
             <div className="text-center py-4 text-muted-foreground text-sm">
                 No se encontraron organizaciones.
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
