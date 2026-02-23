using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Programs.Queries.GetProgramById;

public class GetProgramByIdEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("{id:int}",
                async (int id, IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<GetProgramByIdResponse>(new GetProgramByIdQuery(id));

                    return result is not null
                        ? Results.Ok(result)
                        : Results.NotFound();
                })
            .WithName("GetProgramById")
            .WithTags("Programs");
    }
}