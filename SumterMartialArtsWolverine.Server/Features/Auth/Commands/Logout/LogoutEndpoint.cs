using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Logout;

public static class LogoutEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("logout",
                async (IMessageBus messageBus) =>
                {
                    var command = new LogoutCommand();
                    await messageBus.InvokeAsync<LogoutCommandResponse>(command);
                    return Results.Ok(new { message = "Logged out successfully" });
                })
            .RequireAuthorization()
            .WithName("Logout")
            .WithTags("Authorization");
    }
}