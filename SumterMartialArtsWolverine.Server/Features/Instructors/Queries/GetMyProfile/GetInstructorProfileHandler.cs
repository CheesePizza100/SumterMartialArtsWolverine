using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Services;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetMyProfile;

public class GetInstructorProfileHandler
{
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetInstructorProfileHandler(AppDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<InstructorProfileResponse> Handle(GetInstructorProfileQuery request, CancellationToken cancellationToken)
    {
        var instructorId = _currentUserService.GetInstructorId();

        if (instructorId == null)
            throw new UnauthorizedAccessException("User is not associated with an instructor");

        var instructor = await _dbContext.Instructors
            .AsNoTracking()
            .Include(i => i.Programs)
            .Include(i => i.ClassSchedule)
            .FirstOrDefaultAsync(i => i.Id == instructorId.Value, cancellationToken);

        if (instructor == null)
            throw new InvalidOperationException("Instructor not found");

        return new InstructorProfileResponse(
            instructor.Id,
            instructor.Name,
            instructor.Email,
            instructor.Rank,
            instructor.Bio,
            instructor.PhotoUrl,
            instructor.Programs
                .Select(p => new ProgramDto(p.Id, p.Name))
                .ToList(),
            instructor.ClassSchedule
                .Select(cs => new AvailabilityRuleDto(
                    string.Join(", ", cs.DaysOfWeek),
                    cs.StartTime,
                    cs.Duration
                )).ToList()
        );
    }
}