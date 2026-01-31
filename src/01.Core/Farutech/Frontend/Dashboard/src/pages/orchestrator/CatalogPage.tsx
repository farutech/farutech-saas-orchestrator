// ============================================================================
// CATALOG PAGE - Hierarchical navigation (Product > Module > Feature)
// ============================================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useApi';
import { GlobalLoader } from '@/components/farutech/GlobalLoader';
import { ProductsView } from './catalog/ProductsView';
import { ModulesView } from './catalog/ModulesView';
import { FeaturesView } from './catalog/FeaturesView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight, Package } from 'lucide-react';
import type { ProductDto, ModuleDto } from '@/types/api';

type ViewLevel = 'products' | 'modules' | 'features';

export default function CatalogPage() {
  const [currentView, setCurrentView] = useState<ViewLevel>('products');
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleDto | null>(null);

  const { isLoading } = useProducts();

  const handleProductSelect = (product: ProductDto) => {
    setSelectedProduct(product);
    setSelectedModule(null);
    setCurrentView('modules');
  };

  const handleModuleSelect = (module: ModuleDto) => {
    setSelectedModule(module);
    setCurrentView('features');
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setSelectedModule(null);
    setCurrentView('products');
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setCurrentView('modules');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <GlobalLoader fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Package className="mr-3 h-8 w-8" />
            Catálogo de Productos
          </h1>
          <p className="text-white/60 mt-2">
            Gestiona la jerarquía de Productos, Módulos y Features
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <Card className="bg-slate-900/50 border-white/10 p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer text-white/80 hover:text-white"
                onClick={handleBackToProducts}
              >
                Productos
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {selectedProduct && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className={`cursor-pointer ${
                      currentView === 'modules' 
                        ? 'text-white font-semibold' 
                        : 'text-white/80 hover:text-white'
                    }`}
                    onClick={handleBackToModules}
                  >
                    {selectedProduct.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}

            {selectedModule && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-white font-semibold">
                    {selectedModule.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </Card>

      {/* Views */}
      <AnimatePresence mode="wait">
        {currentView === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ProductsView onSelectProduct={handleProductSelect} />
          </motion.div>
        )}

        {currentView === 'modules' && selectedProduct && (
          <motion.div
            key="modules"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ModulesView
              product={selectedProduct}
              onSelectModule={handleModuleSelect}
              onBack={handleBackToProducts}
            />
          </motion.div>
        )}

        {currentView === 'features' && selectedModule && (
          <motion.div
            key="features"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <FeaturesView
              module={selectedModule}
              onBack={handleBackToModules}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
