import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { AppProvider } from "@/contexts/AppContext";
import { FarutechProvider } from "@/contexts/FarutechContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthenticatedRoute } from "@/components/auth/AuthenticatedRoute";

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

// ...


import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/settings/ProfilePage";
import OrganizationsManagementPage from "./pages/OrganizationsManagementPage";

// Orchestrator Pages
import OrchestratorLayout from "./pages/orchestrator/OrchestratorLayout";
import CatalogPage from "./pages/orchestrator/CatalogPage";
import CustomersPage from "./pages/orchestrator/CustomersPage";
import ProvisioningPage from "./pages/orchestrator/ProvisioningPage";

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

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/organizations" element={<OrganizationsManagementPage />} />
                    <Route path="/organizations/:orgId/apps" element={<OrganizationAppsPage />} />
                  </Route>
                  {/* AppLauncher route removed */}
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
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </TooltipProvider>
            </FarutechProvider>
          </AuthProvider>
        </AppProvider>
      </SessionProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
