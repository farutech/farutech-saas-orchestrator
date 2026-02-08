namespace Farutech.Orchestrator.Domain.Enums;

/// <summary>
/// Type of provisioning task
/// </summary>
public enum ProvisionTaskType
{
    /// <summary>
    /// Provision a new tenant instance
    /// </summary>
    TenantProvision,

    /// <summary>
    /// Deprovision an existing tenant instance
    /// </summary>
    TenantDeprovision,

    /// <summary>
    /// Update features for an existing tenant
    /// </summary>
    FeatureUpdate,

    /// <summary>
    /// Generate invoices for billing
    /// </summary>
    InvoiceGeneration
}