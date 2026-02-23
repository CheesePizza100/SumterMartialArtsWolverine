namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentRankAtDate;

public record GetStudentRankAtDateQuery(int StudentId, int ProgramId, DateTime AsOfDate);