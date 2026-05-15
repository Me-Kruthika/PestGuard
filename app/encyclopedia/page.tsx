"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Bug,
  Leaf,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pests, type Pest } from "@/lib/pest-data";
import { cn } from "@/lib/utils";

const categories = ["all", "insect", "fungus", "bacteria", "virus", "mite", "nematode"] as const;
const severities = ["all", "low", "medium", "high", "critical"] as const;

const severityConfig = {
  low: { color: "bg-success/10 text-success border-success/30", label: "Low" },
  medium: { color: "bg-warning/10 text-warning border-warning/30", label: "Medium" },
  high: { color: "bg-destructive/10 text-destructive border-destructive/30", label: "High" },
  critical: { color: "bg-destructive text-destructive-foreground", label: "Critical" },
};

const categoryIcons: Record<Pest["category"], typeof Bug> = {
  insect: Bug,
  fungus: Leaf,
  bacteria: AlertTriangle,
  virus: AlertTriangle,
  mite: Bug,
  nematode: Bug,
};

function PestCard({ pest, index }: { pest: Pest; index: number }) {
  const severity = severityConfig[pest.severity];
  const CategoryIcon = categoryIcons[pest.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/encyclopedia/${pest.id}`}>
        <Card className="group h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
          {/* Image placeholder */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <CategoryIcon className="h-16 w-16 text-primary/30" />
            </div>
            <div className="absolute right-2 top-2">
              <Badge variant="outline" className={cn("text-xs", severity.color)}>
                {severity.label}
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="line-clamp-1 text-lg group-hover:text-primary">
                  {pest.name}
                </CardTitle>
                <CardDescription className="line-clamp-1 text-xs italic">
                  {pest.scientificName}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="capitalize text-xs">
                {pest.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {pest.description}
            </p>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">Affects:</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {pest.affectedCrops.slice(0, 3).map((crop) => (
                  <Badge key={crop} variant="outline" className="text-xs">
                    {crop}
                  </Badge>
                ))}
                {pest.affectedCrops.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{pest.affectedCrops.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function EncyclopediaPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");

  const filteredPests = useMemo(() => {
    return pests.filter((pest) => {
      const matchesSearch =
        search === "" ||
        pest.name.toLowerCase().includes(search.toLowerCase()) ||
        pest.scientificName.toLowerCase().includes(search.toLowerCase()) ||
        pest.affectedCrops.some((crop) =>
          crop.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory = category === "all" || pest.category === category;
      const matchesSeverity = severity === "all" || pest.severity === severity;

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [search, category, severity]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">
          <BookOpen className="mr-1 h-3 w-3" />
          Knowledge Base
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Pest Encyclopedia</h1>
        <p className="mt-2 text-muted-foreground">
          Comprehensive database of agricultural pests with identification guides and treatment options.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search pests, crops, or symptoms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Severity Filter */}
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-full sm:w-40">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                {severities.map((sev) => (
                  <SelectItem key={sev} value={sev}>
                    {sev === "all" ? "All Severities" : sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPests.length} of {pests.length} pests
        </p>
        {(search || category !== "all" || severity !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setSeverity("all");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Pest Grid */}
      {filteredPests.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPests.map((pest, index) => (
            <PestCard key={pest.id} pest={pest} index={index} />
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <CardContent>
            <Bug className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No pests found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
