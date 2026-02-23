using SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.AddTestResult;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.CreateStudent;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.CreateStudentLogin;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.EnrollInProgram;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetProgressionAnalytics;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentAttendance;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentEventStream;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentRankAtDate;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudents;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.StudentSearch;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.UpdateStudent;

namespace SumterMartialArtsWolverine.Server.Api.EndpointConfigurations;

public static class AdminEndpoints
{
    public static void Map(RouteGroupBuilder api)
    {
        // Admin - Student Management
        var adminStudents = api.MapGroup("/admin/students")
            .RequireAuthorization("AdminOnly");
        //GetStudentByIdEndpoint.MapEndpoint(adminStudents);
        GetStudentsEndpoint.MapEndpoint(adminStudents);
        StudentSearchEndpoint.MapEndpoint(adminStudents);
        UpdateStudentEndpoint.MapEndpoint(adminStudents);
        CreateStudentEndpoint.MapEndpoint(adminStudents);
        GetStudentAttendanceEndpoint.MapEndpoint(adminStudents);
        AddTestResultEndpoint.MapEndpoint(adminStudents);
        GetStudentEventStreamEndpoint.MapEndpoint(adminStudents);
        GetStudentRankAtDateEndpoint.MapEndpoint(adminStudents);
        EnrollInProgramEndpoint.MapEndpoint(adminStudents);
        CreateStudentLoginEndpoint.MapEndpoint(adminStudents);
        GetProgressionAnalyticsEndpoint.MapEndpoint(adminStudents);
    }
}