// ============================================================================
// PERMISSIONS DEMO COMPONENT - Example of using permissions in components
// ============================================================================

import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck, ShieldX, Loader2 } from 'lucide-react';

export default function PermissionsDemo() {
  const {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading permissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">Error loading permissions: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Permissions Demo
          </CardTitle>
          <CardDescription>
            Example of permission-based UI controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Your Permissions ({permissions.length})</h3>
            <div className="flex flex-wrap gap-2">
              {permissions.map((permission) =>      <Badge key={permission.id} variant="outline">
                  {permission.code}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dashboard Access */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {hasPermission('dashboard:access') ? (
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <ShieldX className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">Dashboard Access</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Can access the main dashboard
              </p>
              <Badge variant={hasPermission('dashboard:access') ? "default" : "secondary"}>
                {hasPermission('dashboard:access') ? "Granted" : "Denied"}
              </Badge>
            </div>

            {/* Customer Management */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {hasAnyPermission(['customers:list', 'customers:create']) ? (
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <ShieldX className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">Customer Management</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Can view and create customers
              </p>
              <Badge variant={hasAnyPermission(['customers:list', 'customers:create']) ? "default" : "secondary"}>
                {hasAnyPermission(['customers:list', 'customers:create']) ? "Granted" : "Denied"}
              </Badge>
            </div>

            {/* POS Operations */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {hasPermission('pos:open_session') ? (
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <ShieldX className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">POS Operations</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Can open POS sessions
              </p>
              <Badge variant={hasPermission('pos:open_session') ? "default" : "secondary"}>
                {hasPermission('pos:open_session') ? "Granted" : "Denied"}
              </Badge>
            </div>

            {/* Inventory Management */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {hasAllPermissions(['products:list', 'stock:manage']) ? (
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <ShieldX className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">Full Inventory Control</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Can list products and manage stock
              </p>
              <Badge variant={hasAllPermissions(['products:list', 'stock:manage']) ? "default" : "secondary"}>
                {hasAllPermissions(['products:list', 'stock:manage']) ? "Granted" : "Denied"}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Permission-Based Actions</h3>
            <div className="flex flex-wrap gap-2">
              {hasPermission('customers:create') && (
                <Button size="sm">
                  Create Customer
                </Button>
              )}

              {hasPermission('products:create') && (
                <Button size="sm" variant="outline">
                  Add Product
                </Button>
              )}

              {hasPermission('pos:open_session') && (
                <Button size="sm" variant="secondary">
                  Open POS Session
                </Button>
              )}

              {hasPermission('provisioning:create') && (
                <Button size="sm" variant="destructive">
                  Provision Instance
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}