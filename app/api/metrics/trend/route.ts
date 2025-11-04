import { NextRequest, NextResponse } from 'next/server';
import { queryHistoricalMetrics } from '@/lib/metrics/ingestion';
import { analyzeTrend, comparePeriods, detectAnomalies } from '@/lib/analysis/trend';

// GET /api/metrics/trend - Analyze trends and anomalies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metric = searchParams.get('metric');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const clusterId = searchParams.get('clusterId');
    const brokerId = searchParams.get('brokerId');
    const compareStartTime = searchParams.get('compareStartTime');
    const compareEndTime = searchParams.get('compareEndTime');

    if (!metric || !startTime || !endTime) {
      return NextResponse.json(
        {
          error: 'Missing required parameters: metric, startTime, endTime',
        },
        { status: 400 }
      );
    }

    const start = parseInt(startTime, 10);
    const end = parseInt(endTime, 10);

    if (isNaN(start) || isNaN(end)) {
      return NextResponse.json(
        { error: 'startTime and endTime must be valid Unix timestamps' },
        { status: 400 }
      );
    }

    // Query historical data
    const data = await queryHistoricalMetrics(
      metric,
      start,
      end,
      clusterId || undefined,
      brokerId || undefined
    );

    if (data.length === 0) {
      return NextResponse.json({
        metric,
        period: { startTime: start, endTime: end },
        trend: {
          trend: 'stable',
          rate: 0,
          average: 0,
          stdDev: 0,
          min: 0,
          max: 0,
          anomaly: false,
          anomalyScore: 0,
        },
        anomalies: [],
        comparison: null,
      });
    }

    // Analyze trend
    const trend = analyzeTrend(data);

    // Detect anomalies
    const anomalies = detectAnomalies(data, 3);

    // Compare with previous period if provided
    let comparison = null;
    if (compareStartTime && compareEndTime) {
      const compareStart = parseInt(compareStartTime, 10);
      const compareEnd = parseInt(compareEndTime, 10);

      if (!isNaN(compareStart) && !isNaN(compareEnd)) {
        const compareData = await queryHistoricalMetrics(
          metric,
          compareStart,
          compareEnd,
          clusterId || undefined,
          brokerId || undefined
        );

        if (compareData.length > 0) {
          comparison = comparePeriods(compareData, data);
        }
      }
    }

    return NextResponse.json({
      metric,
      period: { startTime: start, endTime: end },
      trend,
      anomalies: anomalies.map((a) => ({
        timestamp: a.timestamp,
        value: a.value,
        labels: a.labels,
      })),
      comparison,
      dataPoints: data.length,
    });
  } catch (error: any) {
    console.error('Error analyzing trends:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze trends' },
      { status: 500 }
    );
  }
}

