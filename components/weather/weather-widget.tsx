"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSun,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { pests, calculatePestRisk, type Pest } from "@/lib/pest-data";
import { cn } from "@/lib/utils";

interface WeatherData {
  temperature: number;
  humidity: number;
  conditions: string;
  location: string;
  windSpeed: number;
}

interface PestRisk {
  pest: Pest;
  risk: number;
  reason: string;
}

// Mock weather data for demo
function getMockWeather(): WeatherData {
  return {
    temperature: 24 + Math.round(Math.random() * 6),
    humidity: 55 + Math.round(Math.random() * 25),
    conditions: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
    location: "Your Location",
    windSpeed: 5 + Math.round(Math.random() * 15),
  };
}

function getWeatherIcon(conditions: string) {
  const lower = conditions.toLowerCase();
  if (lower.includes("rain")) return CloudRain;
  if (lower.includes("snow")) return Snowflake;
  if (lower.includes("cloud") && lower.includes("sun")) return CloudSun;
  if (lower.includes("cloud")) return Cloud;
  return Sun;
}

function getSeason(): "spring" | "summer" | "fall" | "winter" {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

export function WeatherWidget({ compact = false }: { compact?: boolean }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [pestRisks, setPestRisks] = useState<PestRisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const data = getMockWeather();
      setWeather(data);

      // Calculate pest risks based on weather
      const season = getSeason();
      const risks = pests
        .map((pest) => ({
          pest,
          risk: calculatePestRisk(pest, data.temperature, data.humidity, season),
          reason: `${data.temperature}°C and ${data.humidity}% humidity favor this pest`,
        }))
        .filter((r) => r.risk > 50)
        .sort((a, b) => b.risk - a.risk)
        .slice(0, 3);

      setPestRisks(risks);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Card className={compact ? "h-full" : ""}>
        <CardContent className="flex h-full items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.conditions);
  const overallRisk = pestRisks.length > 0 ? Math.max(...pestRisks.map((r) => r.risk)) : 30;
  const riskLevel = overallRisk > 70 ? "High" : overallRisk > 50 ? "Medium" : "Low";
  const riskColor = overallRisk > 70 ? "text-destructive" : overallRisk > 50 ? "text-warning" : "text-success";

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <WeatherIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{weather.temperature}°C</p>
                <p className="text-sm text-muted-foreground">{weather.conditions}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Pest Risk</p>
              <p className={cn("text-lg font-semibold", riskColor)}>{riskLevel}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Current Weather */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CloudSun className="h-5 w-5" />
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <WeatherIcon className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{weather.location}</span>
              </div>
              <p className="text-3xl font-bold">{weather.temperature}°C</p>
              <p className="text-muted-foreground">{weather.conditions}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="font-medium">{weather.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-medium">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="font-medium">{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pest Risk Alert */}
      <Card className={cn("border-2", overallRisk > 70 ? "border-destructive/50" : overallRisk > 50 ? "border-warning/50" : "border-success/50")}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg">
              <AlertTriangle className={cn("h-5 w-5", riskColor)} />
              Pest Risk Level
            </div>
            <Badge className={cn(
              overallRisk > 70 ? "bg-destructive" : overallRisk > 50 ? "bg-warning text-warning-foreground" : "bg-success"
            )}>
              {riskLevel} Risk
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Overall Risk Score</span>
                <span className="font-medium">{overallRisk}%</span>
              </div>
              <Progress value={overallRisk} className="h-3" />
            </div>

            {pestRisks.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">High-Risk Pests for Current Conditions:</p>
                {pestRisks.map(({ pest, risk }) => (
                  <div key={pest.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div>
                      <p className="font-medium">{pest.name}</p>
                      <p className="text-xs text-muted-foreground">{pest.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-semibold", risk > 70 ? "text-destructive" : "text-warning")}>
                        {risk}%
                      </p>
                      <p className="text-xs text-muted-foreground">risk</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Based on current weather conditions ({weather.temperature}°C, {weather.humidity}% humidity), 
              these pests are most likely to be active in your area.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
