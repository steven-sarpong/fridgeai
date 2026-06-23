"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Image as ImageIcon, RefreshCw, Loader2 } from "lucide-react";
import { processImageFile, resizeDataUrl, ImageProcessingError } from "@/lib/image-utils";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onError?: (message: string) => void;
}

type Status = "starting" | "ready" | "error";

// Kapselt den Kamera-Zugriff über getUserMedia. Fällt automatisch auf einen
// Datei-Upload zurück, falls die Kamera nicht verfügbar oder erlaubt ist.
export default function CameraCapture({ onCapture, onError }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<Status>("starting");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function startCamera(mode: "environment" | "user" = facingMode) {
    setStatus("starting");
    setCameraError(null);
    stopCamera();

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setCameraError("Dieser Browser unterstützt keinen Kamera-Zugriff.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });
      streamRef.current = stream;

      // Das <video>-Element ist immer im DOM gemountet (siehe JSX unten),
      // dadurch existiert videoRef.current bereits zuverlässig an dieser Stelle.
      const video = videoRef.current;
      if (!video) {
        setStatus("error");
        setCameraError("Kamera-Vorschau konnte nicht initialisiert werden.");
        return;
      }

      video.srcObject = stream;

      // Erst wenn wirklich Frames vorliegen, die Vorschau als "bereit" markieren –
      // verhindert das kurze Schwarzbild beim Start.
      await new Promise<void>((resolve) => {
        const handleReady = () => {
          video.removeEventListener("loadeddata", handleReady);
          resolve();
        };
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.addEventListener("loadeddata", handleReady);
        }
      });

      await video.play();
      setStatus("ready");
    } catch (err) {
      console.warn("Kamera-Zugriff fehlgeschlagen:", err);
      stopCamera();
      setStatus("error");
      const isPermissionError =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      setCameraError(
        isPermissionError
          ? "Kamera-Berechtigung wurde verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen oder lade stattdessen ein Foto hoch."
          : "Kamera nicht verfügbar. Du kannst stattdessen ein Foto hochladen."
      );
    }
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

  async function handleTakePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || status !== "ready") return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const rawDataUrl = canvas.toDataURL("image/jpeg", 0.92);

    try {
      // Auf einheitliche Maximalgröße verkleinern, bevor es an die KI geht.
      const resized = await resizeDataUrl(rawDataUrl);
      onCapture(resized);
    } catch {
      onCapture(rawDataUrl);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // erlaubt erneutes Auswählen derselben Datei
    if (!file) return;

    setUploadError(null);
    setUploadBusy(true);
    try {
      const processedDataUrl = await processImageFile(file);
      onCapture(processedDataUrl);
    } catch (err) {
      const message =
        err instanceof ImageProcessingError
          ? err.message
          : "Das Bild konnte nicht verarbeitet werden. Bitte versuche es erneut.";
      setUploadError(message);
      onError?.(message);
    } finally {
      setUploadBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-[3/4] bg-black rounded-xl2 overflow-hidden">
        {/* Video bleibt immer gemountet, damit videoRef beim Start der Kamera bereits existiert. */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${status === "ready" ? "opacity-100" : "opacity-0"}`}
          muted
          playsInline
        />

        {status !== "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            {status === "starting" && (
              <>
                <Loader2 size={32} className="text-gray-400 mb-2 animate-spin" />
                <p className="text-sm text-gray-400">Kamera wird gestartet…</p>
              </>
            )}
            {status === "error" && (
              <>
                <Camera size={36} className="text-gray-500 mb-2" />
                <p className="text-sm text-gray-400 mb-4">{cameraError}</p>
                <button
                  onClick={() => startCamera()}
                  type="button"
                  className="btn-secondary flex items-center gap-2 text-sm py-2 px-4"
                >
                  <RefreshCw size={15} /> Kamera erneut starten
                </button>
              </>
            )}
          </div>
        )}

        {status === "ready" && (
          <button
            onClick={handleSwitchCamera}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"
            aria-label="Kamera wechseln"
            type="button"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {uploadError && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {uploadError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleTakePhoto}
          disabled={status !== "ready"}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
          type="button"
        >
          <Camera size={18} /> Foto aufnehmen
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadBusy}
          className="btn-secondary flex items-center justify-center gap-2 px-4"
          type="button"
          aria-label="Foto hochladen"
        >
          {uploadBusy ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
