"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  MapPin,
  List,
  Filter,
  TrendingUp,
  AlertTriangle,
  Users,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportCard } from "@/components/community/report-card";
import { mockCommunityReports, type CommunityReport } from "@/lib/pest-data";
import { AlertService } from "@/lib/alert-service";

// Dynamic import for map to avoid SSR issues
const ReportsMap = dynamic(
  () => import("@/components/community/reports-map").then((mod) => mod.ReportsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

const severityOptions = ["all", "critical", "high", "medium", "low"] as const;

export default function CommunityPage() {
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [view, setView] = useState<"map" | "list">("map");

  // Check for outbreaks and trigger alerts
  useEffect(() => {
    const checkForOutbreaks = async () => {
      try {
        const outbreaks = await AlertService.checkForOutbreaks(mockCommunityReports);

        for (const outbreak of outbreaks) {
          await fetch('/api/alerts/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'outbreak',
              data: outbreak,
              severity: outbreak.severity,
            }),
          });
        }
      } catch (error) {
        console.error('Failed to check for outbreaks:', error);
      }
    };

    checkForOutbreaks();
  }, []);

  const filteredReports = useMemo(() => {
    let reports = [...mockCommunityReports];
    if (severityFilter !== "all") {
      reports = reports.filter((r) => r.severity === severityFilter);
    }
    return reports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [severityFilter]);

  const stats = useMemo(() => {
    const total = mockCommunityReports.length;
    const critical = mockCommunityReports.filter((r) => r.severity === "critical").length;
    const verified = mockCommunityReports.filter((r) => r.verified).length;
    const recentCount = mockCommunityReports.filter(
      (r) => Date.now() - r.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length;
    return { total, critical, verified, recentCount };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">
          <Users className="mr-1 h-3 w-3" />
          Crowdsourced Intelligence
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Community Reports</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time pest sightings from farmers and gardeners in your area. Report pests to help your community.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.critical}</p>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.verified}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.recentCount}</p>
              <p className="text-sm text-muted-foreground">Last 24 Hours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Map/List View */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Pest Sightings</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions.map((sev) => (
                        <SelectItem key={sev} value={sev}>
                          {sev === "all" ? "All" : sev.charAt(0).toUpperCase() + sev.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Tabs value={view} onValueChange={(v) => setView(v as "map" | "list")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="map" className="gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="hidden sm:inline">Map</span>
                      </TabsTrigger>
                      <TabsTrigger value="list" className="gap-2">
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">List</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {view === "map" ? (
                <div className="h-[500px]">
                  <ReportsMap
                    reports={filteredReports}
                    selectedReport={selectedReport}
                    onSelectReport={setSelectedReport}
                  />
                </div>
              ) : (
                <div className="max-h-[500px] space-y-3 overflow-y-auto p-4">
                  {filteredReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onClick={() => setSelectedReport(report)}
                      isSelected={selectedReport?.id === report.id}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Pests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Trending Pests
              </CardTitle>
              <CardDescription>Most reported in your region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Aphids", count: 24, trend: "+12%" },
                { name: "Late Blight", count: 18, trend: "+45%" },
                { name: "Japanese Beetle", count: 15, trend: "+8%" },
                { name: "Spider Mites", count: 12, trend: "-5%" },
              ].map((pest, i) => (
                <div key={pest.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {i + 1}
                    </span>
                    <span className="font-medium">{pest.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{pest.count}</Badge>
                    <span
                      className={
                        pest.trend.startsWith("+")
                          ? "text-xs text-destructive"
                          : "text-xs text-success"
                      }
                    >
                      {pest.trend}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredReports.slice(0, 4).map((report) => (
                <div
                  key={report.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  onClick={() => {
                    setSelectedReport(report);
                    setView("map");
                  }}
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${
                      report.severity === "critical" || report.severity === "high"
                        ? "bg-destructive"
                        : report.severity === "medium"
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{report.pestName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {report.location.address}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Report CTA */}
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-6 text-center">
              <MapPin className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 font-semibold">Spotted a Pest?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Help your community by reporting pest sightings in your area.
              </p>
              <Button className="mt-4 w-full" asChild>
                <a href="/detect">Submit a Report</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
