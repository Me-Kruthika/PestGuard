import { NextResponse } from 'next/server';
import { AlertService, type AlertSubscription } from '@/lib/alert-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const subscriptions = AlertService.getSubscriptions(userId || undefined);
    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching alert subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const subscriptionData: Omit<AlertSubscription, 'id' | 'createdAt'> = await request.json();

    // Validate required fields
    if (!subscriptionData.userId || !subscriptionData.phoneNumber || !subscriptionData.severityLevels || !subscriptionData.alertTypes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subscriptionId = AlertService.addSubscription(subscriptionData);
    return NextResponse.json({ success: true, subscriptionId });
  } catch (error) {
    console.error('Error creating alert subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    const success = AlertService.updateSubscription(id, updates);
    if (!success) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating alert subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    const success = AlertService.removeSubscription(id);
    if (!success) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting alert subscription:', error);
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
  }
}