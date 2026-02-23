using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.RecordTestResult;

public record InstructorRecordTestRequest(
    int ProgramId,
    string ProgramName,
    string Rank,
    string Result,
    string Notes,
    DateTime TestDate
);

public record InstructorRecordTestCommand(
    int StudentId,
    int ProgramId,
    string ProgramName,
    string Rank,
    string Result,
    string Notes,
    DateTime TestDate
) : IAuditableCommand
{
    public string Action => AuditActions.InstructorRecordedTest;
    public string EntityType => "TestResult";
}