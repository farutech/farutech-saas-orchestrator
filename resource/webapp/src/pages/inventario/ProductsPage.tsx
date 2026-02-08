/**
 * Página de Productos - Inventario
 * Demuestra: Grid Layout, Search, Filter, Card, Badge, ImageUpload
 */

import { useState } from 'react'
import { Card, Button, Badge, Modal, Input, Select, StatsCard } from '@/components/ui'
import {
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  image?: string
}

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: ''
  })

  const products: Product[] = [
    {
      id: '1',
      name: 'Laptop Pro 15"',
      sku: 'LAP-001',
      category: 'Electrónica',
      price: 1299.99,
      stock: 15,
      status: 'in_stock'
    },
    {
      id: '2',
      name: 'Mouse Inalámbrico',
      sku: 'ACC-002',
      category: 'Accesorios',
      price: 29.99,
      stock: 5,
      status: 'low_stock'
    },
    {
      id: '3',
      name: 'Teclado Mecánico RGB',
      sku: 'ACC-003',
      category: 'Accesorios',
      price: 89.99,
      stock: 0,
      status: 'out_of_stock'
    },
    {
      id: '4',
      name: 'Monitor 27" 4K',
      sku: 'MON-004',
      category: 'Electrónica',
      price: 499.99,
      stock: 8,
      status: 'low_stock'
    },
    {
      id: '5',
      name: 'Auriculares Bluetooth',
      sku: 'AUD-005',
      category: 'Audio',
      price: 149.99,
      stock: 25,
      status: 'in_stock'
    },
    {
      id: '6',
      name: 'Webcam HD',
      sku: 'CAM-006',
      category: 'Accesorios',
      price: 79.99,
      stock: 12,
      status: 'in_stock'
    }
  ]

  const categories = ['Todos', 'Electrónica', 'Accesorios', 'Audio']

  const statusConfig = {
    in_stock: { label: 'En Stock', variant: 'success' as const },
    low_stock: { label: 'Stock Bajo', variant: 'warning' as const },
    out_of_stock: { label: 'Agotado', variant: 'danger' as const }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.status === 'in_stock').length,
    lowStock: products.filter(p => p.status === 'low_stock').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length
  }

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

  const handleSubmit = () => {
    console.log('Guardando producto:', formData)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Productos
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Gestiona tu catálogo de productos
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Productos"
          value={stats.total.toString()}
          icon={<CubeIcon className="h-6 w-6" />}
          description="En catálogo"
        />
        <StatsCard
          title="En Stock"
          value={stats.inStock.toString()}
          icon={<CubeIcon className="h-6 w-6" />}
          variant="success"
          description="Disponibles"
        />
        <StatsCard
          title="Stock Bajo"
          value={stats.lowStock.toString()}
          icon={<CubeIcon className="h-6 w-6" />}
          variant="warning"
          description="Requieren reorden"
        />
        <StatsCard
          title="Valor Inventario"
          value={`$${(totalValue / 1000).toFixed(1)}K`}
          icon={<CubeIcon className="h-6 w-6" />}
          variant="primary"
          description="Total en stock"
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === (category === 'Todos' ? 'all' : category) ? 'primary' : 'ghost'}
                onClick={() => setSelectedCategory(category === 'Todos' ? 'all' : category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
              <CubeIcon className="w-16 h-16 text-gray-400" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      SKU: {product.sku}
                    </p>
                  </div>
                  <Badge variant={statusConfig[product.status].variant}>
                    {statusConfig[product.status].label}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="default">{product.category}</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Stock: {product.stock}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CubeIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Intenta ajustar los filtros o agrega un nuevo producto
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Agregar Producto
          </Button>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Producto"
      >
        <div className="space-y-4">
          <Input
            label="Nombre del producto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Laptop Pro 15"
            required
          />
          
          <Input
            label="SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="LAP-001"
            required
          />
          
          <Select
            label="Categoría"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: '', label: 'Seleccionar...' },
              { value: 'Electrónica', label: 'Electrónica' },
              { value: 'Accesorios', label: 'Accesorios' },
              { value: 'Audio', label: 'Audio' }
            ]}
          />
          
          <Input
            label="Precio"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="1299.99"
            required
          />
          
          <Input
            label="Stock inicial"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="15"
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Crear Producto
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
