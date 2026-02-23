using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetProgressionAnalytics.Calculators;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetProgressionAnalytics.Visitor;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetProgressionAnalytics;

public class GetProgressionAnalyticsHandler
{
    private readonly IEnumerable<IProgressionAnalyticsCalculator> _calculators;
    private readonly AppDbContext _dbContext;

    public GetProgressionAnalyticsHandler(IEnumerable<IProgressionAnalyticsCalculator> calculators, AppDbContext dbContext)
    {
        _calculators = calculators;
        _dbContext = dbContext;
    }

    public async Task<GetProgressionAnalyticsResponse> Handle(GetProgressionAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.StudentProgressionEvents.AsQueryable();
        var builder = new AnalyticsResponseVisitor();

        foreach (var calculator in _calculators)
        {
            var result = await calculator.Calculate(query, request.ProgramId, cancellationToken);
            result.Accept(builder);
        }

        return builder.ProduceResult();
    }
}