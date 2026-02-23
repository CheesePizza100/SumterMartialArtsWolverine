using SumterMartialArtsWolverine.Server.Api.Features.Students.Shared;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetMyStudents;

public record GetMyStudentsQuery;
public record InstructorStudentDto(
    int Id,
    string Name,
    string Email,
    string Phone,
    List<StudentProgramDto> Programs,
    List<TestHistoryDto> TestHistory
);
public record StudentProgramDto(
    int ProgramId,
    string ProgramName,
    string CurrentRank,
    DateTime EnrolledDate,
    DateTime? LastTestDate,
    string? InstructorNotes,
    AttendanceDto Attendance
);