using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Commands.UpdateEmailTemplate;

public static class UpdateEmailTemplateEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("{id}",
                async (int id, [FromBody] UpdateEmailTemplateRequest request, IMessageBus messageBus) =>
                {
                    var command = new UpdateEmailTemplateCommand(
                        id,
                        request.Name,
                        request.Subject,
                        request.Body,
                        request.Description
                    );
                    var result = await messageBus.InvokeAsync<UpdateEmailTemplateResponse>(command);
                    return result.Success
                        ? Results.Ok(new { success = true, message = result.Message })
                        : Results.BadRequest(new { success = false, message = result.Message });
                })
            .WithName("UpdateEmailTemplate")
            .WithTags("Admin");
    }
}