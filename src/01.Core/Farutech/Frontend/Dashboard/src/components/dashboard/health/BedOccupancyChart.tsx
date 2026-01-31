import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartData } from '@/types/dashboard';

interface BedOccupancyChartProps {
  data: ChartData[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--health-secondary))',
  'hsl(var(--health-accent))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--success))',
];

export function BedOccupancyChart({ data }: BedOccupancyChartProps) {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Ocupación de Camas</CardTitle>
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
              {data.map((_, index)
        => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number)
        => [`${value}%`, 'Ocupación']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value)
        => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
