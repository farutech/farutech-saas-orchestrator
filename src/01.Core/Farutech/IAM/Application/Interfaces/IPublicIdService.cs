namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Service for converting internal GUIDs to secure public identifiers
/// </summary>
public interface IPublicIdService
{
    /// <summary>
    /// Convert an internal GUID to a public identifier
    /// </summary>
    /// <param name="internalId">Internal GUID</param>
    /// <param name="entityType">Type of entity (User, Tenant, Session, etc.)</param>
    /// <returns>Encrypted public identifier</returns>
    string ToPublicId(Guid internalId, string entityType);

    /// <summary>
    /// Convert a public identifier back to internal GUID
    /// </summary>
    /// <param name="publicId">Public identifier</param>
    /// <returns>Internal GUID or null if invalid</returns>
    Guid? FromPublicId(string publicId);

    /// <summary>
    /// Validate if a public identifier is valid and not expired
    /// </summary>
    /// <param name="publicId">Public identifier to validate</param>
    /// <returns>True if valid, false otherwise</returns>
    bool IsValidPublicId(string publicId);

    /// <summary>
    /// Convert multiple internal GUIDs to public identifiers
    /// </summary>
    /// <param name="internalIds">List of internal GUIDs</param>
    /// <param name="entityType">Type of entity</param>
    /// <returns>Dictionary of internal ID to public ID</returns>
    Task<Dictionary<Guid, string>> ToPublicIdsAsync(IEnumerable<Guid> internalIds, string entityType);

    /// <summary>
    /// Convert multiple public identifiers to internal GUIDs
    /// </summary>
    /// <param name="publicIds">List of public identifiers</param>
    /// <returns>Dictionary of public ID to internal GUID</returns>
    Task<Dictionary<string, Guid>> FromPublicIdsAsync(IEnumerable<string> publicIds);
}
