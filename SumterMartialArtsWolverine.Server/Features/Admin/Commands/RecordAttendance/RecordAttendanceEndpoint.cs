using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.RecordAttendance;

public static class RecordAttendanceEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/students/{id}/attendance",
                async (int id, RecordAttendanceRequest request, IMessageBus messageBus) =>
                {
                    var command = new RecordAttendanceCommand(
                        id,
                        request.ProgramId,
                        request.ClassesAttended
                    );

                    var result = await messageBus.InvokeAsync<RecordAttendanceCommandResponse>(command);
                    return result.Success
                        ? Results.Ok(new { success = true, message = result.Message })
                        : Results.BadRequest(new { success = false, message = result.Message });
                })
            .WithName("RecordAttendance")
            .WithTags("Admin");
    }
}