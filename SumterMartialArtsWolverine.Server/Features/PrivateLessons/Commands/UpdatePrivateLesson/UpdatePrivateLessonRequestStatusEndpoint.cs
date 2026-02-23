using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.PrivateLessons.Commands.UpdatePrivateLesson;

public static class UpdatePrivateLessonRequestStatusEndpoint
{
    public static void MapEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPatch("{id}/status", async (
                int id,
                [FromBody] UpdateStatusRequest request,
                IMessageBus messageBus,
                CancellationToken cancellationToken) =>
            {
                var command = new UpdatePrivateLessonStatusCommand(id, request.Status, request.RejectionReason);
                var response = await messageBus.InvokeAsync<UpdatePrivateLessonStatusResponse>(command);
                return response.Success
                    ? Results.Ok(response)
                    : Results.BadRequest(response);
            })
            .WithName("UpdatePrivateLessonRequestStatus")
            .WithTags("PrivateLessons");
    }
}