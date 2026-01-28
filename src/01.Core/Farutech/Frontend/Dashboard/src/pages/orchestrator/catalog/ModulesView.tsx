// ============================================================================
// MODULES VIEW - Vista de módulos de un producto
// ============================================================================

import { useProductModules } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { ProductDto, ModuleDto } from '@/types/api';

interface ModulesViewProps {
  product: ProductDto;
  onSelectModule: (module: ModuleDto) => void;
  onBack: () => void;
}

export function ModulesView({ product, onSelectModule, onBack }: ModulesViewProps) {
  const { data: modules, isLoading } = useProductModules(product.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Módulos de {product.name}</h2>
          <p className="text-white/60 mt-1">{modules?.length || 0} módulos disponibles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Módulo
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules?.map((module) => (
          <Card
            key={module.id}
            className="bg-slate-900/50 border-white/10 hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => onSelectModule(module)}
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {module.name}
                <ChevronRight className="h-5 w-5" />
              </CardTitle>
              <CardDescription className="text-white/60">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant={module.isActive ? 'default' : 'secondary'}>
                  {module.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
                {module.features && (
                  <Badge variant="outline" className="text-white/80">
                    {module.features.length} features
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
