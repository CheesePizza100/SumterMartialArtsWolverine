using SumterMartialArtsWolverine.Server.Api.Features.PrivateLessons.Queries.GetPrivateLessons;
using SumterMartialArtsWolverine.Server.Api.Features.PrivateLessons.Commands.SubmitPrivateLesson;
using SumterMartialArtsWolverine.Server.Api.Features.PrivateLessons.Commands.UpdatePrivateLesson;

namespace SumterMartialArtsWolverine.Server.Api.EndpointConfigurations;

public static class PrivateLessonEndpoints
{
    public static void Map(RouteGroupBuilder api)
    {
        // Private Lessons - Public
        var privateLessons = api.MapGroup("/private-lessons");
        SubmitPrivateLessonRequestEndpoint.MapEndpoint(privateLessons);

        // Private Lessons - Admin/Instructor Only
        var privateLessonsAuth = api.MapGroup("/private-lessons")
            .RequireAuthorization("InstructorOrAdmin");
        GetPrivateLessonsEndpoint.MapEndpoint(privateLessonsAuth);
        UpdatePrivateLessonRequestStatusEndpoint.MapEndpoint(privateLessonsAuth);
    }
}