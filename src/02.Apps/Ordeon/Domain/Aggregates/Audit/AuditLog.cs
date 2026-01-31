using System;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.Audit;

public sealed class AuditLog : Entity
{
    public string EntityName { get; private set; }
    public string EntityId { get; private set; }
    public string Action { get; private set; } // Insert, Update, Delete
    public string Changes { get; private set; } // JSON with old/new values
    public Guid UserId { get; private set; }
    public DateTime Timestamp { get; private set; }

    private AuditLog(string entityName, string entityId, string action, string changes, Guid userId)
    {
        EntityName = entityName;
        EntityId = entityId;
        Action = action;
        Changes = changes;
        UserId = userId;
        Timestamp = DateTime.UtcNow;
    }

    public static AuditLog Create(string entityName, string entityId, string action, string changes, Guid userId)
        => new(entityName, entityId, action, changes, userId);
}

