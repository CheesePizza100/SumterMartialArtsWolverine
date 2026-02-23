using System.Security.Claims;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetStudentById;

public static class GetStudentByIdEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("{id}",
                async (int id, IMessageBus messageBus, ClaimsPrincipal user) =>
                {
                    if (!user.IsInRole("Admin"))
                    {
                        var userStudentIdClaim = user.FindFirst("StudentId")?.Value;

                        if (userStudentIdClaim == null || int.Parse(userStudentIdClaim) != id)
                        {
                            return Results.Forbid();
                        }
                    }
                    var result = await messageBus.InvokeAsync<GetStudentByIdResponse>(new GetStudentByIdQuery(id));
                    return result is not null
                        ? Results.Ok(result)
                        : Results.NotFound();
                })
            .RequireAuthorization()
            .WithName("GetStudentById")
            .WithTags("Students");
    }
}