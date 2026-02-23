namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentRankAtDate;

public record GetStudentRankAtDateResponse(string Rank, DateTime? EnrolledDate, DateTime? LastTestDate, string? LastTestNotes, int TotalEventsProcessed);