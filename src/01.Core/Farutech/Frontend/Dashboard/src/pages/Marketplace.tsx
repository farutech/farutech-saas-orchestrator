// ============================================================================
// MARKETPLACE PAGE - Product catalog with manifest display
// ============================================================================

import { useState, useEffect } from 'react';
import { catalogService } from '@/services/catalog.service';
import { usePermissions } from '@/hooks/usePermissions';
import type { ProductDto, ProductManifestDto } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Shield, Zap } from 'lucide-react';

export default function Marketplace() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [selectedManifest, setSelectedManifest] = useState<ProductManifestDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [manifestLoading, setManifestLoading] = useState(false);
  const { hasPermission } = usePermissions();

  useEffect(()
        => {
    loadProducts();
  }, []);

  const loadProducts = async ()
        => {
    try {
      setLoading(true);
      const productList = await catalogService.getProducts();
      setProducts(productList);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductManifest = async (productId: string)
        => {
    try {
      setManifestLoading(true);
      const manifest = await catalogService.getProductManifest(productId);
      setSelectedManifest(manifest);
    } catch (error) {
      console.error('Error loading product manifest:', error);
    } finally {
      setManifestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Farutech Marketplace</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product)
        => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                {product.name}
              </CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {product.modules?.length || 0} modules
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={()
        => loadProductManifest(product.id)}
                  disabled={manifestLoading}
                >
                  {manifestLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "View Details"
                  )}
                </Button>

                {hasPermission('provisioning:create') && (
                  <Button size="sm">
                    Provision Instance
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedManifest && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              {selectedManifest.name} - Complete Manifest
            </CardTitle>
            <CardDescription>
              Detailed view of modules, features, and required permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {selectedManifest.modules?.map((module)
        => (
                <div key={module.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{module.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {module.features?.map((feature)
        => (
                      <div key={feature.id} className="border rounded p-3 bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{feature.name}</h4>
                          {feature.requiresLicense && (
                            <Badge variant="outline">License Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {feature.description}
                        </p>
                        {feature.additionalCost && (
                          <p className="text-sm font-medium text-green-600">
                            +${feature.additionalCost}/month
                          </p>
                        )}

                        {feature.permissions && feature.permissions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium mb-1">Required Permissions:</p>
                            <div className="flex flex-wrap gap-1">
                              {feature.permissions.map((permission)
        => (
                                <Badge key={permission.id} variant="secondary" className="text-xs">
                                  {permission.code}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}