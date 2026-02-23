namespace SumterMartialArtsWolverine.Server.Api.Features.PrivateLessons.Commands.UpdatePrivateLesson;

public record UpdateStatusRequest(string Status, string RejectionReason);

public record UpdatePrivateLessonStatusCommand(int Id, string Status, string RejectionReason);