using System.Diagnostics;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.Api.Middleware;

public class LoggingMiddleware
{
    private readonly ILogger<LoggingMiddleware> _logger;

    public LoggingMiddleware(ILogger<LoggingMiddleware> logger)
    {
        _logger = logger;
    }

    public Task BeforeAsync(IMessageContext context)
    {
        context.Envelope.Headers["__start"] =
            Stopwatch.GetTimestamp().ToString();
        return Task.CompletedTask;
    }

    public Task AfterAsync(IMessageContext context)
    {
        if (context.Envelope.Headers.TryGetValue("__start", out var raw) &&
            long.TryParse(raw, out var start))
        {
            var elapsedMs =
                (Stopwatch.GetTimestamp() - start)
                * 1000.0 / Stopwatch.Frequency;
            _logger.LogInformation(
                "Handled {MessageName} in {ElapsedMs} ms",
                context.Envelope.MessageType,
                elapsedMs
            );
        }
        return Task.CompletedTask;
    }
}
