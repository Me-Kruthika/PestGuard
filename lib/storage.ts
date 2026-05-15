import type { DetectionResult } from "./pest-data";

const STORAGE_KEYS = {
  DETECTIONS: "pestguard_detections",
  ALERTS: "pestguard_alerts",
};

// ================= DETECTIONS =================

export function saveDetection(detection: DetectionResult): void {
  if (typeof window === "undefined") return;

  const existing = getDetections();
  existing.unshift(detection);

  localStorage.setItem(
    STORAGE_KEYS.DETECTIONS,
    JSON.stringify(existing.slice(0, 100))
  );

  // 🚨 ALERT TRIGGER
  if (detection.severity === "high" || detection.severity === "critical") {
    saveAlert({
      id: Date.now(),
      pestName: detection.pestName,
      severity: detection.severity,
      message: `High risk detected: ${detection.pestName}`,
      timestamp: new Date(),
    });
  }
}

export function getDetections(): DetectionResult[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.DETECTIONS);
    if (!data) return [];

    return JSON.parse(data).map((d: any) => ({
      ...d,
      timestamp: new Date(d.timestamp),
    }));
  } catch {
    return [];
  }
}

// ================= ALERTS =================

export interface Alert {
  id: number;
  pestName: string;
  severity: string;
  message: string;
  timestamp: Date;
}

export function saveAlert(alert: Alert) {
  if (typeof window === "undefined") return;

  const existing = getAlerts();
  existing.unshift(alert);

  localStorage.setItem(
    STORAGE_KEYS.ALERTS,
    JSON.stringify(existing.slice(0, 50))
  );
}

export function getAlerts(): Alert[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!data) return [];

    return JSON.parse(data).map((a: any) => ({
      ...a,
      timestamp: new Date(a.timestamp),
    }));
  } catch {
    return [];
  }
}

// ================= ANALYTICS =================

export function getDetectionStats() {
  const detections = getDetections();

  const pestCounts: Record<string, number> = {};
  const monthlyMap: Record<string, number> = {};

  detections.forEach((d) => {
    pestCounts[d.pestName] = (pestCounts[d.pestName] || 0) + 1;

    const month = new Date(d.timestamp).toLocaleString("default", {
      month: "short",
    });

    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  return {
    totalDetections: detections.length,
    monthlyDetections: Object.entries(monthlyMap).map(([month, val]) => ({
      month,
      detections: val,
    })),
    pestDistribution: Object.entries(pestCounts).map(
      ([name, val], i) => ({
        name,
        value: val,
        fill: `var(--chart-${(i % 5) + 1})`,
      })
    ),
    recentDetections: detections.slice(0, 5),
  };
}