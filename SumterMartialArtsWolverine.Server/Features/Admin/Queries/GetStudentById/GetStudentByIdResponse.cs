using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentById;

public record GetStudentByIdResponse(
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
        Phone,
        Programs,
        TestHistory
    };
}
public record ProgramEnrollmentDto(
    int ProgramId,
    string Name,
    string Rank,
    DateTime EnrolledDate,
    DateTime? LastTest,
    string? TestNotes,
    AttendanceDto Attendance
);
public record TestHistoryDto(
    DateTime Date,
    string Program,
    string Rank,
    string Result,
    string Notes
);
public record AttendanceDto(
    int Last30Days,
    int Total,
    int AttendanceRate
);