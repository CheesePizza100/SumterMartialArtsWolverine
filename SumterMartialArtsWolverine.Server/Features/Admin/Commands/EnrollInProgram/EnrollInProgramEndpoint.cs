using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.EnrollInProgram;

public static class EnrollInProgramEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("{id}/enroll",
                async (int id, EnrollInProgramRequest request, IMessageBus messageBus) =>
                {
                    var command = new EnrollInProgramCommand(
                        id,
                        request.ProgramId,
                        request.ProgramName,
                        request.InitialRank
                    );

                    var result = await messageBus.InvokeAsync<EnrollInProgramCommandResponse>(command);
                    return result.Success
                        ? Results.Ok(new { success = true, message = result.Message })
                        : Results.BadRequest(new { success = false, message = result.Message });
                })
            .WithName("EnrollInProgram")
            .WithTags("Admin");
    }
}