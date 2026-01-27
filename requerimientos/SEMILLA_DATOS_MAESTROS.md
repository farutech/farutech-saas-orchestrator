# DEFINICIÓN DE SEMILLA DE DATOS (SEEDING) - FARUTECH POS

Este documento define los datos maestros que DEBEN existir en la base de datos del Orchestrator para que el sistema sea funcional.

## 1. Producto Base
- **Code:** `farutech_pos`
- **Name:** "Farutech POS & Services"
- **Description:** "Sistema de gestión de punto de venta, servicios y control de inventario."

## 2. Definición de Módulos (Jerarquía)

### Módulo A: Ventas (`sales_module`)
- **Feature:** `pos_terminal` (Terminal de Punto de Venta)
    - *Permissions:* `sales:create`, `sales:read`, `pos:open_session`, `pos:close_session`
- **Feature:** `service_orders` (Gestión de Servicios)
    - *Permissions:* `services:create`, `services:assign`, `services:complete`

### Módulo B: Inventario (`inventory_module`)
- **Feature:** `stock_management` (Control de Stock)
    - *Permissions:* `stock:view`, `stock:adjust`
- **Feature:** `warehouses` (Multi-bodega) - *Premium*
    - *Permissions:* `warehouse:create`, `warehouse:transfer`

### Módulo C: Seguridad (`security_module`)
- **Feature:** `rbac_core` (Roles y Permisos)
    - *Permissions:* `users:invite`, `roles:manage`

## 3. Planes de Suscripción (Ejemplo)
- **Plan:** "Basic" (Incluye `sales_module`, `inventory_module` básico).
- **Plan:** "Enterprise" (Incluye Todo + `warehouses`).

## 4. Regla de Negocio para el Owner
Al crear una instancia, el usuario creador (Owner) recibe automáticamente el rol `SuperAdmin` en esa instancia, con acceso a **TODAS** las features activas en su plan.