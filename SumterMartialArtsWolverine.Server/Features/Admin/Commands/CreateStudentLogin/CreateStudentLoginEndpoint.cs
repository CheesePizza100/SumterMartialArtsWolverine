using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.CreateStudentLogin;

public static class CreateStudentLoginEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("{studentId}/create-login",
                async (int studentId, [FromBody] CreateStudentLoginRequest request, IMessageBus messageBus) =>
                {
                    var command = new CreateStudentLoginCommand(
                        studentId,
                        request.Username,
                        request.Password
                    );
                    var result = await messageBus.InvokeAsync<CreateStudentLoginCommandResponse>(command);
                    return Results.Ok(result);
                })
            .WithName("CreateStudentLogin")
            .WithTags("Admin");
    }
}