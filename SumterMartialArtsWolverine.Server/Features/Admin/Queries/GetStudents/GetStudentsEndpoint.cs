using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudents;

public class GetStudentsEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("",
                async (IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<List<GetStudentsResponse>>(new GetStudentsQuery());
                    return Results.Ok(result);
                })
            .WithName("GetStudents")
            .WithTags("Admin");
    }
}
