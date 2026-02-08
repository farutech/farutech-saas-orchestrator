/**
 * Página de Leads - CRM
 * Demuestra: Kanban Board, Drag & Drop, Card, Badge
 */

import { useState } from 'react'
import { Card, Button, Badge, Modal, Input, Select, Textarea } from '@/components/ui'
import {
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  company: string
  value: number
  stage: 'new' | 'contacted' | 'qualified' | 'proposal'
  source: string
  assignedTo: string
}

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    value: '',
    source: '',
    notes: ''
  })

  const leads: Lead[] = [
    {
      id: 1,
      name: 'Roberto Sánchez',
      email: 'roberto@startup.com',
      phone: '+34 611 222 333',
      company: 'StartupX',
      value: 25000,
      stage: 'new',
      source: 'Website',
      assignedTo: 'Juan'
    },
    {
      id: 2,
      name: 'Laura Fernández',
      email: 'laura@techco.com',
      phone: '+34 644 555 666',
      company: 'TechCo',
      value: 45000,
      stage: 'contacted',
      source: 'Referral',
      assignedTo: 'María'
    },
    {
      id: 3,
      name: 'Diego Moreno',
      email: 'diego@innovate.com',
      phone: '+34 677 888 999',
      company: 'Innovate Solutions',
      value: 75000,
      stage: 'qualified',
      source: 'LinkedIn',
      assignedTo: 'Carlos'
    },
    {
      id: 4,
      name: 'Patricia López',
      email: 'patricia@digital.com',
      phone: '+34 688 111 222',
      company: 'Digital Agency',
      value: 120000,
      stage: 'proposal',
      source: 'Event',
      assignedTo: 'Ana'
    }
  ]

  const stages = [
    { id: 'new', title: 'Nuevos', color: 'bg-blue-100 dark:bg-blue-900', textColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'contacted', title: 'Contactados', color: 'bg-yellow-100 dark:bg-yellow-900', textColor: 'text-yellow-600 dark:text-yellow-400' },
    { id: 'qualified', title: 'Calificados', color: 'bg-purple-100 dark:bg-purple-900', textColor: 'text-purple-600 dark:text-purple-400' },
    { id: 'proposal', title: 'Propuesta', color: 'bg-green-100 dark:bg-green-900', textColor: 'text-green-600 dark:text-green-400' }
  ]

  const getLeadsByStage = (stage: string) => leads.filter(lead => lead.stage === stage)

  const handleSubmit = () => {
    console.log('Creando lead:', formData)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pipeline de Leads
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Gestiona y cualifica tus oportunidades de venta
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuevo Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stages.map(stage => {
          const stageLeads = getLeadsByStage(stage.id)
          const totalValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0)
          return (
            <Card key={stage.id} className={stage.color}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stage.textColor}`}>
                    {stage.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stageLeads.length}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    ${(totalValue / 1000).toFixed(0)}K en valor
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map(stage => (
          <div key={stage.id} className="space-y-4">
            <div className={`${stage.color} rounded-lg p-3`}>
              <h3 className={`font-semibold ${stage.textColor}`}>
                {stage.title} ({getLeadsByStage(stage.id).length})
              </h3>
            </div>
            
            <div className="space-y-3">
              {getLeadsByStage(stage.id).map(lead => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-move">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {lead.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lead.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="primary">${(lead.value / 1000).toFixed(0)}K</Badge>
                      <Badge variant="default">{lead.source}</Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Asignado a: {lead.assignedTo}
                      </span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <PhoneIcon className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <EnvelopeIcon className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <CalendarIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {getLeadsByStage(stage.id).length === 0 && (
                <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
                  No hay leads en esta etapa
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Lead"
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Roberto Sánchez"
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="roberto@empresa.com"
            required
          />
          
          <Input
            label="Teléfono"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+34 611 222 333"
          />
          
          <Input
            label="Empresa"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="StartupX"
          />
          
          <Input
            label="Valor estimado"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="25000"
          />
          
          <Select
            label="Fuente"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            options={[
              { value: '', label: 'Seleccionar...' },
              { value: 'Website', label: 'Sitio Web' },
              { value: 'Referral', label: 'Referido' },
              { value: 'LinkedIn', label: 'LinkedIn' },
              { value: 'Event', label: 'Evento' },
              { value: 'Cold Call', label: 'Llamada en Frío' }
            ]}
          />

          <Textarea
            label="Notas"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Información adicional..."
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Crear Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
