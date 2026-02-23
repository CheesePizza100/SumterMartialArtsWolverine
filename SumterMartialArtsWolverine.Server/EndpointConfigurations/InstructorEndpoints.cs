using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.CreateInstructorLogin;
using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetInstructorAvailability;
using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetInstructorById;
using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetInstructors;
using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetMyProfile;
using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetMyStudents;
using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetStudentDetail;
using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.RecordAttendance;
using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.RecordTestResult;
using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.UpdateProgramNotes;

namespace SumterMartialArtsWolverine.Server.Api.EndpointConfigurations;

public static class InstructorEndpoints
{
    public static void Map(RouteGroupBuilder api)
    {
        // Instructors - Public
        var instructors = api.MapGroup("/instructors");
        GetInstructorsEndpoint.MapEndpoint(instructors);
        GetInstructorByIdEndpoint.MapEndpoint(instructors);
        GetInstructorAvailabilityEndpoint.MapEndpoint(instructors);

        // Instructors - Instructor Role Only
        var instructorsAuth = api.MapGroup("/instructors")
            .RequireAuthorization("InstructorOrAdmin");
        GetInstructorProfileEndpoint.MapEndpoint(instructorsAuth);
        InstructorRecordTestEndpoint.MapEndpoint(instructorsAuth);
        InstructorRecordAttendanceEndpoint.MapEndpoint(instructorsAuth);
        InstructorUpdateNotesEndpoint.MapEndpoint(instructorsAuth);
        GetMyStudentsEndpoint.MapEndpoint(instructorsAuth);
        GetStudentDetailEndpoint.MapEndpoint(instructorsAuth);

        // Instructors - Admin Only
        var instructorsAdmin = api.MapGroup("/instructors")
            .RequireAuthorization("AdminOnly");
        CreateInstructorLoginEndpoint.MapEndpoint(instructorsAdmin);
    }
}