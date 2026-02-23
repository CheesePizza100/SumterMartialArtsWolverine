using SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Login;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain;
using System.IdentityModel.Tokens.Jwt;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Middleware;

public class LoginAuditingMiddleware
{
    private readonly AppDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LoginAuditingMiddleware(
        AppDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task AfterAsync(
        LoginCommand command,
        IMessageContext context,
        LoginCommandResponse response)
    {
        if (response is null)
            return;

        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(response.Token);

        var sessionIdClaim = token.Claims
            .FirstOrDefault(c => c.Type == "SessionId")?.Value;

        if (!Guid.TryParse(sessionIdClaim, out var sessionId))
            return;

        var ipAddress =
            _httpContextAccessor.HttpContext?
                .Connection
                .RemoteIpAddress?
                .ToString()
            ?? "unknown";

        var auditLog = AuditLog.Create(
            response.UserId,
            sessionId,
            response.Username,
            AuditActions.UserLoggedIn,
            "User",
            response.UserId.ToString(),
            ipAddress
        );

        _dbContext.AuditLogs.Add(auditLog);
        await _dbContext.SaveChangesAsync();
    }
}
