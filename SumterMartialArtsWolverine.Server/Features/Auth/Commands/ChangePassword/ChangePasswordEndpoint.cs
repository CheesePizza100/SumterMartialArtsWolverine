using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.ChangePassword;

public static class ChangePasswordEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("change-password",
                async ([FromBody] ChangePasswordRequest request, IMessageBus messageBus) =>
                {
                    var command = new ChangePasswordCommand(
                        request.CurrentPassword,
                        request.NewPassword
                    );
                    var result = await messageBus.InvokeAsync<ChangePasswordCommandResponse>(command);
                    return Results.Ok(result);
                })
            .RequireAuthorization()
            .WithName("ChangePassword")
            .WithTags("Authorization");
    }
}