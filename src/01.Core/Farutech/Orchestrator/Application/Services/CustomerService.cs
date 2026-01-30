using Farutech.Orchestrator.Application.DTOs.Tenants;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Service implementation for Customer business operations
/// </summary>
public class CustomerService(ICustomerRepository customerRepository) : ICustomerService
{
    private readonly ICustomerRepository _customerRepository = customerRepository;

    /// <inheritdoc />
    public async Task<Customer> CreateCustomerAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        // Validate required fields
        ArgumentNullException.ThrowIfNull(request);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Code);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.CompanyName);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.TaxId);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Email);

        // Validate code uniqueness
        if (!await IsCodeAvailableAsync(request.Code, cancellationToken: cancellationToken))
        {
            throw new InvalidOperationException($"Customer code '{request.Code}' is already in use.");
        }

        // Create customer with validated data
        var customer = new Customer
        {
            Code = request.Code,
            CompanyName = request.CompanyName,
            TaxId = request.TaxId,
            Email = request.Email,
            Phone = request.Phone ?? string.Empty,
            Address = request.Address ?? string.Empty
        };

        await _customerRepository.AddAsync(customer, cancellationToken);
        return customer;
    }

    /// <inheritdoc />
    public async Task<Customer?> GetCustomerByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _customerRepository.GetByIdAsync(id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<Customer?> GetCustomerByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        return await _customerRepository.GetByCodeAsync(code, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IEnumerable<Customer>> GetCustomersByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _customerRepository.GetByUserIdAsync(userId, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<Customer> UpdateCustomerAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken);
        if (customer == null)
        {
            throw new KeyNotFoundException($"Customer with ID {id} not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.CompanyName))
        {
            customer.CompanyName = request.CompanyName;
        }

        if (!string.IsNullOrWhiteSpace(request.TaxId))
        {
            customer.TaxId = request.TaxId;
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            customer.Email = request.Email;
        }

        if (request.Phone != null)
        {
            customer.Phone = request.Phone;
        }

        if (request.Address != null)
        {
            customer.Address = request.Address;
        }

        customer.UpdatedAt = DateTime.UtcNow;

        await _customerRepository.UpdateAsync(customer, cancellationToken);
        return customer;
    }

    /// <inheritdoc />
    public async Task DeleteCustomerAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken);
        if (customer == null)
        {
            throw new KeyNotFoundException($"Customer with ID {id} not found.");
        }

        await _customerRepository.DeleteAsync(customer, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<bool> IsCodeAvailableAsync(string code, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        var existingCustomer = await _customerRepository.GetByCodeAsync(code, cancellationToken);
        return existingCustomer == null || existingCustomer.Id == excludeId;
    }
}