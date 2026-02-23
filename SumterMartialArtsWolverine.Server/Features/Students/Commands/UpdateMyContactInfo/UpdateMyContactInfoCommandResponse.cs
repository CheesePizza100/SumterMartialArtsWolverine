using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Students.Commands.UpdateMyContactInfo;

public record UpdateMyContactInfoCommandResponse( bool Success, string Message, int StudentId) : IAuditableResponse
{
    public string EntityId => StudentId.ToString();

    public object GetAuditDetails() => new
    {
        Success,
        Message
    };
}