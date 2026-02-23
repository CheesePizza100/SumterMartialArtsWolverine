using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders.Constants;

namespace SumterMartialArtsAzure.Server.Api.Features.Students.EventHandlers;

public class StudentEnrolledInProgramEventHandler
{
    private readonly EmailOrchestrator _emailOrchestrator;
    private readonly AppDbContext _dbContext;

    public StudentEnrolledInProgramEventHandler(EmailOrchestrator emailOrchestrator, AppDbContext dbContext)
    {
        _emailOrchestrator = emailOrchestrator;
        _dbContext = dbContext;
    }

    public async Task Handle(StudentEnrolledInProgram domainEvent, CancellationToken cancellationToken)
    {
        var student = await _dbContext.Students
            .FirstOrDefaultAsync(s => s.Id == domainEvent.StudentId, cancellationToken);

        // Send enrollment confirmation for THIS program
        await _emailOrchestrator.SendAsync(
            student.Email,
            student.Name,
            new SimpleEmailContentBuilder(EmailTemplateKeys.ProgramEnrollment)
                .WithVariable("StudentName", student.Name)
                .WithVariable("ProgramName", domainEvent.ProgramName)
                .WithVariable("InitialRank", domainEvent.InitialRank)
        );
    }
}