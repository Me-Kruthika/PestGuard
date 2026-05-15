import { sendBulkSMSAlerts, sendSMSAlert, type SMSAlert } from './notifications';
import type { DetectionResult, CommunityReport, Pest } from './pest-data';

export interface AlertSubscription {
  id: string;
  userId: string;
  phoneNumber: string;
  location?: {
    lat: number;
    lng: number;
    radius: number; // in kilometers
  };
  pestTypes?: string[]; // pest IDs to monitor
  severityLevels: ('low' | 'medium' | 'high' | 'critical')[];
  alertTypes: ('detection' | 'community_report' | 'outbreak')[];
  enabled: boolean;
  createdAt: Date;
  lastAlertSent?: Date;
}

export interface AlertTrigger {
  type: 'detection' | 'community_report' | 'outbreak';
  data: DetectionResult | CommunityReport | OutbreakAlert;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface OutbreakAlert {
  pestId: string;
  pestName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reportCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

// In-memory storage for demo purposes - in production, use a database
let alertSubscriptions: AlertSubscription[] = [];

export class AlertService {
  static addSubscription(subscription: Omit<AlertSubscription, 'id' | 'createdAt'>): string {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSubscription: AlertSubscription = {
      ...subscription,
      id,
      createdAt: new Date(),
    };
    alertSubscriptions.push(newSubscription);
    return id;
  }

  static removeSubscription(id: string): boolean {
    const index = alertSubscriptions.findIndex(sub => sub.id === id);
    if (index !== -1) {
      alertSubscriptions.splice(index, 1);
      return true;
    }
    return false;
  }

  static updateSubscription(id: string, updates: Partial<AlertSubscription>): boolean {
    const subscription = alertSubscriptions.find(sub => sub.id === id);
    if (subscription) {
      Object.assign(subscription, updates);
      return true;
    }
    return false;
  }

  static getSubscriptions(userId?: string): AlertSubscription[] {
    if (userId) {
      return alertSubscriptions.filter(sub => sub.userId === userId);
    }
    return [...alertSubscriptions];
  }

  static async triggerAlert(trigger: AlertTrigger): Promise<{ success: number; failed: number }> {
    const relevantSubscriptions = this.getRelevantSubscriptions(trigger);

    if (relevantSubscriptions.length === 0) {
      return { success: 0, failed: 0 };
    }

    const alerts = relevantSubscriptions.map(sub => this.createSMSAlert(sub, trigger));

    return await sendBulkSMSAlerts(alerts);
  }

  private static getRelevantSubscriptions(trigger: AlertTrigger): AlertSubscription[] {
    return alertSubscriptions.filter(sub => {
      if (!sub.enabled) return false;
      if (!sub.alertTypes.includes(trigger.type)) return false;
      if (!sub.severityLevels.includes(trigger.severity)) return false;

      // Check location proximity if specified
      if (sub.location && trigger.data.location) {
        const distance = this.calculateDistance(
          sub.location.lat,
          sub.location.lng,
          trigger.data.location.lat,
          trigger.data.location.lng
        );
        if (distance > sub.location.radius) return false;
      }

      // Check pest type filter
      if (sub.pestTypes && sub.pestTypes.length > 0) {
        const pestId = 'pestId' in trigger.data ? trigger.data.pestId : trigger.data.pestId;
        if (!sub.pestTypes.includes(pestId)) return false;
      }

      return true;
    });
  }

  private static createSMSAlert(subscription: AlertSubscription, trigger: AlertTrigger): SMSAlert {
    let message = '';

    switch (trigger.type) {
      case 'detection':
        const detection = trigger.data as DetectionResult;
        message = `🚨 PEST ALERT: ${detection.pestName} detected with ${Math.round(detection.confidence * 100)}% confidence at ${detection.location?.address || 'unknown location'}. Severity: ${trigger.severity.toUpperCase()}`;
        break;

      case 'community_report':
        const report = trigger.data as CommunityReport;
        message = `📢 COMMUNITY REPORT: ${report.pestName} reported by ${report.userName} at ${report.location.address}. Severity: ${trigger.severity.toUpperCase()}`;
        break;

      case 'outbreak':
        const outbreak = trigger.data as OutbreakAlert;
        message = `⚠️ OUTBREAK ALERT: ${outbreak.reportCount} reports of ${outbreak.pestName} in ${outbreak.location.address}. Severity: ${trigger.severity.toUpperCase()}`;
        break;
    }

    return {
      message,
      to: subscription.phoneNumber,
      priority: trigger.severity as 'low' | 'medium' | 'high' | 'critical',
    };
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Outbreak detection based on multiple reports in a short time period
  static async checkForOutbreaks(reports: CommunityReport[], timeWindowHours: number = 24, minReports: number = 3): Promise<OutbreakAlert[]> {
    const outbreaks: OutbreakAlert[] = [];
    const now = new Date();
    const windowStart = new Date(now.getTime() - timeWindowHours * 60 * 60 * 1000);

    // Group reports by pest and location
    const groupedReports = new Map<string, CommunityReport[]>();

    reports
      .filter(report => report.timestamp >= windowStart)
      .forEach(report => {
        const key = `${report.pestId}_${Math.round(report.location.lat * 100)}_${Math.round(report.location.lng * 100)}`;
        if (!groupedReports.has(key)) {
          groupedReports.set(key, []);
        }
        groupedReports.get(key)!.push(report);
      });

    for (const [key, groupReports] of groupedReports) {
      if (groupReports.length >= minReports) {
        const severity = this.calculateOutbreakSeverity(groupReports);
        const outbreak: OutbreakAlert = {
          pestId: groupReports[0].pestId,
          pestName: groupReports[0].pestName,
          location: groupReports[0].location,
          reportCount: groupReports.length,
          severity,
          timestamp: now,
        };
        outbreaks.push(outbreak);
      }
    }

    return outbreaks;
  }

  private static calculateOutbreakSeverity(reports: CommunityReport[]): 'low' | 'medium' | 'high' | 'critical' {
    const severityCounts = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    reports.forEach(report => {
      severityCounts[report.severity]++;
    });

    if (severityCounts.critical > 0) return 'critical';
    if (severityCounts.high > reports.length * 0.5) return 'high';
    if (severityCounts.medium > reports.length * 0.3) return 'medium';
    return 'low';
  }
}