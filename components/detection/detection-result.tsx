"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Leaf,
  FlaskConical,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Save,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getPestById, type DetectionResult, type Treatment } from "@/lib/pest-data";
import { saveDetection } from "@/lib/storage";
import { generateAnalysisText } from "@/lib/mock-ai";
import { AlertService } from "@/lib/alert-service";

interface DetectionResultProps {
  result: DetectionResult;
  onSave?: () => void;
  onNewScan?: () => void;
}

const severityConfig = {
  low: { color: "bg-success text-success-foreground", label: "Low Severity", icon: CheckCircle2 },
  medium: { color: "bg-warning text-warning-foreground", label: "Medium Severity", icon: AlertTriangle },
  high: { color: "bg-destructive text-destructive-foreground", label: "High Severity", icon: AlertTriangle },
  critical: { color: "bg-destructive text-destructive-foreground", label: "Critical", icon: AlertTriangle },
};

function TreatmentCard({ treatment, isOrganic }: { treatment: Treatment; isOrganic: boolean }) {
  const safetyColors = {
    safe: "bg-success/10 text-success border-success/20",
    moderate: "bg-warning/10 text-warning border-warning/20",
    caution: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {isOrganic ? (
              <Leaf className="h-4 w-4 text-primary" />
            ) : (
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            )}
            <CardTitle className="text-base">{treatment.name}</CardTitle>
          </div>
          <Badge variant="outline" className={cn("text-xs", safetyColors[treatment.safetyRating])}>
            {treatment.safetyRating === "safe" ? "Safe" : treatment.safetyRating === "moderate" ? "Moderate" : "Use Caution"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{treatment.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Effectiveness</span>
            <span className="font-medium">{treatment.effectiveness}%</span>
          </div>
          <Progress value={treatment.effectiveness} className="h-2" />
        </div>
        
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          <p className="font-medium">How to apply:</p>
          <p className="mt-1 text-muted-foreground">{treatment.applicationMethod}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated cost:</span>
          <span className="font-medium">{treatment.costEstimate}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function DetectionResultComponent({ result, onNewScan }: DetectionResultProps) {
  const pest = getPestById(result.pestId);
  const severity = severityConfig[result.severity];
  const SeverityIcon = severity.icon;

  // Trigger alerts for high-confidence detections
  useEffect(() => {
    if (result.confidence > 0.7 && (result.severity === 'high' || result.severity === 'critical')) {
      const triggerAlert = async () => {
        try {
          await fetch('/api/alerts/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'detection',
              data: result,
              severity: result.severity,
            }),
          });
        } catch (error) {
          console.error('Failed to trigger alert:', error);
        }
      };

      triggerAlert();
    }
  }, [result]);

  const handleSave = () => {
    saveDetection(result);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `PestGuard AI - ${result.pestName} Detection`,
          text: `I detected ${result.pestName} with ${(result.confidence * 100).toFixed(0)}% confidence using PestGuard AI.`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  if (!pest) return null;

  const analysisText = generateAnalysisText(pest, result.confidence);
  const organicTreatments = pest.organicTreatments;
  const chemicalTreatments = pest.chemicalTreatments;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className={severity.color}>
                  <SeverityIcon className="mr-1 h-3 w-3" />
                  {severity.label}
                </Badge>
                <Badge variant="outline">{pest.category}</Badge>
              </div>
              <CardTitle className="mt-3 text-2xl">{result.pestName}</CardTitle>
              <CardDescription className="mt-1 italic">{pest.scientificName}</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className="text-3xl font-bold text-primary">
                {(result.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save to History
            </Button>
            <Button size="sm" variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button size="sm" variant="outline" asChild className="gap-2">
              <Link href={`/encyclopedia/${pest.id}`}>
                <BookOpen className="h-4 w-4" />
                View in Encyclopedia
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {analysisText.split("\n").map((line, i) => {
              if (line.startsWith("**") && line.endsWith("**")) {
                return <h4 key={i} className="font-semibold">{line.replace(/\*\*/g, "")}</h4>;
              }
              if (line.startsWith("- ")) {
                return <li key={i}>{line.substring(2)}</li>;
              }
              if (line.match(/^\d\./)) {
                return <li key={i}>{line.substring(3)}</li>;
              }
              return <p key={i}>{line.replace(/\*\*/g, "")}</p>;
            })}
          </div>
        </CardContent>
      </Card>

      {/* Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Symptoms to Look For</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {pest.symptoms.map((symptom, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-sm">{symptom}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Treatments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Treatment Recommendations</CardTitle>
          <CardDescription>
            Organic treatments are shown first. Always follow safety guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="organic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="organic" className="gap-2">
                <Leaf className="h-4 w-4" />
                Organic ({organicTreatments.length})
              </TabsTrigger>
              <TabsTrigger value="chemical" className="gap-2">
                <FlaskConical className="h-4 w-4" />
                Chemical ({chemicalTreatments.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="organic" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {organicTreatments.map((treatment) => (
                  <TreatmentCard key={treatment.name} treatment={treatment} isOrganic />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="chemical" className="mt-4">
              <div className="rounded-lg bg-destructive/5 p-4 mb-4 border border-destructive/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Safety Warning</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Always wear appropriate protective equipment when handling chemical treatments. 
                      Follow label instructions carefully and observe pre-harvest intervals.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {chemicalTreatments.map((treatment) => (
                  <TreatmentCard key={treatment.name} treatment={treatment} isOrganic={false} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Prevention */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prevention Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {pest.preventionTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={onNewScan} className="flex-1 gap-2">
          Scan Another Plant
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" asChild className="flex-1 gap-2">
          <Link href="/community">
            Report to Community
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
