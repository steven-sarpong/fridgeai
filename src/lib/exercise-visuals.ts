// Visuelles System für Trainingsübungen. Jede Kategorie hat ein generisches
// KI-generiertes Demo-Video (public/exercises/*.mp4) als Bewegungs-Vorschau,
// plus Icon + Farbverlauf als Fallback, falls das Video nicht laden sollte.
// Eine einzelne `WorkoutExercise` kann das per `imageUrl`/`gifUrl` weiterhin
// gezielt überschreiben (siehe training/page.tsx, ExerciseVisual).
//
// Bevorzugte Quelle ist `exercise.visualCategory`: Die KI ordnet diese
// Kategorie bereits beim Erstellen des Trainingsplans zu (siehe
// WORKOUT_SYSTEM_PROMPT in ai-service.ts), basierend auf der tatsächlichen
// Bewegung der Übung - zuverlässiger als nachträgliches Text-Matching auf
// das freie "muscleGroup"-Feld, das z.B. Trizeps-Übungen oft fälschlich dem
// Bizeps-Curl-Video zuordnen würde. Für ältere, bereits gespeicherte Pläne
// ohne `visualCategory` bleibt das Text-Matching als Fallback erhalten.

import { ExerciseVisualCategory } from "@/types";

export interface ExerciseVisualStyle {
  icon: string; // lucide-react Icon-Name, in training/page.tsx auf Komponente gemappt
  gradient: string; // Tailwind-Gradient-Klassen (Fallback, falls Video nicht lädt)
  videoUrl: string; // generisches Bewegungs-Demo für die Kategorie
}

const CATEGORY_VISUALS: Record<ExerciseVisualCategory, ExerciseVisualStyle> = {
  brust: { icon: "Sparkle", gradient: "from-rose-400 to-rose-600", videoUrl: "/exercises/brust.mp4" },
  ruecken: { icon: "MoveVertical", gradient: "from-blue-400 to-blue-600", videoUrl: "/exercises/ruecken.mp4" },
  schulter: { icon: "Circle", gradient: "from-amber-400 to-amber-600", videoUrl: "/exercises/schulter.mp4" },
  arme: { icon: "Dumbbell", gradient: "from-purple-400 to-purple-600", videoUrl: "/exercises/arme.mp4" },
  beine: { icon: "Footprints", gradient: "from-emerald-400 to-emerald-600", videoUrl: "/exercises/beine.mp4" },
  gesaess: { icon: "Circle", gradient: "from-pink-400 to-pink-600", videoUrl: "/exercises/gesaess.mp4" },
  bauch: { icon: "Hexagon", gradient: "from-orange-400 to-orange-600", videoUrl: "/exercises/bauch.mp4" },
  cardio: { icon: "HeartPulse", gradient: "from-red-400 to-red-600", videoUrl: "/exercises/cardio.mp4" },
};

// Fallback für ältere Trainingspläne, die noch kein `visualCategory`-Feld
// haben und nur das freie "muscleGroup"-Textfeld mitbringen.
const MUSCLE_GROUP_FALLBACK: { match: RegExp; category: ExerciseVisualCategory }[] = [
  { match: /brust|chest|push/i, category: "brust" },
  { match: /rücken|lat|row|zug/i, category: "ruecken" },
  { match: /schulter|shoulder|delt/i, category: "schulter" },
  { match: /bizeps|trizeps|arm/i, category: "arme" },
  { match: /bein|quad|hamstring|leg|wade/i, category: "beine" },
  { match: /gesäß|glute|hüfte/i, category: "gesaess" },
  { match: /bauch|core|abs/i, category: "bauch" },
  { match: /cardio|ausdauer|hiit/i, category: "cardio" },
];

const DEFAULT_CATEGORY: ExerciseVisualCategory = "cardio";

export function getExerciseVisual(
  muscleGroup: string,
  visualCategory?: ExerciseVisualCategory
): ExerciseVisualStyle {
  if (visualCategory && CATEGORY_VISUALS[visualCategory]) {
    return CATEGORY_VISUALS[visualCategory];
  }
  const found = MUSCLE_GROUP_FALLBACK.find((entry) => entry.match.test(muscleGroup));
  return CATEGORY_VISUALS[found?.category ?? DEFAULT_CATEGORY];
}
