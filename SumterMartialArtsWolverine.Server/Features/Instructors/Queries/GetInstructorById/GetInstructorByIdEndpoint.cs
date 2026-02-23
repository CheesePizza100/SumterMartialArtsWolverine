using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetInstructorById;

public class GetInstructorByIdEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("{id:int}",
                async (int id, IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<GetInstructorByIdResponse>(new GetInstructorByIdQuery(id));

                    return result is not null
                        ? Results.Ok(result)
                        : Results.NotFound();
                })
            .WithName("GetInstructorById")
            .WithTags("Instructors");
    }
}