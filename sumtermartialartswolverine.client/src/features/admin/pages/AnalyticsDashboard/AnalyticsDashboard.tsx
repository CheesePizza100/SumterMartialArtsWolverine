import { useState, useEffect } from 'react';
import { eventSourcingService } from '../../services/eventSourcingService';
import type { ProgressionAnalytics } from '../../models/eventSourcing.model';
import './AnalyticsDashboard.css';

function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<ProgressionAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async (programId?: number) => {
        setIsLoading(true);
        setError(undefined);
        try {
            const data = await eventSourcingService.getProgressionAnalytics(programId);
            setAnalytics(data);
        } catch (err) {
            console.error('Error loading analytics:', err);
            setError('Failed to load analytics. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getMonthName = (month: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1];
    };

    const getBarWidth = (count: number, maxCount: number) =>
        maxCount > 0 ? (count / maxCount) * 100 : 0;

    const maxTestCount = analytics?.mostActiveTestingMonths.length
        ? Math.max(...analytics.mostActiveTestingMonths.map(m => m.testCount))
        : 0;

    const maxRankCount = analytics?.currentRankDistribution.length
        ? Math.max(...analytics.currentRankDistribution.map(r => r.count))
        : 0;

    return (
        <div className="analytics-container">
            <div className="header">
                <h1>Belt Progression Analytics</h1>
                <p className="subtitle">Powered by Event Sourcing</p>
            </div>

            {isLoading && (
                <div className="loading-container">
                    <div className="spinner" />
                    <p>Loading analytics...</p>
                </div>
            )}

            {error && !isLoading && (
                <div className="error-container">
                    <p>{error}</p>
                    <button className="btn-retry" onClick={() => loadAnalytics()}>Retry</button>
                </div>
            )}

            {analytics && !isLoading && (
                <div className="dashboard">

                    {/* Key Metrics */}
                    <div className="metrics-grid">
                        <div className="metric-card blue">
                            <div className="metric-value">{analytics.totalEnrollments}</div>
                            <div className="metric-label">Total Enrollments</div>
                        </div>
                        <div className="metric-card green">
                            <div className="metric-value">{analytics.totalPromotions}</div>
                            <div className="metric-label">Total Promotions</div>
                        </div>
                        <div className="metric-card purple">
                            <div className="metric-value">{analytics.totalTests}</div>
                            <div className="metric-label">Total Tests</div>
                        </div>
                        <div className="metric-card orange">
                            <div className="metric-value">{analytics.passRate.toFixed(1)}%</div>
                            <div className="metric-label">Pass Rate</div>
                        </div>
                    </div>

                    {/* Test Results Breakdown */}
                    <div className="chart-card">
                        <h2>Test Results Breakdown</h2>
                        <div className="test-breakdown">
                            <div className="breakdown-item passed">
                                <div
                                    className="breakdown-bar"
                                    style={{ width: `${analytics.totalTests > 0 ? (analytics.passedTests / analytics.totalTests * 100) : 0}%` }}
                                />
                                <div className="breakdown-label">
                                    <span className="count">{analytics.passedTests}</span>
                                    <span className="text">Passed</span>
                                </div>
                            </div>
                            <div className="breakdown-item failed">
                                <div
                                    className="breakdown-bar"
                                    style={{ width: `${analytics.totalTests > 0 ? (analytics.failedTests / analytics.totalTests * 100) : 0}%` }}
                                />
                                <div className="breakdown-label">
                                    <span className="count">{analytics.failedTests}</span>
                                    <span className="text">Failed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Average Time to Blue Belt */}
                    {analytics.averageDaysToBlue > 0 && (
                        <div className="stat-card">
                            <h2>Average Time to Blue Belt</h2>
                            <div className="stat-value">
                                {analytics.averageDaysToBlue} days
                                <span className="stat-subtext">
                                    ({Math.round(analytics.averageDaysToBlue / 30)} months)
                                </span>
                            </div>
                            <p className="stat-description">
                                Based on event sourcing data from all students who have achieved blue belt
                            </p>
                        </div>
                    )}

                    {/* Most Active Testing Months */}
                    <div className="chart-card">
                        <h2>Most Active Testing Months</h2>
                        <div className="monthly-chart">
                            {analytics.mostActiveTestingMonths.length > 0 ? (
                                analytics.mostActiveTestingMonths.map((month, i) => (
                                    <div key={i} className="month-bar">
                                        <div className="bar-container">
                                            <div
                                                className="bar"
                                                style={{ height: `${getBarWidth(month.testCount, maxTestCount)}%` }}
                                            />
                                        </div>
                                        <div className="month-label">
                                            {getMonthName(month.month)} {month.year}
                                        </div>
                                        <div className="month-count">{month.testCount}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">No testing data available yet</div>
                            )}
                        </div>
                    </div>

                    {/* Current Rank Distribution */}
                    <div className="chart-card">
                        <h2>Current Rank Distribution</h2>
                        <div className="rank-distribution">
                            {analytics.currentRankDistribution.length > 0 ? (
                                analytics.currentRankDistribution.map((rank, i) => (
                                    <div key={i} className="rank-row">
                                        <div className="rank-name">{rank.rank}</div>
                                        <div className="rank-bar-container">
                                            <div
                                                className="rank-bar"
                                                style={{ width: `${getBarWidth(rank.count, maxRankCount)}%` }}
                                            />
                                        </div>
                                        <div className="rank-count">{rank.count}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">No rank data available yet</div>
                            )}
                        </div>
                    </div>

                    {/* Event Sourcing Info Card */}
                    <div className="info-card">
                        <h3>?? About This Dashboard</h3>
                        <p>
                            This analytics dashboard is powered by <strong>Event Sourcing</strong>.
                            All statistics are computed from the complete event history stored in the event store,
                            allowing for:
                        </p>
                        <ul>
                            <li>Complete audit trail of all belt progressions</li>
                            <li>Time-travel queries to see historical states</li>
                            <li>Accurate analytics based on immutable event data</li>
                            <li>Ability to replay events and rebuild state at any point in time</li>
                        </ul>
                    </div>

                </div>
            )}
        </div>
    );
}

export default AnalyticsDashboard;