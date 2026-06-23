// Gemeinsame Bildverarbeitung für Kamera-Aufnahme und Datei-Upload.
// Normalisiert jedes unterstützte Format auf ein verkleinertes JPEG-DataURL:
// - reduziert die Dateigröße (wichtig für Vision-API-Kosten & Limits)
// - liefert ein einheitliches Format für die KI-Analyse
// - liefert nebenbei die Vorschau (dieselbe DataURL kann direkt in <img> genutzt werden)

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB Rohdatei-Obergrenze
const MAX_DIMENSION = 1600; // längste Kante nach Verkleinerung
const JPEG_QUALITY = 0.82;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export class ImageProcessingError extends Error {}

function isLikelyAcceptedFile(file: File): boolean {
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  // iOS liefert bei HEIC/HEIF teils einen leeren oder falschen MIME-Type –
  // daher zusätzlich über die Dateiendung prüfen.
  const lowerName = file.name.toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"].some((ext) =>
    lowerName.endsWith(ext)
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new ImageProcessingError("Datei konnte nicht gelesen werden."));
    };
    reader.onerror = () => reject(new ImageProcessingError("Datei konnte nicht gelesen werden."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(
        new ImageProcessingError(
          "Dieses Bildformat kann nicht verarbeitet werden. Bitte nutze JPG, PNG oder WEBP."
        )
      );
    img.src = src;
  });
}

function drawToJpegDataUrl(img: HTMLImageElement): string {
  let { width, height } = img;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width >= height) {
      height = Math.round((height / width) * MAX_DIMENSION);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width / height) * MAX_DIMENSION);
      height = MAX_DIMENSION;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ImageProcessingError("Bildverarbeitung wird von diesem Browser nicht unterstützt.");
  }
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

function isHeicFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    lowerName.endsWith(".heic") ||
    lowerName.endsWith(".heif")
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new ImageProcessingError(message)), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

/**
 * Validiert und verarbeitet eine hochgeladene Bilddatei.
 * Wirft ImageProcessingError mit einer für Nutzer verständlichen Meldung.
 */
export async function processImageFile(file: File): Promise<string> {
  if (!isLikelyAcceptedFile(file)) {
    throw new ImageProcessingError(
      "Nicht unterstütztes Dateiformat. Bitte JPG, PNG, WEBP oder HEIC verwenden."
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new ImageProcessingError(
      `Die Datei ist zu groß (max. ${Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)} MB).`
    );
  }

  const heic = isHeicFile(file);
  const rawDataUrl = await readFileAsDataUrl(file);

  try {
    // Manche Browser (v.a. Chrome/Firefox) können HEIC nicht decodieren und hängen
    // dabei eher, statt sofort einen Fehler zu werfen – daher mit Timeout abbrechen.
    const img = await withTimeout(
      loadImage(rawDataUrl),
      heic ? 6000 : 15000,
      "Das Bild konnte nicht geladen werden (Zeitüberschreitung)."
    );
    return drawToJpegDataUrl(img);
  } catch (err) {
    if (heic) {
      throw new ImageProcessingError(
        "HEIC-Fotos werden von diesem Browser nicht unterstützt. Nutze die Kamera-Funktion direkt in der App, oder stelle dein iPhone unter Einstellungen → Kamera → Formate auf \"Aufnahmekompatibilität – höchste\" (speichert als JPG)."
      );
    }
    if (err instanceof ImageProcessingError) throw err;
    throw new ImageProcessingError(
      "Dieses Bild konnte nicht verarbeitet werden. Bitte als JPG, PNG oder WEBP erneut versuchen."
    );
  }
}

/** Verkleinert ein bereits vorhandenes DataURL-Bild (z. B. direkt von der Kamera). */
export async function resizeDataUrl(dataUrl: string): Promise<string> {
  const img = await loadImage(dataUrl);
  return drawToJpegDataUrl(img);
}
