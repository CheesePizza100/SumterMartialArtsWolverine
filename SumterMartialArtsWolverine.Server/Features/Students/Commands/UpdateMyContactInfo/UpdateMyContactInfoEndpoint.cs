using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Students.Commands.UpdateMyContactInfo;

public static class UpdateMyContactInfoEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("me",
                async ([FromBody] UpdateMyContactInfoRequest request, IMessageBus messageBus) =>
                {
                    var command = new UpdateMyContactInfoCommand(
                        request.Name,
                        request.Email,
                        request.Phone
                    );
                    var result = await messageBus.InvokeAsync<UpdateMyContactInfoCommandResponse>(command);
                    return Results.Ok(result);
                })
            .WithName("UpdateMyContactInfo")
            .WithTags("Students");
    }
}
