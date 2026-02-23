namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetInstructors;

public record GetInstructorsResponse(
    int Id,
    string Name,
    string Email,
    string Rank,
    string Bio,
    string PhotoUrl,
    bool HasLogin,
    List<int> ProgramIds
);