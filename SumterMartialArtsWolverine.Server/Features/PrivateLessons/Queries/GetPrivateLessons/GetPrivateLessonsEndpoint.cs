using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.PrivateLessons.Queries.GetPrivateLessons;

public static class GetPrivateLessonsEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("", async (
                [FromQuery] string filter,
                IMessageBus messageBus,
                CancellationToken cancellationToken) =>
            {
                var query = new GetPrivateLessonsQuery(filter ?? "Pending");
                var response = await messageBus.InvokeAsync<List<GetPrivateLessonsResponse>>(query);
                return Results.Ok(response);
            })
            .WithName("GetPrivateLessons")
            .WithTags("PrivateLessons");
    }
}