using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders.Constants;

namespace SumterMartialArtsAzure.Server.Api.Features.Instructors.EventHandlers;

public class InstructorLoginCreatedEventHandler
{
    private readonly EmailOrchestrator _emailOrchestrator;

    public InstructorLoginCreatedEventHandler(EmailOrchestrator emailOrchestrator)
    {
        _emailOrchestrator = emailOrchestrator;
    }

    public Task Handle(InstructorLoginCreated domainEvent)
    {
        return _emailOrchestrator.SendAsync(
            domainEvent.InstructorEmail,
            domainEvent.InstructorName,
            new SimpleEmailContentBuilder(EmailTemplateKeys.InstructorLoginCredentials)
                .WithVariable("InstructorName", domainEvent.InstructorName)
                .WithVariable("UserName", domainEvent.Username)
                .WithVariable("TemporaryPassword", domainEvent.TemporaryPassword)
        );
    }
}