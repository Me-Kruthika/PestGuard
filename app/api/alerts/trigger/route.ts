import { NextResponse } from 'next/server';
import { AlertService, type AlertTrigger } from '@/lib/alert-service';

export async function POST(request: Request) {
  try {
    const trigger: AlertTrigger = await request.json();

    // Validate the trigger data
    if (!trigger.type || !trigger.data || !trigger.severity) {
      return NextResponse.json({ error: 'Invalid alert trigger data' }, { status: 400 });
    }

    const result = await AlertService.triggerAlert(trigger);
    return NextResponse.json({
      success: true,
      alertsSent: result.success,
      alertsFailed: result.failed
    });
  } catch (error) {
    console.error('Error triggering alert:', error);
    return NextResponse.json({ error: 'Failed to trigger alert' }, { status: 500 });
  }
}