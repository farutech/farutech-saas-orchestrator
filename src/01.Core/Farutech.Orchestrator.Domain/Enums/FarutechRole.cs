namespace Farutech.Orchestrator.Domain.Enums;

public enum FarutechRole
{
    Owner,        // Dueño de la Organización (Acceso Total)
    InstanceAdmin,// Administrador de una Instancia específica
    User,         // Usuario operativo
    Guest         // Solo lectura
}
