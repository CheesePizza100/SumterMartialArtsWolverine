using Microsoft.ApplicationInsights;
using SumterMartialArtsWolverine.Server.Domain.Common;
using SumterMartialArtsWolverine.Server.Services.Telemetry;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Middleware;

public class DomainEventTelemetryMiddleware
{
    private readonly TelemetryClient _telemetry;
    private readonly IServiceProvider _serviceProvider;

    public DomainEventTelemetryMiddleware(
        TelemetryClient telemetry,
        IServiceProvider serviceProvider)
    {
        _telemetry = telemetry;
        _serviceProvider = serviceProvider;
    }

    public Task BeforeAsync(IDomainEvent domainEvent, IMessageContext context)
    {
        var eventType = domainEvent.GetType().Name;

        var properties = new Dictionary<string, string>
        {
            ["OccurredOn"] = domainEvent.OccurredOn.ToString("O"),
            ["EventType"] = eventType
        };

        // Resolve enrichers for the concrete event type
        var enricherType = typeof(IDomainEventTelemetryEnricher<>)
            .MakeGenericType(domainEvent.GetType());

        var enrichers = (IEnumerable<object>)_serviceProvider
            .GetService(typeof(IEnumerable<>).MakeGenericType(enricherType))!;

        foreach (dynamic enricher in enrichers)
        {
            enricher.Enrich((dynamic)domainEvent, properties);
        }

        _telemetry.TrackEvent(eventType, properties);

        return Task.CompletedTask;
    }
}
