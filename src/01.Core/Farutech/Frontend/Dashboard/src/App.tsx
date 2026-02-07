import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { AppProvider } from "@/contexts/AppContext";
import { SessionBridgeProvider } from "@/contexts/SessionBridgeContext";
import { FarutechProvider } from "@/contexts/FarutechContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthenticatedRoute } from "@/components/auth/AuthenticatedRoute";
import { RedirectToOrganizationApps } from "@/components/RedirectToOrganizationApps";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SelectContext from "./pages/auth/SelectContext";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ConfirmEmail from "./pages/auth/ConfirmEmail";

// Main Pages
import { MainLayout } from "@/components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import SelectInstance from "./pages/SelectInstance";
import OrganizationAppsPage from "./pages/OrganizationAppsPage";
import { NavigationDebugPanel } from '@/components/debug/NavigationDebugPanel';
import SessionReceiver from '@/components/SessionReceiver';

// ...


import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/settings/ProfilePage";
import OrganizationsManagementPage from "./pages/OrganizationsManagementPage";
import OrganizationDetailPage from "./pages/OrganizationDetailPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";

// Orchestrator Pages
import OrchestratorLayout from "./pages/orchestrator/OrchestratorLayout";
import CatalogPage from "./pages/orchestrator/CatalogPage";
import CustomersPage from "./pages/orchestrator/CustomersPage";
import ProvisioningPage from "./pages/orchestrator/ProvisioningPage";
import ProvisionAppPage from "./pages/ProvisionAppPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >

      <SessionProvider>
        <AppProvider>
          <SessionBridgeProvider>
            <AuthProvider>
              <FarutechProvider>
                <TooltipProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/select-context" element={<SelectContext />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/confirm-email" element={<ConfirmEmail />} />

                  {/* Instance Selection (semi-protected) */}
                  <Route path="/select-instance" element={<SelectInstance />} />
                  <Route path="/session-receive" element={<SessionReceiver />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/home" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<OrganizationsManagementPage />} />
                    <Route path="/dashboard/:id" element={<OrganizationDetailPage />} />
                    <Route path="/dashboard/:id/provision" element={<ProvisionAppPage />} />
                    {/* @deprecated: Redirect old app detail route to organization with applications tab */}
                    <Route 
                      path="/dashboard/:orgId/apps/:appId" 
                      element={<RedirectToOrganizationApps />} 
                    />
                    {/* Legacy redirects */}
                    <Route path="/organizations" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/organizations/:id" element={<Navigate to="/dashboard/:id" replace />} />
                    <Route path="/organizations/:id/provision" element={<Navigate to="/dashboard/:id/provision" replace />} />
                  </Route>
                  {/* AppHome route removed */}
                  <Route
                    path="/app/:appId/*"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <AuthenticatedRoute>
                        <ProfilePage />
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/organizations"
                    element={
                      <AuthenticatedRoute>
                        <OrganizationsManagementPage />
                      </AuthenticatedRoute>
                    }
                  />

                  {/* Orchestrator Routes (Admin Only) */}
                  {/* Provisioning Page - Full Screen (no layout wrapper) */}
                  <Route
                    path="/orchestrator/provisioning"
                    element={
                      <ProtectedRoute requiresOrchestrator>
                        <ProvisioningPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Other Orchestrator Routes - With Layout */}
                  <Route
                    path="/orchestrator"
                    element={
                      <ProtectedRoute requiresOrchestrator>
                        <OrchestratorLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/orchestrator/catalog" replace />} />
                    <Route path="catalog" element={<CatalogPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="settings" element={<div className="text-white">Settings</div>} />
                  </Route>

                  {/* Default & 404 */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                {import.meta.env.DEV && <NavigationDebugPanel />}
                </TooltipProvider>
              </FarutechProvider>
            </AuthProvider>
          </SessionBridgeProvider>
        </AppProvider>
      </SessionProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
