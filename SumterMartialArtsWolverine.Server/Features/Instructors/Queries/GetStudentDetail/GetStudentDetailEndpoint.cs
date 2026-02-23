using SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetMyStudents;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetStudentDetail;

public static class GetStudentDetailEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("me/students/{studentId}",
                async (int studentId, IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<InstructorStudentDto>(new GetStudentDetailQuery(studentId));
                    return Results.Ok(result);
                })
            .WithName("GetStudentDetail")
            .WithTags("Instructors");
    }
}