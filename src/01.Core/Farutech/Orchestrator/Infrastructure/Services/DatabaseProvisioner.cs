using System;
using System.Threading.Tasks;
using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Farutech.Orchestrator.Infrastructure.Services;

public class DatabaseProvisioner : IDatabaseProvisioner
{
    private readonly IConfiguration _configuration;

    public DatabaseProvisioner(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<string> PrepareDatabaseAndGetConnectionStringAsync(string baseConnectionString, string database, string schema)
    {
        if (string.IsNullOrWhiteSpace(baseConnectionString))
            throw new ArgumentException("baseConnectionString is required", nameof(baseConnectionString));

        var adminBuilder = new NpgsqlConnectionStringBuilder(baseConnectionString)
        {
            Database = "postgres"
        };

        await using var adminConn = new NpgsqlConnection(adminBuilder.ConnectionString);
        await adminConn.OpenAsync();

        try
        {
            await using var checkCmd = adminConn.CreateCommand();
            checkCmd.CommandText = $"SELECT 1 FROM pg_database WHERE datname = '{database}'";
            var exists = await checkCmd.ExecuteScalarAsync();

            if (exists == null)
            {
                await using var createCmd = adminConn.CreateCommand();
                createCmd.CommandText = $"CREATE DATABASE \"{database}\"";
                await createCmd.ExecuteNonQueryAsync();
            }
        }
        finally
        {
            await adminConn.CloseAsync();
        }

        // create schema in the target database
        var builder = new NpgsqlConnectionStringBuilder(baseConnectionString)
        {
            Database = database
        };

        await using var conn = new NpgsqlConnection(builder.ConnectionString);
        await conn.OpenAsync();

        try
        {
            await using var cmd = conn.CreateCommand();
            cmd.CommandText = $"CREATE SCHEMA IF NOT EXISTS \"{schema}\";";
            await cmd.ExecuteNonQueryAsync();
        }
        finally
        {
            await conn.CloseAsync();
        }

        // return connection string scoped to schema
        var tenantBuilder = new NpgsqlConnectionStringBuilder(baseConnectionString)
        {
            Database = database,
            SearchPath = schema
        };

        return tenantBuilder.ConnectionString;
    }
}
