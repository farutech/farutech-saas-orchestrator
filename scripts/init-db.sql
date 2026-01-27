-- Farutech Orchestrator - Inicialización de Base de Datos
-- Ejecutado automáticamente por Docker al iniciar PostgreSQL

-- Crear extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear extensión para JSONB
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Crear schema para multi-tenancy
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS tenants;

-- Confirmar creación
SELECT 'Database initialized successfully' AS status;
