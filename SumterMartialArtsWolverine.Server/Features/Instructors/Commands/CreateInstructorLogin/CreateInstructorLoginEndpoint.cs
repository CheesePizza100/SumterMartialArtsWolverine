using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.CreateInstructorLogin;

public static class CreateInstructorLoginEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("{instructorId}/create-login",
                async (int instructorId, [FromBody] CreateInstructorLoginRequest request, IMessageBus messageBus) =>
                {
                    var command = new CreateInstructorLoginCommand(
                        instructorId,
                        request.Username,
                        request.Password
                    );
                    var result = await messageBus.InvokeAsync<CreateInstructorLoginResponse>(command);
                    return Results.Ok(result);
                })
            .WithName("CreateInstructorLogin")
            .WithTags("Instructors");
    }
}
