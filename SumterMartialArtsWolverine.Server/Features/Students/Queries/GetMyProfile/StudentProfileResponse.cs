using SumterMartialArtsWolverine.Server.Api.Features.Students.Shared;

namespace SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetMyProfile;

public record StudentProfileResponse(
    int Id,
    string Name,
    string Email,
    string Phone,
    List<ProgramEnrollmentDto> Programs,
    List<TestHistoryDto> TestHistory
);