/**
 * Componente principal de la aplicación
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import RequireAuth from '@/components/layout/RequireAuth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { MainLayout } from './components/layout/MainLayout'
import { ContentSuspense } from './components/layout/ContentSuspense'
import { ToastContainer } from './components/ui/Toast'
import { LoginPage } from './pages/auth/LoginPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { UsersPage } from './pages/users/UsersPage'
import { ProfilePage } from './pages/settings/ProfilePage'

// Lazy load de páginas pesadas
const ChartsPage = lazy(() => import('./pages/charts/ChartsPage'))
const ComponentsPage = lazy(() => import('./pages/components/ComponentsPage'))
const ProcessesPage = lazy(() => import('./pages/processes/ProcessesPage'))
const GeneralSettingsPage = lazy(() => import('./pages/settings/GeneralSettingsPage'))
const NotFoundPage = lazy(() => import('./pages/errors/NotFoundPage'))

// Design System Pages
const TokensPage = lazy(() => import('./pages/design-system/TokensPage'))
const ColorsPage = lazy(() => import('./pages/design-system/ColorsPage'))
const TypographyPage = lazy(() => import('./pages/design-system/TypographyPage'))
const ComponentsLibraryPage = lazy(() => import('./pages/design-system/ComponentsLibraryPage'))
const ChartsLibraryPage = lazy(() => import('./pages/design-system/ChartsLibraryPage'))

// Module Pages - CRM
const CrmDashboardPage = lazy(() => import('./pages/crm/CrmDashboardPage'))
const ClientsPage = lazy(() => import('./pages/crm/ClientsPage'))
const LeadsPage = lazy(() => import('./pages/crm/LeadsPage'))

// Module Pages - Ventas
const VentasDashboardPage = lazy(() => import('./pages/ventas/VentasDashboardPage'))
const OrdersPage = lazy(() => import('./pages/ventas/OrdersPage'))

// Module Pages - Inventario
const InventarioDashboardPage = lazy(() => import('./pages/inventario/InventarioDashboardPage'))
const ProductsPage = lazy(() => import('./pages/inventario/ProductsPage'))

// Module Pages - Reportes
const ReportesDashboardPage = lazy(() => import('./pages/reportes/ReportesDashboardPage'))

// Configurar React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
})

/**
 * Helper para crear rutas protegidas con Suspense boundary
 * Esto permite mostrar el logo spinner solo en el contenido mientras carga
 */
const createProtectedRoute = (element: React.ReactNode) => (
  <RequireAuth>
    <MainLayout>
      <ContentSuspense>
        {element}
      </ContentSuspense>
    </MainLayout>
  </RequireAuth>
)

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
                {/* Protected routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={createProtectedRoute(<DashboardPage />)} />
                
                {/* Design System */}
                <Route path="/design-system/tokens" element={createProtectedRoute(<TokensPage />)} />
                <Route path="/design-system/colors" element={createProtectedRoute(<ColorsPage />)} />
                <Route path="/design-system/typography" element={createProtectedRoute(<TypographyPage />)} />
                <Route path="/design-system/components" element={createProtectedRoute(<ComponentsLibraryPage />)} />
                <Route path="/design-system/charts" element={createProtectedRoute(<ChartsLibraryPage />)} />
                
                {/* Examples */}
                <Route path="/components" element={createProtectedRoute(<ComponentsPage />)} />
                <Route path="/charts" element={createProtectedRoute(<ChartsPage />)} />
                
                {/* CRM Module */}
                <Route path="/crm/dashboard" element={createProtectedRoute(<CrmDashboardPage />)} />
                <Route path="/crm/clientes" element={createProtectedRoute(<ClientsPage />)} />
                <Route path="/crm/leads" element={createProtectedRoute(<LeadsPage />)} />
                <Route path="/crm/*" element={createProtectedRoute(<div className="text-center py-12 text-gray-500">Módulo CRM - Sección en construcción</div>)} />
                
                {/* Ventas Module */}
                <Route path="/ventas/dashboard" element={createProtectedRoute(<VentasDashboardPage />)} />
                <Route path="/ventas/ordenes" element={createProtectedRoute(<OrdersPage />)} />
                <Route path="/ventas/*" element={createProtectedRoute(<div className="text-center py-12 text-gray-500">Módulo Ventas - Sección en construcción</div>)} />
                
                {/* Inventario Module */}
                <Route path="/inventario/dashboard" element={createProtectedRoute(<InventarioDashboardPage />)} />
                <Route path="/inventario/productos" element={createProtectedRoute(<ProductsPage />)} />
                <Route path="/inventario/*" element={createProtectedRoute(<div className="text-center py-12 text-gray-500">Módulo Inventario - Sección en construcción</div>)} />
                
                {/* Reportes Module */}
                <Route path="/reportes/dashboard" element={createProtectedRoute(<ReportesDashboardPage />)} />
                <Route path="/reportes/*" element={createProtectedRoute(<div className="text-center py-12 text-gray-500">Módulo Reportes - Sección en construcción</div>)} />
                
                {/* Shared App Pages - Accesibles desde múltiples módulos */}
                <Route path="/users" element={createProtectedRoute(<UsersPage />)} />
                <Route path="/processes" element={createProtectedRoute(<ProcessesPage />)} />
                <Route path="/reports" element={createProtectedRoute(<div className="text-center py-12 text-gray-500">Página de Reportes - En construcción</div>)} />
                <Route path="/settings/profile" element={createProtectedRoute(<ProfilePage />)} />
                <Route path="/settings/general" element={createProtectedRoute(<GeneralSettingsPage />)} />
                <Route path="/settings/system" element={createProtectedRoute(<div className="text-center py-12 text-gray-500">Configuración del Sistema - En construcción</div>)} />
                <Route path="/security/roles" element={createProtectedRoute(<div className="text-center py-12 text-gray-500">Roles y Permisos - En construcción</div>)} />
                <Route path="/security/audit" element={createProtectedRoute(<div className="text-center py-12 text-gray-500">Auditoría - En construcción</div>)} />
                
                {/* 404 - Debe ser la última ruta */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            <ToastContainer />
          </BrowserRouter>
        </QueryClientProvider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App
