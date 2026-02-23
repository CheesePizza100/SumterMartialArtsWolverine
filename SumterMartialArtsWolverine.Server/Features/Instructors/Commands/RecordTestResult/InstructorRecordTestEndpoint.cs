using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.RecordTestResult;

public static class InstructorRecordTestEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("me/students/{studentId}/test-results",
                async (int studentId, [FromBody] InstructorRecordTestRequest request, IMessageBus messageBus) =>
                {
                    var command = new InstructorRecordTestCommand(
                        studentId,
                        request.ProgramId,
                        request.ProgramName,
                        request.Rank,
                        request.Result,
                        request.Notes,
                        request.TestDate
                    );
                    var result = await messageBus.InvokeAsync<InstructorRecordTestResponse>(command);
                    return result.Success
                        ? Results.Ok(new { success = true, message = result.Message })
                        : Results.NotFound(new { success = false, message = result.Message });
                })
            .WithName("InstructorRecordTest")
            .WithTags("Instructors");
    }
}
