using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentEventStream;

public class GetStudentEventStreamEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("{studentId}/programs/{programId}/events",
                async (int studentId, int programId, IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<List<GetStudentEventStreamResponse>>(new GetStudentEventStreamQuery(studentId, programId));
                    return Results.Ok(result);
                })
            .WithName("GetStudentEventStream")
            .WithTags("Students - Event Sourcing");
    }
}