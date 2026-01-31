import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartData } from '@/types/dashboard';

interface PetStatsChartProps {
  data: ChartData[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--vet-secondary))',
  'hsl(var(--vet-accent))',
  'hsl(var(--muted-foreground))',
];

export function PetStatsChart({ data }: PetStatsChartProps) {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tipos de Mascotas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [value, 'Pacientes']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
