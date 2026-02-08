/**
 * Página de Clientes - CRM
 * Demuestra: Card Grid, Avatar, Badge, Modal, Form Components, StatsCard
 */

import { useState } from 'react'
import { 
  Card, 
  Button, 
  Badge, 
  Modal,
  Input,
  Select,
  StatsCard
} from '@/components/ui'
import {
  UsersIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  company: string
  location: string
  status: 'active' | 'inactive' | 'pending'
  revenue: number
  avatar?: string
}

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    status: 'active',
    revenue: ''
  })

  // Datos de ejemplo
  const clients: Client[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      phone: '+1 234 567 890',
      company: 'Tech Solutions SA',
      location: 'Madrid, España',
      status: 'active',
      revenue: 125000
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.garcia@startup.com',
      phone: '+34 654 321 098',
      company: 'Innovation Hub',
      location: 'Barcelona, España',
      status: 'active',
      revenue: 89000
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      email: 'carlos.r@company.com',
      phone: '+52 555 123 456',
      company: 'Global Ventures',
      location: 'Ciudad de México, México',
      status: 'pending',
      revenue: 0
    },
    {
      id: 4,
      name: 'Ana Martínez',
      email: 'ana.martinez@corp.com',
      phone: '+54 11 4567 8900',
      company: 'Enterprise Corp',
      location: 'Buenos Aires, Argentina',
      status: 'inactive',
      revenue: 45000
    },
    {
      id: 5,
      name: 'Luis González',
      email: 'luis.gonzalez@tech.com',
      phone: '+34 612 345 678',
      company: 'Digital Agency',
      location: 'Valencia, España',
      status: 'active',
      revenue: 67000
    },
    {
      id: 6,
      name: 'Carmen Ruiz',
      email: 'carmen.ruiz@startup.com',
      phone: '+34 678 901 234',
      company: 'Eco Solutions',
      location: 'Sevilla, España',
      status: 'active',
      revenue: 95000
    }
  ]

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      location: client.location,
      status: client.status,
      revenue: client.revenue.toString()
    })
    setIsModalOpen(true)
  }

  const handleNewClient = () => {
    setSelectedClient(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      location: '',
      status: 'active',
      revenue: ''
    })
    setIsModalOpen(true)
  }

  const handleSubmit = () => {
    console.log('Guardando cliente:', formData)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Clientes
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Gestiona tu cartera de clientes y contactos
          </p>
        </div>
        <Button variant="primary" onClick={handleNewClient}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Clientes"
          value="156"
          icon={<UsersIcon className="h-6 w-6" />}
          description="+12% vs mes anterior"
        />
        <StatsCard
          title="Activos"
          value="124"
          icon={<CheckCircleIcon className="h-6 w-6" />}
          variant="success"
          description="79% del total"
        />
        <StatsCard
          title="Pendientes"
          value="18"
          icon={<ClockIcon className="h-6 w-6" />}
          variant="warning"
          description="Requieren seguimiento"
        />
        <StatsCard
          title="Ingresos Total"
          value="$2.5M"
          icon={<UsersIcon className="h-6 w-6" />}
          variant="primary"
          description="+8.5% este mes"
        />
      </div>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-lg">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {client.company}
                  </p>
                </div>
              </div>
              <Badge variant={
                client.status === 'active' ? 'success' :
                client.status === 'pending' ? 'warning' : 'default'
              }>
                {client.status === 'active' ? 'Activo' :
                 client.status === 'pending' ? 'Pendiente' : 'Inactivo'}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <EnvelopeIcon className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <PhoneIcon className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPinIcon className="w-4 h-4" />
                <span>{client.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Ingresos</span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${client.revenue.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEditClient(client)}
                >
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => window.location.href = `mailto:${client.email}`}
                >
                  <EnvelopeIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Juan Pérez"
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="juan@empresa.com"
            required
          />
          
          <Input
            label="Teléfono"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+34 123 456 789"
          />
          
          <Input
            label="Empresa"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Tech Solutions SA"
          />
          
          <Input
            label="Ubicación"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Madrid, España"
          />
          
          <Select
            label="Estado"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'pending' })}
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'pending', label: 'Pendiente' },
              { value: 'inactive', label: 'Inactivo' }
            ]}
          />
          
          <Input
            label="Ingresos estimados"
            type="number"
            value={formData.revenue}
            onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
            placeholder="50000"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {selectedClient ? 'Guardar Cambios' : 'Crear Cliente'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
