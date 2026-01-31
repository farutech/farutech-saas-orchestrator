import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartData } from '@/types/dashboard';

interface CashFlowChartProps {
  data: ChartData[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Flujo de Caja</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs fill-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value)
        => `$${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px hsl(222 47% 11% / 0.1)'
              }}
              formatter={(value: number)
        => [`$${value.toLocaleString()}`, '']}
            />
            <Legend />
            <Bar 
              dataKey="ingresos" 
              name="Ingresos"
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="gastos" 
              name="Gastos"
              fill="hsl(var(--muted-foreground))" 
              radius={[4, 4, 0, 0]}
              opacity={0.5}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
