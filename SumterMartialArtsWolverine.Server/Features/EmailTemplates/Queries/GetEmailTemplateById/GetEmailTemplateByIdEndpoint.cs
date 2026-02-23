using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Queries.GetEmailTemplateById;

public static class GetEmailTemplateByIdEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("{id}",
                async (int id, IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<EmailTemplateDetailResponse>(new GetEmailTemplateByIdQuery(id));
                    return result != null
                        ? Results.Ok(result)
                        : Results.NotFound();
                })
            .WithName("GetEmailTemplateById")
            .WithTags("Admin");
    }
}