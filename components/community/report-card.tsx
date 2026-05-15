"use client";

import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  MapPin,
  ThumbsUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  Bug,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CommunityReport } from "@/lib/pest-data";

interface ReportCardProps {
  report: CommunityReport;
  onClick?: () => void;
  isSelected?: boolean;
}

const severityConfig = {
  low: {
    color: "bg-success/10 text-success border-success/30",
    label: "Low",
  },
  medium: {
    color: "bg-warning/10 text-warning border-warning/30",
    label: "Medium",
  },
  high: {
    color: "bg-destructive/10 text-destructive border-destructive/30",
    label: "High",
  },
  critical: {
    color: "bg-destructive text-destructive-foreground",
    label: "Critical",
  },
};

export function ReportCard({ report, onClick, isSelected }: ReportCardProps) {
  const severity = severityConfig[report.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all hover:border-primary/50",
          isSelected && "border-primary ring-2 ring-primary/20"
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Pest icon placeholder */}
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Bug className="h-7 w-7 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{report.pestName}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {report.userName}
                  </p>
                </div>
                <Badge variant="outline" className={cn("text-xs flex-shrink-0", severity.color)}>
                  {severity.label}
                </Badge>
              </div>

              {/* Location */}
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{report.location.address}</span>
              </div>

              {/* Description */}
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {report.description}
              </p>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{report.upvotes}</span>
                  </div>
                  {report.verified && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(report.timestamp, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ReportCardCompact({ report, onClick }: ReportCardProps) {
  const severity = severityConfig[report.severity];

  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div
        className={cn(
          "h-3 w-3 rounded-full",
          report.severity === "critical" || report.severity === "high"
            ? "bg-destructive"
            : report.severity === "medium"
              ? "bg-warning"
              : "bg-success"
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{report.pestName}</span>
          {report.verified && <CheckCircle2 className="h-3 w-3 text-primary" />}
        </div>
        <p className="truncate text-sm text-muted-foreground">{report.location.address}</p>
      </div>
      <span className="text-xs text-muted-foreground">
        {formatDistanceToNow(report.timestamp, { addSuffix: true })}
      </span>
    </div>
  );
}
