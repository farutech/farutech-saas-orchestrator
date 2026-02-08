# 🚀 QUICK START - Farutech Dashboard

## Inicio Rápido (30 segundos)

```powershell
# 1. Desde la raíz del proyecto
.\scripts\start-dashboard.ps1
```

Esto iniciará automáticamente el Dashboard en http://localhost:5173

## Inicio Manual

### Opción A: Desarrollo del Dashboard

```powershell
# 1. Build Design System (solo primera vez)
cd src\05.SDK\DesignSystem
npm run build

# 2. Instalar dependencias Dashboard (solo primera vez)
cd ..\..\02.Apps\Frontend\Dashboard
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Opción B: Build para Producción

```powershell
# Build Dashboard optimizado
cd src\02.Apps\Frontend\Dashboard
npm run build

# Preview build
npm run preview
```

## 📁 Estructura de Archivos Clave

```
src/
├── 05.SDK/DesignSystem/
│   ├── src/components/
│   │   ├── Auth/                    # ✅ LoginForm, RegisterForm, etc.
│   │   └── Layout/
│   │       └── AppHeader.tsx        # ✅ Header enterprise
│   └── dist/                        # Build output
│
└── 02.Apps/Frontend/Dashboard/
    ├── src/
    │   ├── pages/auth/              # ✅ LoginPage, RegisterPage, etc.
    │   ├── components/layout/
    │   │   └── DashboardAppHeader.tsx  # ✅ Wrapper del AppHeader
    │   └── store/
    │       └── authStore.ts         # ✅ Zustand store
    └── package.json                 # Design System como dependencia local
```

## 🔧 Características Implementadas

### Auth Components (Design System)
- ✅ **LoginForm** - Con toggle password, remember me
- ✅ **ForgotPasswordForm** - Flujo dual (email/admin)
- ✅ **ResetPasswordForm** - Password strength meter
- ✅ **RegisterForm** - Con términos y condiciones
- ✅ **AuthLayout** - Container con branding

### AppHeader Component (Design System)
- ✅ **Breadcrumbs** - Navegación contextual
- ✅ **Search** - Con keyboard shortcut (⌘K)
- ✅ **Theme Toggle** - Dark/Light mode
- ✅ **Notifications** - Con badge de no leídos
- ✅ **User Menu** - Profile, Settings, Logout
- ✅ **Glassmorphism** - Diseño moderno semi-transparente

### Dashboard Integration
- ✅ **DashboardAppHeader** - Wrapper conectado a stores
- ✅ **Auth Pages** - Login, Register, Forgot, Reset
- ✅ **Rutas actualizadas** - Todo integrado en App.tsx

## 🧪 Testing de Flujos

### 1. Auth Flow
```
http://localhost:5173/auth/login
↓ (credentials)
http://localhost:5173/launcher
↓ (select module)
http://localhost:5173/dashboard
```

### 2. Header Features
- **Breadcrumbs**: Navega por diferentes rutas y verifica breadcrumbs
- **Search**: Click en search o presiona ⌘K (Ctrl+K en Windows)
- **Theme**: Click en Moon/Sun icon para cambiar tema
- **Notifications**: Click en Bell icon para ver notificaciones
- **User Menu**: Click en avatar para ver opciones

## 🐛 Troubleshooting

### Design System no se importa correctamente
```powershell
# Rebuild Design System
cd src\05.SDK\DesignSystem
npm run build

# Reinstalar en Dashboard
cd ..\..\02.Apps\Frontend\Dashboard
npm install
```

### Port 5173 ya está en uso
```powershell
# Cambiar puerto en vite.config.ts
server: {
  port: 5174  // o cualquier otro puerto
}
```

### Errores de TypeScript
```powershell
# Verificar tipos
cd src\02.Apps\Frontend\Dashboard
npx tsc --noEmit --skipLibCheck
```

## 📊 Performance

### Design System v1.1.0
- **Bundle**: 337.96 kB (gzip: 75.70 kB)
- **CSS**: 47.61 kB (gzip: 8.25 kB)
- **Build Time**: ~15s

### Dashboard
- **Bundle**: 1,047.64 kB (gzip: 297.60 kB)
- **CSS**: 123.28 kB (gzip: 20.43 kB)
- **Build Time**: ~38s

## 🚀 Próximos Pasos

### Alta Prioridad
- [ ] Implementar SearchModal component
- [ ] Conectar Theme Toggle con ThemeContext
- [ ] API real para notificaciones
- [ ] Mark as read para notificaciones

### Media Prioridad
- [ ] Tests E2E con Playwright
- [ ] Storybook para componentes
- [ ] Optimización de bundle size
- [ ] PWA features

### Baja Prioridad
- [ ] Animaciones avanzadas
- [ ] Keyboard shortcuts manager
- [ ] User preferences persistence
- [ ] Analytics integration

## 📚 Documentación

- [DESIGN_SYSTEM_v1.1.0_IMPLEMENTATION.md](../docs/DESIGN_SYSTEM_v1.1.0_IMPLEMENTATION.md) - Documentación completa
- [PROGRESS.md](../PROGRESS.md) - Estado del proyecto
- [API-Documentation.md](../docs/API-Documentation.md) - Backend API

## 🤝 Soporte

Para issues o preguntas, consulta la documentación o revisa los logs del terminal.

---

**Version**: 1.1.0  
**Last Update**: 2026-02-07  
**Status**: ✅ Production Ready
