using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;

namespace SumterMartialArtsWolverine.Server.Api.Features.Programs.Queries.GetPrograms;

public class GetProgramsHandler
{
    private readonly AppDbContext _dbContext;

    public GetProgramsHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetProgramsResponse>> Handle(GetProgramsQuery request, CancellationToken cancellationToken)
    {
        var programs = await _dbContext.Programs
            .AsNoTracking()
            .Include(p => p.Instructors)
            .Select(p => new GetProgramsResponse(
                p.Id,
                p.Name,
                p.Description,
                p.AgeGroup,
                p.ImageUrl,
                p.Duration,
                p.Schedule,
                p.Instructors.Select(i => i.Id).ToList()
            )).ToListAsync(cancellationToken: cancellationToken);

        return programs;
    }
}