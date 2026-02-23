using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Queries.GetEmailTemplates;

public static class GetEmailTemplatesEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("",
                async (IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<List<EmailTemplateResponse>>(new GetEmailTemplatesQuery());
                    return Results.Ok(result);
                })
            .WithName("GetEmailTemplates")
            .WithTags("Admin");
    }
}