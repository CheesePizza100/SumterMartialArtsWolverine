using SumterMartialArtsWolverine.Server.Domain.Common;

namespace SumterMartialArtsWolverine.Server.Domain.Events;

public record PrivateLessonRequestCreated(
    int RequestId,
    int InstructorId,
    string StudentName,
    string StudentEmail,
    DateTime RequestedStart,
    DateTime RequestedEnd
) : IDomainEvent
{
    public DateTime OccurredOn { get; init; } = DateTime.UtcNow;
}
