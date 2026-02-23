using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders.Constants;

namespace SumterMartialArtsAzure.Server.Api.Features.PrivateLessons.EventHandlers;

public class PrivateLessonRequestRejectedHandler
{
    private readonly EmailOrchestrator _emailOrchestrator;
    private readonly AppDbContext _dbContext;

    public PrivateLessonRequestRejectedHandler(EmailOrchestrator emailOrchestrator, AppDbContext dbContext)
    {
        _emailOrchestrator = emailOrchestrator;
        _dbContext = dbContext;
    }

    public async Task Handle(PrivateLessonRequestRejected domainEvent, CancellationToken cancellationToken)
    {
        var request = await _dbContext.PrivateLessonRequests
            .Include(r => r.Instructor)
            .Include(privateLessonRequest => privateLessonRequest.RequestedLessonTime)
            .FirstOrDefaultAsync(r => r.Id == domainEvent.RequestId, cancellationToken);

        if (request == null)
        {
            return;
        }

        await _emailOrchestrator.SendAsync(
            domainEvent.StudentEmail,
            domainEvent.StudentName,
            new SimpleEmailContentBuilder(EmailTemplateKeys.PrivateLessonRejected)
                .WithVariable("StudentName", domainEvent.StudentName)
                .WithVariable("InstructorName", request.Instructor.Name)
                .WithVariable("RequestedDate", request.RequestedLessonTime.Start.ToString("MMMM dd, yyyy 'at' h:mm tt"))
                .WithVariable("Reason", domainEvent.Reason ?? "The requested time slot if not available")
        );
    }
}