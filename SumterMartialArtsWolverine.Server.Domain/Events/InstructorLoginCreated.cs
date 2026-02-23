using SumterMartialArtsWolverine.Server.Domain.Common;

namespace SumterMartialArtsWolverine.Server.Domain.Events;

public record InstructorLoginCreated(
    int InstructorId,
    string InstructorName,
    string InstructorEmail,
    string Username,
    string TemporaryPassword
) : IDomainEvent
{
    public DateTime OccurredOn { get; init; } = DateTime.UtcNow;
}
