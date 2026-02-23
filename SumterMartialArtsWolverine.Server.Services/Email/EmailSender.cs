using FluentEmail.Core;
using SumterMartialArtsWolverine.Server.Domain.ValueObjects;

namespace SumterMartialArtsWolverine.Server.Services.Email;

public class EmailSender
{
    private readonly IFluentEmail _fluentEmail;

    public EmailSender(IFluentEmail fluentEmail)
    {
        _fluentEmail = fluentEmail;
    }

    public Task SendAsync(string toEmail, string toName, EmailContent content)
    {
        return _fluentEmail
            .To(toEmail, toName)
            .Subject(content.Subject)
            .Body(content.Body, isHtml: true)
            .SendAsync();
    }
}