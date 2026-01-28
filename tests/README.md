# Ejecutar Tests de Integración

## Prerrequisitos
- Docker Desktop ejecutándose
- .NET 9.0 SDK instalado
- Puerto 5432 y 4222 libres (o Docker asignará puertos dinámicos)

## Ejecutar Todos los Tests
```bash
cd tests/Farutech.Orchestrator.IntegrationTests
dotnet test --verbosity normal
```

## Ejecutar Tests Específicos
```bash
# Solo tests de autenticación
dotnet test --filter "Category=Auth" --verbosity normal

# Solo tests de seguridad
dotnet test --filter "Category=Security" --verbosity normal

# Solo tests de provisioning
dotnet test --filter "Category=Provisioning" --verbosity normal
```

## Ejecutar con Cobertura
```bash
dotnet test --collect:"XPlat Code Coverage" --results-directory ./coverage
```

## Debug Tests
```bash
# Ejecutar en modo debug
dotnet test --logger "console;verbosity=detailed" --blame
```

## Verificar Estado de Contenedores
```bash
# Durante la ejecución de tests
docker ps
docker logs <container_id>
```

## Troubleshooting

### Error: "No such service: redis"
- Los tests no requieren Redis, solo PostgreSQL y NATS

### Error: "Connection refused"
- Verificar que Docker Desktop esté ejecutándose
- Verificar que los puertos 5432 y 4222 no estén en uso

### Error: "Database migration failed"
- Los tests aplican migraciones automáticamente
- Verificar logs de contenedor PostgreSQL

### Tests Lentos
- Los contenedores Testcontainers toman tiempo en iniciar
- Tiempo esperado: 30-60 segundos para primer test
- Tests subsiguientes: 5-10 segundos cada uno

## Configuración de CI/CD
```yaml
# En GitHub Actions
- name: Run Integration Tests
  run: |
    cd tests/Farutech.Orchestrator.IntegrationTests
    dotnet test --verbosity minimal --logger "trx;LogFileName=test-results.trx"
```

## Métricas Esperadas
- **Tiempo total:** 2-3 minutos
- **Tests passing:** 100%
- **Cobertura:** > 60%
- **Contenedores:** PostgreSQL + NATS