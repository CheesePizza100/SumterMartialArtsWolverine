using System.Security.Claims;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetMyPrivateLessonRequests;

public static class GetMyPrivateLessonRequestsEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("me/private-lessons",
                async (IMessageBus messageBus, ClaimsPrincipal user) =>
                {
                    var studentIdClaim = user.FindFirst("StudentId")?.Value;
                    if (studentIdClaim == null)
                    {
                        return Results.BadRequest("Student ID not found");
                    }

                    var studentId = int.Parse(studentIdClaim);
                    var result = await messageBus.InvokeAsync<PrivateLessonRequestResponse>(new GetMyPrivateLessonRequestsQuery(studentId));
                    return Results.Ok(result);
                })
            .RequireAuthorization("StudentOnly")
            .WithName("GetMyPrivateLessonRequests")
            .WithTags("Students");
    }
}