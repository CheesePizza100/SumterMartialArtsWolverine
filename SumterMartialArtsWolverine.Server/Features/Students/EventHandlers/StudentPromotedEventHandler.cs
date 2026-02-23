using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders.Constants;

namespace SumterMartialArtsAzure.Server.Api.Features.Students.EventHandlers;

public class StudentPromotedEventHandler
{
    private readonly EmailOrchestrator _emailOrchestrator;
    private readonly AppDbContext _dbContext;

    public StudentPromotedEventHandler(EmailOrchestrator emailOrchestrator, AppDbContext dbContext)
    {
        _emailOrchestrator = emailOrchestrator;
        _dbContext = dbContext;
    }

    public async Task Handle(StudentPromoted domainEvent, CancellationToken cancellationToken)
    {
        var student = await _dbContext.Students
            .FirstOrDefaultAsync(s => s.Id == domainEvent.StudentId, cancellationToken);

        await _emailOrchestrator.SendAsync(
            student.Email,
            student.Name,
            new SimpleEmailContentBuilder(EmailTemplateKeys.BeltPromotion)
                .WithVariable("StudentName", student.Name)
                .WithVariable("ProgramName", domainEvent.ProgramName)
                .WithVariable("FromRank", domainEvent.PreviousRank)
                .WithVariable("ToRank", domainEvent.NewRank)
                .WithVariable("PromotionDate", domainEvent.PromotedAt.ToString("MMMM dd, yyyy"))
                .WithVariable("InstructorNotes", domainEvent.Notes)
        );
    }
}