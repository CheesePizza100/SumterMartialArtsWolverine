using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.StudentSearch;

public class StudentSearchEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("search",
                async (string q, IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<List<GetStudentSearchResponse>>(new StudentSearchQuery(q));
                    return Results.Ok(result);
                })
            .WithName("StudentSearch")
            .WithTags("Admin");
    }
}