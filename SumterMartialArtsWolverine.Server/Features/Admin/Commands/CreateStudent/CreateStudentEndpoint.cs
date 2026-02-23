using Wolverine;
using SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetStudentById;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.CreateStudent;

public static class CreateStudentEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("",
                async (CreateStudentRequest request, IMessageBus messageBus) =>
                {
                    var command = new CreateStudentCommand(
                        request.Name,
                        request.Email,
                        request.Phone
                    );

                    var result = await messageBus.InvokeAsync<GetStudentByIdResponse>(command);
                    return Results.Created($"/api/students/{result.Id}", result);
                })
            .WithName("CreateStudent")
            .WithTags("Admin");
    }
}