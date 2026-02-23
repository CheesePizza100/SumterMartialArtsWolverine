using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Services;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Middleware;

public class AuditingMiddleware
{
    private readonly IAuditService _auditService;
    private readonly ICurrentUserService _currentUserService;

    public AuditingMiddleware(
        IAuditService auditService,
        ICurrentUserService currentUserService)
    {
        _auditService = auditService;
        _currentUserService = currentUserService;
    }

    public async Task AfterAsync(
    IAuditableCommand command,
    IMessageContext context)
    {
        var response = context.Envelope.Message as IAuditableResponse;
        if (response is null)
            return;

        if (string.IsNullOrWhiteSpace(response.EntityId) ||
            response.EntityId == Guid.Empty.ToString())
            return;

        await _auditService.LogAsync(
            command.Action,
            command.EntityType,
            response.EntityId,
            response.GetAuditDetails()
        );
    }
}
