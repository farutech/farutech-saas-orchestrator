import { KPICard } from '@/components/dashboard/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Users,
  TrendingUp,
  Package,
  Receipt,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const salesData = [
  { hour: '9AM', ventas: 450 },
  { hour: '10AM', ventas: 780 },
  { hour: '11AM', ventas: 1200 },
  { hour: '12PM', ventas: 1800 },
  { hour: '1PM', ventas: 1500 },
  { hour: '2PM', ventas: 900 },
  { hour: '3PM', ventas: 1100 },
  { hour: '4PM', ventas: 1400 },
  { hour: '5PM', ventas: 1600 },
];

const recentSales = [
  { id: 1, customer: 'María García', amount: 125.50, items: 3, method: 'Tarjeta' },
  { id: 2, customer: 'Juan López', amount: 78.00, items: 2, method: 'Efectivo' },
  { id: 3, customer: 'Ana Martínez', amount: 245.80, items: 5, method: 'Tarjeta' },
  { id: 4, customer: 'Carlos Ruiz', amount: 56.30, items: 1, method: 'Efectivo' },
  { id: 5, customer: 'Laura Sánchez', amount: 189.00, items: 4, method: 'Tarjeta' },
];

export function POSDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="gap-2 gradient-pos text-white">
          <Plus className="h-4 w-4" />
          Nueva Venta
        </Button>
        <Button variant="outline" className="gap-2">
          <Receipt className="h-4 w-4" />
          Ver Recibos
        </Button>
        <Button variant="outline" className="gap-2">
          <Package className="h-4 w-4" />
          Inventario
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ventas Hoy"
          value="$12,450"
          change="+18.2%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          title="Transacciones"
          value="127"
          change="+12"
          trend="up"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <KPICard
          title="Ticket Promedio"
          value="$98.03"
          change="+5.4%"
          trend="up"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <KPICard
          title="Clientes Nuevos"
          value="23"
          change="+8"
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Ventas por Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="hour" 
                  className="text-xs fill-muted-foreground"
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value}`, 'Ventas']}
                />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Ventas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSales.map((sale) => (
              <div 
                key={sale.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium text-sm">{sale.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {sale.items} artículos • {sale.method}
                  </p>
                </div>
                <span className="font-bold text-primary">
                  ${sale.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">$8,240</p>
              <p className="text-sm text-muted-foreground">Tarjeta</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">$3,450</p>
              <p className="text-sm text-muted-foreground">Efectivo</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Receipt className="h-8 w-8 mx-auto mb-2 text-info" />
              <p className="text-2xl font-bold">$560</p>
              <p className="text-sm text-muted-foreground">Transferencia</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold">$200</p>
              <p className="text-sm text-muted-foreground">Crédito</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
