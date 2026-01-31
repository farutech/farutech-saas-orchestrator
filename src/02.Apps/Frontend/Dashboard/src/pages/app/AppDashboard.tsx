// ============================================================================
// APP DASHBOARD - Main dashboard view
// ============================================================================

import * as React from 'react';
import { UniversalDashboardLayout } from '@/components/layout/UniversalDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusChip, DataTable } from '@/components/design-system';
import { useTheme } from '@/contexts/ThemeContext';
import { ColumnDef } from '@tanstack/react-table';
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Edit,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface KPIData {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const kpiData: KPIData[] = [
  {
    title: 'Ingresos Totales',
    value: '$45,231.89',
    change: 20.1,
    changeLabel: 'vs mes anterior',
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: 'Clientes Nuevos',
    value: '+2,350',
    change: 180.1,
    changeLabel: 'vs mes anterior',
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: 'Pedidos',
    value: '12,234',
    change: 19,
    changeLabel: 'vs mes anterior',
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    title: 'Tasa de Conversión',
    value: '3.2%',
    change: -4.5,
    changeLabel: 'vs mes anterior',
    icon: <TrendingUp className="h-4 w-4" />,
  },
];

const recentOrders: RecentOrder[] = [
  { id: 'ORD-001', customer: 'Juan Pérez', product: 'Plan Premium', amount: 250, status: 'completed', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'María García', product: 'Plan Básico', amount: 50, status: 'pending', date: '2024-01-14' },
  { id: 'ORD-003', customer: 'Carlos López', product: 'Plan Enterprise', amount: 500, status: 'completed', date: '2024-01-13' },
  { id: 'ORD-004', customer: 'Ana Martínez', product: 'Plan Premium', amount: 250, status: 'cancelled', date: '2024-01-12' },
  { id: 'ORD-005', customer: 'Pedro Sánchez', product: 'Plan Básico', amount: 50, status: 'pending', date: '2024-01-11' },
];

// ============================================================================
// Table Columns
// ============================================================================

const orderColumns: ColumnDef<RecentOrder>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'customer', header: 'Cliente' },
  { accessorKey: 'product', header: 'Producto' },
  {
    accessorKey: 'amount',
    header: 'Monto',
    cell: ({ row }) => `$${row.getValue<number>('amount').toFixed(2)}`,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variants: Record<string, 'success' | 'warning' | 'error'> = {
        completed: 'success',
        pending: 'warning',
        cancelled: 'error',
      };
      const labels: Record<string, string> = {
        completed: 'Completado',
        pending: 'Pendiente',
        cancelled: 'Cancelado',
      };
      return <StatusChip label={labels[status]} variant={variants[status]} size="sm" />;
    },
  },
  { accessorKey: 'date', header: 'Fecha' },
];

// ============================================================================
// Component
// ============================================================================

export default function AppDashboard() {
  const { getThemeInfo, appTheme } = useTheme();
  const currentTheme = getThemeInfo(appTheme);

  return (
    <UniversalDashboardLayout
      pageTitle="Dashboard"
      pageDescription={`Bienvenido al panel de ${currentTheme.name}`}
      headerActions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Acción
        </Button>
      }
    >
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {kpi.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {kpi.change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                )}
                <span className={kpi.change >= 0 ? 'text-success' : 'text-destructive'}>
                  {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                </span>
                <span className="ml-1">{kpi.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
          <CardDescription>Los últimos pedidos de tu sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={orderColumns}
            data={recentOrders}
            rowActions={[
              { label: 'Ver', icon: <Eye className="h-4 w-4" />, onClick: (row) => console.log('View', row) },
              { label: 'Editar', icon: <Edit className="h-4 w-4" />, onClick: (row) => console.log('Edit', row) },
            ]}
            pageSize={5}
            searchPlaceholder="Buscar pedidos..."
          />
        </CardContent>
      </Card>
    </UniversalDashboardLayout>
  );
}
