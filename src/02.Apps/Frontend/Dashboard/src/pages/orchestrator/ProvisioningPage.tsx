// ============================================================================
// PROVISIONING PAGE - Wizard para provisionar tenants
// ============================================================================

import { useState } from 'react';
import { useCustomers, useProducts, useProvisionTenant } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Server, ChevronRight, Check } from 'lucide-react';
import type { ProvisionTenantRequest } from '@/types/api';

export default function ProvisioningPage() {
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const provisionMutation = useProvisionTenant();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProvisionTenantRequest>({
    customerId: '',
    productId: '',
    environment: 'Production',
    moduleIds: [],
  });

  const selectedProduct = products?.find((p) => p.id === formData.productId);

  const handleProvision = async () => {
    await provisionMutation.mutateAsync(formData);
    setStep(1);
    setFormData({ customerId: '', productId: '', environment: 'Production', moduleIds: [] });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Server className="mr-3 h-8 w-8" />
          Provisionamiento
        </h1>
        <p className="text-white/60 mt-2">Configura una nueva instancia para un cliente</p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= s ? 'bg-primary text-white' : 'bg-slate-800 text-white/40'
              }`}
            >
              {step > s ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < 3 && <div className={`w-32 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Cliente */}
      {step === 1 && (
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Paso 1: Seleccionar Cliente</CardTitle>
            <CardDescription className="text-white/60">Elige el cliente para esta instancia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Cliente</Label>
              <Select value={formData.customerId} onValueChange={(v) => setFormData({ ...formData, customerId: v })}>
                <SelectTrigger className="bg-slate-800 border-white/10 text-white">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setStep(2)} disabled={!formData.customerId}>
              Siguiente <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Producto */}
      {step === 2 && (
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Paso 2: Seleccionar Producto</CardTitle>
            <CardDescription className="text-white/60">Elige el producto a provisionar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Empty State - Productos */}
            {!products || products.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg bg-slate-800/30">
                <Server className="mx-auto h-12 w-12 text-white/20 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No hay productos disponibles</h3>
                <p className="text-white/60 text-sm max-w-md mx-auto">
                  No hay productos disponibles en el catálogo. Contacta al administrador del sistema para agregar productos antes de continuar.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((p) => (
                  <Card
                    key={p.id}
                    className={`cursor-pointer transition-all ${
                      formData.productId === p.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setFormData({ ...formData, productId: p.id })}
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{p.name}</CardTitle>
                      <CardDescription className="text-white/60">{p.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!formData.productId || !products || products.length === 0}
              >
                Siguiente <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Configuración */}
      {step === 3 && (
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Paso 3: Configuración</CardTitle>
            <CardDescription className="text-white/60">Selecciona módulos y entorno</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-white">Entorno</Label>
              <Select value={formData.environment} onValueChange={(v) => setFormData({ ...formData, environment: v })}>
                <SelectTrigger className="bg-slate-800 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Desarrollo</SelectItem>
                  <SelectItem value="Staging">Staging</SelectItem>
                  <SelectItem value="Production">Producción</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedProduct?.modules && (
              <div>
                <Label className="text-white mb-3 block">Módulos</Label>
                <div className="space-y-2">
                  {selectedProduct.modules.map((m) => (
                    <div key={m.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={m.id}
                        checked={formData.moduleIds?.includes(m.id)}
                        onCheckedChange={(checked) => {
                          const newModules = checked
                            ? [...(formData.moduleIds || []), m.id]
                            : formData.moduleIds?.filter((id) => id !== m.id) || [];
                          setFormData({ ...formData, moduleIds: newModules });
                        }}
                      />
                      <label htmlFor={m.id} className="text-white text-sm cursor-pointer">
                        {m.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Atrás</Button>
              <Button onClick={handleProvision}>Provisionar</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
