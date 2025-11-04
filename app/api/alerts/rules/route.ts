import { NextRequest, NextResponse } from 'next/server';
import { getAlertEngine } from '@/lib/alerts/alertEngine';
import { AlertRule } from '@/types';

// GET /api/alerts/rules - List all alert rules
export async function GET() {
  try {
    const alertEngine = getAlertEngine();
    const rules = alertEngine.getRules();
    return NextResponse.json({ rules });
  } catch (error: any) {
    console.error('Error fetching alert rules:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch alert rules' },
      { status: 500 }
    );
  }
}

// POST /api/alerts/rules - Create a new alert rule
export async function POST(request: NextRequest) {
  try {
    const body: AlertRule = await request.json();

    // Validate required fields
    if (!body.name || !body.metric || !body.threshold || !body.operator) {
      return NextResponse.json(
        { error: 'Missing required fields: name, metric, threshold, operator' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!body.id) {
      body.id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Set defaults
    body.enabled = body.enabled !== undefined ? body.enabled : true;
    body.duration = body.duration || 0;
    body.notificationChannels = body.notificationChannels || [];

    const alertEngine = getAlertEngine();
    alertEngine.addRule(body);

    return NextResponse.json({ rule: body }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating alert rule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create alert rule' },
      { status: 500 }
    );
  }
}

