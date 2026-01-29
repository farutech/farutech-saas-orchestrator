// ============================================================================
// CREATE APPLICATION MODAL - Modal for provisioning new applications
// ============================================================================

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProducts, useProductManifest, useProvisionTenant, queryKeys } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Server, ChevronRight, Check, Loader2, Package, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import type { ProvisionTenantRequest, Customer, SubscriptionPlanDto } from '@/types/api';

interface CreateInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
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

  const selectedProduct = products?.find((p) => p.id === formData.productId);
  const selectedPlan = productManifest?.subscriptionPlans?.find((p) => p.id === formData.subscriptionPlanId);
  
  // Filtrar productos: si hay filtro, buscar; si no, mostrar primeros 10
  const filteredProducts = productFilter
    ? products?.filter(p => p.name?.toLowerCase().includes(productFilter.toLowerCase()))
    : products?.slice(0, 10);

  const handleProvision = async () => {
    try {
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

  const handleClose = () => {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Seleccione la Aplicación</Label>
              <div className="relative mt-1">
                <Input
                  placeholder="Buscar aplicación..."
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  onFocus={() => setShowProductDropdown(true)}
                  onBlur={() => setTimeout(() => setShowProductDropdown(false), 200)}
                  disabled={productsLoading}
                  className="mb-2"
                />
                {showProductDropdown && filteredProducts && filteredProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setFormData({ ...formData, productId: product.id, subscriptionPlanId: '' });
                          setProductFilter(product.name || '');
                          setShowProductDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-100 focus:bg-slate-100 focus:outline-none border-b border-slate-100 last:border-b-0"
                      >
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-slate-500">{product.description}</div>
                        )}
                      </button>
                    ))}
                    {!productFilter && products && products.length > 10 && (
                      <div className="px-4 py-2 text-xs text-slate-500 bg-slate-50 text-center">
                        Mostrando 10 de {products.length} aplicaciones. Escribe para buscar más.
                      </div>
                    )}
                  </div>
                )}
                {formData.productId && selectedProduct && (
                  <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{selectedProduct.name}</div>
                        {selectedProduct.description && (
                          <div className="text-xs text-slate-600 mt-0.5">{selectedProduct.description}</div>
                        )}
                      </div>
                      <Badge variant="secondary">Seleccionado</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Tipo de Infraestructura</Label>
              <p className="text-xs text-slate-500 mt-1 mb-2">
                Seleccione la infraestructura según sus necesidades de rendimiento y presupuesto
              </p>
              <Select
                value={formData.deploymentType}
                onValueChange={(v) => setFormData({ ...formData, deploymentType: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="Shared">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">🌐 Compartido (Shared)</span>
                      <span className="text-xs text-slate-500">
                        Recursos compartidos • Más económico • Ideal para iniciar
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Dedicated">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">⚡ Dedicado (Dedicated)</span>
                      <span className="text-xs text-slate-500">
                        Recursos dedicados • Máximo rendimiento • Sin límites
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
                    productManifest.modules.map((module) => (
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
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Seleccione su Plan de Suscripción</Label>
              <p className="text-sm text-slate-600 mt-1 mb-3">
                Elija el plan que mejor se adapte a las necesidades de su negocio
              </p>
              {manifestLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : productManifest?.subscriptionPlans && productManifest.subscriptionPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {productManifest.subscriptionPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setFormData({ ...formData, subscriptionPlanId: plan.id })}
                      className={`p-4 border-2 rounded-lg text-left transition-all hover:border-primary hover:shadow-md ${
                        formData.subscriptionPlanId === plan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200'
                      } ${plan.isRecommended ? 'ring-2 ring-primary/20' : ''}`}
                    >
                      {plan.isRecommended && (
                        <Badge className="mb-2" variant="default">Recomendado</Badge>
                      )}
                      <div className="font-semibold text-lg mb-1">{plan.name}</div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        {formatPrice(plan.monthlyPrice)}
                        <span className="text-sm font-normal text-slate-600">/mes</span>
                      </div>
                      {plan.annualPrice && (
                        <div className="text-xs text-slate-600 mb-3">
                          {formatPrice(plan.annualPrice)}/año (ahorra {formatPrice((plan.monthlyPrice * 12) - plan.annualPrice)})
                        </div>
                      )}
                      <div className="text-xs text-slate-600 mb-3">{plan.description}</div>
                      
                      {plan.limits && (
                        <div className="space-y-1 text-xs mt-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center">
                            <Check className="h-3 w-3 text-green-600 mr-1" />
                            {plan.limits.maxUsers === -1 ? 'Usuarios ilimitados' : `Hasta ${plan.limits.maxUsers} usuarios`}
                          </div>
                          <div className="flex items-center">
                            <Check className="h-3 w-3 text-green-600 mr-1" />
                            {plan.limits.storageGB === -1 ? 'Almacenamiento ilimitado' : `${plan.limits.storageGB} GB almacenamiento`}
                          </div>
                          <div className="flex items-center">
                            <Check className="h-3 w-3 text-green-600 mr-1" />
                            Soporte {plan.limits.supportLevel}
                          </div>
                        </div>
                      )}
                      
                      {plan.isFullAccess && (
                        <Badge className="mt-2" variant="secondary">Acceso Completo</Badge>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500 py-8 text-center bg-slate-50 rounded-md">
                  No hay planes de suscripción disponibles para esta aplicación.
                </div>
              )}
            </div>
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
                  onChange={(e) => {
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  {selectedPlan.features.slice(0, 5).map((feature) => (
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
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Anterior
            </Button>
          )}

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
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