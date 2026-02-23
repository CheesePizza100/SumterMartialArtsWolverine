using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetProgressionAnalytics.AnalyticsResults;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetProgressionAnalytics;

public record GetProgressionAnalyticsResponse(
    int TotalEnrollments,
    int TotalTests,
    int PassedTests,
    int FailedTests,
    double PassRate,
    int TotalPromotions,
    List<RankProgression> RankProgressions,
    List<MonthlyTestActivity> MostActiveTestingMonths,
    List<RankDistribution> CurrentRankDistribution
);
public record MonthlyTestActivity(int Year, int Month, int TestCount);

public record RankDistribution(string Rank, int Count);