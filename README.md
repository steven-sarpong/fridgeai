# FridgeAI / SmartMeal Tracker

Mobile-first Web-App zum Kühlschrank- und Essen-Tracking mit KI-gestütztem Kamera-Scan.
Nutzer fotografieren ihren Kühlschrank, die KI erkennt Lebensmittel, speichert sie in einer
digitalen Kühlschrank-Liste und schlägt darauf basierend Rezepte vor. Zusätzlich können
Mahlzeiten getrackt werden (Kalorien & Makros).

## Tech-Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** für ein modernes, mobile-first UI
- **OpenRouter** als KI-Provider (multimodales Vision-Modell + Text-Modell + Fallback)
- **localStorage** als clientseitige Persistenz (keine Server-Datenbank, datenschutzfreundlich)

## Setup

### 1. Voraussetzungen

- [Node.js](https://nodejs.org) (Version 18 oder höher) und npm müssen installiert sein.

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

Kopiere `.env.example` zu `.env.local`:

```bash
cp .env.example .env.local        # macOS/Linux
```

```powershell
Copy-Item .env.example .env.local # Windows PowerShell
```

Trage deinen OpenRouter-API-Key ein (kostenlos erhältlich unter https://openrouter.ai/keys):

```env
OPENROUTER_API_KEY=sk-or-...

OPENROUTER_PRIMARY_MODEL=google/gemini-2.5-flash
OPENROUTER_FALLBACK_MODEL=google/gemma-4-26b-a4b-it:free
OPENROUTER_TEXT_MODEL=openai/gpt-4o-mini
```

Du kannst die Modelle frei austauschen – wichtig ist nur, dass `OPENROUTER_PRIMARY_MODEL`
und `OPENROUTER_FALLBACK_MODEL` multimodale (Bild-fähige) Modelle sind, da sie für den
Kühlschrank-Scan genutzt werden. Welche Modelle OpenRouter aktuell anbietet, ändert sich
gelegentlich – die volle, aktuelle Liste mit Modalitäten gibt es unter
https://openrouter.ai/api/v1/models (Feld `architecture.input_modalities` muss `image`
enthalten).

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die App läuft anschließend unter http://localhost:3000.

> **Kamera-Hinweis:** Browser erlauben Kamera-Zugriff (`getUserMedia`) nur über `https://`
> oder `localhost`. Für Tests auf einem echten Smartphone im lokalen Netzwerk wird daher ein
> Tunnel-Dienst (z. B. `ngrok`) oder ein Deployment mit HTTPS benötigt.

### 5. Production-Build

```bash
npm run build
npm run start
```

## Projektstruktur

```
src/
  app/
    page.tsx              → Dashboard
    scan/page.tsx          → Kamera-Scan & KI-Analyse
    fridge/page.tsx        → Digitale Kühlschrank-Liste
    recipes/page.tsx       → Rezeptvorschläge
    meals/page.tsx         → Mahlzeiten-Tracker
    settings/page.tsx      → API-Key-Hinweis, Datenschutz, Reset
    api/
      scan/route.ts        → API-Route: Bildanalyse über OpenRouter
      recipes/route.ts     → API-Route: Rezeptgenerierung über OpenRouter
    layout.tsx, globals.css
  components/
    CameraCapture.tsx       → Kamera-Zugriff + Foto-Upload-Fallback
    BottomNav.tsx           → App-Navigation
    PageHeader.tsx
  lib/
    ai-service.ts           → Zentrale OpenRouter-Anbindung inkl. Fallback-Logik
    storage.ts               → localStorage-CRUD für Lebensmittel & Mahlzeiten
    category-style.ts         → Farben/Emojis je Kategorie, Datums-Helper
  types/
    index.ts                 → Zentrale TypeScript-Typen
```

## Wie die KI-Integration funktioniert

Alle Aufrufe an OpenRouter laufen ausschließlich über die Server-Route
[`src/lib/ai-service.ts`](src/lib/ai-service.ts) – der API-Key verlässt nie den Server.

1. **Kühlschrank-Scan** (`analyzeFridgeImage`): Das aufgenommene Foto wird als Base64-Data-URL
   an ein multimodales Modell (`OPENROUTER_PRIMARY_MODEL`) gesendet. Schlägt die Anfrage fehl
   (Timeout, Modell nicht verfügbar, Rate-Limit), wird automatisch `OPENROUTER_FALLBACK_MODEL`
   verwendet.
2. **Rezeptvorschläge** (`generateRecipes`): Die Namen aller Kühlschrank-Items werden als
   Text-Prompt an `OPENROUTER_TEXT_MODEL` gesendet, mit demselben Fallback-Mechanismus.
3. Beide Funktionen fordern strukturierte **JSON-Antworten** an (`response_format: json_object`)
   und parsen das Ergebnis defensiv (inkl. Recovery, falls ein Modell zusätzlichen Text um das
   JSON herum liefert).

### Beispiel-Prompts

**System-Prompt für den Kühlschrank-Scan:**

```
Du bist ein präziser Lebensmittel-Erkennungsassistent für eine Kühlschrank-Tracking-App.
Analysiere das übermittelte Foto eines Kühlschranks oder einzelner Lebensmittel.
Antworte AUSSCHLIESSLICH mit validem JSON in genau diesem Format, ohne zusätzlichen Text:

{
  "detected_items": [
    { "name": "Tomaten", "category": "Gemüse", "confidence": 0.91, "estimated_quantity": "4 Stück" }
  ]
}
```

**System-Prompt für Rezeptvorschläge:**

```
Du bist ein kreativer, ernährungsbewusster Koch-Assistent für eine Meal-Tracking-App.
Erstelle Rezeptvorschläge basierend auf den vorhandenen Kühlschrank-Zutaten des Nutzers.
Antworte AUSSCHLIESSLICH mit validem JSON in genau diesem Format, ohne zusätzlichen Text:

{
  "recipes": [
    {
      "title": "Tomaten-Mozzarella-Omelett",
      "category": "Schnell & einfach",
      "available_ingredients": ["Tomaten", "Eier", "Mozzarella"],
      "missing_ingredients": ["Basilikum"],
      "prep_time": "15 Minuten",
      "calories_estimate": 520,
      "macros": { "protein": "32g", "carbs": "12g", "fat": "38g" },
      "steps": ["Tomaten waschen und schneiden.", "Eier verquirlen.", "Alles in der Pfanne braten."]
    }
  ]
}
```

Beide vollständigen Prompts findest du in [`src/lib/ai-service.ts`](src/lib/ai-service.ts).

## Datenschutz

- Es gibt **keine Server-Datenbank** – alle Lebensmittel- und Mahlzeiten-Daten liegen
  ausschließlich im `localStorage` des Browsers.
- Fotos werden nur zur Analyse an OpenRouter übertragen und nicht von der App selbst
  gespeichert.
- Der API-Key wird ausschließlich serverseitig (Next.js API-Routes) verwendet.

## Bekannte Grenzen / mögliche Erweiterungen

- Kein Nutzer-Login / Multi-Device-Sync (bewusst einfach gehalten, localStorage-basiert).
- Mengenangaben und Haltbarkeitsdaten aus dem KI-Scan sind Schätzungen und sollten bei Bedarf
  vom Nutzer korrigiert werden (dafür gibt es die Bearbeiten-Funktion im Scan-Review).
- Für einen produktiven Mehrnutzer-Einsatz empfiehlt sich der Wechsel von localStorage zu einer
  echten Datenbank (z. B. Supabase/Postgres) inkl. Authentifizierung.
