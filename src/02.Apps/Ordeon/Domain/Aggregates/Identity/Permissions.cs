namespace Farutech.Apps.Ordeon.Domain.Aggregates.Identity;

/// <summary>
/// Catálogo centralizado de permisos del sistema.
/// Siguiendo la convención: modulo.funcion.accion
/// </summary>
public static class Permissions
{
    public static class Inventory
    {
        public const string Read = "inv.itm.read";
        public const string Create = "inv.itm.crt";
        public const string Update = "inv.itm.upd";
        public const string Delete = "inv.itm.del";
    }

    public static class Warehouse
    {
        public const string Read = "log.whs.read";
        public const string Create = "log.whs.crt";
        public const string Update = "log.whs.upd";
    }

    public static class Documents
    {
        public const string Read = "doc.gen.read";
        public const string Create = "doc.gen.crt";
        public const string Cancel = "doc.gen.can";
        public const string ManageDefinitions = "doc.def.mng";
    }

    public static class POS
    {
        public const string OpenSession = "pos.ses.opn";
        public const string CloseSession = "pos.ses.cls";
        public const string WithdrawCash = "pos.csh.wdr"; // Sangrías

        public static class Configuration
        {
            public const string Read = "pos.cfg.read";
            public const string Manage = "pos.cfg.mng";
        }
    }
}

