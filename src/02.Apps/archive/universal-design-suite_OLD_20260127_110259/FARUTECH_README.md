# Farutech - Sistema Multi-tenant SaaS

Sistema híbrido Multi-tenant con Orchestrator (Admin Panel) y Client Apps (Dashboards dinámicos).

## 🎯 Características Principales

### 1. **Núcleo de Autenticación (2 Pasos)**
- ✅ Login con selección de organización
- ✅ Tokens JWT (intermediateToken → accessToken)
- ✅ Gestión de contexto multi-tenant

### 2. **App Launcher (Portal de Inicio)**
- ✅ Selección de aplicaciones disponibles
- ✅ Motor de temas dinámicos por industria:
  - **Orchestrator**: Azul Profundo/Pizarra
  - **Medical**: Turquesa/Cian
  - **Veterinary**: Naranja/Tierra
  - **ERP/POS**: Violeta/Indigo

### 3. **Orchestrator (Admin Panel)**
- ✅ Catálogo jerárquico (Product > Module > Feature)
- ✅ Gestión de clientes (CRM)
- ✅ Wizard de provisionamiento (3 pasos)
- ✅ Navegación tipo Master-Detail

### 4. **Client Dashboards**
- ✅ Layouts modulares por industria
- ✅ Componentes contextuales
- ✅ Temas dinámicos

### 5. **API Integration**
- ✅ Cliente Axios con interceptores
- ✅ React Query hooks
- ✅ Tipos TypeScript generados desde OpenAPI

## 🚀 Inicio Rápido

### Instalación

\`\`\`bash
# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env y configurar VITE_API_BASE_URL
\`\`\`

### Desarrollo

\`\`\`bash
# Iniciar servidor de desarrollo
bun run dev
\`\`\`

### Build

\`\`\`bash
# Build para producción
bun run build

# Preview del build
bun run preview
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
src/
├── components/
│   ├── farutech/          # Componentes específicos de Farutech
│   │   ├── FarutechLogo.tsx
│   │   └── GlobalLoader.tsx
│   └── ui/                # Componentes Shadcn UI
│
├── contexts/
│   ├── AuthContext.tsx    # Gestión de autenticación
│   └── FarutechContext.tsx
│
├── hooks/
│   └── useApi.ts          # React Query hooks
│
├── lib/
│   ├── api-client.ts      # Cliente Axios configurado
│   ├── theme-manager.ts   # Sistema de temas dinámicos
│   └── utils.ts
│
├── pages/
│   ├── auth/
│   │   ├── Login.tsx          # Login (Paso 1)
│   │   ├── SelectContext.tsx  # Selección de org (Paso 2)
│   │   └── Register.tsx
│   │
│   ├── orchestrator/
│   │   ├── OrchestratorLayout.tsx
│   │   ├── CatalogPage.tsx        # Product > Module > Feature
│   │   ├── CustomersPage.tsx      # CRM
│   │   ├── ProvisioningPage.tsx   # Wizard
│   │   └── catalog/
│   │       ├── ProductsView.tsx
│   │       ├── ModulesView.tsx
│   │       └── FeaturesView.tsx
│   │
│   ├── AppLauncher.tsx    # Portal de inicio
│   └── Dashboard.tsx      # Client Dashboard
│
├── services/
│   ├── auth.service.ts
│   ├── catalog.service.ts
│   ├── customers.service.ts
│   ├── instances.service.ts
│   └── provisioning.service.ts
│
├── types/
│   └── api.ts             # Tipos TypeScript del API
│
└── App.tsx                # Configuración de rutas
\`\`\`

## 🔐 Flujo de Autenticación

### Paso 1: Login
\`\`\`
POST /api/Auth/login
{
  "email": "user@example.com",
  "password": "password"
}
\`\`\`

**Caso A**: Usuario con una sola organización
- Respuesta: `accessToken` directo
- Redirige a: `/launcher`

**Caso B**: Usuario con múltiples organizaciones
- Respuesta: `intermediateToken` + `availableTenants[]`
- Redirige a: `/auth/select-context`

### Paso 2: Selección de Contexto (Solo si hay múltiples orgs)
\`\`\`
POST /api/Auth/select-context
{
  "intermediateToken": "...",
  "tenantId": "uuid"
}
\`\`\`

Respuesta: `accessToken` final

## 🎨 Sistema de Temas

El sistema aplica temas dinámicos según el tipo de aplicación:

\`\`\`typescript
import { ThemeManager } from '@/lib/theme-manager';

// Aplicar tema
ThemeManager.applyTheme('medical');

// Detectar tema desde producto
const theme = ThemeManager.detectThemeFromProduct('Hospital System');
\`\`\`

## 📡 Uso de API

### Con React Query Hooks

\`\`\`typescript
import { useProducts, useCreateProduct } from '@/hooks/useApi';

function MyComponent() {
  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      name: 'New Product',
      description: 'Description'
    });
  };
}
\`\`\`

### Endpoints Disponibles

#### Auth
- `POST /api/Auth/login`
- `POST /api/Auth/select-context`
- `POST /api/Auth/register`
- `POST /api/Auth/assign-user`

#### Catalog
- `GET /api/Catalog/products`
- `POST /api/Catalog/products`
- `GET /api/Catalog/products/{id}`
- `PUT /api/Catalog/products/{id}`
- `DELETE /api/Catalog/products/{id}`
- `GET /api/Catalog/products/{productId}/modules`
- (Y más endpoints para Modules y Features)

#### Customers
- `GET /api/Customers`
- `POST /api/Customers`
- `GET /api/Customers/{id}`
- `PUT /api/Customers/{id}`
- `DELETE /api/Customers/{id}`

#### Provisioning
- `POST /api/Provisioning/provision`
- `DELETE /api/Provisioning/{tenantInstanceId}`
- `PUT /api/Provisioning/{tenantInstanceId}/features`

#### Instances
- `GET /api/Instances`
- `GET /api/Instances/{id}`

## 🛠️ Stack Tecnológico

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** + **Shadcn UI**
- **TanStack Query** (React Query)
- **Axios** (con interceptores)
- **React Hook Form** + **Zod**
- **Lucide React** (Iconos)
- **Framer Motion** (Animaciones)

## 📝 Notas de Implementación

### Tokens
- `accessToken`: Almacenado en `localStorage`
- `intermediateToken`: Almacenado en `sessionStorage`
- Automáticamente adjuntado en headers por interceptores de Axios

### Contexto Tenant
- Almacenado en `localStorage` como JSON
- Incluye: `tenantId`, `companyName`, `role`
- Enviado en header `X-Tenant-Id` para multi-tenant routing

### GlobalLoader
- Componente animado con "breathing effect"
- Logo de Farutech con anillos pulsantes
- Usado en lugar de spinners genéricos

## 🎯 Próximos Pasos

1. **Protected Routes**: Implementar guard de rutas con AuthContext
2. **User Profile**: Página de perfil de usuario
3. **Dashboard Modules**: Implementar dashboards específicos (ERP, Medical, Vet, POS)
4. **Real-time Updates**: WebSocket para actualizaciones en tiempo real
5. **Testing**: Unit tests y E2E tests

## 📄 Licencia

Propietario - Farutech © 2025
