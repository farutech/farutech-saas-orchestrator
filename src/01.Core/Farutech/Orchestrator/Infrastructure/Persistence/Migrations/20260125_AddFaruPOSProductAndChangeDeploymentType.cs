using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Farutech.Orchestrator.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFaruPOSProductAndChangeDeploymentType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Renombrar columna Environment a DeploymentType
            migrationBuilder.RenameColumn(
                name: "Environment",
                table: "TenantInstances",
                newName: "DeploymentType");

            // 2. Actualizar valores existentes
            migrationBuilder.Sql(@"
                UPDATE ""TenantInstances"" 
                SET ""DeploymentType"" = 'Shared' 
                WHERE ""DeploymentType"" IN ('development', 'staging');
                
                UPDATE ""TenantInstances"" 
                SET ""DeploymentType"" = 'Dedicated' 
                WHERE ""DeploymentType"" = 'production';
            ");

            // 3. Insertar Producto: FaruPOS
            migrationBuilder.Sql(@"
                INSERT INTO ""Products"" (""Id"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '00000000-0000-0000-0000-000000000001',
                    'FARUPOS',
                    'FaruPOS - Point of Sale',
                    'Sistema de punto de venta completo con gestión de inventario, ventas, clientes y reportes. Ideal para retail, farmacias, restaurantes y más.',
                    true,
                    NOW(),
                    false
                );
            ");

            // 4. Insertar Módulos Base (Shared)
            migrationBuilder.Sql(@"
                -- POS BASIC (Shared)
                INSERT INTO ""Modules"" (""Id"", ""ProductId"", ""Code"", ""Name"", ""Description"", ""IsRequired"", ""IsActive"", ""DeploymentType"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '10000000-0000-0000-0000-000000000001',
                    '00000000-0000-0000-0000-000000000001',
                    'POS_BASIC_SHARED',
                    'POS Básico (Compartido)',
                    'Ventas, cobros y cierre de caja básico en servidor compartido. Límite de 50 ventas/día.',
                    false,
                    true,
                    'Shared',
                    NOW(),
                    false
                );

                -- INVENTORY BASIC (Shared)
                INSERT INTO ""Modules"" (""Id"", ""ProductId"", ""Code"", ""Name"", ""Description"", ""IsRequired"", ""IsActive"", ""DeploymentType"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '10000000-0000-0000-0000-000000000002',
                    '00000000-0000-0000-0000-000000000001',
                    'INV_BASIC_SHARED',
                    'Inventario Básico (Compartido)',
                    'Consulta de stock y movimientos básicos en servidor compartido. Hasta 500 productos.',
                    false,
                    true,
                    'Shared',
                    NOW(),
                    false
                );

                -- REPORTS STANDARD (Shared)
                INSERT INTO ""Modules"" (""Id"", ""ProductId"", ""Code"", ""Name"", ""Description"", ""IsRequired"", ""IsActive"", ""DeploymentType"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '10000000-0000-0000-0000-000000000003',
                    '00000000-0000-0000-0000-000000000001',
                    'RPT_STANDARD_SHARED',
                    'Reportes Estándar (Compartido)',
                    'Reportes predefinidos de ventas e inventario en servidor compartido.',
                    false,
                    true,
                    'Shared',
                    NOW(),
                    false
                );

                -- CUSTOMERS BASIC (Shared)
                INSERT INTO ""Modules"" (""Id"", ""ProductId"", ""Code"", ""Name"", ""Description"", ""IsRequired"", ""IsActive"", ""DeploymentType"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '10000000-0000-0000-0000-000000000004',
                    '00000000-0000-0000-0000-000000000001',
                    'CUS_BASIC_SHARED',
                    'Clientes Básico (Compartido)',
                    'Gestión básica de clientes en servidor compartido. Hasta 1000 clientes.',
                    false,
                    true,
                    'Shared',
                    NOW(),
                    false
                );
            ");

            // 5. Insertar Módulos Dedicados (Dedicated)
            migrationBuilder.Sql(@"
                -- POS ADVANCED (Dedicated)
                INSERT INTO ""Modules"" (""Id"", ""ProductId"", ""Code"", ""Name"", ""Description"", ""IsRequired"", ""IsActive"", ""DeploymentType"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '20000000-0000-0000-0000-000000000001',
                    '00000000-0000-0000-0000-000000000001',
                    'POS_ADVANCED_DEDICATED',
                    'POS Avanzado (Dedicado)',
                    'Ventas completas con cotizaciones, apartados, devoluciones y facturación. Servidor dedicado, ventas ilimitadas.',
                    false,
                    true,
                    'Dedicated',
                    NOW(),
                    false
                );

                -- INVENTORY ADVANCED (Dedicated)
                INSERT INTO ""Modules"" (""Id"", ""ProductId"", ""Code"", ""Name"", ""Description"", ""IsRequired"", ""IsActive"", ""DeploymentType"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '20000000-0000-0000-0000-000000000002',
                    '00000000-0000-0000-0000-000000000001',
                    'INV_ADVANCED_DEDICATED',
                    'Inventario Avanzado (Dedicado)',
                    'Gestión completa con ajustes, transferencias, lotes, vencimientos. Servidor dedicado, productos ilimitados.',
                    false,
                    true,
                    'Dedicated',
                    NOW(),
                    false
                );

                -- REPORTS CUSTOM (Dedicated)
                INSERT INTO ""Modules"" (""Id"", ""ProductId"", ""Code"", ""Name"", ""Description"", ""IsRequired"", ""IsActive"", ""DeploymentType"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '20000000-0000-0000-0000-000000000003',
                    '00000000-0000-0000-0000-000000000001',
                    'RPT_CUSTOM_DEDICATED',
                    'Reportes Personalizados (Dedicado)',
                    'Reportes personalizados, exportación a Excel/PDF, programación automática. Servidor dedicado.',
                    false,
                    true,
                    'Dedicated',
                    NOW(),
                    false
                );

                -- CUSTOMERS LOYALTY (Dedicated)
                INSERT INTO ""Modules"" (""Id"", ""ProductId"", ""Code"", ""Name"", ""Description"", ""IsRequired"", ""IsActive"", ""DeploymentType"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '20000000-0000-0000-0000-000000000004',
                    '00000000-0000-0000-0000-000000000001',
                    'CUS_LOYALTY_DEDICATED',
                    'Programa de Lealtad (Dedicado)',
                    'Programa de puntos, recompensas y promociones. Servidor dedicado, clientes ilimitados.',
                    false,
                    true,
                    'Dedicated',
                    NOW(),
                    false
                );

                -- MULTI-STORE (Dedicated)
                INSERT INTO ""Modules"" (""Id"", ""ProductId"", ""Code"", ""Name"", ""Description"", ""IsRequired"", ""IsActive"", ""DeploymentType"", ""CreatedAt"", ""IsDeleted"")
                VALUES (
                    '20000000-0000-0000-0000-000000000005',
                    '00000000-0000-0000-0000-000000000001',
                    'MULTISTORE_DEDICATED',
                    'Multi-Tienda (Dedicado)',
                    'Gestión de múltiples sucursales, inventario centralizado, reportes consolidados. Solo en servidor dedicado.',
                    false,
                    true,
                    'Dedicated',
                    NOW(),
                    false
                );
            ");

            // 6. Insertar Features asociadas a los módulos
            migrationBuilder.Sql(@"
                -- Features para POS_BASIC_SHARED
                INSERT INTO ""Features"" (""Id"", ""ModuleId"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES 
                    ('f1000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'POS_SALES', 'Realizar Ventas', 'Crear y procesar ventas básicas', true, NOW(), false),
                    ('f1000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'POS_CLOSEDAY', 'Cerrar Caja', 'Cierre de caja diario', true, NOW(), false);

                -- Features para INV_BASIC_SHARED
                INSERT INTO ""Features"" (""Id"", ""ModuleId"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES 
                    ('f1000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'INV_VIEW', 'Consultar Inventario', 'Ver stock y movimientos', true, NOW(), false),
                    ('f1000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'INV_PRODUCTS', 'Gestión de Productos', 'Crear y editar productos (máx. 500)', true, NOW(), false);

                -- Features para RPT_STANDARD_SHARED
                INSERT INTO ""Features"" (""Id"", ""ModuleId"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES 
                    ('f1000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'RPT_SALES', 'Reporte de Ventas', 'Reporte predefinido de ventas', true, NOW(), false),
                    ('f1000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'RPT_INVENTORY', 'Reporte de Inventario', 'Reporte predefinido de stock', true, NOW(), false);

                -- Features para CUS_BASIC_SHARED
                INSERT INTO ""Features"" (""Id"", ""ModuleId"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES 
                    ('f1000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000004', 'CUS_CRUD', 'Gestión de Clientes', 'Crear, editar y consultar clientes (máx. 1000)', true, NOW(), false);

                -- Features para POS_ADVANCED_DEDICATED
                INSERT INTO ""Features"" (""Id"", ""ModuleId"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES 
                    ('f2000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'POS_QUOTATIONS', 'Cotizaciones', 'Crear y gestionar cotizaciones', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'POS_LAYAWAY', 'Apartados', 'Gestión de apartados y abonos', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'POS_REFUNDS', 'Devoluciones', 'Procesar devoluciones completas', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 'POS_INVOICING', 'Facturación', 'Generar facturas electrónicas', true, NOW(), false);

                -- Features para INV_ADVANCED_DEDICATED
                INSERT INTO ""Features"" (""Id"", ""ModuleId"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES 
                    ('f2000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', 'INV_ADJUSTMENTS', 'Ajustes de Inventario', 'Ajustar stock manualmente', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', 'INV_TRANSFERS', 'Transferencias', 'Transferir productos entre bodegas', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002', 'INV_BATCHES', 'Lotes y Vencimientos', 'Control de lotes y fechas de vencimiento', true, NOW(), false);

                -- Features para RPT_CUSTOM_DEDICATED
                INSERT INTO ""Features"" (""Id"", ""ModuleId"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES 
                    ('f2000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000003', 'RPT_CUSTOM', 'Reportes Personalizados', 'Crear reportes personalizados', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000003', 'RPT_EXPORT', 'Exportar Reportes', 'Exportar a Excel, PDF, CSV', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000003', 'RPT_SCHEDULE', 'Programar Reportes', 'Programar envío automático de reportes', true, NOW(), false);

                -- Features para CUS_LOYALTY_DEDICATED
                INSERT INTO ""Features"" (""Id"", ""ModuleId"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES 
                    ('f2000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000004', 'CUS_POINTS', 'Puntos de Lealtad', 'Acumular y redimir puntos', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000004', 'CUS_REWARDS', 'Recompensas', 'Gestionar recompensas y promociones', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000004', 'CUS_TIERS', 'Niveles VIP', 'Niveles de cliente (Bronze, Silver, Gold)', true, NOW(), false);

                -- Features para MULTISTORE_DEDICATED
                INSERT INTO ""Features"" (""Id"", ""ModuleId"", ""Code"", ""Name"", ""Description"", ""IsActive"", ""CreatedAt"", ""IsDeleted"")
                VALUES 
                    ('f2000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000005', 'MULTI_STORES', 'Múltiples Sucursales', 'Gestionar múltiples sucursales', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000005', 'MULTI_CENTRAL_INV', 'Inventario Centralizado', 'Inventario centralizado con distribución', true, NOW(), false),
                    ('f2000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000005', 'MULTI_CONSOLIDATED', 'Reportes Consolidados', 'Reportes consolidados de todas las sucursales', true, NOW(), false);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Eliminar features
            migrationBuilder.Sql(@"DELETE FROM ""Features"" WHERE ""ModuleId"" IN (
                SELECT ""Id"" FROM ""Modules"" WHERE ""ProductId"" = '00000000-0000-0000-0000-000000000001'
            );");

            // Eliminar módulos
            migrationBuilder.Sql(@"DELETE FROM ""Modules"" WHERE ""ProductId"" = '00000000-0000-0000-0000-000000000001';");

            // Eliminar producto
            migrationBuilder.Sql(@"DELETE FROM ""Products"" WHERE ""Id"" = '00000000-0000-0000-0000-000000000001';");

            // Revertir columna
            migrationBuilder.RenameColumn(
                name: "DeploymentType",
                table: "TenantInstances",
                newName: "Environment");

            migrationBuilder.Sql(@"
                UPDATE ""TenantInstances"" 
                SET ""Environment"" = 'production' 
                WHERE ""Environment"" = 'Dedicated';
                
                UPDATE ""TenantInstances"" 
                SET ""Environment"" = 'development' 
                WHERE ""Environment"" = 'Shared';
            ");
        }
    }
}
