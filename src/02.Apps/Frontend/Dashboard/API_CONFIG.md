# 🔌 Configuración del API - Farutech

## Conexión al Backend

Este proyecto está configurado para conectarse al API de Farutech. La configuración es **simple y centralizada**.

---

## 📝 Configuración Rápida

### 1. Copiar archivo de configuración

```bash
cp .env.example .env
```

### 2. Editar el archivo `.env`

Abre el archivo `.env` y modifica la URL del API:

```env
VITE_API_BASE_URL=http://localhost:5098
```

### 3. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

---

## 🛠️ Archivos de Configuración

### Archivo Principal: `.env`
- **Ubicación**: Raíz del proyecto
- **Variable clave**: `VITE_API_BASE_URL`
- **Valor por defecto**: `http://localhost:5098`

### Archivo de Configuración TypeScript: `src/config/app.config.ts`
Este archivo centraliza TODAS las configuraciones de la app:
- URL del API
- Endpoints de Swagger
- Timeouts
- Claves de almacenamiento local
- Variables de entorno

**No necesitas editar este archivo**, solo modifica `.env`

---

## 🔍 Verificación de la Conexión

Al iniciar la aplicación en **modo desarrollo**, verás en la consola del navegador:

```
🔧 Farutech Configuration
📡 API Base URL: http://localhost:5098
📖 Swagger URL: http://localhost:5098/swagger/v1/swagger.json
⏱️  API Timeout: 30 seconds
🌍 Environment: development
```

---

## 🌐 URLs del API

### Desarrollo Local
```
Base URL:    http://localhost:5098
Swagger:     http://localhost:5098/swagger/v1/swagger.json
```

### Staging / Producción
Modifica el archivo `.env` según el entorno:

```env
# Staging
VITE_API_BASE_URL=https://api-staging.farutech.com

# Producción
VITE_API_BASE_URL=https://api.farutech.com
```

---

## 🔐 Autenticación

El cliente API está configurado con interceptores automáticos que:

✅ Inyectan el JWT token en cada petición (`Authorization: Bearer <token>`)  
✅ Agregan el contexto del tenant (`X-Tenant-Id` header)  
✅ Manejan errores 401/403 automáticamente  
✅ Redirigen al login si la sesión expira  

---

## 📊 Endpoints Principales

| Módulo | Endpoint | Descripción |
|--------|----------|-------------|
| **Auth** | `/api/Auth/login` | Login (paso 1) |
| **Auth** | `/api/Auth/select-context` | Selección de organización (paso 2) |
| **Catalog** | `/api/Catalog/products` | Gestión de productos |
| **Catalog** | `/api/Catalog/products/{id}/modules` | Módulos de un producto |
| **Customers** | `/api/Customers` | CRM - Gestión de clientes |
| **Provisioning** | `/api/Provisioning/provision` | Wizard de aprovisionamiento |
| **Instances** | `/api/TenantInstances/my-instances` | Instancias del usuario |

---

## ⚠️ Notas Importantes

### MockData Eliminado
Los dashboards ya **NO usan datos mock**. Ahora se conectan directamente al API.

### CORS
Si tienes problemas de CORS, asegúrate de que el backend permita peticiones desde `http://localhost:8080`:

```csharp
// En tu Startup.cs o Program.cs (backend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:8080")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

---

## 🐛 Troubleshooting

### Error: "Network Error" o "ERR_CONNECTION_REFUSED"
**Causa**: El backend no está corriendo  
**Solución**: Inicia el servidor del API

### Error: "401 Unauthorized"
**Causa**: Token expirado o inválido  
**Solución**: Cierra sesión y vuelve a loguearte

### Error: "404 Not Found"
**Causa**: Endpoint incorrecto o backend desactualizado  
**Solución**: Verifica que la URL en `.env` sea correcta

### Los cambios no se reflejan
**Causa**: Variables de entorno no recargan automáticamente  
**Solución**: Para el servidor (`Ctrl+C`) y ejecuta `npm run dev` de nuevo

---

## 📱 Cambiar API en Tiempo de Ejecución (Avanzado)

Si necesitas cambiar el API sin reiniciar el servidor, puedes usar la consola del navegador:

```javascript
// ⚠️ Solo para debugging - no recomendado en producción
localStorage.setItem('farutech_api_override', 'https://api-staging.farutech.com');
location.reload();
```

Para restaurar:

```javascript
localStorage.removeItem('farutech_api_override');
location.reload();
```

---

## ✅ Checklist de Configuración

- [ ] Archivo `.env` creado (copiado de `.env.example`)
- [ ] Variable `VITE_API_BASE_URL` configurada correctamente
- [ ] Backend API corriendo en la URL especificada
- [ ] Servidor de desarrollo reiniciado (`npm run dev`)
- [ ] Consola del navegador muestra la configuración correcta
- [ ] Login funciona correctamente

---

## 📖 Documentación Adicional

- **OpenAPI Spec**: `http://localhost:5098/swagger/v1/swagger.json`
- **Swagger UI**: `http://localhost:5098/swagger`
- **Tipos TypeScript**: `src/types/api.ts`
- **Cliente API**: `src/lib/api-client.ts`
- **Servicios**: `src/services/*.service.ts`
- **Hooks React Query**: `src/hooks/useApi.ts`

---

**¿Necesitas ayuda?** Revisa los logs de la consola del navegador (F12) para más detalles sobre errores de conexión.
