using SumterMartialArtsWolverine.Server.Api.Features.Programs.Queries.GetProgramById;
using SumterMartialArtsWolverine.Server.Api.Features.Programs.Queries.GetPrograms;

namespace SumterMartialArtsWolverine.Server.Api.EndpointConfigurations;

public static class ProgramEndpoints
{
    public static void Map(RouteGroupBuilder api)
    {
        // Programs - Public
        var programs = api.MapGroup("/programs");
        GetProgramsEndpoint.MapEndpoint(programs);
        GetProgramByIdEndpoint.MapEndpoint(programs);
    }
}