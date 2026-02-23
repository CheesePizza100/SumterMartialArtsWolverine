using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentAttendance;

public class GetStudentAttendanceEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("{id}/attendance",
                async (int id, int programId, IMessageBus messageBus) =>
                {
                    var result = await messageBus.InvokeAsync<GetStudentAttendanceResponse>(new GetStudentAttendanceQuery(id, programId));
                    return result != null
                        ? Results.Ok(result)
                        : Results.NotFound();
                })
            .WithName("GetStudentAttendance")
            .WithTags("Admin");
    }
}