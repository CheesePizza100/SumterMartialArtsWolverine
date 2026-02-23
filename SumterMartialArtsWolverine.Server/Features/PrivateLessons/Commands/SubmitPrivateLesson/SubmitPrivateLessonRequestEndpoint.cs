using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.PrivateLessons.Commands.SubmitPrivateLesson;

public static class SubmitPrivateLessonRequestEndpoint
{
    public static void MapEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPost("", async (
                [FromBody] SubmitPrivateLessonCommand request,
                IMessageBus messageBus,
                CancellationToken cancellationToken) =>
            {
                var response = await messageBus.InvokeAsync<SubmitPrivateLessonResponse>(request);
                return Results.Ok(response);
            })
            .WithName("SubmitPrivateLessonCommand")
            .WithTags("PrivateLessons");
    }
}