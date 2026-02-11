# Configuration Management Guide

## Overview

This guide explains how to configure the Farutech SaaS Orchestrator for different deployment environments (Development, Staging, Production).

## Architecture Decision: Backend Proxy Pattern

**Security-First Approach**: The frontend communicates exclusively with the Orchestrator API, which acts as a secure proxy to the IAM API. This architecture provides:

### Security Benefits
- ✅ JWT tokens never exposed in browser
- ✅ Centralized authentication logic
- ✅ Backend validation and rate limiting
- ✅ No CORS configuration needed between frontend and IAM
- ✅ Better session management

### Functional Benefits
- ✅ Consistent error handling
- ✅ Centralized logging and auditing
- ✅ Single API endpoint for frontend
- ✅ Backend can add business logic

### Performance Benefits
- ✅ Backend can implement caching
- ✅ Persistent connections between services
- ✅ Request optimization and batching

### Trade-offs
- ⚠️ One additional HTTP hop (negligible impact)
- ✅ Significantly improved security posture

## Environment Variables

### Frontend Configuration (.env files)

The frontend uses Vite environment variables prefixed with `VITE_`:

#### Development (.env.local or .env)
```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_IAM_API_URL=http://localhost:5001
VITE_ORCHESTRATOR_API_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=development
```

#### Staging (.env.staging)
```bash
VITE_API_BASE_URL=http://orchestrator-api:8080
VITE_IAM_API_URL=http://iam-api:8080
VITE_ORCHESTRATOR_API_URL=http://orchestrator-api:8080
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=staging
```

#### Production (.env.production)
```bash
VITE_API_BASE_URL=https://orchestrator-api.farutech.com
VITE_IAM_API_URL=https://iam-api.farutech.com
VITE_ORCHESTRATOR_API_URL=https://orchestrator-api.farutech.com
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=production
```

**Note**: `VITE_IAM_API_URL` is kept for future extensibility but is not used directly by the frontend due to the backend proxy pattern.

### Backend Configuration (appsettings.json files)

#### Environment-Specific Settings

- `appsettings.Development.json` - Local development
- `appsettings.Staging.json` - Staging environment
- `appsettings.Production.json` - Production environment

#### ASP.NET Core Environment Variables

Set the environment using:
```bash
# Windows
$env:ASPNETCORE_ENVIRONMENT="Staging"

# Linux/Mac
export ASPNETCORE_ENVIRONMENT=Staging
```

## Secrets Management

### Using Environment Variables for Secrets

For production deployments, use environment variables for sensitive data:

```bash
# Database
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_db_password

# JWT
JWT_SECRET_KEY=your_256_bit_secret_key

# Redis
REDIS_PASSWORD=your_redis_password

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
```

### ASP.NET Core User Secrets (Development)

For local development, use user secrets:

```bash
# In the API project directory
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "your_connection_string"
dotnet user-secrets set "Jwt:SecretKey" "your_secret_key"
```

## Docker Deployment

### Environment Variables in Docker Compose

Example docker-compose.yml environment configuration:

```yaml
services:
  orchestrator-api:
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=${DB_CONNECTION}
      - Services__IAM__Url=https://iam-api.farutech.com
      - Jwt__SecretKey=${JWT_SECRET}

  iam-api:
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=${IAM_DB_CONNECTION}
      - RedisOptions__ConnectionString=${REDIS_CONNECTION}
      - EmailOptions__ApiKey=${SENDGRID_API_KEY}
```

## Configuration Validation

### Frontend

The frontend configuration is validated at build time. Missing required environment variables will cause build failures.

### Backend

Configuration is validated at startup. Missing required settings will cause the application to fail to start with clear error messages.

## Deployment Checklist

- [ ] Set correct ASPNETCORE_ENVIRONMENT
- [ ] Configure database connection strings
- [ ] Set JWT secret keys
- [ ] Configure service URLs (IAM, Orchestrator)
- [ ] Set up Redis connection
- [ ] Configure email service (SendGrid)
- [ ] Update CORS allowed origins
- [ ] Test configuration in staging before production

## Troubleshooting

### Common Issues

1. **Connection Refused**: Check service URLs and ports
2. **Database Connection Failed**: Verify connection strings and credentials
3. **JWT Token Invalid**: Ensure secret keys are consistent across services
4. **CORS Errors**: Update allowed origins for the environment

### Debugging Configuration

Enable detailed logging to troubleshoot configuration issues:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Debug"
    }
  }
}
```