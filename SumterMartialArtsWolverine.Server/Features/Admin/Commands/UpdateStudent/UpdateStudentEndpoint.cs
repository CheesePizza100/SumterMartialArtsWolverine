using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.UpdateStudent;

public static class UpdateStudentEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("{id}",
                async (int id, UpdateStudentRequest request, IMessageBus messageBus) =>
                {
                    var command = new UpdateStudentCommand(
                        id,
                        request.Name,
                        request.Email,
                        request.Phone
                    );

                    var result = await messageBus.InvokeAsync<UpdateStudentCommandResponse>(command);
                    return result != null
                        ? Results.Ok(result)
                        : Results.NotFound();
                })
            .WithName("UpdateStudent")
            .WithTags("Admin");
    }
}