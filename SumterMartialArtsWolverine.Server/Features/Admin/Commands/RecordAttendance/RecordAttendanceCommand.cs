using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.RecordAttendance;

public record RecordAttendanceRequest(int ProgramId, int ClassesAttended);

public record RecordAttendanceCommand( int StudentId, int ProgramId, int ClassesAttended) : IAuditableCommand
{
    public string Action => AuditActions.AttendanceRecorded;
    public string EntityType => "Attendance";
}