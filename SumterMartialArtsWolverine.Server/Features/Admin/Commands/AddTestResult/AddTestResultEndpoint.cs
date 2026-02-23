using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.AddTestResult;

public static class AddTestResultEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("{id}/test-results",
                async (int id, AddTestResultRequest request, IMessageBus messageBus) =>
                {
                    var command = new AddTestResultCommand(
                        id,
                        request.ProgramId,
                        request.ProgramName,
                        request.Rank,
                        request.Result,
                        request.Notes,
                        request.TestDate
                    );

                    var result = await messageBus.InvokeAsync<AddTestResultResponse>(command);
                    return result.Success
                        ? Results.Ok(new { success = true, message = result.Message })
                        : Results.NotFound(new { success = false, message = result.Message });
                })
            .WithName("AddTestResult")
            .WithTags("Admin");
    }
}