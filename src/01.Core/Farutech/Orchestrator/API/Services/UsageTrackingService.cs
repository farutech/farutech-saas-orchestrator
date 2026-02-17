using System.Collections.Concurrent;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Farutech.Orchestrator.API.Services;

public interface IUsageTrackingService
{
    Task TrackUsageAsync(string userId, string organizationId, string action, DateTime timestamp, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<MostUsedOrganizationStat>> GetMostUsedAsync(string userId, int limit = 10, CancellationToken cancellationToken = default);
    Task EnsureIndexesAsync(CancellationToken cancellationToken = default);
}

public sealed record MostUsedOrganizationStat(string OrganizationId, long Count, DateTime LastAccessed);

public sealed class MongoUsageTrackingService(IMongoDatabase database, ILogger<MongoUsageTrackingService> logger) : IUsageTrackingService
{
    private const string UsageLogsCollectionName = "usage_logs";
    private const string UserMostUsedCollectionName = "user_most_used";

    private readonly IMongoCollection<UsageLogDocument> _usageLogs = database.GetCollection<UsageLogDocument>(UsageLogsCollectionName);
    private readonly IMongoCollection<UserMostUsedDocument> _userMostUsed = database.GetCollection<UserMostUsedDocument>(UserMostUsedCollectionName);
    private readonly ILogger<MongoUsageTrackingService> _logger = logger;

    public async Task TrackUsageAsync(
        string userId,
        string organizationId,
        string action,
        DateTime timestamp,
        CancellationToken cancellationToken = default)
    {
        var normalizedAction = string.IsNullOrWhiteSpace(action)
            ? UsageActions.View
            : action.Trim().ToUpperInvariant();

        var utcTimestamp = timestamp.Kind == DateTimeKind.Utc
            ? timestamp
            : timestamp.ToUniversalTime();

        await _usageLogs.InsertOneAsync(new UsageLogDocument
        {
            UserId = userId,
            OrganizationId = organizationId,
            Action = normalizedAction,
            Timestamp = utcTimestamp
        }, cancellationToken: cancellationToken);

        var existingEntryFilter = Builders<UserMostUsedDocument>.Filter.And(
            Builders<UserMostUsedDocument>.Filter.Eq(x => x.UserId, userId),
            Builders<UserMostUsedDocument>.Filter.ElemMatch(
                x => x.Organizations,
                x => x.OrganizationId == organizationId)
        );

        var incrementExistingEntry = Builders<UserMostUsedDocument>.Update
            .Inc("organizations.$.count", 1)
            .Set("organizations.$.lastAccessed", utcTimestamp)
            .Set(x => x.UpdatedAt, utcTimestamp);

        var updateExistingResult = await _userMostUsed.UpdateOneAsync(
            existingEntryFilter,
            incrementExistingEntry,
            cancellationToken: cancellationToken);

        if (updateExistingResult.MatchedCount == 0)
        {
            var missingEntryFilter = Builders<UserMostUsedDocument>.Filter.And(
                Builders<UserMostUsedDocument>.Filter.Eq(x => x.UserId, userId),
                Builders<UserMostUsedDocument>.Filter.Not(
                    Builders<UserMostUsedDocument>.Filter.ElemMatch(
                        x => x.Organizations,
                        x => x.OrganizationId == organizationId))
            );

            var pushNewEntry = Builders<UserMostUsedDocument>.Update
                .SetOnInsert(x => x.UserId, userId)
                .Push(x => x.Organizations, new UserMostUsedOrganizationDocument
                {
                    OrganizationId = organizationId,
                    Count = 1,
                    LastAccessed = utcTimestamp
                })
                .Set(x => x.UpdatedAt, utcTimestamp);

            try
            {
                await _userMostUsed.UpdateOneAsync(
                    missingEntryFilter,
                    pushNewEntry,
                    new UpdateOptions { IsUpsert = true },
                    cancellationToken);
            }
            catch (MongoWriteException ex) when (ex.WriteError?.Category == ServerErrorCategory.DuplicateKey)
            {
                // Another request created the user document concurrently; retry increment path.
                await _userMostUsed.UpdateOneAsync(
                    existingEntryFilter,
                    incrementExistingEntry,
                    cancellationToken: cancellationToken);
            }
        }

        _logger.LogInformation(
            "Usage event tracked. UserId={UserId}, OrganizationId={OrganizationId}, Action={Action}, Timestamp={Timestamp}",
            userId,
            organizationId,
            normalizedAction,
            utcTimestamp);
    }

    public async Task<IReadOnlyList<MostUsedOrganizationStat>> GetMostUsedAsync(
        string userId,
        int limit = 10,
        CancellationToken cancellationToken = default)
    {
        var safeLimit = Math.Clamp(limit, 1, 50);

        var userStats = await _userMostUsed
            .Find(x => x.UserId == userId)
            .FirstOrDefaultAsync(cancellationToken);

        if (userStats?.Organizations is not { Count: > 0 })
        {
            return [];
        }

        return userStats.Organizations
            .OrderByDescending(x => x.Count)
            .ThenByDescending(x => x.LastAccessed)
            .Take(safeLimit)
            .Select(x => new MostUsedOrganizationStat(x.OrganizationId, x.Count, x.LastAccessed))
            .ToList();
    }

    public async Task EnsureIndexesAsync(CancellationToken cancellationToken = default)
    {
        var usageLogIndexes = new[]
        {
            new CreateIndexModel<UsageLogDocument>(
                Builders<UsageLogDocument>.IndexKeys
                    .Ascending(x => x.UserId)
                    .Ascending(x => x.OrganizationId),
                new CreateIndexOptions { Name = "idx_usage_logs_user_org" }),
            new CreateIndexModel<UsageLogDocument>(
                Builders<UsageLogDocument>.IndexKeys
                    .Ascending(x => x.UserId)
                    .Descending(x => x.Timestamp),
                new CreateIndexOptions { Name = "idx_usage_logs_user_timestamp" })
        };

        await _usageLogs.Indexes.CreateManyAsync(usageLogIndexes, cancellationToken);

        var mostUsedUserIndex = new CreateIndexModel<UserMostUsedDocument>(
            Builders<UserMostUsedDocument>.IndexKeys.Ascending(x => x.UserId),
            new CreateIndexOptions { Name = "idx_user_most_used_user_unique", Unique = true });

        await _userMostUsed.Indexes.CreateOneAsync(mostUsedUserIndex, cancellationToken: cancellationToken);

        _logger.LogInformation("MongoDB indexes ensured for usage tracking collections");
    }
}

public sealed class UsageIndexInitializerHostedService(
    IUsageTrackingService usageTrackingService,
    ILogger<UsageIndexInitializerHostedService> logger) : IHostedService
{
    private readonly IUsageTrackingService _usageTrackingService = usageTrackingService;
    private readonly ILogger<UsageIndexInitializerHostedService> _logger = logger;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await _usageTrackingService.EnsureIndexesAsync(cancellationToken);
            _logger.LogInformation("Usage tracking indexes initialized");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize usage tracking indexes");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

public sealed class InMemoryUsageTrackingService : IUsageTrackingService
{
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, MostUsedOrganizationStat>> _statsByUser = new();

    public Task TrackUsageAsync(
        string userId,
        string organizationId,
        string action,
        DateTime timestamp,
        CancellationToken cancellationToken = default)
    {
        var utcTimestamp = timestamp.Kind == DateTimeKind.Utc
            ? timestamp
            : timestamp.ToUniversalTime();

        var userStats = _statsByUser.GetOrAdd(userId, _ => new ConcurrentDictionary<string, MostUsedOrganizationStat>());

        userStats.AddOrUpdate(
            organizationId,
            _ => new MostUsedOrganizationStat(organizationId, 1, utcTimestamp),
            (_, current) => current with { Count = current.Count + 1, LastAccessed = utcTimestamp });

        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<MostUsedOrganizationStat>> GetMostUsedAsync(
        string userId,
        int limit = 10,
        CancellationToken cancellationToken = default)
    {
        if (!_statsByUser.TryGetValue(userId, out var userStats))
        {
            return Task.FromResult<IReadOnlyList<MostUsedOrganizationStat>>([]);
        }

        var safeLimit = Math.Clamp(limit, 1, 50);
        var result = userStats.Values
            .OrderByDescending(x => x.Count)
            .ThenByDescending(x => x.LastAccessed)
            .Take(safeLimit)
            .ToList();

        return Task.FromResult<IReadOnlyList<MostUsedOrganizationStat>>(result);
    }

    public Task EnsureIndexesAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;
}

public static class UsageActions
{
    public const string View = "VIEW";
    public const string Access = "ACCESS";
    public const string Select = "SELECT";

    public static readonly HashSet<string> Allowed = new(StringComparer.Ordinal)
    {
        View,
        Access,
        Select
    };
}

[BsonIgnoreExtraElements]
internal sealed class UsageLogDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("organizationId")]
    public string OrganizationId { get; set; } = string.Empty;

    [BsonElement("action")]
    public string Action { get; set; } = UsageActions.View;

    [BsonElement("timestamp")]
    public DateTime Timestamp { get; set; }
}

[BsonIgnoreExtraElements]
internal sealed class UserMostUsedDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("organizations")]
    public List<UserMostUsedOrganizationDocument> Organizations { get; set; } = [];

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

[BsonIgnoreExtraElements]
internal sealed class UserMostUsedOrganizationDocument
{
    [BsonElement("organizationId")]
    public string OrganizationId { get; set; } = string.Empty;

    [BsonElement("count")]
    public long Count { get; set; }

    [BsonElement("lastAccessed")]
    public DateTime LastAccessed { get; set; }
}
