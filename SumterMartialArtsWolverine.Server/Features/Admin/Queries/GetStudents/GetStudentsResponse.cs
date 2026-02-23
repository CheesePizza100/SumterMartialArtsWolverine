using SumterMartialArtsWolverine.Server.Api.Features.Students.Shared;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudents;

public record GetStudentsResponse(
    int Id,
    string Name,
    string Email,
    string Phone,
    bool HasLogin,
    List<ProgramEnrollmentDto> Programs,
    List<TestHistoryDto> TestHistory
);
