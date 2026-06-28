// Visuelles System für Trainingsübungen. Jede Kategorie entspricht einer
// konkreten Übung mit eigenem KI-generierten Demo-Video
// (public/exercises/*.mp4), plus Icon + Farbverlauf als Fallback, falls das
// Video nicht laden sollte. Eine einzelne `WorkoutExercise` kann das per
// `imageUrl`/`gifUrl` weiterhin gezielt überschreiben (siehe
// training/page.tsx, ExerciseVisual).
//
// Bevorzugte Quelle ist `exercise.visualCategory`: Die KI ordnet diese
// Kategorie bereits beim Erstellen des Trainingsplans zu (siehe
// WORKOUT_SYSTEM_PROMPT in ai-service.ts) und wählt dabei die Übung, die der
// tatsächlich generierten Übung am nächsten kommt - zuverlässiger als
// nachträgliches Text-Matching auf das freie "muscleGroup"-Feld. Für ältere,
// bereits gespeicherte Pläne ohne `visualCategory` bleibt das grobe
// Text-Matching auf eine der 8 ursprünglichen Kategorien als Fallback
// erhalten.

import { ExerciseVisualCategory } from "@/types";

export interface ExerciseVisualStyle {
  icon: string; // lucide-react Icon-Name, in training/page.tsx auf Komponente gemappt
  gradient: string; // Tailwind-Gradient-Klassen (Fallback, falls Video nicht lädt)
  videoUrl: string; // KI-generiertes Demo-Video für die konkrete Übung
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
  trizeps_dips: { icon: "Dumbbell", gradient: "from-purple-400 to-purple-600", videoUrl: "/exercises/trizeps_dips.mp4" },
  fliegende: { icon: "Sparkle", gradient: "from-rose-400 to-rose-600", videoUrl: "/exercises/fliegende.mp4" },
  seitheben: { icon: "Circle", gradient: "from-amber-400 to-amber-600", videoUrl: "/exercises/seitheben.mp4" },
  kreuzheben: { icon: "MoveVertical", gradient: "from-blue-400 to-blue-600", videoUrl: "/exercises/kreuzheben.mp4" },
  klimmzuege: { icon: "MoveVertical", gradient: "from-blue-400 to-blue-600", videoUrl: "/exercises/klimmzuege.mp4" },
  rudern: { icon: "MoveVertical", gradient: "from-blue-400 to-blue-600", videoUrl: "/exercises/rudern.mp4" },
  face_pulls: { icon: "Circle", gradient: "from-amber-400 to-amber-600", videoUrl: "/exercises/face_pulls.mp4" },
  beinpresse: { icon: "Footprints", gradient: "from-emerald-400 to-emerald-600", videoUrl: "/exercises/beinpresse.mp4" },
  rumaenisches_kreuzheben: { icon: "Footprints", gradient: "from-emerald-400 to-emerald-600", videoUrl: "/exercises/rumaenisches_kreuzheben.mp4" },
  wadenheben: { icon: "Footprints", gradient: "from-emerald-400 to-emerald-600", videoUrl: "/exercises/wadenheben.mp4" },
  ausfallschritte: { icon: "Footprints", gradient: "from-emerald-400 to-emerald-600", videoUrl: "/exercises/ausfallschritte.mp4" },
  liegestuetze: { icon: "Sparkle", gradient: "from-rose-400 to-rose-600", videoUrl: "/exercises/liegestuetze.mp4" },
  plank: { icon: "Hexagon", gradient: "from-orange-400 to-orange-600", videoUrl: "/exercises/plank.mp4" },
  russian_twists: { icon: "Hexagon", gradient: "from-orange-400 to-orange-600", videoUrl: "/exercises/russian_twists.mp4" },
  beinheben: { icon: "Hexagon", gradient: "from-orange-400 to-orange-600", videoUrl: "/exercises/beinheben.mp4" },
  burpees: { icon: "HeartPulse", gradient: "from-red-400 to-red-600", videoUrl: "/exercises/burpees.mp4" },
  mountain_climbers: { icon: "HeartPulse", gradient: "from-red-400 to-red-600", videoUrl: "/exercises/mountain_climbers.mp4" },
  seilspringen: { icon: "HeartPulse", gradient: "from-red-400 to-red-600", videoUrl: "/exercises/seilspringen.mp4" },
  trizeps_kickback: { icon: "Dumbbell", gradient: "from-purple-400 to-purple-600", videoUrl: "/exercises/trizeps_kickback.mp4" },
  enger_kabelzug: { icon: "MoveVertical", gradient: "from-blue-400 to-blue-600", videoUrl: "/exercises/enger_kabelzug.mp4" },
  goblet_squat: { icon: "Footprints", gradient: "from-emerald-400 to-emerald-600", videoUrl: "/exercises/goblet_squat.mp4" },
  step_ups: { icon: "Footprints", gradient: "from-emerald-400 to-emerald-600", videoUrl: "/exercises/step_ups.mp4" },
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
