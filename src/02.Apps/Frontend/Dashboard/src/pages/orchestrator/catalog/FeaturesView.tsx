// ============================================================================
// FEATURES VIEW - Vista de features de un módulo
// ============================================================================

import { useModuleFeatures } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Plus, Check, X } from 'lucide-react';
import type { ModuleDto } from '@/types/api';

interface FeaturesViewProps {
  module: ModuleDto;
  onBack: () => void;
}

export function FeaturesView({ module, onBack }: FeaturesViewProps) {
  const { data: features, isLoading } = useModuleFeatures(module.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Features de {module.name}</h2>
          <p className="text-white/60 mt-1">{features?.length || 0} features disponibles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Feature
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {features?.map((feature) => (
          <Card key={feature.id} className="bg-slate-900/50 border-white/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    {feature.isActive ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                    {feature.name}
                  </CardTitle>
                  <CardDescription className="text-white/60 mt-2">
                    {feature.description}
                  </CardDescription>
                </div>
                <Badge variant={feature.isActive ? 'default' : 'secondary'}>
                  {feature.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
