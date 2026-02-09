# Validación HTTP/HTTPS - IAM API

## 🎯 Objetivo
Asegurar que la API IAM siempre se ejecute con ambos protocolos HTTP y HTTPS cuando uses `dotnet run`.

## ✅ Configuración Actual

### launchSettings.json
El perfil **"https"** es ahora el primero (por defecto), configurando:
- **HTTPS**: `https://localhost:7001`
- **HTTP**: `http://localhost:5152`

```json
{
  "profiles": {
    "https": {
      "applicationUrl": "https://localhost:7001;http://localhost:5152"
    },
    "http": {
      "applicationUrl": "http://localhost:5152"
    }
  }
}
```

## 🚀 Uso

### Comando por Defecto (Recomendado)
```bash
cd src/01.Core/Farutech/IAM/API
dotnet run
```
✅ **Automáticamente inicia con HTTPS + HTTP**

### Usar Perfil Específico
```bash
# Solo HTTPS + HTTP
dotnet run --launch-profile https

# Solo HTTP
dotnet run --launch-profile http
```

## 🔍 Validación

### Script Automático (PowerShell)
```powershell
# Validación completa (detiene procesos, inicia app, valida endpoints)
.\scripts\Validate-IamHttps.ps1

# Solo validar endpoints (app ya debe estar corriendo)
.\scripts\Validate-IamHttps.ps1 -ValidateOnly

# Solo iniciar aplicación
.\scripts\Validate-IamHttps.ps1 -StartApp

# Solo detener aplicación
.\scripts\Validate-IamHttps.ps1 -StopApp
```

### Script Batch (Windows)
```cmd
.\scripts\validate-iam-https.bat
```

### Validación Manual
```bash
# Verificar HTTP
curl http://localhost:5152/swagger

# Verificar HTTPS (ignorar certificado de desarrollo)
curl -k https://localhost:7001/swagger
```

## 📋 Endpoints Disponibles

| Protocolo | URL | Estado |
|-----------|-----|--------|
| HTTP | http://localhost:5152 | ✅ Siempre disponible |
| HTTPS | https://localhost:7001 | ✅ Siempre disponible |
| Swagger UI | Ambos `/swagger` | ✅ Documentación interactiva |

## 🔒 Certificado HTTPS

En desarrollo, ASP.NET Core genera automáticamente un certificado de desarrollo. Si ves advertencias de certificado, puedes:

1. **Aceptar la advertencia** en el navegador
2. **Usar `-k`** con curl para ignorar validación
3. **Confiar en el certificado** en tu sistema

## 🐛 Troubleshooting

### Error: "address already in use"
```bash
# Detener todos los procesos dotnet
Get-Process | Where-Object { $_.ProcessName -eq "dotnet" } | Stop-Process -Force
```

### Error: Solo funciona HTTP
Verifica que el perfil "https" sea el primero en `launchSettings.json`

### Error: Solo funciona HTTPS
Verifica que ambos URLs estén en `applicationUrl`: `"https://localhost:7001;http://localhost:5152"`

## 📝 Notas Técnicas

- **Perfil por defecto**: El primer perfil en `launchSettings.json` se usa con `dotnet run`
- **Middleware HTTPS**: `app.UseHttpsRedirection()` redirige HTTP a HTTPS automáticamente
- **CORS**: Configurado para permitir `localhost:3000`, `localhost:8081`, `localhost:7001`
- **TokenOptions**: Issuer configurado como `https://localhost:7001`

## 🎉 Resultado

Ahora cuando ejecutes `dotnet run`, la aplicación siempre iniciará con:
- ✅ **HTTP**: `http://localhost:5152`
- ✅ **HTTPS**: `https://localhost:7001`
- ✅ **Swagger UI**: Disponible en ambos protocolos