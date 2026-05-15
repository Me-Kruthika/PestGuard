"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Camera, Upload, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/detection/image-uploader";
import { CameraCapture } from "@/components/detection/camera-capture";
import { DetectionResultComponent } from "@/components/detection/detection-result";
import { WeatherWidget } from "@/components/weather/weather-widget";
import { mockDetectPest } from "@/lib/mock-ai";
import { saveDetection } from "@/lib/storage"; // ✅ ADD THIS
import type { DetectionResult } from "@/lib/pest-data";

type ViewState = "upload" | "camera" | "result";

export default function DetectPage() {
  const [view, setView] = useState<ViewState>("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  // ✅ HANDLE IMAGE UPLOAD
  const handleImageSelect = async (_file: File, preview: string) => {
    setIsProcessing(true);
    try {
      const detection = await mockDetectPest(preview);

      // 🔥 SAVE TO STORAGE (this fixes dashboard)
      saveDetection({
        ...detection,
        timestamp: new Date(),
      });

      setResult(detection);
      setView("result");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ HANDLE CAMERA
  const handleCameraCapture = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const detection = await mockDetectPest(imageData);

      // 🔥 SAVE HERE TOO
      saveDetection({
        ...detection,
        timestamp: new Date(),
      });

      setResult(detection);
      setView("result");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewScan = () => {
    setResult(null);
    setView("upload");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">
          <Sparkles className="mr-1 h-3 w-3" />
          AI Detection
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Pest Detection</h1>
        <p className="mt-2 text-muted-foreground">
          Upload an image or use your camera to identify pests instantly with AI-powered analysis.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {view === "result" && result ? (
              <DetectionResultComponent
                key="result"
                result={result}
                onNewScan={handleNewScan}
              />
            ) : (
              <Card key="upload">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {view === "camera" ? (
                      <>
                        <Camera className="h-5 w-5" />
                        Camera Capture
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        Upload Image
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Take a clear photo of the affected plant area. Our AI will analyze it and identify any pests.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    onCameraRequest={() => setView("camera")}
                    disabled={isProcessing}
                  />
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WeatherWidget />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detection Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Capture images in good natural lighting</p>
              <p>• Get close to show pest details clearly</p>
              <p>• Include damaged + healthy tissue</p>
              <p>• Multiple angles improve accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Did You Know?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Early pest detection can reduce crop losses by up to 40% and decrease pesticide use.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Camera */}
      <AnimatePresence>
        {view === "camera" && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setView("upload")}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>
    </div>
  );
}