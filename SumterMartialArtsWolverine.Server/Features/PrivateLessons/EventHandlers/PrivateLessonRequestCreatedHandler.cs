using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders.Constants;

namespace SumterMartialArtsAzure.Server.Api.Features.PrivateLessons.EventHandlers;

public class PrivateLessonRequestCreatedHandler
{
    private readonly EmailOrchestrator _emailOrchestrator;
    private readonly AppDbContext _dbContext;

    public PrivateLessonRequestCreatedHandler(EmailOrchestrator emailOrchestrator, AppDbContext dbContext)
    {
        _emailOrchestrator = emailOrchestrator;
        _dbContext = dbContext;
    }

    public async Task Handle(PrivateLessonRequestCreated domainEvent, CancellationToken cancellationToken)
    {
        var instructor = await _dbContext.Instructors
            .FirstOrDefaultAsync(i => i.Id == domainEvent.InstructorId, cancellationToken);

        if (instructor == null)
        {
            return;
        }

        await _emailOrchestrator.SendAsync(
            domainEvent.StudentEmail,
            domainEvent.StudentName,
            new SimpleEmailContentBuilder(EmailTemplateKeys.PrivateLessonRequestConfirmation)
                .WithVariable("StudentName", domainEvent.StudentName)
                .WithVariable("InstructorName", instructor.Name)
                .WithVariable("RequestedDate", domainEvent.RequestedStart.ToString("MMMM dd, yyyy 'at' h:mm tt"))
        );

        var admin = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == "admin" && u.Role == UserRole.Admin, cancellationToken);

        if (admin != null)
        {
            await _emailOrchestrator.SendAsync(
                admin.Email,
                admin.Username,
                new SimpleEmailContentBuilder(EmailTemplateKeys.PrivateLessonAdminNotification)
                    .WithVariable("StudentName", domainEvent.StudentName)
                    .WithVariable("InstructorName", instructor.Name)
                    .WithVariable("RequestedDate", domainEvent.RequestedStart.ToString("MMMM dd, yyyy 'at' h:mm tt"))
            );
        }
    }
}