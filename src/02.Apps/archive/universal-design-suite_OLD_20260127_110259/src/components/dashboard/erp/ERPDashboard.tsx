import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ERPDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Alert>
        <Database className="h-4 w-4" />
        <AlertTitle>Dashboard ERP</AlertTitle>
        <AlertDescription>
          Este módulo se conectará al API para mostrar datos de contabilidad, finanzas y reportes.
          Configure el endpoint en el archivo .env (VITE_API_BASE_URL).
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Pendiente: Integración con API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Una vez conectado al backend, aquí se mostrarán:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>KPIs financieros (ingresos, gastos, margen)</li>
            <li>Gráfico de flujo de caja</li>
            <li>Tabla de transacciones recientes</li>
            <li>Facturas pendientes y estadísticas</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
