// ============================================================================
// PROVISIONING PAGE - Enterprise Wizard para provisionar tenants
// Diseño: Split-screen con Sidebar fijo y área de contenido scrollable
// ============================================================================

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCustomers, useProducts, useProvisionTenant } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Server, ChevronRight, Check, X, Database, Settings, UserCircle, HelpCircle, Loader2 } from 'lucide-react';
import type { ProvisionTenantRequest } from '@/types/api';

// Step configuration
const STEPS = [
  { id: 1, title: 'Datos Básicos', description: 'Información del cliente', icon: Database },
  { id: 2, title: 'Infraestructura', description: 'Producto y entorno', icon: Server },
  { id: 3, title: 'Módulos', description: 'Configuración de funcionalidades', icon: Settings },
  { id: 4, title: 'Owner', description: 'Usuario administrador', icon: UserCircle },
];

export default function ProvisioningPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const provisionMutation = useProvisionTenant();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProvisionTenantRequest>({
    customerId: '',
    productId: '',
    environment: 'Production',
    moduleIds: [],
  });

  // Pre-select customer from URL parameter
  useEffect(() => {
    const customerId = searchParams.get('customerId');
    if (customerId) {
      setFormData(prev => ({ ...prev, customerId }));
      setStep(2); // Skip to step 2 if customer is pre-selected
    }
  }, [searchParams]);

  const selectedCustomer = customers?.find((c) => c.id === formData.customerId);
  const selectedProduct = products?.find((p) => p.id === formData.productId);

  const handleProvision = async () => {
    setIsSubmitting(true);
    try {
      await provisionMutation.mutateAsync(formData);
      // Reset and navigate back
      setStep(1);
      setFormData({ customerId: '', productId: '', environment: 'Production', moduleIds: [] });
      navigate('/orchestrator/customers');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1: return !!formData.customerId;
      case 2: return !!formData.productId && !!formData.environment;
      case 3: return formData.moduleIds && formData.moduleIds.length > 0;
      default: return true;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ============================================================
          SIDEBAR - Navigation & Progress Tracker (Fixed Left)
          ============================================================ */}
      <aside className="hidden lg:flex lg:flex-col w-80 bg-white border-r border-gray-200">
        {/* Logo & Brand */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Server className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-lg tracking-tight">Farutech</h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Orchestrator</p>
            </div>
          </div>
        </div>

        {/* Stepper Vertical */}
        <div className="flex-1 p-8">
          <div className="space-y-2">
            {STEPS.map((s, idx) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              const isPending = step < s.id;
              const StepIcon = s.icon;

              return (
                <div key={s.id} className="relative">
                  {/* Connector Line */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`absolute left-5 top-12 w-px h-8 transition-all duration-200 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}

                  {/* Step Item */}
                  <div
                    className={`relative flex items-start gap-4 p-3 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-blue-50 shadow-sm' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5 animate-in zoom-in duration-300" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium tracking-tight transition-colors duration-200 ${
                          isActive ? 'text-gray-900' : isPending ? 'text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Ayuda y Documentación</span>
          </a>
        </div>
      </aside>

      {/* ============================================================
          MAIN CONTENT AREA (Scrollable Right)
          ============================================================ */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Context & Cancel (Sticky Top) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Paso {step} de {STEPS.length}: {STEPS[step - 1]?.title}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orchestrator/customers')}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
        </header>

        {/* Content - Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-8">
            
            {/* ============== STEP 1: Cliente ============== */}
            {step === 1 && (
              <Card className="bg-white shadow-sm rounded-xl border border-gray-200 animate-in fade-in duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-bold tracking-tight">Seleccionar Cliente</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Elige el cliente para el cual se provisionará esta nueva instancia
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-2 block">Cliente</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(v) => setFormData({ ...formData, customerId: v })}
                    >
                      <SelectTrigger className="h-11 bg-white border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCustomer && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-top duration-200">
                      <p className="text-xs font-medium text-gray-700 mb-1">Contacto</p>
                      <p className="text-sm text-gray-900">{selectedCustomer.contactName}</p>
                      <p className="text-xs text-gray-500">{selectedCustomer.contactEmail}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ============== STEP 2: Producto & Entorno ============== */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <Card className="bg-white shadow-sm rounded-xl border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 font-bold tracking-tight">Seleccionar Producto</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Elige el producto que se provisionará para este cliente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!products || products.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <Server className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-base font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                          No hay productos disponibles en el catálogo. Contacta al administrador del sistema.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {products.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setFormData({ ...formData, productId: p.id })}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              formData.productId === p.id
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <h4 className="font-medium text-gray-900 text-sm">{p.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{p.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm rounded-xl border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 font-bold tracking-tight text-base">Entorno</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Selecciona el entorno donde se desplegará la instancia
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={formData.environment}
                      onValueChange={(v) => setFormData({ ...formData, environment: v })}
                    >
                      <SelectTrigger className="h-11 bg-white border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Development">Desarrollo</SelectItem>
                        <SelectItem value="Staging">Staging</SelectItem>
                        <SelectItem value="Production">Producción</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ============== STEP 3: Módulos ============== */}
            {step === 3 && (
              <Card className="bg-white shadow-sm rounded-xl border border-gray-200 animate-in fade-in duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-bold tracking-tight">Configuración de Módulos</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Selecciona los módulos que estarán disponibles para este cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedProduct?.modules && selectedProduct.modules.length > 0 ? (
                    <div className="space-y-3">
                      {selectedProduct.modules.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <Checkbox
                            id={m.id}
                            checked={formData.moduleIds?.includes(m.id)}
                            onCheckedChange={(checked) => {
                              const newModules = checked
                                ? [...(formData.moduleIds || []), m.id]
                                : formData.moduleIds?.filter((id) => id !== m.id) || [];
                              setFormData({ ...formData, moduleIds: newModules });
                            }}
                            className="mt-0.5"
                          />
                          <label htmlFor={m.id} className="flex-1 cursor-pointer">
                            <p className="text-sm font-medium text-gray-900">{m.name}</p>
                            {m.description && (
                              <p className="text-xs text-gray-600 mt-0.5">{m.description}</p>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No hay módulos disponibles para este producto
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ============== STEP 4: Owner (Placeholder) ============== */}
            {step === 4 && (
              <Card className="bg-white shadow-sm rounded-xl border border-gray-200 animate-in fade-in duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-bold tracking-tight">Usuario Administrador</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Configura el usuario que tendrá acceso administrativo a la instancia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <UserCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-sm">Configuración de usuario administrador</p>
                    <p className="text-xs mt-2">(En desarrollo)</p>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>

        {/* Actions Bar - Sticky Bottom */}
        <footer className="h-20 bg-white border-t border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            {step > 1 && (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={isSubmitting}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Atrás
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {step < STEPS.length ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceedToNextStep() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-all duration-200"
              >
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleProvision}
                disabled={!canProceedToNextStep() || isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Provisionando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Provisionar
                  </>
                )}
              </Button>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
