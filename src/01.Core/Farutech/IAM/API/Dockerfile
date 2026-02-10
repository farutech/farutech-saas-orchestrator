# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copy solution file
COPY ["Farutech.sln", "./"]

# Copy all project files
COPY ["src/01.Core/Farutech/IAM/Domain/Farutech.IAM.Domain.csproj", "src/01.Core/Farutech/IAM/Domain/"]
COPY ["src/01.Core/Farutech/IAM/Application/Farutech.IAM.Application.csproj", "src/01.Core/Farutech/IAM/Application/"]
COPY ["src/01.Core/Farutech/IAM/Infrastructure/Farutech.IAM.Infrastructure.csproj", "src/01.Core/Farutech/IAM/Infrastructure/"]
COPY ["src/01.Core/Farutech/IAM/API/Farutech.IAM.API.csproj", "src/01.Core/Farutech/IAM/API/"]

# Restore dependencies
RUN dotnet restore "src/01.Core/Farutech/IAM/API/Farutech.IAM.API.csproj"

# Copy all source code
COPY . .

# Build and publish
WORKDIR "/src/src/01.Core/Farutech/IAM/API"
RUN dotnet build "Farutech.IAM.API.csproj" -c Release -o /app/build
RUN dotnet publish "Farutech.IAM.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app

# Install curl for healthchecks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published app
COPY --from=build /app/publish .

# Create non-root user
RUN useradd -m -s /bin/bash appuser && chown -R appuser:appuser /app
USER appuser

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "Farutech.IAM.API.dll"]
