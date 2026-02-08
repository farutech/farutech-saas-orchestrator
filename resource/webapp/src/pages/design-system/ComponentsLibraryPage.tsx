import { useState } from 'react'
import { CodePreview, CodePreviewGroup } from '../../components/ui/CodePreview'
import {
  Button,
  ButtonGroup,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  RadioGroup,
  Badge,
  Avatar,
  AvatarGroup,
  Card,
  CardHeader,
  Alert,
  Modal,
  Tooltip,
  Tabs,
  Breadcrumb,
  Divider,
  SectionHeader,
  ProgressBar,
  Spinner,
  StatsCard,
  StatsCardGroup,
  NoDataState,
  Skeleton,
  SkeletonCard,
  Drawer,
  Stepper,
  useStepper,
  DatePicker,
  ModuleSwitcher,
  CommandPalette,
  NotificationPanel,
} from '../../components/ui'
import {
  HomeIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

/**
 * 📚 Components Library Page
 * 
 * Documentación completa de TODOS los componentes UI del Design System.
 * Organizado por categorías con ejemplos interactivos.
 */

export default function ComponentsLibraryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { currentStep, next, prev, goTo } = useStepper(5)

  return (
    <div className="space-y-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📚 Components Library
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Biblioteca completa de componentes UI con ejemplos y código.
        </p>

        {/* Quick Navigation */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            'Botones',
            'Formularios',
            'Feedback',
            'Datos',
            'Navegación',
            'Overlays',
            'Layout',
            'Avanzados',
          ].map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase()}`}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
            >
              {category}
            </a>
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <section id="botones" className="scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🔘 Botones
        </h2>

        <CodePreviewGroup>
          <CodePreview
            title="Button - Variantes"
            description="Botón con múltiples variantes de color y tamaño."
            preview={
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            }
            code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>`}
          />

          <CodePreview
            title="Button - Tamaños"
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            }
            code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
          />

          <CodePreview
            title="ButtonGroup"
            description="Grupo de botones relacionados."
            preview={
              <ButtonGroup>
                <Button variant="secondary">Izquierda</Button>
                <Button variant="secondary">Centro</Button>
                <Button variant="secondary">Derecha</Button>
              </ButtonGroup>
            }
            code={`<ButtonGroup>
  <Button variant="secondary">Izquierda</Button>
  <Button variant="secondary">Centro</Button>
  <Button variant="secondary">Derecha</Button>
</ButtonGroup>`}
          />
        </CodePreviewGroup>
      </section>

      {/* FORMS */}
      <section id="formularios" className="scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📝 Formularios
        </h2>

        <CodePreviewGroup>
          <CodePreview
            title="Input"
            preview={
              <div className="space-y-4 max-w-md">
                <Input label="Nombre" placeholder="Ingresa tu nombre" />
                <Input label="Email" type="email" placeholder="correo@ejemplo.com" error="Email inválido" />
                <Input label="Contraseña" type="password" placeholder="********" />
                <Input label="Deshabilitado" disabled value="Campo deshabilitado" />
              </div>
            }
            code={`<Input label="Nombre" placeholder="Ingresa tu nombre" />
<Input label="Email" error="Email inválido" />
<Input label="Contraseña" type="password" />
<Input disabled value="Campo deshabilitado" />`}
          />

          <CodePreview
            title="Textarea"
            preview={
              <div className="max-w-md">
                <Textarea 
                  label="Descripción" 
                  placeholder="Escribe aquí..." 
                  rows={4}
                />
              </div>
            }
            code={`<Textarea 
  label="Descripción" 
  placeholder="Escribe aquí..." 
  rows={4}
/>`}
          />

          <CodePreview
            title="Select"
            preview={
              <div className="max-w-md">
                <Select 
                  label="País"
                  options={[
                    { value: '', label: 'Selecciona un país' },
                    { value: 'mx', label: 'México' },
                    { value: 'co', label: 'Colombia' },
                    { value: 'ar', label: 'Argentina' },
                    { value: 'cl', label: 'Chile' },
                  ]}
                />
              </div>
            }
            code={`<Select 
  label="País"
  options={[
    { value: '', label: 'Selecciona un país' },
    { value: 'mx', label: 'México' },
    { value: 'co', label: 'Colombia' },
  ]}
/>`}
          />

          <CodePreview
            title="Checkbox & Switch"
            preview={
              <div className="space-y-4">
                <Checkbox label="Acepto los términos y condiciones" />
                <Checkbox label="Checkbox deshabilitado" disabled />
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Switch label="Notificaciones activas" checked={false} onChange={() => {}} />
                  <Switch label="Dark mode" checked={true} onChange={() => {}} className="mt-3" />
                </div>
              </div>
            }
            code={`<Checkbox label="Acepto términos" />
<Checkbox label="Deshabilitado" disabled />
<Switch label="Notificaciones" checked={true} onChange={handleChange} />
<Switch label="Dark mode" checked={false} onChange={handleChange} />`}
          />

          <CodePreview
            title="RadioGroup"
            preview={
              <RadioGroup
                options={[
                  { value: 'basic', label: 'Plan Básico', description: '$9/mes' },
                  { value: 'pro', label: 'Plan Pro', description: '$19/mes' },
                  { value: 'enterprise', label: 'Enterprise', description: 'Contactar' },
                ]}
                onChange={() => {}}
              />
            }
            code={`<RadioGroup
  options={[
    { value: 'basic', label: 'Plan Básico', description: '$9/mes' },
    { value: 'pro', label: 'Plan Pro', description: '$19/mes' },
  ]}
  onChange={handleChange}
/>`}
          />

          <CodePreview
            title="DatePicker"
            preview={
              <div className="max-w-md space-y-4">
                <DatePicker label="Fecha de nacimiento" />
              </div>
            }
            code={`<DatePicker label="Fecha de nacimiento" />`}
          />
        </CodePreviewGroup>
      </section>

      {/* FEEDBACK */}
      <section id="feedback" className="scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          💬 Feedback
        </h2>

        <CodePreviewGroup>
          <CodePreview
            title="Alert - Variantes"
            preview={
              <div className="space-y-4">
                <Alert variant="info" title="Información">
                  Este es un mensaje informativo para el usuario.
                </Alert>
                <Alert variant="success" title="¡Éxito!">
                  La operación se completó correctamente.
                </Alert>
                <Alert variant="warning" title="Advertencia">
                  Por favor revisa los datos ingresados.
                </Alert>
                <Alert variant="error" title="Error">
                  No se pudo completar la operación.
                </Alert>
              </div>
            }
            code={`<Alert variant="info" title="Información">
  Este es un mensaje informativo.
</Alert>

<Alert variant="success" title="¡Éxito!">
  La operación se completó correctamente.
</Alert>

<Alert variant="warning" title="Advertencia">
  Por favor revisa los datos.
</Alert>

<Alert variant="error" title="Error">
  No se pudo completar la operación.
</Alert>`}
          />

          <CodePreview
            title="Modal"
            preview={
              <>
                <Button onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Confirmar acción"
                >
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    ¿Estás seguro de que deseas continuar con esta acción?
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                      Confirmar
                    </Button>
                  </div>
                </Modal>
              </>
            }
            code={`const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>
  Abrir Modal
</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar acción"
>
  <p>¿Estás seguro?</p>
  <Button onClick={() => setIsOpen(false)}>
    Confirmar
  </Button>
</Modal>`}
          />

          <CodePreview
            title="Spinner"
            preview={
              <div className="flex gap-6">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
            }
            code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}
          />

          <CodePreview
            title="ProgressBar"
            preview={
              <div className="space-y-4">
                <ProgressBar value={30} />
                <ProgressBar value={60} showLabel />
                <ProgressBar value={85} />
              </div>
            }
            code={`<ProgressBar value={30} />
<ProgressBar value={60} showLabel />
<ProgressBar value={85} />`}
          />

          <CodePreview
            title="Tooltip"
            preview={
              <div className="flex gap-4">
                <Tooltip content="Información adicional">
                  <Button variant="secondary">Hover me</Button>
                </Tooltip>
                <Tooltip content="Tooltip arriba" position="top">
                  <Button variant="secondary">Top</Button>
                </Tooltip>
              </div>
            }
            code={`<Tooltip content="Información adicional">
  <Button>Hover me</Button>
</Tooltip>

<Tooltip content="Tooltip arriba" position="top">
  <Button>Top</Button>
</Tooltip>`}
          />
        </CodePreviewGroup>
      </section>

      {/* DATA DISPLAY */}
      <section id="datos" className="scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📊 Visualización de Datos
        </h2>

        <CodePreviewGroup>
          <CodePreview
            title="Badge"
            preview={
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="default">Default</Badge>
              </div>
            }
            code={`<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>`}
          />

          <CodePreview
            title="Avatar & AvatarGroup"
            preview={
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Avatar size="sm" name="John Doe" />
                  <Avatar size="md" name="Jane Smith" />
                  <Avatar size="lg" name="Bob Johnson" />
                </div>
                <AvatarGroup
                  avatars={[
                    { name: 'User 1' },
                    { name: 'User 2' },
                    { name: 'User 3' },
                    { name: 'User 4' },
                    { name: 'User 5' },
                  ]}
                  max={3}
                />
              </div>
            }
            code={`<Avatar size="sm" name="John Doe" />
<Avatar size="md" name="Jane Smith" />
<Avatar size="lg" name="Bob Johnson" />

<AvatarGroup
  users={[
    { name: 'User 1' },
    { name: 'User 2' },
    { name: 'User 3' },
  ]}
  max={3}
/>`}
          />

          <CodePreview
            title="Card"
            preview={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader title="Card Simple" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Contenido de la tarjeta con información relevante.
                  </p>
                </Card>
                <Card>
                  <CardHeader 
                    title="Card con Acción" 
                    action={<Button size="sm">Acción</Button>}
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    Tarjeta con botón de acción en el header.
                  </p>
                </Card>
              </div>
            }
            code={`<Card>
  <CardHeader title="Card Simple" />
  <p>Contenido de la tarjeta.</p>
</Card>

<Card>
  <CardHeader 
    title="Card con Acción" 
    action={<Button>Acción</Button>}
  />
  <p>Contenido...</p>
</Card>`}
          />

          <CodePreview
            title="StatsCard"
            preview={
              <StatsCardGroup>
                <StatsCard
                  title="Total Usuarios"
                  value="12,543"
                  change={{ value: 12.5, trend: 'up' }}
                  variant="primary"
                />
                <StatsCard
                  title="Ventas"
                  value="$45,231"
                  change={{ value: 3.2, trend: 'down' }}
                  variant="success"
                />
              </StatsCardGroup>
            }
            code={`<StatsCardGroup>
  <StatsCard
    title="Total Usuarios"
    value="12,543"
    change={{ value: 12.5, trend: 'up' }}
    variant="primary"
  />
</StatsCardGroup>`}
          />

          <CodePreview
            title="EmptyState"
            preview={
              <div className="space-y-6">
                <NoDataState />
              </div>
            }
            code={`<NoDataState />`}
          />

          <CodePreview
            title="Skeleton"
            preview={
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <SkeletonCard />
              </div>
            }
            code={`<Skeleton className="h-8 w-3/4" />
<Skeleton className="h-4 w-full" />
<SkeletonCard />`}
          />
        </CodePreviewGroup>
      </section>

      {/* NAVIGATION */}
      <section id="navegación" className="scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🧭 Navegación
        </h2>

        <CodePreviewGroup>
          <CodePreview
            title="Breadcrumb"
            preview={
              <Breadcrumb
                items={[
                  { label: 'Inicio', href: '/', icon: HomeIcon },
                  { label: 'Configuración', href: '/settings', icon: Cog6ToothIcon },
                  { label: 'Perfil', href: '/settings/profile' },
                ]}
              />
            }
            code={`<Breadcrumb
  items={[
    { label: 'Inicio', href: '/', icon: HomeIcon },
    { label: 'Configuración', href: '/settings' },
    { label: 'Perfil' },
  ]}
/>`}
          />

          <CodePreview
            title="Tabs"
            preview={
              <Tabs
                tabs={[
                  { 
                    id: 'tab1', 
                    label: 'General', 
                    content: <div className="p-4 text-gray-600 dark:text-gray-400">Contenido General</div> 
                  },
                  { 
                    id: 'tab2', 
                    label: 'Seguridad', 
                    content: <div className="p-4 text-gray-600 dark:text-gray-400">Contenido Seguridad</div> 
                  },
                  { 
                    id: 'tab3', 
                    label: 'Notificaciones', 
                    content: <div className="p-4 text-gray-600 dark:text-gray-400">Contenido Notificaciones</div> 
                  },
                ]}
              />
            }
            code={`<Tabs
  tabs={[
    { id: 'tab1', label: 'General', content: <div>Contenido</div> },
    { id: 'tab2', label: 'Seguridad', content: <div>Contenido</div> },
  ]}
/>`}
          />

          <CodePreview
            title="Stepper"
            preview={
              <div className="space-y-6">
                <Stepper
                  steps={[
                    { label: 'Información', description: 'Datos básicos' },
                    { label: 'Configuración', description: 'Preferencias' },
                    { label: 'Revisión', description: 'Verificar datos' },
                    { label: 'Confirmación', description: 'Finalizar' },
                  ]}
                  currentStep={currentStep}
                  onStepClick={goTo}
                />
                <div className="flex justify-between">
                  <Button onClick={prev} disabled={currentStep === 0} variant="secondary">
                    Anterior
                  </Button>
                  <Button onClick={next} disabled={currentStep === 3}>
                    Siguiente
                  </Button>
                </div>
              </div>
            }
            code={`const { currentStep, next, prev, goTo } = useStepper(4)

<Stepper
  steps={[
    { label: 'Información' },
    { label: 'Configuración' },
    { label: 'Revisión' },
  ]}
  currentStep={currentStep}
  onStepClick={goTo}
/>

<Button onClick={prev}>Anterior</Button>
<Button onClick={next}>Siguiente</Button>`}
          />
        </CodePreviewGroup>
      </section>

      {/* OVERLAYS */}
      <section id="overlays" className="scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📱 Overlays
        </h2>

        <CodePreviewGroup>
          <CodePreview
            title="Drawer"
            preview={
              <>
                <Button onClick={() => setIsDrawerOpen(true)}>Abrir Drawer</Button>
                <Drawer
                  isOpen={isDrawerOpen}
                  onClose={() => setIsDrawerOpen(false)}
                  title="Panel Lateral"
                  position="right"
                >
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Contenido del drawer con información adicional.
                  </p>
                  <Button onClick={() => setIsDrawerOpen(false)}>
                    Cerrar
                  </Button>
                </Drawer>
              </>
            }
            code={`const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>
  Abrir Drawer
</Button>

<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Panel Lateral"
  position="right"
>
  <p>Contenido...</p>
</Drawer>`}
          />
        </CodePreviewGroup>
      </section>

      {/* LAYOUT */}
      <section id="layout" className="scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📐 Layout
        </h2>

        <CodePreviewGroup>
          <CodePreview
            title="Divider"
            preview={
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Contenido superior</p>
                  <Divider />
                  <p className="text-gray-600 dark:text-gray-400">Contenido inferior</p>
                </div>
                <Divider label="O continuar con" />
              </div>
            }
            code={`<Divider />
<Divider label="O continuar con" />`}
          />

          <CodePreview
            title="SectionHeader"
            preview={
              <div className="space-y-6">
                <SectionHeader title="Configuración General" />
                <SectionHeader 
                  title="Usuarios" 
                  subtitle="Gestiona los usuarios del sistema"
                />
              </div>
            }
            code={`<SectionHeader title="Configuración General" />

<SectionHeader 
  title="Usuarios" 
  subtitle="Gestiona los usuarios del sistema"
/>`}
          />
        </CodePreviewGroup>
      </section>

      {/* ADVANCED */}
      <section id="avanzados" className="scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🚀 Componentes Avanzados
        </h2>

        <CodePreviewGroup>
          <CodePreview
            title="ModuleSwitcher"
            preview={
              <ModuleSwitcher
                modules={[
                  { id: 'crm', name: 'CRM', description: 'Gestión de clientes' },
                  { id: 'ventas', name: 'Ventas', description: 'Módulo de ventas' },
                  { id: 'config', name: 'Configuración', description: 'Ajustes del sistema' },
                ]}
                currentModule="crm"
                onModuleChange={(id) => console.log('Module:', id)}
              />
            }
            code={`<ModuleSwitcher
  modules={[
    { id: 'crm', name: 'CRM' },
    { id: 'ventas', name: 'Ventas' },
  ]}
  currentModule="crm"
  onModuleChange={handleChange}
/>`}
          />

          <CodePreview
            title="CommandPalette"
            preview={
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Presiona <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs">Ctrl+K</kbd> para abrir
                </p>
                <CommandPalette
                  commands={[
                    { id: '1', title: 'Nuevo Usuario', group: 'Acciones', action: () => {} },
                    { id: '2', title: 'Configuración', group: 'Páginas', action: () => {} },
                  ]}
                />
              </div>
            }
            code={`<CommandPalette
  commands={[
    { 
      id: '1', 
      title: 'Nuevo Usuario', 
      group: 'Acciones',
      action: handleAction 
    },
  ]}
/>`}
          />

          <CodePreview
            title="NotificationPanel"
            preview={
              <NotificationPanel
                notifications={[
                  { 
                    id: '1', 
                    title: 'Nueva notificación', 
                    message: 'Tienes una nueva alerta',
                    type: 'info',
                    read: false,
                    timestamp: new Date()
                  },
                  { 
                    id: '2', 
                    title: 'Actualización', 
                    message: 'Sistema actualizado',
                    type: 'success',
                    read: true,
                    timestamp: new Date(Date.now() - 3600000)
                  },
                ]}
              />
            }
            code={`<NotificationPanel
  notifications={[
    { 
      id: '1', 
      title: 'Nueva notificación',
      message: 'Contenido',
      type: 'info',
      read: false,
      timestamp: new Date()
    },
  ]}
/>`}
          />
        </CodePreviewGroup>
      </section>
    </div>
  )
}
