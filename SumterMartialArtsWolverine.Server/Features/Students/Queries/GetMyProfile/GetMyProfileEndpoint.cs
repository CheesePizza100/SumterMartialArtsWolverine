using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetMyProfile;

public static class GetMyProfileEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("me",
                async (IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<StudentProfileResponse>(new GetMyProfileQuery());
                    return Results.Ok(result);
                })
            .RequireAuthorization()
            .WithName("GetMyProfile")
            .WithTags("Students");
    }
}