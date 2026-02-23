using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetMyProfile;

public static class GetInstructorProfileEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("me",
                async (IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<InstructorProfileResponse>(new GetInstructorProfileQuery());
                    return Results.Ok(result);
                })
            .WithName("GetInstructorProfile")
            .WithTags("Instructors");
    }
}