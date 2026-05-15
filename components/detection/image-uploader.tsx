"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  onCameraRequest: () => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageSelect, onCameraRequest, disabled }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setFileName(file.name);
        onImageSelect(file, previewUrl);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    disabled,
  });

  const clearImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFileName(null);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Selected plant"
                className="h-full w-full object-contain"
              />
              {/* Scanning overlay when processing */}
              {disabled && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm">
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-lg bg-card/90 px-4 py-2 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                        <span className="text-sm font-medium">Analyzing image...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {!disabled && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            )}
            {fileName && (
              <p className="mt-2 text-center text-sm text-muted-foreground">{fileName}</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                "relative cursor-pointer rounded-xl border-2 border-dashed p-8 transition-all",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50",
                disabled && "pointer-events-none opacity-50"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  {isDragActive ? (
                    <ImageIcon className="h-8 w-8 text-primary" />
                  ) : (
                    <Upload className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? "Drop image here" : "Upload plant image"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Drag and drop or click to browse
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Supports JPG, PNG, WebP (max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Camera option */}
            <div className="mt-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative bg-background px-4 text-sm text-muted-foreground">or</span>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full gap-2"
                onClick={onCameraRequest}
                disabled={disabled}
              >
                <Camera className="h-4 w-4" />
                Use Camera
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
