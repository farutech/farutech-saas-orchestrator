#!/bin/bash
# Script para iniciar la infraestructura de desarrollo

echo "🚀 Iniciando Farutech Orchestrator Infrastructure..."
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Levantar servicios
echo "📦 Iniciando contenedores..."
docker-compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo ""
echo "✅ Estado de servicios:"
docker-compose ps

echo ""
echo "📊 Información de conexión:"
echo "  PostgreSQL: localhost:5432"
echo "    - Usuario: farutech_admin"
echo "    - Password: Dev@2026!Secure"
echo "    - Database: farutech_orchestrator"
echo ""
echo "  NATS: nats://localhost:4222"
echo "    - Monitoring: http://localhost:8222"
echo ""
echo "  pgAdmin: http://localhost:5050"
echo "    - Email: admin@farutech.local"
echo "    - Password: Admin@2026"
echo ""
echo "✅ Infraestructura lista!"
