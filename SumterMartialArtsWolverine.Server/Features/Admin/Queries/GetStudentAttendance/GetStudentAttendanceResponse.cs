namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentAttendance;

public record GetStudentAttendanceResponse(int Last30Days, int Total, int AttendanceRate);