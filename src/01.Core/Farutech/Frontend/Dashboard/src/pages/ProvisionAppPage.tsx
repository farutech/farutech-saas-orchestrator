// ============================================================================
// PROVISION APP PAGE - Dedicated page for provisioning new applications
// ============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useCustomer, 
  useProducts, 
  useProductManifest, 
  useProvisionTenant, 
  queryKeys 
} from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
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
  Cpu,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ProvisionTenantRequest } from '@/types/api';

export default function ProvisionAppPage() {
  const { id: orgId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: customer, isLoading: customerLoading } = useCustomer(orgId || '');
  const { data: products, isLoading: productsLoading } = useProducts();
  const provisionMutation = useProvisionTenant();
  const { refreshAvailableTenants } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProvisionTenantRequest>({
    customerId: orgId || '',
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

  // Sync customerId
  useEffect(() => {
    if (orgId) {
      setFormData(prev => ({ ...prev, customerId: orgId }));
    }
  }, [orgId]);

  // Filtrar productos
  const filteredProducts = productFilter
    ? products?.filter(p => p.name?.toLowerCase().includes(productFilter.toLowerCase()))
    : products?.slice(0, 10);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleProvision = async () => {
    try {
      await provisionMutation.mutateAsync(formData);
      await queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      await queryClient.invalidateQueries({ queryKey: queryKeys.availableTenants });
      await refreshAvailableTenants();
      
      toast.success('Aplicación creada exitosamente');
      navigate(`/dashboard/${orgId}`);
    } catch (error) {
      toast.error('Error al crear la aplicación');
    }
  };

  if (customerLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AppHeader title="Cargando..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AppHeader title="Error" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Package className="h-12 w-12 text-slate-300 mb-4" />
          <h2 className="text-xl font-bold">Organización no encontrada</h2>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Volver a Organizaciones
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <AppHeader title={`Nueva App - ${customer.companyName}`} />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-10 space-y-8">
        {/* Navigation and Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/dashboard/${orgId}`)}
            className="h-8 px-2 hover:bg-slate-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
          <span>/</span>
          <span>Configuración de Aplicación</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Agregar Nueva Aplicación</h1>
          <p className="text-slate-500">
            Siga los pasos para configurar una nueva instancia de software para <strong>{customer.companyName}</strong>.
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center group">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all",
                    step === s ? "bg-primary text-white scale-110 shadow-md shadow-primary/20" : 
                    step > s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                  )}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                <div className="hidden sm:block ml-3">
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    step >= s ? "text-slate-900" : "text-slate-400"
                  )}>
                    Paso {s}
                  </div>
                  <div className={cn(
                    "text-xs",
                    step >= s ? "text-slate-600" : "text-slate-400"
                  )}>
                    {s === 1 ? 'Producto' : s === 2 ? 'Módulos' : s === 3 ? 'Suscripción' : 'Confirmación'}
                  </div>
                </div>
                {s < 4 && (
                  <div className={cn(
                    "w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-colors",
                    step > s ? "bg-emerald-500" : "bg-slate-200"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Product Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <section className="space-y-4">
              <Label className="text-lg font-bold text-slate-900 block">Seleccione la Aplicación</Label>
              
              {/* Featured Products Grid - Cleaned up version */}
              {!productFilter && products && products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.slice(0, 4).map((product) => (
                    <Card 
                      key={product.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                        formData.productId === product.id ? "ring-2 ring-primary border-primary bg-primary/5" : "border-slate-200"
                      )}
                      onClick={() => {
                        setFormData({ ...formData, productId: product.id, subscriptionPlanId: '' });
                        setProductFilter(''); // Clear search when selecting a card
                      }}
                    >
                      <CardHeader className="p-5 flex flex-row items-center gap-4 space-y-0">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                          formData.productId === product.id ? "bg-primary text-white" : "bg-violet-100 text-violet-600"
                        )}>
                          <Package className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base font-bold truncate">{product.name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2 mt-1">
                            {product.description || 'Infraestructura SaaS de alto rendimiento.'}
                          </CardDescription>
                        </div>
                        {formData.productId === product.id && (
                          <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              <div className="relative pt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-2">
                  <Package className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                  placeholder="¿Busca una aplicación diferente? Escriba aquí..."
                  value={productFilter}
                  onChange={(e) => {
                    setProductFilter(e.target.value);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="pl-10 h-12 bg-white border-slate-200 focus:ring-violet-500"
                />
                {showProductDropdown && productFilter && filteredProducts && filteredProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-auto">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setFormData({ ...formData, productId: product.id, subscriptionPlanId: '' });
                          setProductFilter('');
                          setShowProductDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 last:border-b-0"
                      >
                        <Package className="h-4 w-4 text-slate-400" />
                        <div className="min-w-0">
                          <div className="font-bold text-sm truncate">{product.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{product.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <Label className="text-lg font-bold text-slate-900 block">Tipo de Infraestructura</Label>
                  <p className="text-sm text-slate-500">
                    Defina el nivel de aislamiento y recursos para su aplicación.
                  </p>
                </div>
                <Badge variant="outline" className="w-fit h-fit py-1 px-3 bg-slate-50">Configuración Sugerida</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deploymentType: 'Shared' })}
                  className={cn(
                    "flex flex-col items-center p-6 rounded-2xl border-2 transition-all text-center",
                    formData.deploymentType === 'Shared' 
                      ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                      : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
                    formData.deploymentType === 'Shared' ? "bg-primary text-white" : "bg-white text-slate-400 border border-slate-100"
                  )}>
                    <Globe className="h-7 w-7" />
                  </div>
                  <span className="font-bold text-base mb-2">Multitenancy (Compartido)</span>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                    Ideal para inicios rápidos y optimización de costos. Seguridad y aislamiento por software.
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deploymentType: 'Dedicated' })}
                  className={cn(
                    "flex flex-col items-center p-6 rounded-2xl border-2 transition-all text-center",
                    formData.deploymentType === 'Dedicated' 
                      ? "border-amber-500 bg-amber-50 ring-4 ring-amber-500/5" 
                      : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
                    formData.deploymentType === 'Dedicated' ? "bg-amber-500 text-white" : "bg-white text-slate-400 border border-slate-100"
                  )}>
                    <Cpu className="h-7 w-7" />
                  </div>
                  <span className="font-bold text-base mb-2">Instancia Dedicada</span>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                    Recursos físicos e infraestructura aislada 100%. Máximo rendimiento y cumplimiento.
                  </p>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Step 2: Modules (Read-only as requested) */}
        {step === 2 && selectedProduct && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Capacidades de {selectedProduct.name}</h3>
                <p className="text-sm text-slate-500">Esta aplicación incluye los siguientes módulos core.</p>
              </div>
              
              <div className="p-6">
                {manifestLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productManifest?.modules?.map((module) => (
                      <div key={module.id} className="p-5 border border-slate-100 rounded-xl bg-slate-50/30 flex gap-4">
                         <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 text-primary">
                           <Package className="h-5 w-5" />
                         </div>
                         <div className="space-y-1">
                           <h4 className="font-bold text-sm text-slate-900">{module.name}</h4>
                           <p className="text-xs text-slate-500 leading-relaxed">{module.description}</p>
                           {module.features && (
                             <div className="flex flex-wrap gap-2 mt-3">
                               {module.features.slice(0, 3).map(f => (
                                 <Badge key={f.id} variant="outline" className="text-[9px] h-5 bg-white">{f.name}</Badge>
                               ))}
                             </div>
                           )}
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Subscription (Refined Styles) */}
        {step === 3 && selectedProduct && (
          <div className="space-y-10">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="bg-violet-100 text-violet-700">Planes Individuales</Badge>
              <h2 className="text-3xl font-bold text-slate-900">Seleccione su Plan de Suscripción</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Todos nuestros planes incluyen seguridad de grado financiero y soporte técnico especializado.
              </p>
            </div>

            {manifestLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
                {productManifest?.subscriptionPlans?.map((plan, idx) => {
                  const isSelected = formData.subscriptionPlanId === plan.id;
                  const PlanIcon = idx === 0 ? Zap : idx === 1 ? Sparkles : Shield;
                  
                  return (
                    <Card
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col transition-all cursor-pointer border-2 overflow-hidden",
                        isSelected 
                          ? "border-primary ring-4 ring-primary/10 scale-[1.05] z-10 shadow-2xl" 
                          : "border-slate-100 hover:border-slate-300 opacity-95 hover:opacity-100 hover:shadow-xl",
                        plan.isRecommended && !isSelected && "border-slate-300 shadow-lg"
                      )}
                      onClick={() => setFormData({ ...formData, subscriptionPlanId: plan.id })}
                    >
                      {plan.isRecommended && (
                        <div className="bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] py-2 text-center w-full">
                          RECOMENDADO
                        </div>
                      )}
                      
                      <CardHeader className="p-8 text-center pb-0">
                        <div className={cn(
                          "w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6",
                          idx === 0 ? "bg-blue-50 text-blue-600 shadow-sm" : 
                          idx === 1 ? "bg-violet-50 text-violet-600 shadow-sm" : 
                          "bg-amber-50 text-amber-600 shadow-sm"
                        )}>
                          <PlanIcon className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                        <CardDescription className="mt-2 text-xs leading-relaxed min-h-[40px]">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-8 flex-1 space-y-8">
                        <div className="text-center border-y border-slate-100 py-6">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-sm font-bold text-slate-400">$</span>
                            <span className="text-5xl font-black text-slate-900 tracking-tighter">
                              {formatPrice(plan.monthlyPrice).replace('$', '').split(',')[0]}
                            </span>
                            <div className="text-left">
                              <div className="text-xs font-bold text-slate-900 uppercase">USD</div>
                              <div className="text-[10px] text-slate-400">/ mes</div>
                            </div>
                          </div>
                          {plan.annualPrice && (
                            <div className="inline-block mt-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                              -20% CON PAGO ANUAL
                            </div>
                          )}
                        </div>

                        <ul className="space-y-4">
                          {plan.limits && (
                            <>
                              <li className="flex items-start gap-3">
                                <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                                <span className="text-sm text-slate-600">
                                  {plan.limits.maxUsers === -1 ? '<b>Usuarios ilimitados</b>' : `Hasta <b>${plan.limits.maxUsers} usuarios</b>`}
                                </span>
                              </li>
                              <li className="flex items-start gap-3">
                                <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                                <span className="text-sm text-slate-600">
                                  {plan.limits.storageGB === -1 ? '<b>Almacenamiento ilimitado</b>' : `<b>${plan.limits.storageGB} GB</b> de almacenamiento`}
                                </span>
                              </li>
                            </>
                          )}
                          {plan.features?.slice(0, 3).map(f => (
                            <li key={f.id} className="flex items-start gap-3">
                              <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                              <span className="text-sm text-slate-600">{f.name}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      
                      <div className="p-8 pt-0">
                        <Button 
                          className={cn(
                            "w-full h-12 text-sm font-bold transition-all",
                            isSelected ? "bg-primary hover:bg-primary/90" : "bg-slate-900 hover:bg-black"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({ ...formData, subscriptionPlanId: plan.id });
                          }}
                        >
                          {isSelected ? 'Seleccionado' : 'Contratar Plan'}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Final Config & Confirm */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <div className="lg:col-span-2 space-y-6">
                <Card className="border-slate-200 overflow-hidden shadow-md">
                   <CardHeader className="bg-slate-50 border-b border-slate-200">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                            <Rocket className="h-4 w-4" />
                         </div>
                         Identidad de la Aplicación
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-8 space-y-8">
                      <div className="space-y-3">
                        <Label htmlFor="instanceCode" className="text-sm font-bold text-slate-900">
                          Código Identificador <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="instanceCode"
                          value={formData.code || ''}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-_]/g, '');
                            setFormData({ ...formData, code: val });
                          }}
                          placeholder="EJ: SEDE01-BOG"
                          className="h-12 text-lg font-mono uppercase border-slate-200 focus:border-primary"
                        />
                        <p className="text-[10px] text-slate-400">
                          Identificador único interno para despliegue técnico.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="instanceName" className="text-sm font-bold text-slate-900">
                          Nombre Público <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="instanceName"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="EJ: FaruPOS Boutique Norte"
                          className="h-12 border-slate-200 focus:border-primary"
                        />
                        <p className="text-[10px] text-slate-400">
                          Nombre visible para todos los usuarios de la organización.
                        </p>
                      </div>
                   </CardContent>
                </Card>

                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="font-bold text-sm text-blue-900">Protocolo de Alta Disponibilidad</h4>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Al confirmar, el sistema aprovisionará automáticamente la infraestructura necesaria 
                        y enviará los accesos administrativos al correo corporativo de <strong>{customer.companyName}</strong>.
                      </p>
                   </div>
                </div>
             </div>

             <aside className="space-y-6">
                <Card className="border-slate-200 shadow-md">
                   <CardHeader className="bg-slate-50 border-b border-slate-200 p-5">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Resumen del Pedido</CardTitle>
                   </CardHeader>
                   <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Producto:</span>
                          <span className="font-bold">{selectedProduct?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Infraestructura:</span>
                          <Badge variant="outline" className="font-bold uppercase text-[9px]">
                            {formData.deploymentType === 'Shared' ? 'Nube Compartida' : 'Nube Dedicada'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Nivel Plan:</span>
                          <span className="font-bold text-primary">{selectedPlan?.name}</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                         <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold text-slate-900">Costo Total</span>
                            <div className="text-right">
                               <div className="text-2xl font-black text-slate-900">
                                  {selectedPlan && formatPrice(selectedPlan.monthlyPrice)}
                               </div>
                               <div className="text-[10px] text-slate-400">Cobro mensual recurrente</div>
                            </div>
                         </div>
                      </div>

                      <Button 
                         onClick={handleProvision}
                         disabled={provisionMutation.isPending || !formData.code || !formData.name}
                         className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-200"
                      >
                         {provisionMutation.isPending ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                         ) : (
                            <>
                              Activar Aplicación
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </>
                         )}
                      </Button>
                      <p className="text-[9px] text-center text-slate-400">
                        Al activar, acepta nuestros términos de servicio y políticas de uso de datos.
                      </p>
                   </CardContent>
                </Card>
             </aside>
          </div>
        )}
      </main>

      {/* Persistent Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 lg:hidden">
         <div className="flex justify-between gap-4">
            <Button variant="outline" className="flex-1" onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}>
               {step === 1 ? 'Cancelar' : 'Anterior'}
            </Button>
            {step < 4 ? (
               <Button className="flex-1" onClick={() => setStep(step + 1)} disabled={(step === 1 && !formData.productId) || (step === 3 && !formData.subscriptionPlanId)}>
                  Siguiente
               </Button>
            ) : null}
         </div>
      </footer>

      {/* Desktop Navigation Helper */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-4 px-6 py-4 bg-slate-900 text-white rounded-full shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-5">
         <Button 
           variant="ghost" 
           size="sm" 
           onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
           className="text-white hover:bg-slate-800"
         >
           {step === 1 ? 'Cancelar' : 'Paso Anterior'}
         </Button>
         <div className="w-px h-6 bg-slate-700 mx-2" />
         {step < 4 ? (
           <Button 
             size="sm" 
             onClick={() => setStep(step + 1)}
             disabled={(step === 1 && !formData.productId) || (step === 3 && !formData.subscriptionPlanId)}
             className="bg-white text-slate-900 hover:bg-slate-100 font-bold"
           >
             Continuar al Paso {step + 1}
             <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         ) : (
           <div className="text-xs font-bold text-emerald-400 px-4">✓ Listo para Lanzamiento</div>
         )}
      </div>
    </div>
  );
}
