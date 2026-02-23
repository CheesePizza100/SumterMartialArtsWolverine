namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentEventStream;

public record GetStudentEventStreamResponse(
    Guid EventId,
    string EventType,
    DateTime OccurredAt,
    int Version,
    string EventData // JSON string
);