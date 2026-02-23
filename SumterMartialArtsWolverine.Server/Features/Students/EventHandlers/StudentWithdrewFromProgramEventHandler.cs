using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;

namespace SumterMartialArtsAzure.Server.Api.Features.Students.EventHandlers;

public class StudentWithdrewFromProgramEventHandler
{
    private readonly EmailOrchestrator _emailOrchestrator;
    private readonly AppDbContext _dbContext;

    public StudentWithdrewFromProgramEventHandler(EmailOrchestrator emailOrchestrator, AppDbContext dbContext)
    {
        _emailOrchestrator = emailOrchestrator;
        _dbContext = dbContext;
    }

    public async Task Handle(StudentWithdrewFromProgram domainEvent, CancellationToken cancellationToken)
    {
        var student = await _dbContext.Students
            .Include(s => s.ProgramEnrollments)
            .FirstOrDefaultAsync(s => s.Id == domainEvent.StudentId, cancellationToken);

        // Get remaining active programs
        var remainingPrograms = student.ProgramEnrollments
            .Where(e => e.IsActive)
            .Select(e => e.ProgramName)
            .ToList();

        await _emailOrchestrator.SendAsync(
            student.Email,
            student.Name,
            new ProgramWithdrawalContentBuilder(student.Name, domainEvent.ProgramName, remainingPrograms)
        );
    }
}