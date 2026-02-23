using SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetMyPrivateLessonRequests;
using SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetMyProfile;
using SumterMartialArtsWolverine.Server.Api.Features.Students.Commands.UpdateMyContactInfo;

namespace SumterMartialArtsWolverine.Server.Api.EndpointConfigurations;

public static class StudentEndpoints
{
    public static void Map(RouteGroupBuilder api)
    {
        // Students - Student Portal (viewing own data)
        var studentsAuth = api.MapGroup("/students")
            .RequireAuthorization("StudentOnly");
        GetMyPrivateLessonRequestsEndpoint.MapEndpoint(studentsAuth);
        GetMyProfileEndpoint.MapEndpoint(studentsAuth);
        UpdateMyContactInfoEndpoint.MapEndpoint(studentsAuth);
    }
}