"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  BookOpen,
  MapPin,
  BarChart3,
  Leaf,
  Shield,
  Zap,
  Users,
  CloudSun,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Camera,
    title: "Real-Time Detection",
    description:
      "Scan plants with your camera or upload images for instant AI-powered pest identification with 95%+ accuracy.",
    href: "/detect",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    title: "Pest Encyclopedia",
    description:
      "Comprehensive database of 50+ pests with detailed lifecycle info, symptoms, and treatment options.",
    href: "/encyclopedia",
    color: "bg-accent/10 text-accent-foreground",
  },
  {
    icon: CloudSun,
    title: "Weather Risk Alerts",
    description:
      "Predict pest outbreaks 3-5 days in advance based on weather patterns and seasonal data.",
    href: "/detect",
    color: "bg-info/10 text-foreground",
  },
  {
    icon: Leaf,
    title: "Smart Treatments",
    description:
      "Get personalized treatment recommendations prioritizing eco-friendly organic solutions first.",
    href: "/detect",
    color: "bg-success/10 text-foreground",
  },
  {
    icon: MapPin,
    title: "Community Reports",
    description:
      "Crowdsourced pest surveillance network. See pest sightings in your area and contribute reports.",
    href: "/community",
    color: "bg-warning/10 text-foreground",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track detection history, visualize trends, and export reports for agricultural advisors.",
    href: "/dashboard",
    color: "bg-destructive/10 text-destructive",
  },
];

const stats = [
  { value: "50+", label: "Pest Species" },
  { value: "95%", label: "Detection Accuracy" },
  { value: "10K+", label: "Community Reports" },
  { value: "40%", label: "Pesticide Reduction" },
];

const benefits = [
  "Instant pest identification from photos",
  "Eco-friendly treatment recommendations",
  "Weather-based outbreak predictions",
  "Real-time community pest alerts",
  "Comprehensive pest encyclopedia",
  "Mobile-friendly field use design",
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4 gap-1.5">
                <Sparkles className="h-3 w-3" />
                AI-Powered Agriculture
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Protect Your Crops with{" "}
                <span className="text-primary">Intelligent</span> Pest Detection
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
                PestGuard AI combines computer vision, weather analytics, and community intelligence 
                to help farmers and gardeners identify pests instantly and get effective treatment 
                recommendations. Reduce crop losses and pesticide use with smart agriculture.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/detect">
                    <Camera className="h-5 w-5" />
                    Start Scanning
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/encyclopedia">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore Encyclopedia
                  </Link>
                </Button>
              </div>
              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Works offline</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Animated Scanner Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-2xl">
                {/* Simulated plant image */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20">
                  {/* Plant silhouette */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <Leaf className="h-32 w-32 text-primary/30" />
                      <Bug className="absolute -right-4 top-8 h-12 w-12 text-destructive/60" />
                    </div>
                  </div>
                  
                  {/* Scanning animation */}
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Detection boxes */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.3 }}
                    className="absolute right-12 top-16 rounded-lg border-2 border-destructive bg-destructive/10 px-3 py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                      <span className="text-xs font-medium text-destructive">Aphids Detected</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Confidence: 94%</span>
                  </motion.div>
                  
                  {/* Corner markers */}
                  <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-primary" />
                  <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-primary" />
                  <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-primary" />
                  <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-primary" />
                </div>
                
                {/* Status bar */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-background/90 p-3 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      <span className="text-sm font-medium">Scanning in progress...</span>
                    </div>
                    <span className="text-sm text-muted-foreground">GPT-4o Vision</span>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-4 top-1/4 rounded-lg border border-border bg-card p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Eco-Friendly</p>
                    <p className="text-xs text-muted-foreground">Organic treatments first</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -right-4 bottom-1/4 rounded-lg border border-border bg-card p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium">Instant Results</p>
                    <p className="text-xs text-muted-foreground">Under 3 seconds</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Protect Your Crops
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              A comprehensive suite of AI-powered tools for modern pest management, 
              from instant detection to community-driven surveillance.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={feature.href}>
                  <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-lg">
                    <CardHeader>
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="flex items-center gap-2">
                        {feature.title}
                        <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-card/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Detect and Treat in 3 Simple Steps
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Capture",
                description: "Take a photo of the affected plant using your camera or upload an existing image.",
                icon: Camera,
              },
              {
                step: "02",
                title: "Identify",
                description: "Our AI analyzes the image and identifies the pest with detailed information.",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "Treat",
                description: "Get personalized treatment recommendations prioritizing eco-friendly solutions.",
                icon: Leaf,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-6xl font-bold text-muted/20">
                  {item.step}
                </span>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">Why PestGuard AI</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Smart Agriculture for a Sustainable Future
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Join thousands of farmers and gardeners who are using AI to protect their crops 
                while reducing chemical pesticide use. Our platform combines the latest in 
                computer vision with community knowledge.
              </p>
              <ul className="mt-8 space-y-3">
                {benefits.map((benefit, i) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="p-6">
                <Shield className="h-10 w-10 text-primary" />
                <h3 className="mt-4 font-semibold">Eco-Friendly First</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Organic treatment options always shown before chemical alternatives.
                </p>
              </Card>
              <Card className="p-6">
                <Zap className="h-10 w-10 text-accent" />
                <h3 className="mt-4 font-semibold">Instant Analysis</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get results in under 3 seconds with our optimized AI pipeline.
                </p>
              </Card>
              <Card className="p-6">
                <Users className="h-10 w-10 text-warning" />
                <h3 className="mt-4 font-semibold">Community Powered</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Real-time pest alerts from farmers in your region.
                </p>
              </Card>
              <Card className="p-6">
                <CloudSun className="h-10 w-10 text-info" />
                <h3 className="mt-4 font-semibold">Predictive Alerts</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Weather-based outbreak predictions keep you one step ahead.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Protect Your Crops?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start scanning now - no signup required. Upload an image or use your camera 
            to get instant pest identification and treatment recommendations.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/detect">
                <Camera className="h-5 w-5" />
                Start Scanning Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/community">
                <MapPin className="mr-2 h-5 w-5" />
                View Community Reports
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
