using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Programs.Queries.GetPrograms;

public static class GetProgramsEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("",
                async (IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<List<GetProgramsResponse>>(new GetProgramsQuery());
                    return Results.Ok(result);
                })
            .WithName("GetPrograms")
            .WithTags("Programs");
    }
}