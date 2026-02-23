using SumterMartialArtsWolverine.Server.Domain.Common;

namespace SumterMartialArtsWolverine.Server.Domain.Events;

public record StudentLoginCreated(
    int StudentId,
    string StudentName,
    string StudentEmail,
    string UserName,
    string TemporaryPassword,
    DateTime CreatedAt
) : IDomainEvent
{
    public DateTime OccurredOn { get; init; } = DateTime.UtcNow;
}
