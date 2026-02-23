using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.DeactivateStudent;

public static class DeactivateStudentEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/students/{id}",
                async (int id, IMessageBus messageBus) =>
                {
                    var command = new DeactivateStudentCommand(id);
                    var result = await messageBus.InvokeAsync<DeactivateStudentCommandResponse>(command);

                    return result.Success
                        ? Results.Ok(new { success = true, message = result.Message })
                        : Results.BadRequest(new { success = false, message = result.Message });
                })
            .RequireAuthorization()
            .WithName("DeactivateStudent")
            .WithTags("Admin");
    }
}