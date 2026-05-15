"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityReport } from "@/lib/pest-data";
import "leaflet/dist/leaflet.css";

interface ReportsMapProps {
  reports: CommunityReport[];
  selectedReport?: CommunityReport | null;
  onSelectReport?: (report: CommunityReport) => void;
}

const severityColors = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#dc2626",
};

function createClusterIcon(count: number, maxSeverity: string) {
  const color = severityColors[maxSeverity as keyof typeof severityColors] || severityColors.medium;
  return new DivIcon({
    html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${count}</div>`,
    className: "custom-cluster-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function createMarkerIcon(severity: string) {
  const color = severityColors[severity as keyof typeof severityColors] || severityColors.medium;
  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path fill="${color}" stroke="white" stroke-width="2" d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24C24 5.4 18.6 0 12 0z"/>
        <circle fill="white" cx="12" cy="12" r="5"/>
      </svg>
    `)}`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

function MapController({ selectedReport }: { selectedReport?: CommunityReport | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedReport) {
      map.flyTo([selectedReport.location.lat, selectedReport.location.lng], 10, {
        duration: 1,
      });
    }
  }, [selectedReport, map]);

  return null;
}

export function ReportsMap({ reports, selectedReport, onSelectReport }: ReportsMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  // Center on US by default
  const center: [number, number] = [39.8283, -98.5795];

  return (
    <MapContainer
      center={center}
      zoom={4}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selectedReport={selectedReport} />
      
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.location.lat, report.location.lng]}
          icon={createMarkerIcon(report.severity)}
          eventHandlers={{
            click: () => onSelectReport?.(report),
          }}
        >
          <Popup>
            <div className="min-w-[200px] p-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{report.pestName}</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    report.severity === "critical" || report.severity === "high"
                      ? "border-destructive text-destructive"
                      : report.severity === "medium"
                        ? "border-warning text-warning"
                        : "border-success text-success"
                  )}
                >
                  {report.severity}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{report.location.address}</p>
              <p className="mt-2 text-sm">{report.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{report.upvotes}</span>
                  {report.verified && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(report.timestamp, "MMM d")}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
