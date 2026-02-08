# @farutech/design-system

Sistema de diseño empresarial de Farutech para aplicaciones React. Proporciona componentes, tokens de diseño y sistema de temas consistente para todos los módulos de la plataforma (Medical, Veterinaria, ERP, POS).

## 🚀 Instalación

### Desde GitHub Packages

1. Crear archivo `.npmrc` en la raíz del proyecto:

```bash
@farutech:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. Instalar el paquete:

```bash
npm install @farutech/design-system
```

## 📦 Características

- **Sistema de Tokens**: 70+ tokens de diseño (colores, tipografía, espaciado, sombras, radios, breakpoints, z-index)
- **Sistema de Temas**: 4 módulos (Medical, Vet, ERP, POS) con modos claro/oscuro
- **30+ Componentes React**: Forms, DataDisplay, Feedback, Navigation, Layout, Patterns
- **6 Hooks Personalizados**: useMediaQuery, useDisclosure, useLocalStorage, useClickOutside, useKeyPress, useTheme
- **TypeScript**: 100% tipado con IntelliSense completo
- **Tree-shakeable**: Imports optimizados para bundle size mínimo
- **Tailwind CSS**: Integración completa con CVA (Class Variance Authority)
- **Accesibilidad**: Componentes ARIA-compliant

## 🎨 Uso Básico

### 1. Configurar el Theme Provider

```tsx
import { ThemeProvider } from '@farutech/design-system/theme';
import '@farutech/design-system/design-system.css';

function App() {
  return (
    <ThemeProvider module="medical" mode="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Usar Componentes

```tsx
import { Button, Input, Card, Badge } from '@farutech/design-system';

function MyComponent() {
  return (
    <Card padding="md" hover>
      <Badge variant="success">Activo</Badge>
      <Input
        label="Email"
        placeholder="usuario@ejemplo.com"
        type="email"
      />
      <Button variant="primary" size="md">
        Guardar
      </Button>
    </Card>
  );
}
```

### 3. Acceder a Tokens

```tsx
import { colors, spacing, typography } from '@farutech/design-system/tokens';

const customStyles = {
  backgroundColor: colors.brand.primary,
  padding: spacing[4],
  fontSize: typography.fontSize.base.size
};
```

### 4. Usar Hooks

```tsx
import {
  useMediaQuery,
  useDisclosure,
  useLocalStorage
} from '@farutech/design-system/hooks';

function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { isOpen, open, close } = useDisclosure();
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return <div>...</div>;
}
```

## 🧩 Componentes Disponibles

### Forms (4 componentes)

- **Input**: Input con validación regex, íconos, password toggle
- **Select**: Select con opciones dinámicas, placeholder, estados
- **Checkbox**: Checkbox con label, descripción, variantes
- **Textarea**: Textarea con contador de caracteres, auto-resize

```tsx
<Input
  label="Nombre"
  error="Campo requerido"
  leftIcon={<UserIcon />}
  validationPattern={/^[a-zA-Z\s]+$/}
/>

<Select
  label="País"
  options={[
    { label: 'Colombia', value: 'co' },
    { label: 'México', value: 'mx' }
  ]}
  placeholder="Seleccionar..."
/>

<Checkbox
  label="Acepto términos"
  description="Lee nuestra política de privacidad"
  size="md"
/>

<Textarea
  label="Comentarios"
  maxLength={500}
  showCount
  rows={4}
/>
```

### Data Display (4 componentes)

- **Badge**: 7 variantes, 3 tamaños, con ícono opcional
- **Avatar**: Inicialesautomáticas, status indicator, tamaños xs-2xl
- **Spinner**: Loading spinner animado, 5 tamaños
- **Divider**: Horizontal/vertical, solid/dashed/dotted, con label

```tsx
<Badge variant="success" size="md" icon={<CheckIcon />}>
  Completado
</Badge>

<Avatar
  src="/avatar.jpg"
  fallback="John Doe"
  status="online"
  size="lg"
  variant="medical"
/>

<Spinner size="md" variant="primary" label="Cargando..." />

<Divider orientation="horizontal" label="O" />
```

### Feedback (3 componentes)

- **Alert**: 5 variantes, dismissible, con ícono y título
- **Modal**: Responsive, escape/overlay close, footer customizable
- **ProgressBar**: Animado, con label, 5 variantes

```tsx
<Alert
  variant="warning"
  title="Advertencia"
  icon={<WarningIcon />}
  onClose={() => {}}
>
  Este es un mensaje de advertencia
</Alert>

<Modal
  open={isOpen}
  onClose={close}
  title="Confirmar Acción"
  description="¿Estás seguro?"
  size="md"
>
  <p>Contenido del modal</p>
  <ModalFooter>
    <Button variant="outline" onClick={close}>Cancelar</Button>
    <Button variant="danger">Confirmar</Button>
  </ModalFooter>
</Modal>

<ProgressBar
  value={75}
  max={100}
  showLabel
  label="Progreso"
  variant="success"
/>
```

### Navigation (2 componentes)

- **Tabs**: 3 variantes (line, contained, pills), horizontal/vertical
- **Breadcrumb**: Con íconos, custom separator, max items

```tsx
<Tabs
  variant="line"
  tabs={[
    { id: 'tab1', label: 'General', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Seguridad', content: <div>Content 2</div> }
  ]}
/>

<Breadcrumb
  items={[
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/productos' },
    { label: 'Detalle' }
  ]}
  separator=">"
/>
```

### Layout (3 componentes)

- **Container**: Responsive max-width, 13 tamaños
- **Stack**: Flex layout con direction, spacing, align, justify
- **Grid**: Grid system con cols, gap, responsive

```tsx
<Container maxWidth="lg" padding="md">
  <Stack direction="column" spacing={4} align="center">
    <Grid cols={3} gap={4} responsive={{ sm: 1, md: 2, lg: 3 }}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </Grid>
  </Stack>
</Container>
```

### Patterns (2 componentes)

- **FormLayout**: Layout de formulario con secciones y footer
- **PageLayout**: Layout de página completa con breadcrumbs, sidebar

```tsx
<FormLayout
  title="Crear Usuario"
  description="Completa el formulario"
  sections={[
    {
      title: 'Información Personal',
      children: <Input label="Nombre" />
    }
  ]}
  footer={
    <>
      <Button variant="outline">Cancelar</Button>
      <Button variant="primary">Guardar</Button>
    </>
  }
/>

<PageLayout
  title="Dashboard"
  description="Resumen de actividad"
  breadcrumbs={[
    { label: 'Inicio', href: '/' },
    { label: 'Dashboard' }
  ]}
  actions={<Button>Nueva Acción</Button>}
  sidebar={<div>Sidebar content</div>}
>
  <div>Main content</div>
</PageLayout>
```

## 🎭 Sistema de Temas

4 módulos con colores brand específicos:

| Módulo | Color | Descripción |
|--------|-------|-------------|
| `medical` | Verde | Aplicaciones médicas |
| `vet` | Azul | Clínicas veterinarias |
| `erp` | Púrpura | Gestión empresarial |
| `pos` | Amber | Punto de venta |

Cada módulo soporta modo `light` y `dark`.

```tsx
import { createTheme } from '@farutech/design-system/theme';

const medicalTheme = createTheme('medical', 'light');
const vetDarkTheme = createTheme('vet', 'dark');
```

## 🪝 Hooks Disponibles

### useMediaQuery

```tsx
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1025px)');

// Convenience hooks
const isMobile = useIsMobile();
const isTablet = useIsTablet();
const isDesktop = useIsDesktop();
```

### useDisclosure

```tsx
const { isOpen, open, close, toggle } = useDisclosure({
  defaultOpen: false,
  onOpen: () => console.log('opened'),
  onClose: () => console.log('closed')
});
```

### useLocalStorage

```tsx
const [value, setValue, remove] = useLocalStorage('key', 'default');
setValue('newValue');
remove();
```

### useClickOutside

```tsx
const ref = useClickOutside<HTMLDivElement>((event) => {
  console.log('Clicked outside!');
}, true);

<div ref={ref}>Content</div>
```

### useKeyPress

```tsx
useKeyPress('Escape', () => console.log('Escape pressed'), {
  enabled: true,
  ctrl: false,
  shift: false
});
```

## 📚 Tokens Disponibles

### Colores (70+ colores)

```ts
import { colors } from '@farutech/design-system/tokens';

// Brand
colors.brand.primary        // hsl(142, 76%, 36%)
colors.brand.secondary      // hsl(221, 83%, 53%)
colors.brand.accent         // hsl(262, 83%, 58%)

// Semantic
colors.semantic.error       // hsl(0, 84%, 60%)
colors.semantic.warning     // hsl(38, 92%, 50%)
colors.semantic.success     // hsl(142, 76%, 36%)
colors.semantic.info        // hsl(199, 89%, 48%)

// Module colors
colors.modules.medical      // hsl(142, 76%, 36%)
colors.modules.vet          // hsl(199, 89%, 48%)
colors.modules.erp          // hsl(262, 83%, 58%)
colors.modules.pos          // hsl(38, 92%, 50%)

// Neutral scale (50-950)
colors.neutral[50]          // hsl(210, 40%, 98%)
colors.neutral[900]         // hsl(222, 47%, 11%)
```

### Espaciado (8pt grid)

```ts
import { spacing } from '@farutech/design-system/tokens';

spacing[0]  // 0px
spacing[1]  // 4px
spacing[2]  // 8px
spacing[4]  // 16px
spacing[6]  // 24px
spacing[8]  // 32px
spacing[12] // 48px
spacing[16] // 64px
spacing[96] // 384px
```

### Tipografía

```ts
import { typography } from '@farutech/design-system/tokens';

typography.fontFamily.sans   // "Inter, system-ui, ..."
typography.fontFamily.mono   // "Fira Code, monospace"

typography.fontSize.xs       // { size: '0.75rem', lineHeight: '1rem' }
typography.fontSize.base     // { size: '1rem', lineHeight: '1.5rem' }
typography.fontSize.3xl      // { size: '1.875rem', lineHeight: '2.25rem' }

typography.fontWeight.normal // 400
typography.fontWeight.bold   // 700
```

## 🏗️ Arquitectura

```
@farutech/design-system/
├── /                      # Componentes principales + CSS
├── /tokens                # Sistema completo de tokens
├── /theme                 # Theme engine y ThemeProvider
└── /hooks                 # React hooks personalizados
```

**Build Output:**
- ESM: `dist/index.mjs` (65.56 kB → 12.72 kB gzip)
- CJS: `dist/index.js` (24.62 kB → 8.47 kB gzip)
- CSS: `dist/design-system.css` (24.76 kB → 5.39 kB gzip)
- Types: `dist/*.d.ts` (TypeScript declarations)

## 🔧 Integración con Tailwind

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@farutech/design-system/**/*.{js,mjs}"
  ],
  theme: {
    extend: {
      // El Design System ya incluye las variables CSS
    }
  }
}
```

## 📊 Estadísticas

- **Componentes**: 30+
- **Tokens**: 70+
- **Hooks**: 6
- **Variantes**: 100+
- **TypeScript**: 100%
- **Bundle Size**: 12.72 kB (gzip)
- **CSS Size**: 5.39 kB (gzip)

## 🤝 Contribuir

Este es un paquete interno de Farutech. Para contribuir:

1. Clonar el repositorio
2. `npm install`
3. Hacer cambios en `src/`
4. `npm run build`
5. Probar localmente con `npm link`
6. Crear PR con descripción detallada

## 📝 Changelog

### v1.0.0 (2025-02-07)

**Lanzamiento inicial** con:
- ✅ 30+ componentes organizados por categorías
- ✅ Sistema completo de tokens de diseño
- ✅ Theme engine multi-módulo
- ✅ 6 hooks personalizados
- ✅ 2 patrones de layout
- ✅ TypeScript definitions completas
- ✅ Build optimizado (ESM + CJS)
- ✅ Documentación completa

## 📄 Licencia

Propietario - Farutech © 2025

---

**Versión**: 1.0.0  
**Mantenido por**: Equipo de Frontend Farutech  
**Build Date**: 2025-02-07
