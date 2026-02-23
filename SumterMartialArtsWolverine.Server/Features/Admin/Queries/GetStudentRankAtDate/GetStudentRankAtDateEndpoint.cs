using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentRankAtDate;

public class GetStudentRankAtDateEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("{studentId}/programs/{programId}/rank-at-date",
                async (int studentId, int programId, DateTime asOfDate, IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<GetStudentRankAtDateResponse>(new GetStudentRankAtDateQuery(studentId, programId, asOfDate));

                    return result != null
                        ? Results.Ok(result)
                        : Results.NotFound();
                })
            .WithName("GetStudentRankAtDate")
            .WithTags("Students - Event Sourcing");
    }
}