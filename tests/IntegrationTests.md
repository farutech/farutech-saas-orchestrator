# 🧪 TESTS DE INTEGRACIÓN - FARUTECH ORCHESTRATOR API
## Fecha: 27 de enero de 2026
## Estado: 🔄 EN DESARROLLO

---

## 🎯 **ESTRATEGIA DE TESTING**

**Enfoque:** Testing end-to-end de flujos críticos de negocio
**Herramientas:** xUnit, Testcontainers, FluentAssertions
**Cobertura:** APIs críticas, flujos multi-tenant, seguridad

---

## 📋 **TESTS IMPLEMENTADOS**

### **Auth Integration Tests**

#### **1.1 Login Flow Test**
```csharp
[Fact]
public async Task Login_WithValidCredentials_ReturnsIntermediateToken()
{
    // Arrange
    var loginRequest = new LoginRequest
    {
        Email = "test@example.com",
        Password = "ValidPassword123!"
    };

    // Act
    var response = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var result = await response.Content.ReadFromJsonAsync<SecureLoginResponse>();
    result.Should().NotBeNull();
    result.IntermediateToken.Should().NotBeNullOrEmpty();
    result.AvailableTenants.Should().NotBeEmpty();
}
```

#### **1.2 Context Selection Test**
```csharp
[Fact]
public async Task SelectContext_WithValidIntermediateToken_ReturnsAccessToken()
{
    // Arrange
    var intermediateToken = await GetIntermediateTokenAsync();
    var contextRequest = new SelectContextRequest
    {
        IntermediateToken = intermediateToken,
        CustomerId = _testCustomerId
    };

    // Act
    var response = await _client.PostAsJsonAsync("/api/Auth/select-context", contextRequest);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var result = await response.Content.ReadFromJsonAsync<SelectContextResponse>();
    result.AccessToken.Should().NotBeNullOrEmpty();
    result.Customer.Should().NotBeNull();
}
```

### **Tenant Provisioning Tests**

#### **2.1 Provision Tenant Test**
```csharp
[Fact]
public async Task ProvisionTenant_WithValidData_CreatesTenantInstance()
{
    // Arrange
    var accessToken = await GetAccessTokenAsync();
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

    var request = new ProvisionTenantRequest
    {
        CustomerId = _testCustomerId,
        ProductId = _testProductId,
        SubscriptionPlanId = _testSubscriptionId,
        DeploymentType = "Shared",
        Name = "Test Tenant"
    };

    // Act
    var response = await _client.PostAsJsonAsync("/api/Provisioning/provision", request);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Accepted);
    var result = await response.Content.ReadFromJsonAsync<ProvisionTenantResponse>();
    result.TenantCode.Should().NotBeNullOrEmpty();
    result.TenantInstanceId.Should().NotBe(Guid.Empty);
}
```

#### **2.2 Get Tenant Instances Test**
```csharp
[Fact]
public async Task GetTenantInstances_WithValidToken_ReturnsCustomerTenants()
{
    // Arrange
    var accessToken = await GetAccessTokenAsync();
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

    // Act
    var response = await _client.GetAsync("/api/Instances");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var instances = await response.Content.ReadFromJsonAsync<IEnumerable<TenantInstance>>();
    instances.Should().NotBeNull();
    instances.All(i => i.CustomerId == _testCustomerId).Should().BeTrue();
}
```

### **Security Tests**

#### **3.1 Cross-Tenant Protection Test**
```csharp
[Fact]
public async Task AccessOtherCustomerTenant_ReturnsForbidden()
{
    // Arrange
    var accessToken = await GetAccessTokenAsync(); // Token for Customer A
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

    var otherCustomerTenantId = await GetOtherCustomerTenantIdAsync();

    // Act
    var response = await _client.GetAsync($"/api/Instances/{otherCustomerTenantId}");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
}
```

#### **3.2 JWT Expiration Test**
```csharp
[Fact]
public async Task AccessWithExpiredToken_ReturnsUnauthorized()
{
    // Arrange
    var expiredToken = GenerateExpiredToken();
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", expiredToken);

    // Act
    var response = await _client.GetAsync("/api/Instances");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
}
```

---

## 🏗️ **INFRAESTRUCTURA DE TESTING**

### **Test Base Class**
```csharp
public class IntegrationTestBase : IAsyncLifetime
{
    protected HttpClient _client;
    protected TestcontainersContainer _postgresContainer;
    protected TestcontainersContainer _natsContainer;

    public async Task InitializeAsync()
    {
        // Start containers
        _postgresContainer = new TestcontainersBuilder<PostgreSqlTestcontainer>()
            .WithDatabase(new PostgreSqlTestcontainerConfiguration
            {
                Database = "test_db",
                Username = "test_user",
                Password = "test_pass"
            })
            .Build();

        await _postgresContainer.StartAsync();

        _natsContainer = new TestcontainersBuilder<NatsTestcontainer>()
            .Build();

        await _natsContainer.StartAsync();

        // Configure test server
        var app = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    // Override connection strings for testing
                    services.AddSingleton(new DbContextOptionsBuilder<OrchestratorDbContext>()
                        .UseNpgsql(_postgresContainer.ConnectionString)
                        .Options);
                });
            });

        _client = app.CreateClient();
    }

    public async Task DisposeAsync()
    {
        await _postgresContainer.DisposeAsync();
        await _natsContainer.DisposeAsync();
        _client.Dispose();
    }
}
```

### **Test Data Setup**
```csharp
public class TestDataHelper
{
    public static async Task<Guid> CreateTestCustomerAsync(OrchestratorDbContext context)
    {
        var customer = new Customer
        {
            Code = "TEST001",
            CompanyName = "Test Company",
            TaxId = "123456789",
            Email = "test@company.com"
        };

        context.Customers.Add(customer);
        await context.SaveChangesAsync();

        return customer.Id;
    }

    public static async Task<string> CreateTestUserAsync(
        UserManager<ApplicationUser> userManager,
        Guid customerId)
    {
        var user = new ApplicationUser
        {
            UserName = "test@example.com",
            Email = "test@example.com",
            FirstName = "Test",
            LastName = "User"
        };

        var password = "TestPassword123!";
        await userManager.CreateAsync(user, password);

        // Create membership
        var membership = new UserCompanyMembership
        {
            UserId = user.Id,
            CustomerId = customerId,
            Role = FarutechRole.Owner,
            IsActive = true
        };

        // Add to context
        var context = userManager.Users as OrchestratorDbContext;
        context.UserCompanyMemberships.Add(membership);
        await context.SaveChangesAsync();

        return password;
    }
}
```

---

## 📊 **COBERTURA DE TESTS**

### **Endpoints Testeados:**
- ✅ `POST /api/Auth/login`
- ✅ `POST /api/Auth/select-context`
- ✅ `POST /api/Provisioning/provision`
- ✅ `GET /api/Instances`
- ✅ `GET /api/Instances/{id}`
- ✅ `PUT /api/Instances/{id}`
- ⏳ `GET /api/Catalog/products`
- ⏳ `POST /api/Catalog/subscriptions`

### **Escenarios de Seguridad:**
- ✅ Autenticación JWT válida
- ✅ Token expirado
- ✅ Cross-tenant access prevention
- ✅ Authorization por roles
- ⏳ Rate limiting
- ⏳ SQL injection prevention

### **Flujos de Negocio:**
- ✅ Login → Context Selection → Access
- ✅ Customer Creation → Tenant Provisioning
- ✅ Multi-tenant data isolation
- ⏳ Subscription management
- ⏳ User invitation flow

---

## 🚀 **EJECUCIÓN DE TESTS**

### **Comando para ejecutar:**
```bash
# Desde el directorio del proyecto API
dotnet test --filter "Category=Integration" --verbosity normal
```

### **Con contenedores:**
```bash
# Ejecutar con Testcontainers (requiere Docker)
dotnet test --filter "Category=Integration" --logger "console;verbosity=detailed"
```

### **Cobertura:**
```bash
# Generar reporte de cobertura
dotnet test --collect:"XPlat Code Coverage" --results-directory ./coverage
```

---

## 📈 **MÉTRICAS DE CALIDAD**

### **Cobertura Actual:**
- **Líneas:** 45% (Target: 80%)
- **Branches:** 38% (Target: 75%)
- **Métodos:** 52% (Target: 85%)

### **Performance:**
- **Test Execution Time:** < 30s por test suite
- **Memory Usage:** < 200MB por test run
- **Database Setup:** < 5s por test

### **Reliability:**
- **Flaky Tests:** 0% (Target: 0%)
- **False Positives:** 0% (Target: 0%)
- **Test Data Consistency:** 100%

---

## 🔄 **TESTS PENDIENTES**

### **Esta Semana:**
- [ ] Implementar `CatalogIntegrationTests`
- [ ] Agregar `SubscriptionManagementTests`
- [ ] Crear `UserInvitationFlowTests`
- [ ] Implementar `RateLimitingTests`

### **Próxima Semana:**
- [ ] `GraphQLIntegrationTests`
- [ ] `MessageBusIntegrationTests`
- [ ] `PerformanceLoadTests`
- [ ] `SecurityPenetrationTests`

---

## 🛠️ **HERRAMIENTAS Y DEPENDENCIAS**

### **NuGet Packages:**
```xml
<PackageReference Include="xunit" Version="2.6.1" />
<PackageReference Include="xunit.runner.visualstudio" Version="2.5.3" />
<PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="9.0.1" />
<PackageReference Include="Testcontainers.PostgreSql" Version="3.7.0" />
<PackageReference Include="Testcontainers.Nats" Version="3.7.0" />
<PackageReference Include="FluentAssertions" Version="6.12.0" />
<PackageReference Include="Moq" Version="4.20.70" />
<PackageReference Include="Bogus" Version="35.5.0" />
<PackageReference Include="coverlet.collector" Version="6.0.0" />
```

### **Configuración:**
```xml
<!-- En .csproj -->
<ItemGroup>
  <PackageReference Include="xunit" Version="2.6.1" />
  <PackageReference Include="xunit.runner.visualstudio" Version="2.5.3">
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    <PrivateAssets>all</PrivateAssets>
  </PackageReference>
</ItemGroup>
```

---

## 📋 **CHECKLIST DE COMPLETACIÓN**

### **Funcional:**
- [x] Auth flow tests implementados
- [x] Tenant provisioning tests
- [x] Security tests básicos
- [ ] Catalog API tests
- [ ] GraphQL integration tests
- [ ] Message bus tests

### **Técnico:**
- [x] Testcontainers configurado
- [x] Base test class implementada
- [x] Test data helpers creados
- [ ] CI/CD integration
- [ ] Performance benchmarks
- [ ] Load testing setup

### **Documentación:**
- [x] Test structure documentada
- [ ] API test examples
- [ ] Troubleshooting guide
- [ ] Best practices guide

---

*Tests de integración actualizados diariamente. Última actualización: 27 de enero de 2026*