"use client";

import { useEffect, useState } from "react";
import { getDetectionStats, getAlerts } from "@/lib/storage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      const s = getDetectionStats();
      const a = getAlerts();

      setStats(s);
      setAlerts(a);
    };

    load();

    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Dashboard</h1>

      {/* TOTAL */}
      <h2>Total Detections: {stats.totalDetections}</h2>

      {/* 📈 CHART */}
      <h3 style={{ marginTop: 30 }}>Detection Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats.monthlyDetections}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="detections" stroke="#22c55e" />
        </LineChart>
      </ResponsiveContainer>

      {/* 🥧 PIE */}
      <h3 style={{ marginTop: 30 }}>Pest Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={stats.pestDistribution} dataKey="value">
            {stats.pestDistribution.map((entry: any, index: number) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* 🚨 ALERTS */}
      <h3 style={{ marginTop: 30 }}>Alerts</h3>

      {alerts.length === 0 && <p>No alerts</p>}

      {alerts.map((a, i) => (
        <div
          key={i}
          style={{
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            background:
              a.severity === "critical"
                ? "#fee2e2"
                : a.severity === "high"
                ? "#fef3c7"
                : "#e0f2fe",
          }}
        >
          <strong>{a.pestName}</strong> ({a.severity})
          <br />
          {a.message}
        </div>
      ))}

      {/* 🧾 RECENT */}
      <h3 style={{ marginTop: 30 }}>Recent Scans</h3>

      {stats.recentDetections.length === 0 && <p>No scans yet</p>}

      {stats.recentDetections.map((d: any, i: number) => (
        <div key={i}>
          {d.pestName} - {d.confidence}% ({d.severity})
        </div>
      ))}
    </div>
  );
}