using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Programs.Queries.GetProgramById;

public record InstructorDto(int Id, string Name, string Rank);
public record GetProgramByIdResponse(
    int Id,
    string Name,
    string Description,
    string? Details,
    string AgeGroup,
    string ImageUrl,
    string Duration,
    string Schedule,
    List<InstructorDto> Instructors
);