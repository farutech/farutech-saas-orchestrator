// ============================================================================
// CREATE APPLICATION MODAL - Modal for provisioning new applications
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useProducts, useProductManifest, useProvisionTenant, queryKeys } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  ChevronRight, 
  Check, 
  Loader2, 
  Package, 
  CreditCard,
  Sparkles,
  Shield,
  Rocket,
  Zap,
  Globe,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ProvisionTenantRequest, Customer, SubscriptionPlanDto } from '@/types/api';

interface CreateInstanceModalProps {
  isOpen: boolean;
  onClose: () =>void;
  organization: Customer;
}

export function CreateInstanceModal({ isOpen, onClose, organization }: CreateInstanceModalProps) {
  const queryClient = useQueryClient();
  const { data: products, isLoading: productsLoading } = useProducts();
  const provisionMutation = useProvisionTenant();
  const { refreshAvailableTenants } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProvisionTenantRequest>({
    customerId: organization.id,
    productId: '',
    deploymentType: 'Shared',
    subscriptionPlanId: '',
    code: '',
    name: '',
  });
  const [productFilter, setProductFilter] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Load product manifest when a product is selected
  const { data: productManifest, isLoading: manifestLoading } = useProductManifest(formData.productId);

  const selectedProduct = products?.find((p) =>p.id === formData.productId);
  const selectedPlan = productManifest?.subscriptionPlans?.find((p) =>p.id === formData.subscriptionPlanId);
  
  // Sync customerId when organization or isOpen changes
  useEffect(() =>{
    if (isOpen && organization?.id) {
      setFormData(prev => ({ ...prev, customerId: organization.id }));
    }
  }, [isOpen, organization?.id]);

  // Filtrar productos: si hay filtro, buscar; si no, mostrar primeros 10
  const filteredProducts = productFilter
    ? products?.filter(p => p.name?.toLowerCase().includes(productFilter.toLowerCase()))
    : products?.slice(0, 10);

  const handleProvision = async () =>{
    try {
      console.log('[CreateInstanceModal] Provisioning with data:', formData);
      await provisionMutation.mutateAsync(formData);
      
      // Invalidar caches para forzar refetch de datos actualizados
      await queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      await queryClient.invalidateQueries({ queryKey: queryKeys.availableTenants });
      
      // Refresh available tenants to update the context (para intermediate token)
      await refreshAvailableTenants();
      
      toast.success('Aplicación creada exitosamente');
      onClose();
      setStep(1);
      setProductFilter('');
      setShowProductDropdown(false);
      setFormData({
        customerId: organization.id,
        productId: '',
        deploymentType: 'Shared',
        subscriptionPlanId: '',
        code: '',
        name: '',
      });
    } catch (error) {
      toast.error('Error al crear la aplicación');
      console.error('Provision error:', error);
    }
  };

  const handleClose = () =>{
    onClose();
    setStep(1);
    setProductFilter('');
    setShowProductDropdown(false);
    setFormData({
      customerId: organization.id,
      productId: '',
      deploymentType: 'Shared',
      subscriptionPlanId: '',
    });
  };

  const formatPrice = (price: number) =>{
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] md:max-w-[1100px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="mr-3 h-6 w-6" />
            Agregar Nueva Aplicación
          </DialogTitle>
          <DialogDescription>
            Configure una nueva aplicación para <strong>{organization.companyName}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Steps Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= s ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-12 h-0.5 mx-1 ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Product Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold text-slate-900 mb-3 block">Seleccione la Aplicación</Label>
              
              {/* Featured Products Grid */}
              {!productFilter && products && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {products.slice(0, 3).map((product) => (
                    <Card 
                      key={product.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm",
                        formData.productId === product.id ? "ring-2 ring-primary border-primary bg-primary/5" : "border-slate-200"
                      )}
                      onClick={() => {
                        setFormData({ ...formData, productId: product.id, subscriptionPlanId: '' });
                        setProductFilter(product.name || '');
                      }}
                    >
                      <CardHeader className="p-4 flex flex-row items-center gap-3 space-y-0">
                        <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-sm font-bold truncate">{product.name}</CardTitle>
                          <CardDescription className="text-[10px] truncate">{product.description || 'App de Farutech'}</CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              <div className="relative">
                <Input
                  placeholder="O busque otra aplicación específica..."
                  value={productFilter}
                  onChange={(e) =>setProductFilter(e.target.value)}
                  onFocus={() =>setShowProductDropdown(true)}
                  onBlur={() =>setTimeout(() =>setShowProductDropdown(false), 200)}
                  disabled={productsLoading}
                  className="mb-2 h-11"
                />
                {showProductDropdown && filteredProducts && filteredProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredProducts.map((product) =>(
                      <button
                        key={product.id}
                        onClick={() =>{
                          setFormData({ ...formData, productId: product.id, subscriptionPlanId: '' });
                          setProductFilter(product.name || '');
                          setShowProductDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                      >
                        <Package className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          {product.description && (
                            <div className="text-[10px] text-slate-500 truncate">{product.description}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <Label className="text-sm font-semibold text-slate-900 mb-2 block">Tipo de Infraestructura</Label>
              <p className="text-xs text-slate-500 mb-4">
                El despliegue dedicado ofrece aislamiento total y recursos garantizados.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deploymentType: 'Shared' })}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-lg border-2 text-left transition-all",
                    formData.deploymentType === 'Shared' 
                      ? "border-primary bg-white shadow-md" 
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className={cn("h-5 w-5", formData.deploymentType === 'Shared' ? "text-primary" : "text-slate-400")} />
                    <span className="font-bold text-sm">Compartido</span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-relaxed text-wrap">
                    Ideal para PyMEs. Costo eficiente y alta disponibilidad garantizada.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deploymentType: 'Dedicated' })}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-lg border-2 text-left transition-all",
                    formData.deploymentType === 'Dedicated' 
                      ? "border-amber-500 bg-white shadow-md" 
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className={cn("h-5 w-5", formData.deploymentType === 'Dedicated' ? "text-amber-500" : "text-slate-400")} />
                    <span className="font-bold text-sm">Dedicado</span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-relaxed text-wrap">
                    Para operaciones críticas. Recursos de cómputo y red exclusivos.
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Modules Info (read-only) */}
        {step === 2 && selectedProduct && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Módulos Incluidos en la Aplicación</Label>
              <p className="text-sm text-slate-600 mt-1 mb-3">
                Esta aplicación incluye los siguientes módulos funcionales:
              </p>
              {manifestLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-2">
                  {productManifest?.modules && productManifest.modules.length > 0 ? (
                    productManifest.modules.map((module) =>(
                      <div key={module.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                        <div className="flex items-start">
                          <Package className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">{module.name}</div>
                            {module.description && (
                              <div className="text-xs text-slate-600 mt-1">{module.description}</div>
                            )}
                            {module.features && module.features.length > 0 && (
                              <div className="mt-2 text-xs text-slate-500">
                                Incluye: {module.features.map(f => f.name).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500 py-4 text-center bg-slate-50 rounded-md">
                      No hay información de módulos disponible.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Subscription Plan Selection */}
        {step === 3 && selectedProduct && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Planes de Suscripción</h3>
              <p className="text-sm text-slate-500">
                Seleccione el nivel de servicio más adecuado para su organización
              </p>
            </div>

            {manifestLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : productManifest?.subscriptionPlans && productManifest.subscriptionPlans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                {productManifest.subscriptionPlans.map((plan, idx) => {
                  const isSelected = formData.subscriptionPlanId === plan.id;
                  const PlanIcon = idx === 0 ? Zap : idx === 1 ? Sparkles : Shield;
                  
                  return (
                    <Card
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col transition-all cursor-pointer border-2 overflow-hidden",
                        isSelected 
                          ? "border-primary ring-2 ring-primary/20 scale-[1.02] z-10 shadow-xl" 
                          : "border-slate-200 hover:border-slate-300 opacity-90 hover:opacity-100 hover:shadow-lg hover:scale-[1.01]",
                        plan.isRecommended && !isSelected && "border-slate-300 shadow-md"
                      )}
                      onClick={() => setFormData({ ...formData, subscriptionPlanId: plan.id })}
                    >
                      {plan.isRecommended && (
                        <div className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-1.5 text-center w-full">
                          MÁS POPULAR
                        </div>
                      )}
                      
                      <CardHeader className="pt-6 pb-2 text-center">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4",
                          idx === 0 ? "bg-blue-50 text-blue-600" : 
                          idx === 1 ? "bg-violet-50 text-violet-600" : 
                          "bg-amber-50 text-amber-600"
                        )}>
                          <PlanIcon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                        <CardDescription className="text-[11px] leading-relaxed line-clamp-2 mt-1">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1 pb-6 text-center">
                        <div className="mb-4">
                          <span className="text-3xl font-black text-slate-900 leading-none">
                            {formatPrice(plan.monthlyPrice).split(',')[0]}
                          </span>
                          <span className="text-sm text-slate-500 font-medium">/mes</span>
                          {plan.annualPrice && (
                            <div className="text-[10px] text-emerald-600 font-bold mt-1">
                              Pago anual: {formatPrice(plan.annualPrice)} /año
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-100 text-left">
                          {plan.limits && (
                            <>
                              <div className="flex items-center gap-2.5">
                                <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                <span className="text-xs text-slate-600 font-medium">
                                  {plan.limits.maxUsers === -1 ? 'Usuarios ilimitados' : `${plan.limits.maxUsers} Usuarios`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                <span className="text-xs text-slate-600 font-medium">
                                  {plan.limits.storageGB === -1 ? 'Almacenamiento ilimitado' : `${plan.limits.storageGB} GB Storage`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                <span className="text-xs text-slate-600 font-medium">
                                  Soporte {plan.limits.supportLevel}
                                </span>
                              </div>
                            </>
                          )}
                          {plan.features?.slice(0, 2).map((feature) => (
                            <div key={feature.id} className="flex items-center gap-2.5">
                              <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                              <span className="text-xs text-slate-600 font-medium">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      
                      <div className={cn(
                        "p-4 border-t",
                        isSelected ? "bg-primary/5 border-primary/20" : "bg-slate-50 border-slate-100"
                      )}>
                        <Button 
                          className={cn("w-full transition-all", isSelected ? "bg-primary" : "bg-slate-700 hover:bg-slate-800")}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({ ...formData, subscriptionPlanId: plan.id });
                          }}
                        >
                          {isSelected ? 'Seleccionado' : 'Elegir Plan'}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <Package className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 italic">No hay planes disponibles para esta selección.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            {/* Campos de código y nombre */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md space-y-4">
              <h4 className="font-medium text-sm text-blue-900 mb-3">Identificación de la Instancia</h4>
              
              <div>
                <Label htmlFor="instanceCode" className="text-sm font-medium">
                  Código <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="instanceCode"
                  value={formData.code || ''}
                  onChange={(e) =>{
                    // Permitir solo letras, números y guiones (sin espacios)
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-_]/g, '');
                    setFormData({ ...formData, code: value });
                  }}
                  placeholder="ej: SEDE-NORTE, FAR-001"
                  maxLength={20}
                  className="mt-1"
                />
                <p className="text-xs text-slate-600 mt-1">
                  Código único sin espacios ni caracteres especiales (solo letras, números, guiones y guión bajo)
                </p>
              </div>

              <div>
                <Label htmlFor="instanceName" className="text-sm font-medium">
                  Nombre Descriptivo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="instanceName"
                  value={formData.name || ''}
                  onChange={(e) =>setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: Sede Norte, Farmacia Central"
                  maxLength={100}
                  className="mt-1"
                />
                <p className="text-xs text-slate-600 mt-1">
                  Nombre que te ayudará a identificar esta instancia
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3 flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Resumen de la configuración
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Organización:</span>
                  <span className="font-medium">{organization.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Aplicación:</span>
                  <span className="font-medium">{selectedProduct?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Infraestructura:</span>
                  <Badge variant="secondary">{formData.deploymentType === 'Shared' ? 'Compartido' : 'Dedicado'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Plan:</span>
                  <span className="font-medium">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-600 font-medium">Costo mensual:</span>
                  <span className="text-lg font-bold text-primary">
                    {selectedPlan && formatPrice(selectedPlan.monthlyPrice)}
                  </span>
                </div>
              </div>
            </div>
            
            {selectedPlan?.features && selectedPlan.features.length > 0 && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                <h4 className="font-medium text-sm text-green-900 mb-2">✓ Funcionalidades incluidas:</h4>
                <div className="text-xs text-green-800 space-y-1">
                  {selectedPlan.features.slice(0, 5).map((feature) =>(
                    <div key={feature.id} className="flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      {feature.name}
                    </div>
                  ))}
                  {selectedPlan.features.length > 5 && (
                    <div className="text-green-700 italic">
                      ... y {selectedPlan.features.length - 5} funcionalidades más
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>

          {step > 1 && (
            <Button variant="outline" onClick={() =>setStep(step - 1)}>
              Anterior
            </Button>
          )}

          {step < 4 ? (
            <Button
              onClick={() =>setStep(step + 1)}
              disabled={
                (step === 1 && !formData.productId) ||
                (step === 3 && !formData.subscriptionPlanId)
              }
            >
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleProvision}
              disabled={
                provisionMutation.isPending || 
                !formData.code || 
                formData.code.trim().length === 0 ||
                !formData.name || 
                formData.name.trim().length === 0
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {provisionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  Confirmar y Crear
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}