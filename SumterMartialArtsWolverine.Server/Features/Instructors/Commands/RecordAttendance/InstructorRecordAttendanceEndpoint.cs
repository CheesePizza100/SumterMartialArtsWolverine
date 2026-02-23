using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.RecordAttendance;

public static class InstructorRecordAttendanceEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("me/students/{studentId}/attendance",
                async (int studentId, [FromBody] InstructorRecordAttendanceRequest request, IMessageBus messageBus) =>
                {
                    var command = new InstructorRecordAttendanceCommand(
                        studentId,
                        request.ProgramId,
                        request.ClassesAttended
                    );
                    var result = await messageBus.InvokeAsync<InstructorRecordAttendanceResponse>(command);
                    return result.Success
                        ? Results.Ok(new { success = true, message = result.Message })
                        : Results.NotFound(new { success = false, message = result.Message });
                })
            .WithName("InstructorRecordAttendance")
            .WithTags("Instructors");
    }
}
