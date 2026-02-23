using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetInstructorById;

public class GetInstructorByIdHandler
{
    private readonly AppDbContext _db;

    public GetInstructorByIdHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<GetInstructorByIdResponse?> Handle(GetInstructorByIdQuery query, CancellationToken cancellationToken)
    {
        // The issue is that AvailabilityRules is not a navigation property(entity relationship)
        // it's a JSON-serialized collection stored as a string. You can't use .Include() on it.
        // AvailabilityRules are automatically loaded because they're stored as JSON in the same
        // table row - no need to .Include() them. You only use .Include() for actual entity relationships (like Programs)
        var instructor = await _db.Instructors
            .AsNoTracking()
            .Include(i => i.Programs)
            .FirstOrDefaultAsync(i => i.Id == query.Id);

        if (instructor == null) return null;

        return new GetInstructorByIdResponse(instructor);
    }
}