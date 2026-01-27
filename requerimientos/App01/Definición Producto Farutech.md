Esta es una corrección crucial. El documento anterior definió el "motor", pero un motor sin chasis, ruedas y volante no es un vehículo funcional. Has identificado que falta el **Ecosistema de Datos Maestros**, el **Módulo de Seguridad (RBAC)** y la **Gestión de Efectivo (POS)**, que son vitales para la operación diaria y el control del fraude.

Aquí tienes un prompt robusto y directivo, diseñado para que la IA actúe como ese **Director de Producto y Arquitecto Líder** que toma el documento anterior (el Motor) e integra todo el ecosistema necesario para hacerlo un ERP funcional y seguro.

Copia y pega el siguiente prompt:

---

**Actúa como un Senior Product Director y Lead Architect.**

Hemos definido el "Core Transaccional" (el motor de documentos parametrizables), y esa parte está aprobada. Sin embargo, para que el sistema sea viable operativamente y comercialmente, necesitamos definir el **Ecosistema Completo de la Solución (Full Scope)**. El documento anterior es insuficiente porque carece de los datos maestros, la seguridad granular y el control de efectivo (POS).

Necesito que generes una **Extensión Crítica del PRD (Product Requirements Document)** o una "Versión 2.0 Integrada" que cubra las siguientes brechas, manteniendo el stack tecnológico (.NET 9 + React 19 + PostgreSQL + Arquitectura Multi-tenant) y la visión de usar JSONB para flexibilidad donde aplique.

**Tus nuevos objetivos son detallar los siguientes módulos faltantes con la misma profundidad técnica (Tablas, APIs, Reglas de Negocio):**

### 1. Módulo de Datos Maestros y Parametrización (El soporte del motor)

El sistema no puede generar transacciones sin referencias. Define la arquitectura para:

* **Inventario y Servicios:** Tabla de Items (diferenciando bienes físicos vs. servicios), Categorías, **Unidades de Medida** y Factores de Conversión (ej: Caja a Unidad).
* **Logística:** Tabla de **Bodegas** (Multi-almacén).
* **Terceros:** Tabla de **Clientes** y Proveedores con su información fiscal.
* **Financiero:** Tabla de **Formas de Pago** y reglas de negocio.
* **Regla de Identificadores:** Define la estrategia de **UUID (interno)** vs. **Código Visible (modificable/parametrizable)** para todas las entidades maestras, explicando cómo manejar el cambio de códigos sin romper la integridad referencial.

### 2. Módulo de Seguridad Avanzada y RBAC (Granularidad tipo ERP)

Necesito un modelo de seguridad robusto, similar a ERPs maduros (como Novasoft/Siigo). Define:

* **Arquitectura de Permisos:** No solo "Admin/User". Necesito control granular sobre **Módulos, Menús, Tablas (CRUD), Procedimientos y Reportes**.
* **Scope de Datos:** Definir reglas para que un usuario pueda ver "solo sus documentos" o "todo el departamento".
* **Matriz de Seguridad:** Cómo se asignan estos permisos a Roles y Usuarios en la base de datos.

### 3. Módulo de Gestión de Efectivo y POS (Control de Fraude)

Este es el punto crítico de control financiero. El sistema debe evitar fugas de dinero. Define:

* **Entidades:** Tablas de **Cajas**, **Cajeros** (Usuarios autorizados), y la tabla de vinculación **Caja-Cajero-Turno**.
* **Ciclo Operativo:** Procesos de **Apertura y Cierre de Caja** (Arqueo ciego).
* **Movimientos de Dinero (Sangrías/Retiros):**
* Proceso donde un cajero autorizado retira dinero excedente.
* Este retiro debe generar un **Documento Soporte** (usando el motor transaccional definido anteriormente) que justifique la salida.
* Impacto en el reporte de "Cuadre de Caja" al final del turno.



### 4. Integración Técnica y Roadmap Realista

* **Estrella de Datos:** Explica cómo estas tablas satélites (Maestros, Cajas) se unen a la tabla central `trx__documents` para formar un modelo analítico robusto.
* **Re-estimación del Roadmap:** Al agregar estos módulos (Maestros + Seguridad + POS), el tiempo de desarrollo cambiará. Dame un timeline realista actualizado desglosado por equipos o células de trabajo (ej: Equipo Core, Equipo POS, Equipo Maestros).

**Formato de Salida:**
Genera un documento técnico ("Addendum al PRD - V2") que incluya:

1. **Diagrama Entidad-Relación (Texto/Mermaid):** Mostrando las nuevas tablas y sus relaciones con el Core.
2. **Definición de Tablas (SQL):** Con tipos de datos específicos para Postgres.
3. **Historias de Usuario Técnicas:** Para el control de seguridad y el flujo de retiro de dinero.
4. **Estrategia de Desarrollo:** ¿Podemos paralelizar? Define los equipos necesarios.

**Nota de Contexto:** El sistema es **Multi-tenant**. Asegúrate de que todas las definiciones de tablas y seguridad contemplen el aislamiento de datos entre clientes (tenant_id).

Espero una respuesta profesional, lista para ser entregada al Head of Product y a los Líderes Técnicos para asignación inmediata de tareas.