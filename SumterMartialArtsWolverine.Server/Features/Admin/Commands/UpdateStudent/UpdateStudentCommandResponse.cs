using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Api.Features.Students.Shared;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.UpdateStudent;

public record UpdateStudentCommandResponse(
    int Id,
    string Name,
    string Email,
    string Phone,
    List<ProgramEnrollmentDto> Programs,
    List<TestHistoryDto> TestHistory
) : IAuditableResponse
{
    public string EntityId => Id.ToString();

    public object GetAuditDetails() => new
    {
        Name,
        Email,
        Phone
    };
}