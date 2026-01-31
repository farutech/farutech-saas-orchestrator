// ============================================================================
// PRODUCTS VIEW - Lista y gestión de productos
// ============================================================================

import { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, ChevronRight, Edit, Trash2 } from 'lucide-react';
import type { ProductDto, CreateProductDto, UpdateProductDto } from '@/types/api';

interface ProductsViewProps {
  onSelectProduct: (product: ProductDto) => void;
}

export function ProductsView({ onSelectProduct }: ProductsViewProps) {
  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
  });

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: ProductDto) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (editingProduct) {
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        data: { ...formData, isActive: editingProduct.isActive },
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-white/60">
          {products?.length || 0} productos disponibles
        </p>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Card
            key={product.id}
            className="bg-slate-900/50 border-white/10 hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => onSelectProduct(product)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center justify-between">
                    {product.name}
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </CardTitle>
                  <CardDescription className="text-white/60 mt-2">
                    {product.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  {product.modules && (
                    <Badge variant="outline" className="text-white/80">
                      {product.modules.length} módulos
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Ingresa los detalles del producto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Farutech ERP"
                className="bg-slate-800 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-white">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del producto..."
                className="bg-slate-800 border-white/10 text-white"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.description}>
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
