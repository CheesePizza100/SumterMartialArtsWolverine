namespace SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetMyPrivateLessonRequests;

public record PrivateLessonRequestResponse(
    int Id,
    int InstructorId,
    string InstructorName,
    DateTime RequestedStart,
    DateTime RequestedEnd,
    string Status,
    string? Notes,
    string? RejectionReason,
    DateTime CreatedAt
);