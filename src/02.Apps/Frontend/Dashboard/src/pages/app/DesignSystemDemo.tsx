// ============================================================================
// DEMO PAGE - Showcase of Design System components
// ============================================================================

import * as React from 'react';
import { UniversalDashboardLayout } from '@/components/layout/UniversalDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ValidatedInput,
  AutoResizeTextarea,
  SearchableSelect,
  DateRangePicker,
  Stepper,
  StepperContent,
  StepperActions,
  StatusChip,
  DataTable,
  notification,
} from '@/components/design-system';
import type { SelectOption, StepperStep, DataTableAction } from '@/components/design-system';
import { ColumnDef } from '@tanstack/react-table';
import { DateRange } from 'react-day-picker';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Phone,
  Check,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';

// ============================================================================
// Demo Data
// ============================================================================

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

const demoUsers: DemoUser[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'María García', email: 'maria@example.com', role: 'Usuario', status: 'active', createdAt: '2024-02-20' },
  { id: '3', name: 'Carlos López', email: 'carlos@example.com', role: 'Editor', status: 'pending', createdAt: '2024-03-10' },
  { id: '4', name: 'Ana Martínez', email: 'ana@example.com', role: 'Usuario', status: 'inactive', createdAt: '2024-03-25' },
  { id: '5', name: 'Pedro Sánchez', email: 'pedro@example.com', role: 'Admin', status: 'active', createdAt: '2024-04-01' },
];

const roleOptions: SelectOption[] = [
  { value: 'admin', label: 'Administrador', description: 'Acceso completo' },
  { value: 'editor', label: 'Editor', description: 'Puede editar contenido' },
  { value: 'user', label: 'Usuario', description: 'Solo lectura' },
  { value: 'guest', label: 'Invitado', description: 'Acceso limitado' },
];

const stepperSteps: StepperStep[] = [
  { id: 'info', title: 'Información', description: 'Datos básicos' },
  { id: 'contact', title: 'Contacto', description: 'Información de contacto' },
  { id: 'review', title: 'Revisión', description: 'Confirmar datos' },
];

// ============================================================================
// Table columns
// ============================================================================

const userColumns: ColumnDef<DemoUser>[] = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Rol' },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variants: Record<string, 'success' | 'error' | 'warning'> = {
        active: 'success',
        inactive: 'error',
        pending: 'warning',
      };
      const labels: Record<string, string> = {
        active: 'Activo',
        inactive: 'Inactivo',
        pending: 'Pendiente',
      };
      return <StatusChip label={labels[status]} variant={variants[status]} size="sm" />;
    },
  },
  { accessorKey: 'createdAt', header: 'Creado' },
];

const userActions: DataTableAction<DemoUser>[] = [
  { label: 'Ver', icon: <Eye className="h-4 w-4" />, onClick: (row) => console.log('View', row) },
  { label: 'Editar', icon: <Edit className="h-4 w-4" />, onClick: (row) => console.log('Edit', row) },
  { label: 'Eliminar', icon: <Trash2 className="h-4 w-4" />, onClick: (row) => console.log('Delete', row), variant: 'destructive' },
];

// ============================================================================
// Component
// ============================================================================

export default function DesignSystemDemo() {
  // Form state
  const [email, setEmail] = React.useState('');
  const [emailValidation, setEmailValidation] = React.useState<'default' | 'success' | 'error'>('default');
  const [password, setPassword] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('');
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [description, setDescription] = React.useState('');
  
  // Stepper state
  const [currentStep, setCurrentStep] = React.useState(0);

  // Email validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.length === 0) {
      setEmailValidation('default');
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailValidation('success');
    } else {
      setEmailValidation('error');
    }
  };

  return (
    <UniversalDashboardLayout
      pageTitle="Design System"
      pageDescription="Componentes y patrones del sistema de diseño Farutech"
    >
      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forms">Formularios</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="process">Procesos</TabsTrigger>
        </TabsList>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Validated Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Inputs Validados</CardTitle>
                <CardDescription>Campos con estados visuales de validación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ValidatedInput
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  validationState={emailValidation}
                  errorMessage="Por favor ingresa un email válido"
                  successMessage="Email válido"
                  leftIcon={Mail}
                  required
                />

                <ValidatedInput
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={Lock}
                  showPasswordToggle
                  helperText="Mínimo 8 caracteres"
                  required
                />

                <ValidatedInput
                  label="Teléfono"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  leftIcon={Phone}
                />
              </CardContent>
            </Card>

            {/* Selects and Pickers */}
            <Card>
              <CardHeader>
                <CardTitle>Selectores</CardTitle>
                <CardDescription>Combobox y selectores de fecha</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SearchableSelect
                  label="Rol de usuario"
                  options={roleOptions}
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  placeholder="Seleccionar rol..."
                  searchPlaceholder="Buscar rol..."
                  clearable
                  required
                />

                <DateRangePicker
                  label="Rango de fechas"
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Seleccionar período..."
                  helperText="Selecciona un rango de fechas"
                />

                <AutoResizeTextarea
                  label="Descripción"
                  placeholder="Escribe una descripción..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minRows={2}
                  maxRows={6}
                  helperText="El campo se expande automáticamente"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>DataTable</CardTitle>
              <CardDescription>Tabla de datos con búsqueda, ordenamiento y paginación</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={userColumns}
                data={demoUsers}
                rowActions={userActions}
                selectable
                onAdd={() => console.log('Add new')}
                addLabel="Nuevo Usuario"
                onRefresh={() => console.log('Refresh')}
                onExport={() => console.log('Export')}
                bulkActions={[
                  {
                    label: 'Eliminar',
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: (rows) => console.log('Delete selected', rows),
                    variant: 'destructive',
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Status Chips */}
            <Card>
              <CardHeader>
                <CardTitle>Status Chips</CardTitle>
                <CardDescription>Indicadores de estado con múltiples variantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <StatusChip label="Default" variant="default" />
                  <StatusChip label="Éxito" variant="success" icon={Check} />
                  <StatusChip label="Error" variant="error" icon={AlertCircle} />
                  <StatusChip label="Advertencia" variant="warning" />
                  <StatusChip label="Info" variant="info" />
                  <StatusChip label="Primary" variant="primary" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusChip label="Pequeño" variant="primary" size="sm" />
                  <StatusChip label="Mediano" variant="primary" size="md" />
                  <StatusChip label="Grande" variant="primary" size="lg" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusChip label="Con pulso" variant="success" pulse />
                  <StatusChip label="Removible" variant="info" removable onRemove={() => console.log('Removed')} />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Sistema de notificaciones toast</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => notification.success('¡Éxito!', 'La operación se completó correctamente')}
                  >
                    Éxito
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => notification.error('Error', 'Algo salió mal')}
                  >
                    Error
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => notification.warning('Advertencia', 'Revisa esta información')}
                  >
                    Advertencia
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => notification.info('Información', 'Datos actualizados')}
                  >
                    Info
                  </Button>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    notification.promise(
                      new Promise((resolve) => setTimeout(resolve, 2000)),
                      {
                        loading: 'Guardando...',
                        success: 'Guardado correctamente',
                        error: 'Error al guardar',
                      }
                    );
                  }}
                >
                  Notificación con Promise
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Process Tab */}
        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle>Stepper</CardTitle>
              <CardDescription>Wizard para procesos multi-paso</CardDescription>
            </CardHeader>
            <CardContent>
              <Stepper
                steps={stepperSteps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                allowClickableSteps
              />

              <StepperContent stepIndex={0} currentStep={currentStep}>
                <div className="grid gap-4 md:grid-cols-2 py-4">
                  <ValidatedInput label="Nombre" placeholder="Tu nombre" leftIcon={User} required />
                  <ValidatedInput label="Apellido" placeholder="Tu apellido" leftIcon={User} required />
                </div>
              </StepperContent>

              <StepperContent stepIndex={1} currentStep={currentStep}>
                <div className="grid gap-4 md:grid-cols-2 py-4">
                  <ValidatedInput label="Email" type="email" placeholder="tu@email.com" leftIcon={Mail} required />
                  <ValidatedInput label="Teléfono" type="tel" placeholder="+1 234 567 8900" leftIcon={Phone} />
                  <ValidatedInput label="Empresa" placeholder="Nombre de la empresa" leftIcon={Building2} className="md:col-span-2" />
                </div>
              </StepperContent>

              <StepperContent stepIndex={2} currentStep={currentStep}>
                <div className="py-4 text-center">
                  <Check className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">¡Todo listo!</h3>
                  <p className="text-muted-foreground">Revisa la información y confirma para continuar.</p>
                </div>
              </StepperContent>

              <StepperActions
                currentStep={currentStep}
                totalSteps={stepperSteps.length}
                onNext={() => setCurrentStep((prev) => Math.min(prev + 1, stepperSteps.length - 1))}
                onPrevious={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                onComplete={() => {
                  notification.success('¡Completado!', 'El proceso se ha completado exitosamente');
                  setCurrentStep(0);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UniversalDashboardLayout>
  );
}
