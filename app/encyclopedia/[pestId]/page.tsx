import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bug,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Calendar,
  Thermometer,
  Droplets,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPestById, pests, type Treatment } from "@/lib/pest-data";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ pestId: string }>;
}

const severityConfig = {
  low: { color: "bg-success text-success-foreground", label: "Low Severity" },
  medium: { color: "bg-warning text-warning-foreground", label: "Medium Severity" },
  high: { color: "bg-destructive text-destructive-foreground", label: "High Severity" },
  critical: { color: "bg-destructive text-destructive-foreground", label: "Critical" },
};

const categoryIcons = {
  insect: Bug,
  fungus: Leaf,
  bacteria: AlertTriangle,
  virus: AlertTriangle,
  mite: Bug,
  nematode: Bug,
};

function TreatmentCard({ treatment, isOrganic }: { treatment: Treatment; isOrganic: boolean }) {
  const safetyColors = {
    safe: "border-success/30 bg-success/5",
    moderate: "border-warning/30 bg-warning/5",
    caution: "border-destructive/30 bg-destructive/5",
  };

  return (
    <Card className={cn("overflow-hidden border", safetyColors[treatment.safetyRating])}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            {isOrganic ? (
              <Leaf className="h-4 w-4 text-primary" />
            ) : (
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            )}
            {treatment.name}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              treatment.safetyRating === "safe"
                ? "text-success"
                : treatment.safetyRating === "moderate"
                  ? "text-warning"
                  : "text-destructive"
            )}
          >
            {treatment.safetyRating === "safe"
              ? "Safe"
              : treatment.safetyRating === "moderate"
                ? "Moderate"
                : "Use Caution"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{treatment.description}</p>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Effectiveness</span>
            <span className="font-medium">{treatment.effectiveness}%</span>
          </div>
          <Progress value={treatment.effectiveness} className="h-2" />
        </div>

        <div className="space-y-1 text-sm">
          <p className="font-medium">Application:</p>
          <p className="text-muted-foreground">{treatment.applicationMethod}</p>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cost estimate:</span>
          <span className="font-medium">{treatment.costEstimate}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export async function generateStaticParams() {
  return pests.map((pest) => ({
    pestId: pest.id,
  }));
}

export default async function PestDetailPage({ params }: PageProps) {
  const { pestId } = await params;
  const pest = getPestById(pestId);

  if (!pest) {
    notFound();
  }

  const severity = severityConfig[pest.severity];
  const CategoryIcon = categoryIcons[pest.category];
  const seasons = ["spring", "summer", "fall", "winter"] as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 gap-2">
        <Link href="/encyclopedia">
          <ArrowLeft className="h-4 w-4" />
          Back to Encyclopedia
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-4">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <CategoryIcon className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={severity.color}>{severity.label}</Badge>
              <Badge variant="secondary" className="capitalize">
                {pest.category}
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{pest.name}</h1>
            <p className="text-lg italic text-muted-foreground">{pest.scientificName}</p>
          </div>
          <Button asChild>
            <Link href="/detect">
              <Camera className="mr-2 h-4 w-4" />
              Scan for This Pest
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pest.description}</p>
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle>Symptoms</CardTitle>
              <CardDescription>Signs to look for when identifying this pest</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2">
                {pest.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                    <span className="text-sm">{symptom}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Lifecycle */}
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pest.lifecycle}</p>
            </CardContent>
          </Card>

          {/* Treatments */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Options</CardTitle>
              <CardDescription>Organic treatments are shown first</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="organic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="organic" className="gap-2">
                    <Leaf className="h-4 w-4" />
                    Organic ({pest.organicTreatments.length})
                  </TabsTrigger>
                  <TabsTrigger value="chemical" className="gap-2">
                    <FlaskConical className="h-4 w-4" />
                    Chemical ({pest.chemicalTreatments.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="organic" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {pest.organicTreatments.map((treatment) => (
                      <TreatmentCard key={treatment.name} treatment={treatment} isOrganic />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="chemical" className="mt-4">
                  <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">Safety Warning</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Always follow label instructions and wear appropriate protective equipment.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {pest.chemicalTreatments.map((treatment) => (
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
              <CardTitle>Prevention Tips</CardTitle>
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Affected Crops */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Affected Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pest.affectedCrops.map((crop) => (
                  <Badge key={crop} variant="outline">
                    {crop}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Risk */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Seasonal Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {seasons.map((season) => (
                <div key={season} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{season}</span>
                    <span className="font-medium">{pest.seasonalRisk[season]}%</span>
                  </div>
                  <Progress value={pest.seasonalRisk[season]} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Optimal Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Optimal Conditions</CardTitle>
              <CardDescription>When this pest thrives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Thermometer className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="font-medium">
                    {pest.optimalConditions.temperature.min}°C -{" "}
                    {pest.optimalConditions.temperature.max}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <Droplets className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="font-medium">
                    {pest.optimalConditions.humidity.min}% -{" "}
                    {pest.optimalConditions.humidity.max}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
