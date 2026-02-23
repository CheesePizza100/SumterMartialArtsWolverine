namespace SumterMartialArtsWolverine.Server.Api.Features.PrivateLessons.Commands.SubmitPrivateLesson;

// missing IAuditableCommand
public record SubmitPrivateLessonCommand(
    int InstructorId,
    string StudentName,
    string StudentEmail,
    string? StudentPhone,
    DateTime RequestedStart,
    DateTime RequestedEnd,
    string? Notes);