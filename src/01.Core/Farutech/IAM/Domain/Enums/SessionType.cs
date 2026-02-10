namespace Farutech.IAM.Domain.Enums;

/// <summary>
/// Types of sessions with different expiration policies
/// </summary>
public enum SessionType
{
    /// <summary>
    /// Normal session - 1 hour duration
    /// </summary>
    Normal = 0,
    
    /// <summary>
    /// Extended session - 24 hours duration (remember me)
    /// </summary>
    Extended = 1,
    
    /// <summary>
    /// Admin session - 8 hours duration (elevated privileges)
    /// </summary>
    Admin = 2
}
