using SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Queries.GetEmailTemplateById;
using SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Queries.GetEmailTemplates;
using SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Commands.UpdateEmailTemplate;

namespace SumterMartialArtsWolverine.Server.Api.EndpointConfigurations;

public static class EmailTemplatesEndpoints
{
    public static void Map(RouteGroupBuilder api)
    {
        var adminEmailTemplates = api.MapGroup("/admin/email-templates")
            .RequireAuthorization("AdminOnly");
        GetEmailTemplatesEndpoint.MapEndpoint(adminEmailTemplates);
        GetEmailTemplateByIdEndpoint.MapEndpoint(adminEmailTemplates);
        UpdateEmailTemplateEndpoint.MapEndpoint(adminEmailTemplates);
    }
}