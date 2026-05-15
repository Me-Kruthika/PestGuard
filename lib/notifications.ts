export async function requestNotificationPermission() {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") return true;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendNotification(title: string, body: string) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/icon.png", // optional (put icon in /public)
    });
  }
}

// SMS Alert Functions
export interface SMSAlert {
  message: string;
  to: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export async function sendSMSAlert(alert: SMSAlert): Promise<boolean> {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: alert.message,
        to: alert.to,
      }),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to send SMS alert:', error);
    return false;
  }
}

export async function sendBulkSMSAlerts(alerts: SMSAlert[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const alert of alerts) {
    const result = await sendSMSAlert(alert);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}