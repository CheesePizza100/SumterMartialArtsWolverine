using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders.Constants;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;

namespace SumterMartialArtsAzure.Server.Api.Features.Students.EventHandlers;

public class StudentCreatedEventHandler
{
    private readonly EmailOrchestrator _emailOrchestrator;

    public StudentCreatedEventHandler(EmailOrchestrator emailOrchestrator)
    {
        _emailOrchestrator = emailOrchestrator;
    }

    public Task Handle(StudentCreated domainEvent, CancellationToken cancellationToken)
    {
        return _emailOrchestrator.SendAsync(
            domainEvent.Email,
            domainEvent.Name,
            new SimpleEmailContentBuilder(EmailTemplateKeys.SchoolWelcome)
                .WithVariable("StudentName", domainEvent.Name)
        );
    }
}

public class StudentTestRecordedEventHandler
{
    public StudentTestRecordedEventHandler()
    {
    }

    public Task Handle(StudentTestRecorded domainEvent, CancellationToken cancellationToken)
    {
        // TODO: Send email notification to admin
        // TODO: Send confirmation email to student

        return Task.CompletedTask;
    }
}

public class StudentAttendanceRecordedEventHandler
{

    public StudentAttendanceRecordedEventHandler()
    {
    }

    public Task Handle(StudentAttendanceRecorded domainEvent, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}