using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetInstructors;

public class GetInstructorsEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("",
                async (IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<List<GetInstructorsResponse>>(new GetInstructorsQuery());

                    return Results.Ok(result);
                })
            .WithName("GetInstructors")
            .WithTags("Instructors");
    }
}