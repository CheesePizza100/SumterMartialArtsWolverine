using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Login;

public static class LoginEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("login",
                async ([FromBody] LoginRequest request, IMessageBus messageBus) =>
                {
                    var command = new LoginCommand(request.UserName, request.Password);
                    var result = await messageBus.InvokeAsync<LoginCommandResponse>(command);
                    return Results.Ok(result);
                })
            .WithName("Login")
            .WithTags("Authorization");
    }
}