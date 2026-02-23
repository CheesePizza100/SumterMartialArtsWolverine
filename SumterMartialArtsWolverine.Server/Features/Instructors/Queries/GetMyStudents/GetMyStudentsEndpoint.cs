using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetMyStudents;

public static class GetMyStudentsEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("me/students",
                async (IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<InstructorStudentDto>(new GetMyStudentsQuery());
                    return Results.Ok(result);
                })
            .WithName("GetMyStudents")
            .WithTags("Instructors");
    }
}