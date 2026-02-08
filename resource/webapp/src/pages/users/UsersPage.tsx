/**
 * Página de gestión de usuarios con CRUD completo
 */

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CrudTable } from '@/components/crud/CrudTable'
import { CrudActions } from '@/components/crud/CrudActions'
import { CrudPagination } from '@/components/crud/CrudPagination'
import { Modal } from '@/components/ui/Modal'
import type { User } from '@/types'
// import { useCrud } from '@/hooks/useCrud'
import { notify } from '@/store/notificationStore'

// Datos de ejemplo (reemplazar con useCrud hook cuando conectes al backend)
const mockUsers: User[] = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', avatar: '', createdAt: '2024-01-15' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'user', avatar: '', createdAt: '2024-01-16' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'moderator', avatar: '', createdAt: '2024-01-17' },
  { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'user', avatar: '', createdAt: '2024-01-18' },
  { id: 5, name: 'Pedro Sánchez', email: 'pedro@example.com', role: 'user', avatar: '', createdAt: '2024-01-19' },
]

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id?: string | number; count?: number } | null>(null)

  // Cuando conectes al backend, descomenta esto:
  // const userCrud = useCrud<User>({ endpoint: '/users', queryKey: 'users' })
  // const { data, isLoading } = userCrud.useList({ page, perPage, search })
  // const createMutation = userCrud.useCreate()
  // const updateMutation = userCrud.useUpdate()
  // const deleteMutation = userCrud.useDelete()

  // Mock data para demo
  const data = { data: mockUsers, total: 5, page: 1, perPage: 10, totalPages: 1 }
  const isLoading = false

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: true,
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200">
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <CrudActions
          onView={() => handleView(row.original)}
          onEdit={() => handleEdit(row.original)}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ]

  const handleView = (user: User) => {
    notify.info('Ver usuario', `Viendo detalles de ${user.name}`)
  }

  const handleEdit = (user: User) => {
    setCurrentUser(user)
    setIsEditModalOpen(true)
  }

  const handleDelete = (_id: string | number) => {
    // Abrir modal de confirmación para borrado
    setDeleteTarget({ id: _id })
    setIsDeleteModalOpen(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return
    setDeleteTarget({ count: selectedRows.size })
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Usuarios
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button icon={<PlusIcon className="h-5 w-5" />} onClick={() => setIsCreateModalOpen(true)}>
          Crear Usuario
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <Button variant="secondary" icon={<FunnelIcon className="h-5 w-5" />}>
            Filtros
          </Button>
          {selectedRows.size > 0 && (
            <Button
              variant="danger"
              icon={<TrashIcon className="h-5 w-5" />}
              onClick={handleBulkDelete}
            >
              Eliminar ({selectedRows.size})
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <CrudTable
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
        <CrudPagination
          currentPage={page}
          totalPages={data?.totalPages || 1}
          perPage={perPage}
          total={data?.total || 0}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Usuario"
        size="md"
      >
        <div className="space-y-4">
          <Input label="Nombre" placeholder="Juan Pérez" />
          <Input label="Email" type="email" placeholder="juan@example.com" />
          <Input label="Contraseña" type="password" placeholder="••••••••" />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => {
            notify.success('Usuario creado', 'El usuario ha sido creado correctamente')
            setIsCreateModalOpen(false)
          }}>
            Crear
          </Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Usuario"
        size="md"
      >
        {currentUser && (
          <div className="space-y-4">
            <Input label="Nombre" defaultValue={currentUser.name} />
            <Input label="Email" type="email" defaultValue={currentUser.email} />
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => {
            notify.success('Usuario actualizado', 'Los cambios han sido guardados')
            setIsEditModalOpen(false)
          }}>
            Guardar
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal (single or bulk) */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeleteTarget(null) }}
        title={deleteTarget?.count ? `Eliminar ${deleteTarget.count} usuarios` : 'Eliminar usuario'}
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400">
          {deleteTarget?.count
            ? `¿Estás seguro de eliminar ${deleteTarget.count} usuarios? Esta acción no se puede deshacer.`
            : '¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.'}
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => { setIsDeleteModalOpen(false); setDeleteTarget(null) }}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              // Mock delete behavior: en producción usar las mutaciones del hook useCrud
              if (deleteTarget?.count) {
                notify.success('Usuarios eliminados', `${deleteTarget.count} usuarios eliminados`)
                setSelectedRows(new Set())
              } else if (deleteTarget?.id) {
                notify.success('Usuario eliminado', 'El usuario ha sido eliminado correctamente')
              }
              setIsDeleteModalOpen(false)
              setDeleteTarget(null)
            }}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
