using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.RecordAttendance;

public record InstructorRecordAttendanceRequest(int ProgramId, int ClassesAttended);

public record InstructorRecordAttendanceCommand( int StudentId, int ProgramId, int ClassesAttended) : IAuditableCommand
{
    public string Action => AuditActions.InstructorRecordedAttendance;
    public string EntityType => "Attendance";
}