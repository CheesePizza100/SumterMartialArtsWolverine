using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders.Constants;

namespace SumterMartialArtsAzure.Server.Api.Features.Students.EventHandlers;

public class StudentLoginCreatedEventHandler
{
    private readonly EmailOrchestrator _emailOrchestrator;

    public StudentLoginCreatedEventHandler(EmailOrchestrator emailOrchestrator)
    {
        _emailOrchestrator = emailOrchestrator;
    }

    public Task Handle(StudentLoginCreated domainEvent, CancellationToken cancellationToken)
    {
        return _emailOrchestrator.SendAsync(
            domainEvent.StudentEmail,
            domainEvent.StudentName,
            new SimpleEmailContentBuilder(EmailTemplateKeys.StudentLoginCredentials)
                .WithVariable("StudentName", domainEvent.StudentName)
                .WithVariable("UserName", domainEvent.UserName)
                .WithVariable("TemporaryPassword", domainEvent.TemporaryPassword)
        );
    }
}