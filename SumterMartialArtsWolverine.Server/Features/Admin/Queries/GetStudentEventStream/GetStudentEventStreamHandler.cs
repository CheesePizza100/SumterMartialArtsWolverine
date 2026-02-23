using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentEventStream;

public class GetStudentEventStreamHandler
{
    private readonly AppDbContext _dbContext;

    public GetStudentEventStreamHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetStudentEventStreamResponse>> Handle(GetStudentEventStreamQuery request, CancellationToken cancellationToken) {
        var events = await _dbContext.StudentProgressionEvents
            .AsNoTracking()
            .Where(e => e.StudentId == request.StudentId && e.ProgramId == request.ProgramId)
            .OrderBy(e => e.Version)
            .Select(e => new GetStudentEventStreamResponse(
                e.EventId,
                e.EventType,
                e.OccurredAt,
                e.Version,
                e.EventData
            ))
            .ToListAsync(cancellationToken);

        return events;
    }
}