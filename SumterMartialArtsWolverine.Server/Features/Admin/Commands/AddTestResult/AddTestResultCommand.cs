using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.AddTestResult;

public record AddTestResultRequest(
    int ProgramId,
    string ProgramName,
    string Rank,
    string Result,
    string Notes,
    DateTime TestDate
);

public record AddTestResultCommand(
    int StudentId,
    int ProgramId,
    string ProgramName,
    string Rank,
    string Result,
    string Notes,
    DateTime TestDate
) : IAuditableCommand
{
    public string Action => AuditActions.TestResultAdded;
    public string EntityType => "TestResult";
}