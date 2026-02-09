# Configuración de Dominios Locales para Desarrollo

## ✅ Configuración Implementada

El sistema ahora usa dominios `.local` en lugar de `localhost` para simular un entorno más cercano a producción:

- **Orchestrator Dashboard:** `farutech.local`
- **App Dashboards:** `{appCode}.{orgCode}.app.farutech.local`

---

## 📝 Configuración del Archivo `hosts`

### **Windows**

1. Abrir archivo hosts como administrador:
   ```powershell
   notepad C:\Windows\System32\drivers\etc\hosts
   ```

2. Agregar las siguientes líneas:
   ```
   # Farutech SaaS Orchestrator - Desarrollo Local
   127.0.0.1    farutech.local
   127.0.0.1    app.farutech.local
   
   # Ejemplos de instancias (agregar según necesites)
   127.0.0.1    demo001.FARU6128.app.farutech.local
   127.0.0.1    8b571b69.FARU6128.app.farutech.local
   ```

3. Guardar y cerrar

4. Limpiar caché DNS:
   ```powershell
   ipconfig /flushdns
   ```

### **Linux/macOS**

1. Abrir archivo hosts:
   ```bash
   sudo nano /etc/hosts
   ```

2. Agregar las mismas líneas que en Windows

3. Guardar (`Ctrl+O`) y salir (`Ctrl+X`)

4. Limpiar caché DNS:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

---

## 🔧 Variables de Entorno

### **Frontend Orchestrator** (`src/01.Core/Farutech/Frontend/Dashboard`)

Crear/actualizar `.env.development`:
```env
VITE_APP_DOMAIN=farutech.local
VITE_API_URL=http://farutech.local
```

### **Frontend App Dashboard** (`src/02.Apps/Frontend/Dashboard`)

Crear/actualizar `.env.development`:
```env
VITE_API_BASE_URL=http://farutech.local
VITE_ORCHESTRATOR_URL=http://farutech.local
```

**Nota:** Aspire inyecta automáticamente estas variables al levantar los servicios.

---

## 🚀 Cómo Usar

### **1. Levantar infraestructura**
```powershell
cd c:\Users\farid\farutech-saas-orchestrator
podman compose up -d
```

### **2. Ejecutar Aspire (como Administrador para puerto 80)**
```powershell
cd src\03.Platform\Farutech.AppHost
dotnet run
```

### **3. Acceder a las aplicaciones**

- **Aspire Dashboard:** http://localhost:15000 (verifica puertos asignados aquí)
- **Orchestrator Frontend:** http://farutech.local:5173
- **Orchestrator API:** http://farutech.local (puerto 80)
- **App Dashboard:** http://farutech.local:5174 (para desarrollo)
- **App Instance (tenant específico):** http://8b571b69.FARU6128.app.farutech.local

---

## 🔍 Verificar Configuración

### **Test 1: Resolver dominio**
```powershell
ping farutech.local
``` al API**
```powershell
curl http://farutech.local/health/live
```
Debe retornar JSON con status "Healthy"

### **Test 3: Acceso web al Frontend Orchestrator**
```powershell
curl http://farutech.local:5173
```
Debe retornar HTML con el contenido de React
curl http://farutech.local:5098/health/live
```
Debe retornar JSON con status "Healthy"

### **Test 4: Resolución de tenant**
```powershell
curl "http://farutech.local/api/resolve/by-hostname?hostname=8b571b69.FARU6128.app.farutech.local"
```
Debe retornar JSON con los datos del tenant

---

## 📋 Cambios en Configuración

### **appsettings.Development.json**
```json
{
  "Provisioning": {
    "UseLocalUrls": false,
    "ProductionDomain": "app.farutech.local"
  },
  "AllowedOrigins": [
    "http://farutech.local",
    "https://farutech.local",
    "http://*.farutech.local",
    "https://*.farutech.local",
    "http://app.farutech.local",
    "https://app.farutech.local",
    "http://*.app.farutech.local",
    "https://*.app.farutech.local"
  ]
}
```

### **AppHost.cs (Aspire)**
```csharp
.WithEnvironment("VITE_APP_DOMAIN", isDev ? "farutech.local" : "farutech.com")
```

---

## ⚠️ Troubleshooting

### **Problema: No resuelve el dominio**
```powershell
# Windows
ipconfig /flushdns
nslookup farutech.local

# Verificar que el navegador no esté usando DNS over HTTPS
# Chrome: chrome://settings/security -> Desactivar "Usar DNS seguro"
```

### **Problema: CORS errors**
Verificar que `AllowedOrigins` en `appsettings.Development.json` incluya los dominios `.local`

### **Problema: Certificado SSL**
Para desarrollo local, puedes:
1. Aceptar el certificado autofirmado en el navegador
2. O configurar certificado con `dotnet dev-certs https --trust`

---

## 📊 URLs de Ejemplo

### **Estructura de URL**
```
Orchestrator:  http://farutech.local
App Instance:  http://{appCode}.{orgCode}.app.farutech.local

Ejemplos:
- http://8b571b69.FARU6128.app.farutech.local
- http://demo001.DEMO1234.app.farutech.local
```

### **Notas**
- `{appCode}`: Código único de la instancia (8 chars)
- `{orgCode}`: Código de la organización (ej: FARU6128)
- `app.farutech.local`: Dominio base configurado

---

## 🔐 CORS y Seguridad

Los orígenes permitidos incluyen wildcards para soportar todos los subdominios:
- `http://*.farutech.local`
- `http://*.app.farutech.local`

Esto permite que cualquier tenant pueda comunicarse con el API sin configuración adicional.

---

**Fecha:** 2026-02-08  
**Estado:** ✅ Configuración lista para desarrollo local
