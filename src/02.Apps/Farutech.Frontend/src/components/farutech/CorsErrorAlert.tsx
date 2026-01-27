import { AlertTriangle, Server, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { API_CONFIG } from '@/config/app.config';

export function CorsErrorAlert() {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error de Conexión al Backend</AlertTitle>
        <AlertDescription>
          El backend no está configurado para aceptar peticiones desde este origen.
          Esto es un problema de configuración CORS en el servidor.
        </AlertDescription>
      </Alert>

      <Card className="border-yellow-500/50 bg-yellow-50/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-5 w-5" />
            Información Técnica
          </CardTitle>
          <CardDescription>Error 405 - Method Not Allowed (OPTIONS)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold mb-2">Detalles del Error:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>El navegador envía una petición OPTIONS (CORS preflight)</li>
              <li>El servidor responde con 405 (método no permitido)</li>
              <li>Origen bloqueado: <code className="bg-muted px-1 rounded">{window.location.origin}</code></li>
              <li>API URL: <code className="bg-muted px-1 rounded">{API_CONFIG.BASE_URL}</code></li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Solución (Backend):
            </p>
            <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
              <pre>{`// Program.cs (antes de app.Run())

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("${window.location.origin}")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");  // ⚠️ ANTES de UseAuthorization
app.UseAuthentication();
app.UseAuthorization();`}</pre>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-1">Pasos:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abre <code className="bg-muted px-1 rounded">Program.cs</code> en el backend</li>
              <li>Agrega la configuración CORS mostrada arriba</li>
              <li>Reinicia el backend: <code className="bg-muted px-1 rounded">dotnet run</code></li>
              <li>Recarga esta página (F5)</li>
            </ol>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              📖 <strong>Documentación completa</strong>: Ver archivo <code>CORS_ERROR_405.md</code> en la raíz del proyecto
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
