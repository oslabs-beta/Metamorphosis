import { NextRequest, NextResponse } from 'next/server';
import { getAlertEngine } from '@/lib/alerts/alertEngine';

// GET /api/alerts/history - Get alert history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ruleId = searchParams.get('ruleId');
    const status = searchParams.get('status'); // 'firing' | 'resolved'
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const alertEngine = getAlertEngine();
    let history = ruleId
      ? alertEngine.getAlertHistory(ruleId)
      : alertEngine.getAlertHistory();

    // Filter by status if provided
    if (status) {
      history = history.filter((alert) => alert.status === status);
    }

    // Limit results
    history = history.slice(0, limit);

    return NextResponse.json({ alerts: history });
  } catch (error: any) {
    console.error('Error fetching alert history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch alert history' },
      { status: 500 }
    );
  }
}

