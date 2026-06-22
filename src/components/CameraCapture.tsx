"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Image as ImageIcon } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
}

// Kapselt den Kamera-Zugriff über getUserMedia. Fällt automatisch auf einen
// Datei-Upload zurück, falls die Kamera nicht verfügbar oder erlaubt ist.
export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  async function startCamera(mode: "environment" | "user" = facingMode) {
    setCameraError(null);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Kamera-Zugriff fehlgeschlagen:", err);
      setCameraActive(false);
      setCameraError(
        "Kamera nicht verfügbar oder Zugriff verweigert. Du kannst stattdessen ein Foto hochladen."
      );
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSwitchCamera() {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  }

  function handleTakePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    onCapture(dataUrl);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onCapture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-[3/4] bg-black rounded-xl2 overflow-hidden">
        {cameraActive ? (
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
            <Camera size={36} className="text-gray-500 mb-2" />
            <p className="text-sm text-gray-400">{cameraError || "Kamera wird gestartet…"}</p>
          </div>
        )}

        {cameraActive && (
          <button
            onClick={handleSwitchCamera}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"
            aria-label="Kamera wechseln"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex items-center gap-3">
        <button
          onClick={handleTakePhoto}
          disabled={!cameraActive}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Camera size={18} /> Foto aufnehmen
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary flex items-center justify-center gap-2"
          type="button"
        >
          <ImageIcon size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
