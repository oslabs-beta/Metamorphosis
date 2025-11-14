import { NextRequest, NextResponse } from 'next/server';
import { getAlertEngine } from '@/lib/alerts/alertEngine';
import { AlertRule } from '@/types';

// GET /api/alerts/rules/[id] - Get a specific alert rule
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alertEngine = getAlertEngine();
    const rule = alertEngine.getRule(params.id);

    if (!rule) {
      return NextResponse.json(
        { error: 'Alert rule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ rule });
  } catch (error: any) {
    console.error('Error fetching alert rule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch alert rule' },
      { status: 500 }
    );
  }
}

// PUT /api/alerts/rules/[id] - Update an alert rule
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Partial<AlertRule> = await request.json();
    const alertEngine = getAlertEngine();

    const existingRule = alertEngine.getRule(params.id);
    if (!existingRule) {
      return NextResponse.json(
        { error: 'Alert rule not found' },
        { status: 404 }
      );
    }

    const updatedRule: AlertRule = {
      ...existingRule,
      ...body,
      id: params.id, // Ensure ID doesn't change
    };

    alertEngine.addRule(updatedRule);

    return NextResponse.json({ rule: updatedRule });
  } catch (error: any) {
    console.error('Error updating alert rule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update alert rule' },
      { status: 500 }
    );
  }
}

// DELETE /api/alerts/rules/[id] - Delete an alert rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alertEngine = getAlertEngine();
    alertEngine.removeRule(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting alert rule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete alert rule' },
      { status: 500 }
    );
  }
}

