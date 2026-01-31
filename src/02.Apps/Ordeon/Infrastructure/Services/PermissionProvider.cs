using Farutech.Apps.Ordeon.Application.Common.Interfaces;
using Farutech.Apps.Ordeon.Domain.Aggregates.Identity;
using System.Collections.Generic;

namespace Farutech.Apps.Ordeon.Infrastructure.Services;

public sealed class PermissionProvider : IPermissionProvider
{
    public IEnumerable<PermissionDefinition> GetAllPermissions()
        => new List<PermissionDefinition>
        {
            // Inventory
            new(Permissions.Inventory.Read, "Ver Items", "Permite ver el catálogo de productos", "Inventario"),
            new(Permissions.Inventory.Create, "Crear Items", "Permite crear nuevos productos", "Inventario"),
            
            // Logistics
            new(Permissions.Warehouse.Read, "Ver Bodegas", "Permite ver almacenes", "Logística"),
            
            // POS
            new(Permissions.POS.OpenSession, "Abrir Caja", "Permite iniciar turnos de venta", "Punto de Venta"),
            new(Permissions.POS.CloseSession, "Cerrar Caja", "Permite finalizar turnos y arqueo", "Punto de Venta"),
            new(Permissions.POS.WithdrawCash, "Realizar Sangrías", "Permite retiros de efectivo", "Punto de Venta"),
            new(Permissions.POS.Configuration.Read, "Ver Configuración POS", "Ver cajeros y cajas", "Punto de Venta"),
            new(Permissions.POS.Configuration.Manage, "Administrar POS", "Crear cajeros y cajas", "Punto de Venta"),
            
            // Documents
            new(Permissions.Documents.ManageDefinitions, "Configurar Documentos", "Configurar prefijos y numeración", "Documentos")
        };
}

