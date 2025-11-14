import { NextRequest, NextResponse } from 'next/server';
import { queryHistoricalMetrics } from '@/lib/metrics/ingestion';

// GET /api/metrics/historical - Query historical metrics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metric = searchParams.get('metric');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const clusterId = searchParams.get('clusterId');
    const brokerId = searchParams.get('brokerId');

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

    const data = await queryHistoricalMetrics(
      metric,
      start,
      end,
      clusterId || undefined,
      brokerId || undefined
    );

    return NextResponse.json({
      metric,
      startTime: start,
      endTime: end,
      dataPoints: data.length,
      data,
    });
  } catch (error: any) {
    console.error('Error querying historical metrics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to query historical metrics' },
      { status: 500 }
    );
  }
}

