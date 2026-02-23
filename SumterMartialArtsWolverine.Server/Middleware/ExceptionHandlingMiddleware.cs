using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task FinallyAsync(Exception? ex)
    {
        if (ex is null)
            return;

        switch (ex)
        {
            case InvalidOperationException invalidEx:
                _logger.LogWarning(
                    invalidEx,
                    "Business rule violation: {Message}",
                    invalidEx.Message
                );
                break;
            case ArgumentException argEx:
                _logger.LogWarning(
                    argEx,
                    "Validation error: {Message}",
                    argEx.Message
                );
                break;
            default:
                _logger.LogError(ex, "Unhandled exception");
                break;
        }
    }
}
