# Farutech Design System

Un sistema de diseño moderno y completo construido con React 19, TypeScript, Tailwind CSS y Radix UI. Inspirado en los mejores design systems como Material Design, Ant Design y Chakra UI.

## 🚀 Características

- **React 19** con las últimas características
- **TypeScript** para desarrollo type-safe
- **Tailwind CSS** para styling utility-first
- **Radix UI** para componentes accesibles y sin estilos
- **Storybook** para documentación interactiva
- **Responsive Design** para mobile, tablet y desktop
- **Dark Mode** integrado
- **Accesibilidad** (WCAG 2.1 AA compliant)
- **Tree-shaking** optimizado
- **Zero dependencies** para runtime

## 📦 Instalación

```bash
npm install @farutech/design-system
# o
yarn add @farutech/design-system
# o
pnpm add @farutech/design-system
```

## 🏗️ Arquitectura

### Componentes UI
- **Base Components**: Button, Input, Select, etc.
- **Layout Components**: Card, Grid, Flex, etc.
- **Navigation**: Tabs, Breadcrumb, Menu, etc.
- **Feedback**: Alert, Toast, Modal, etc.
- **Data Display**: Table, DataTable, Chart, etc.
- **Form Components**: Form, Validation, etc.

### Hooks
- **useDataTable**: Gestión completa de tablas
- **useResponsive**: Detección de breakpoints
- **useDebounce**: Optimización de búsquedas
- **useToast**: Notificaciones
- **useLocalStorage**: Persistencia local

### Estilos
- **Design Tokens**: Colores, tipografía, espaciado
- **CSS Variables**: Para temas light/dark
- **Tailwind Integration**: Clases utility
- **Component Styles**: Estilos específicos por componente

## 🎨 Tema y Personalización

### Variables CSS
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 199 89% 48%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 199 89% 48%;
  --radius: 0.5rem;
}
```

### Dark Mode
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... otras variables */
}
```

## 📚 Documentación Completa

### Storybook
```bash
npm run storybook
```
Visita [http://localhost:6006](http://localhost:6006) para ver la documentación interactiva de todos los componentes.

### Guías de Desarrollo

#### [HOOKS.md](HOOKS.md)
Documentación completa de todos los hooks personalizados disponibles:
- `useDataTable` - Gestión avanzada de tablas
- `useResponsive` - Detección de breakpoints responsive
- `useDebounce` - Optimización de búsquedas
- `useToast` - Sistema de notificaciones
- `useLocalStorage` - Persistencia en localStorage
- `useAuth` - Gestión de autenticación

#### [STYLES.md](STYLES.md)
Guía completa del sistema de estilos:
- Variables CSS (design tokens)
- Sistema de colores y temas
- Espaciado y tipografía responsive
- Animaciones y transiciones
- Dark mode y personalización
- Mejores prácticas de performance

#### [LAYERS.md](LAYERS.md)
Arquitectura del sistema de layers:
- Principios de composición atómica
- Patrones de data flow
- Arquitectura de 5 layers
- Patrones de accesibilidad
- Testing y performance
- Migración y mejores prácticas

### Componentes Principales

#### Button
```tsx
import { Button } from '@farutech/design-system';

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Small</Button>
```

#### DataTable
```tsx
import { DataTable, useDataTable } from '@farutech/design-system';

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

function MyTable({ data }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchable
      selectable
      rowActions={[
        { label: 'Edit', onClick: (row) => console.log('Edit', row) },
        { label: 'Delete', onClick: (row) => console.log('Delete', row), variant: 'destructive' }
      ]}
    />
  );
}
```

#### Form
```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@farutech/design-system';
import { Input } from '@farutech/design-system';

<Form>
  <FormField name="email">
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="Enter your email" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</Form>
```

## 🎯 Principios de Diseño

### 1. Accesibilidad First
- Cumple con WCAG 2.1 AA
- Soporte completo para lectores de pantalla
- Navegación por teclado
- Contraste de colores adecuado

### 2. Responsive Design
- Mobile-first approach
- Breakpoints consistentes: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Componentes adaptativos

### 3. Consistencia
- Paleta de colores unificada
- Tipografía consistente
- Espaciado sistemático
- Comportamiento predecible

### 4. Performance
- Tree-shaking automático
- Bundle splitting
- Lazy loading
- Optimización de re-renders

## 🛠️ Desarrollo

### Configuración
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Storybook
npm run storybook

# Tests
npm run test
```

### Estructura del Proyecto
```
src/
├── components/
│   ├── ui/           # Componentes base
│   └── FarutechLogo.tsx
├── hooks/            # Custom hooks
├── styles/           # CSS y themes
├── utils/            # Utilidades
└── index.ts          # Exports principales
```

## 📋 Lista Completa de Componentes

### Layout Components
- **Card**: Contenedor con header, content, footer
- **Separator**: Divisor visual
- **ScrollArea**: Área scrolleable
- **AspectRatio**: Mantiene proporciones
- **Collapsible**: Contenido colapsable

### Form Components
- **Button**: Botones con múltiples variantes
- **Input**: Campo de texto
- **Textarea**: Área de texto
- **Label**: Etiqueta para inputs
- **Checkbox**: Casilla de verificación
- **Switch**: Interruptor on/off
- **RadioGroup**: Grupo de radio buttons
- **Select**: Dropdown select
- **Slider**: Control deslizante
- **Form**: Sistema de formularios con validación

### Navigation Components
- **Tabs**: Pestañas
- **Breadcrumb**: Migas de pan
- **NavigationMenu**: Menú de navegación
- **Menubar**: Barra de menú
- **ContextMenu**: Menú contextual
- **DropdownMenu**: Menú desplegable

### Feedback Components
- **Alert**: Alertas y notificaciones
- **Toast**: Notificaciones temporales
- **Dialog**: Modal dialogs
- **AlertDialog**: Dialogs de confirmación
- **HoverCard**: Tarjeta al hacer hover
- **Popover**: Contenido emergente
- **Tooltip**: Tooltips informativos
- **Progress**: Barra de progreso

### Data Display
- **Table**: Tabla básica
- **DataTable**: Tabla avanzada con sorting, filtering, pagination
- **Badge**: Etiquetas
- **Avatar**: Avatares de usuario
- **Skeleton**: Estados de carga
- **Chart**: Gráficos (con recharts)

### Advanced Components
- **Accordion**: Acordeón
- **Carousel**: Carrusel de imágenes
- **Drawer**: Panel lateral
- **Sheet**: Panel deslizante
- **Sidebar**: Barra lateral
- **Resizable**: Paneles redimensionables
- **InputOTP**: Input para códigos OTP

## 🔧 Hooks Disponibles

### useDataTable
Gestiona el estado completo de una tabla con sorting, filtering, pagination, etc.

### useResponsive
Detecta breakpoints responsive y proporciona helpers.

### useDebounce
Debounce para optimizar búsquedas y inputs.

### useToast
Manejo de notificaciones toast.

### useLocalStorage
Persistencia en localStorage con sincronización.

## 🎨 Sistema de Colores

### Primary Colors
- **Primary**: Azul principal (#3b82f6)
- **Primary Hover**: Azul más oscuro (#2563eb)
- **Primary Foreground**: Blanco (#ffffff)

### Semantic Colors
- **Destructive**: Rojo para acciones peligrosas (#ef4444)
- **Success**: Verde para confirmaciones (#22c55e)
- **Warning**: Amarillo para advertencias (#f59e0b)
- **Info**: Azul para información (#3b82f6)

### Neutral Colors
- **Background**: Blanco (#ffffff)
- **Foreground**: Gris oscuro (#1f2937)
- **Muted**: Gris claro (#f3f4f6)
- **Border**: Gris muy claro (#e5e7eb)

## 📱 Responsive Breakpoints

```css
/* Mobile First */
.sm: 640px   /* Small tablets */
.md: 768px   /* Tablets */
.lg: 1024px  /* Laptops */
.xl: 1280px  /* Desktops */
.2xl: 1536px /* Large screens */
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Radix UI](https://www.radix-ui.com/) - Componentes primitivos accesibles
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Lucide React](https://lucide.dev/) - Iconos
- [React Hook Form](https://react-hook-form.com/) - Manejo de formularios
- [Zod](https://zod.dev/) - Validación de esquemas

---

Hecho con ❤️ por el equipo de Farutech
