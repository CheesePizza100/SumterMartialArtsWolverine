using SumterMartialArtsWolverine.Server.Domain.Common;

namespace SumterMartialArtsWolverine.Server.Services.Telemetry;

public interface IDomainEventTelemetryEnricher<in TEvent>
    where TEvent : IDomainEvent
{
    void Enrich(TEvent domainEvent, IDictionary<string, string> properties);
}