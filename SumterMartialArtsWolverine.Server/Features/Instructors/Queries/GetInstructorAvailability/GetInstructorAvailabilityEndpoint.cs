using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetInstructorAvailability;

public class GetInstructorAvailabilityEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("{id:int}/availability",
                async (int id, IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<GetInstructorAvailabilityResponse>(new GetInstructorAvailabilityQuery(id));

                    return result is null
                        ? Results.NotFound()
                        : Results.Ok(result);
                })
            .WithName("GetInstructorAvailability")
            .WithTags("Instructors");
    }
}