"use client";

import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { Camera, X, RotateCcw, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  isProcessing?: boolean;
}

export function CameraCapture({ onCapture, onClose, isProcessing }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, []);

  const retake = () => {
    setCapturedImage(null);
  };

  const confirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleUserMedia = () => {
    setHasPermission(true);
  };

  const handleUserMediaError = () => {
    setHasPermission(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg px-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Capture Plant Image</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isProcessing}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close camera</span>
          </Button>
        </div>

        {/* Camera View */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-black">
          {capturedImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Captured plant"
                className="h-full w-full object-cover"
              />
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="flex items-center gap-2 rounded-lg bg-card/90 px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">Analyzing...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {hasPermission === false ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                  <Camera className="h-16 w-16 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Camera Access Denied</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Please enable camera permissions in your browser settings to use this feature.
                    </p>
                  </div>
                  <Button variant="outline" onClick={onClose}>
                    Go Back
                  </Button>
                </div>
              ) : (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode,
                      width: 1280,
                      height: 1280,
                    }}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={handleUserMediaError}
                    className="h-full w-full object-cover"
                  />
                  {/* Scanning overlay */}
                  <div className="pointer-events-none absolute inset-0">
                    {/* Corner markers */}
                    <div className="absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 border-primary" />
                    <div className="absolute right-4 top-4 h-12 w-12 border-r-2 border-t-2 border-primary" />
                    <div className="absolute bottom-4 left-4 h-12 w-12 border-b-2 border-l-2 border-primary" />
                    <div className="absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-primary" />
                    {/* Guide text */}
                    <div className="absolute bottom-16 left-0 right-0 text-center">
                      <span className="rounded-lg bg-background/80 px-3 py-1 text-sm backdrop-blur-sm">
                        Center the affected plant area in frame
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-4">
          {capturedImage ? (
            <>
              <Button
                variant="outline"
                onClick={retake}
                disabled={isProcessing}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retake
              </Button>
              <Button onClick={confirm} disabled={isProcessing} className="gap-2">
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {isProcessing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={toggleCamera}>
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Switch camera</span>
              </Button>
              <Button
                size="lg"
                className="h-16 w-16 rounded-full"
                onClick={capture}
                disabled={!hasPermission}
              >
                <Camera className="h-6 w-6" />
                <span className="sr-only">Capture image</span>
              </Button>
              <Button variant="outline" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium">Tips for best results:</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>- Ensure good lighting on the affected area</li>
            <li>- Get close enough to see pest details</li>
            <li>- Include both damaged and healthy tissue if possible</li>
            <li>- Keep the camera steady to avoid blur</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
