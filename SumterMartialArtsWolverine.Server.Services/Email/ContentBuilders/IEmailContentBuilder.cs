using SumterMartialArtsWolverine.Server.Domain.ValueObjects;

namespace SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;

public interface IEmailContentBuilder
{
    string TemplateKey { get; }
    EmailContent BuildFrom(string templateSubject, string templateBody);
}