/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                      DEMO PAGE - API DATA EXAMPLE                          ║
 * ║                                                                            ║
 * ║  Ejemplo completo de página con datos desde API                           ║
 * ║  Demuestra:                                                               ║
 * ║  - Data source desde API con mapeo de respuesta                           ║
 * ║  - Loading, error y estados vacíos                                        ║
 * ║  - Acciones configurables ejecutando APIs                                 ║
 * ║  - Mutaciones optimistic updates                                          ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo } from 'react'
import { useDataSource } from '@/hooks/useDataSource'
import { useActionExecutor } from '@/hooks/useActionExecutor'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { AdvancedSelect } from '@/components/ui/AdvancedSelect'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loading } from '@/components/ui/Loading'
import { Alert } from '@/components/ui/Alert'
import { useAppConfig, useAppTheme } from '@/store/applicationStore'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import type { ColumnDef } from '@tanstack/react-table'
import type { ActionConfig } from '@/config/applications.config'
import toast from 'react-hot-toast'

// ============================================================================
// TYPES
// ============================================================================

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  department: string
  joinedAt: string
}

const ROLES = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Usuario', value: 'user' },
  { label: 'Moderador', value: 'moderator' }
]

const DEPARTMENTS = [
  { label: 'Tecnología', value: 'tech' },
  { label: 'Ventas', value: 'sales' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Recursos Humanos', value: 'hr' }
]

// ============================================================================
// COMPONENT
// ============================================================================

export default function UsersDemoAPIPage() {
  const config = useAppConfig()
  const { theme, gradients } = useAppTheme()
  const { executeAction } = useActionExecutor()

  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [search, setSearch] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Configurar data source desde API
  // Nota: Este ejemplo usa JSONPlaceholder como API de demostración
  const dataSourceConfig = useMemo(() => ({
    type: 'api' as const,
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    method: 'GET' as const,
    cacheTime: 300000, // 5 minutos
    revalidateOnMount: true,
    responseMapper: {
      // JSONPlaceholder devuelve array directo, no objeto con data
      data: '', // Vacío = usa el array directamente
      total: 'length' // Calculado del array
    }
  }), [])

  // Hook de datos
  const {
    data,
    total,
    isLoading,
    isRefetching,
    error,
    isEmpty,
    refetch,
    mutate,
    invalidate
  } = useDataSource<User>(dataSourceConfig, {
    page,
    perPage,
    filters,
    search
  })

  // Transformar datos de JSONPlaceholder a nuestro formato
  const transformedData = useMemo(() => {
    return data.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.id % 3 === 0 ? 'admin' : user.id % 2 === 0 ? 'moderator' : 'user',
      status: user.id % 4 === 0 ? 'inactive' : user.id % 5 === 0 ? 'pending' : 'active',
      avatar: `https://i.pravatar.cc/150?img=${user.id}`,
      department: ['tech', 'sales', 'marketing', 'hr'][user.id % 4],
      joinedAt: new Date(2020 + (user.id % 5), user.id % 12, user.id % 28).toISOString()
    }))
  }, [data])

  // Columnas
  const columns: ColumnDef<User>[] = useMemo(() => [
    {
      header: 'Usuario',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.avatar || `https://ui-avatars.com/api/?name=${row.original.name}`}
            alt={row.original.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {row.original.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.original.email}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Rol',
      accessorKey: 'role',
      cell: ({ row }) => {
        const roleMap = {
          admin: { label: 'Admin', variant: 'primary' as const },
          moderator: { label: 'Moderador', variant: 'secondary' as const },
          user: { label: 'Usuario', variant: 'default' as const }
        }
        const role = roleMap[row.original.role]
        return <Badge variant={role.variant}>{role.label}</Badge>
      }
    },
    {
      header: 'Departamento',
      accessorKey: 'department',
      cell: ({ row }) => {
        const dept = DEPARTMENTS.find(d => d.value === row.original.department)
        return <span className="text-sm">{dept?.label || row.original.department}</span>
      }
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }) => {
        const statusMap = {
          active: { label: 'Activo', variant: 'success' as const },
          inactive: { label: 'Inactivo', variant: 'default' as const },
          pending: { label: 'Pendiente', variant: 'warning' as const }
        }
        const status = statusMap[row.original.status]
        return <Badge variant={status.variant}>{status.label}</Badge>
      }
    },
    {
      header: 'Fecha Ingreso',
      accessorKey: 'joinedAt',
      cell: ({ row }) => {
        const date = new Date(row.original.joinedAt)
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {date.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        )
      }
    }
  ], [])

  // Acciones configuradas
  const rowActionsConfig: ActionConfig[] = useMemo(() => [
    {
      id: 'view-user',
      label: 'Ver Detalle',
      icon: 'EyeIcon',
      variant: 'ghost',
      type: 'function',
      config: {
        functionName: 'viewUser'
      }
    },
    {
      id: 'edit-user',
      label: 'Editar',
      icon: 'PencilIcon',
      variant: 'ghost',
      type: 'function',
      config: {
        functionName: 'editUser'
      }
    },
    {
      id: 'delete-user',
      label: 'Eliminar',
      icon: 'TrashIcon',
      variant: 'danger',
      type: 'api',
      config: {
        endpoint: 'https://jsonplaceholder.typicode.com/users/{id}',
        method: 'DELETE',
        requireConfirmation: true,
        confirmMessage: '¿Estás seguro de eliminar este usuario?',
        successMessage: 'Usuario eliminado correctamente',
        errorMessage: 'Error al eliminar usuario'
      }
    }
  ], [])

  // Registrar funciones para acciones
  useMemo(() => {
    (window as any).viewUser = (context: any) => {
      setSelectedUser(context.record)
      setShowDetailModal(true)
      return Promise.resolve({ success: true })
    }

    (window as any).editUser = (context: any) => {
      toast.success(`Editando usuario: ${context.record.name}`)
      return Promise.resolve({ success: true })
    }
  }, [])

  // Convertir acciones a formato de tabla
  const rowActions = useMemo(() => {
    return rowActionsConfig.map(action => ({
      label: action.label,
      icon: action.icon === 'EyeIcon' ? <EyeIcon className="h-4 w-4" /> :
            action.icon === 'PencilIcon' ? <PencilIcon className="h-4 w-4" /> :
            action.icon === 'TrashIcon' ? <TrashIcon className="h-4 w-4" /> : null,
      variant: action.variant,
      onClick: async (record: User) => {
        await executeAction(action, { record })
        // Revalidar datos después de acción
        if (action.type === 'api') {
          refetch()
        }
      }
    }))
  }, [rowActionsConfig, executeAction, refetch])

  // Acciones globales
  const globalActions = [
    {
      label: 'Nuevo Usuario',
      icon: <PlusIcon className="h-5 w-5" />,
      variant: 'primary' as const,
      onClick: () => setShowCreateModal(true)
    },
    {
      label: 'Refrescar',
      icon: <ArrowPathIcon className="h-5 w-5" />,
      variant: 'ghost' as const,
      onClick: () => {
        refetch()
        toast.success('Datos actualizados')
      }
    }
  ]

  // Stats calculados
  const stats = useMemo(() => ({
    total: transformedData.length,
    active: transformedData.filter(u => u.status === 'active').length,
    admins: transformedData.filter(u => u.role === 'admin').length,
    pending: transformedData.filter(u => u.status === 'pending').length
  }), [transformedData])

  // Render: Error State
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="danger" title="Error al cargar datos">
          <p>{error.message}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="mt-3"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </Alert>
      </div>
    )
  }

  // Render: Loading State (inicial)
  if (isLoading && !data.length) {
    return (
      <div className="p-6">
        <Loading message="Cargando usuarios..." />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Usuarios - Datos desde API
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ejemplo con JSONPlaceholder API • {total} usuarios totales
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Refrescar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Usuarios
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  {stats.total}
                </p>
              </div>
              <div
                className="rounded-full p-3"
                style={{ background: gradients.primary }}
              >
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
                <p className="mt-2 text-3xl font-semibold text-green-600">{stats.active}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
                <p className="mt-2 text-3xl font-semibold" style={{ color: theme.primaryColor }}>
                  {stats.admins}
                </p>
              </div>
              <div className="rounded-full p-3" style={{ background: gradients.cardLight }}>
                <svg className="h-6 w-6" style={{ color: theme.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
                <p className="mt-2 text-3xl font-semibold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />

            <AdvancedSelect
              options={[{ label: 'Todos los roles', value: '' }, ...ROLES]}
              value={filters.role || ''}
              onChange={(val) => {
                setFilters(prev => ({ ...prev, role: val || undefined }))
                setPage(1)
              }}
              placeholder="Filtrar por rol"
              clearable
            />

            <AdvancedSelect
              options={[{ label: 'Todos los departamentos', value: '' }, ...DEPARTMENTS]}
              value={filters.department || ''}
              onChange={(val) => {
                setFilters(prev => ({ ...prev, department: val || undefined }))
                setPage(1)
              }}
              placeholder="Filtrar por departamento"
              clearable
            />
          </div>
        </div>
      </Card>

      {/* DataTable */}
      <Card>
        <DataTable
          data={transformedData}
          columns={columns}
          actions={rowActions}
          globalActions={globalActions}
          pagination={{
            page,
            perPage,
            total,
            onPageChange: setPage,
            onPerPageChange: (pp) => {
              setPerPage(pp)
              setPage(1)
            }
          }}
          selectable
          loading={isLoading || isRefetching}
          emptyMessage={isEmpty ? 'No se encontraron usuarios' : undefined}
        />
      </Card>

      {/* Modal de Detalle */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedUser(null)
        }}
        title="Detalle del Usuario"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedUser.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rol</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {ROLES.find(r => r.value === selectedUser.role)?.label}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedUser.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Departamento</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {DEPARTMENTS.find(d => d.value === selectedUser.department)?.label}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fecha Ingreso</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(selectedUser.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" onClick={() => setShowDetailModal(false)}>
                Cerrar
              </Button>
              <Button variant="primary">
                Editar Usuario
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
