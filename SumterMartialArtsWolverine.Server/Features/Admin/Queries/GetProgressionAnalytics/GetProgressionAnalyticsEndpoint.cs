using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetProgressionAnalytics;

public static class GetProgressionAnalyticsEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("analytics/progression",
                async (IMessageBus messageBus, int? programId = null) =>
                {
                    var result = await messageBus.InvokeAsync<GetProgressionAnalyticsResponse>(new GetProgressionAnalyticsQuery(programId));
                    return Results.Ok(result);
                })
            .WithName("GetProgressionAnalytics")
            .WithTags("Students - Event Sourcing");
    }
}
