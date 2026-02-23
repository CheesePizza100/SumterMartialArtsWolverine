using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.UpdateProgramNotes;

public static class InstructorUpdateNotesEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("me/students/{studentId}/programs/{programId}/notes",
                async (int studentId, int programId, [FromBody] InstructorUpdateNotesRequest request, IMessageBus messageBus) =>
                {
                    var command = new InstructorUpdateNotesCommand(studentId, programId, request.Notes);
                    var result = await messageBus.InvokeAsync<InstructorUpdateNotesResponse>(command);
                    return result.Success
                        ? Results.Ok(new { success = true, message = result.Message })
                        : Results.NotFound(new { success = false, message = result.Message });
                })
            .WithName("InstructorUpdateNotes")
            .WithTags("Instructors");
    }
}
