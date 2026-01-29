# 📦 DEPENDENCIAS Y VERSIONES - FARUTECH ORCHESTRATOR
## Fecha: 27 de enero de 2026
## Estado: ✅ VALIDADO Y ALINEADO

---

## 🎯 **ESTRATEGIA DE DEPENDENCIAS**

**Principio:** Minimalismo y estabilidad. Solo dependencias necesarias, versiones pinned para reproducibilidad.

**Gestión:** Centralizada en archivos de configuración, actualizaciones controladas por CI/CD.

**Auditoría:** Semanal para vulnerabilidades de seguridad.

---

## 🔧 **DEPENDENCIAS .NET (Backend)**

### **Core Framework:**
```xml
<TargetFramework>net9.0</TargetFramework>
<Nullable>enable</Nullable>
<ImplicitUsings>enable</ImplicitUsings>
```

### **NuGet Packages - Farutech.Orchestrator.API:**
```xml
<PackageReference Include="Aspire.Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0-preview.2.23619.3" />
<PackageReference Include="Aspire.Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0-preview.2.23619.3" />
<PackageReference Include="Aspire.StackExchange.Redis" Version="8.0.0-preview.2.23619.3" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.1" />
<PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="9.0.1" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.8" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="HotChocolate.AspNetCore" Version="14.1.0" />
<PackageReference Include="HotChocolate.AspNetCore.Authorization" Version="14.1.0" />
<PackageReference Include="Serilog.AspNetCore" Version="8.0.1" />
<PackageReference Include="Serilog.Sinks.Console" Version="5.0.1" />
<PackageReference Include="Serilog.Sinks.File" Version="5.0.0" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
<PackageReference Include="MediatR" Version="12.2.0" />
<PackageReference Include="AutoMapper" Version="13.0.1" />
<PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" Version="9.0.1" />
<PackageReference Include="Npgsql" Version="9.0.1" />
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.1" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Relational" Version="9.0.1" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.1" />
```

### **NuGet Packages - Farutech.App01.POS.API:**
```xml
<PackageReference Include="Aspire.Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0-preview.2.23619.3" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.1" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.1" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="Serilog.AspNetCore" Version="8.0.1" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
<PackageReference Include="MediatR" Version="12.2.0" />
<PackageReference Include="AutoMapper" Version="13.0.1" />
```

### **NuGet Packages - Application Layer:**
```xml
<PackageReference Include="FluentValidation" Version="11.9.0" />
<PackageReference Include="MediatR" Version="12.2.0" />
<PackageReference Include="AutoMapper" Version="13.0.1" />
<PackageReference Include="Microsoft.Extensions.Logging.Abstractions" Version="8.0.1" />
```

### **NuGet Packages - Infrastructure Layer:**
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.1" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.1" />
<PackageReference Include="Microsoft.Extensions.Configuration" Version="8.0.1" />
<PackageReference Include="Microsoft.Extensions.Logging.Abstractions" Version="8.0.1" />
<PackageReference Include="Serilog" Version="3.1.1" />
```

### **NuGet Packages - Domain Layer:**
```xml
<!-- No external dependencies - pure domain logic -->
```

---

## 🌐 **DEPENDENCIAS JAVASCRIPT/TYPESCRIPT (Frontend)**

### **Core Dependencies (package.json):**
```json
{
  "name": "universal-design-suite",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "axios": "^1.6.5",
    "zustand": "^4.4.7",
    "lucide-react": "^0.303.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "vite": "^5.0.12",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "@types/react": "^18.2.47",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.19.1",
    "@typescript-eslint/parser": "^6.19.1",
    "vitest": "^1.2.2",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.2.0",
    "@testing-library/user-event": "^14.5.2"
  }
}
```

### **Dev Dependencies:**
```json
{
  "devDependencies": {
    "@types/node": "^20.10.6",
    "jsdom": "^23.2.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5"
  }
}
```

---

## 🐳 **DEPENDENCIAS DOCKER**

### **Base Images:**
```dockerfile
# Backend Services
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Database
FROM postgres:15-alpine

# Message Broker
FROM nats:2.10-alpine

# Cache
FROM redis:7-alpine

# Frontend
FROM node:20-alpine AS base
```

### **Docker Compose Services:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: farutech_orchestrator
      POSTGRES_USER: farutech_user
      POSTGRES_PASSWORD: farutech_pass2026

  nats:
    image: nats:2.10-alpine

  redis:
    image: redis:7-alpine

  orchestrator-api:
    build:
      context: .
      dockerfile: src/backend-core/Farutech.Orchestrator.API/Dockerfile

  app01-pos-api:
    build:
      context: .
      dockerfile: src/apps/app01-pos/Farutech.App01.POS.API/Dockerfile

  frontend:
    build:
      context: .
      dockerfile: universal-design-suite/Dockerfile
```

---

## 🛠 **HERRAMIENTAS DE DESARROLLO**

### **IDE y Editores:**
- **Visual Studio 2022:** Version 17.8+ (Community/Professional/Enterprise)
- **Visual Studio Code:** Version 1.85+
  - Extensiones requeridas:
    - C# (ms-dotnettools.csharp)
    - C# Dev Kit (ms-dotnettools.csdevkit)
    - .NET Aspire (ms-dotnettools.aspire)
    - TypeScript Importer (pmneo.tsimporter)
    - Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

### **Herramientas de Línea de Comando:**
- **.NET SDK:** 8.0.100+
- **Node.js:** 20.10.0+
- **npm:** 10.2.0+
- **Docker:** 24.0+
- **Docker Compose:** 2.20+
- **Git:** 2.40+

### **Herramientas de Testing:**
- **xUnit.net:** 2.6.1
- **Moq:** 4.20.70
- **FluentAssertions:** 6.12.0
- **Testcontainers:** 3.7.0
- **Vitest:** 1.2.2+

### **Herramientas de Calidad:**
- **SonarQube:** 10.3+
- **Coverlet:** 6.0.0
- **StyleCop.Analyzers:** 1.2.0-beta.507
- **Roslynator:** 4.8.0

---

## 🔒 **SEGURIDAD Y COMPLIANCE**

### **Vulnerability Scanning:**
- **NuGet Packages:** `dotnet list package --vulnerable`
- **NPM Packages:** `npm audit`
- **Container Images:** Trivy, Snyk
- **Dependencies:** OWASP Dependency Check

### **Security Headers (API):**
```csharp
app.UseHsts();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
```

### **CORS Configuration:**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("https://localhost:3000", "https://app.farutech.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

---

## 📊 **MATRIZ DE COMPATIBILIDAD**

### **Version Compatibility Matrix:**

| Componente | .NET 9.0 | PostgreSQL 15 | Node.js 20 | Docker 24 |
|------------|----------|---------------|------------|-----------|
| **Backend API** | ✅ | ✅ | N/A | ✅ |
| **Database** | ✅ | ✅ | N/A | ✅ |
| **Frontend** | N/A | N/A | ✅ | ✅ |
| **Message Broker** | ✅ | N/A | N/A | ✅ |
| **Cache** | ✅ | N/A | N/A | ✅ |

### **Platform Support:**
- **Windows:** ✅ (Development)
- **Linux:** ✅ (Production)
- **macOS:** ✅ (Development)
- **Docker:** ✅ (All environments)

---

## 🔄 **ESTRATEGIA DE ACTUALIZACIONES**

### **Update Frequency:**
- **Security Patches:** Inmediatamente
- **Bug Fixes:** Semanal
- **Minor Versions:** Mensual
- **Major Versions:** Trimestral (con testing extensivo)

### **Testing Before Updates:**
1. **Unit Tests:** 100% passing
2. **Integration Tests:** 100% passing
3. **E2E Tests:** 100% passing
4. **Performance Tests:** No regression
5. **Security Scan:** Clean

### **Rollback Plan:**
- **Version Pinning:** Todas las dependencias pinned
- **Backup Strategy:** Database backups antes de updates
- **Monitoring:** Application monitoring durante updates
- **Rollback Time:** < 15 minutos

---

## 📋 **CHECKLIST DE VALIDACIÓN**

### **Pre-Commit Checks:**
- [ ] `dotnet build` - Successful
- [ ] `dotnet test` - All passing
- [ ] `npm run build` - Successful
- [ ] `npm run test` - All passing
- [ ] `docker build` - Successful
- [ ] Security scan - Clean

### **CI/CD Pipeline:**
- [ ] Build stage - ✅
- [ ] Test stage - ✅
- [ ] Security scan - ✅
- [ ] Docker build - ✅
- [ ] Deploy to staging - ✅
- [ ] Integration tests - ✅
- [ ] Deploy to production - ✅

---

*Última actualización: 27 de enero de 2026*
*Responsable: Development Team*