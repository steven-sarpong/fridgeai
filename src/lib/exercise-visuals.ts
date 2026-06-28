// Visuelles System für Trainingsübungen. Jede Muskelgruppe hat ein generisches
// KI-generiertes Demo-Video (public/exercises/*.mp4) als Bewegungs-Vorschau,
// plus Icon + Farbverlauf als Fallback, falls das Video nicht laden sollte.
// Eine einzelne `WorkoutExercise` kann das per `imageUrl`/`gifUrl` weiterhin
// gezielt überschreiben (siehe training/page.tsx, ExerciseVisual).

export interface ExerciseVisualStyle {
  icon: string; // lucide-react Icon-Name, in training/page.tsx auf Komponente gemappt
  gradient: string; // Tailwind-Gradient-Klassen (Fallback, falls Video nicht lädt)
  videoUrl: string; // generisches Bewegungs-Demo für die Muskelgruppe
}

const MUSCLE_GROUP_VISUALS: { match: RegExp; style: ExerciseVisualStyle }[] = [
  { match: /brust|chest|push/i, style: { icon: "Sparkle", gradient: "from-rose-400 to-rose-600", videoUrl: "/exercises/brust.mp4" } },
  { match: /rücken|lat|row|zug/i, style: { icon: "MoveVertical", gradient: "from-blue-400 to-blue-600", videoUrl: "/exercises/ruecken.mp4" } },
  { match: /schulter|shoulder|delt/i, style: { icon: "Circle", gradient: "from-amber-400 to-amber-600", videoUrl: "/exercises/schulter.mp4" } },
  { match: /bizeps|trizeps|arm/i, style: { icon: "Dumbbell", gradient: "from-purple-400 to-purple-600", videoUrl: "/exercises/arme.mp4" } },
  { match: /bein|quad|hamstring|leg|wade/i, style: { icon: "Footprints", gradient: "from-emerald-400 to-emerald-600", videoUrl: "/exercises/beine.mp4" } },
  { match: /gesäß|glute|hüfte/i, style: { icon: "Circle", gradient: "from-pink-400 to-pink-600", videoUrl: "/exercises/gesaess.mp4" } },
  { match: /bauch|core|abs/i, style: { icon: "Hexagon", gradient: "from-orange-400 to-orange-600", videoUrl: "/exercises/bauch.mp4" } },
  { match: /cardio|ausdauer|hiit/i, style: { icon: "HeartPulse", gradient: "from-red-400 to-red-600", videoUrl: "/exercises/cardio.mp4" } },
];

const DEFAULT_VISUAL: ExerciseVisualStyle = {
  icon: "Dumbbell",
  gradient: "from-brand-500 to-brand-700",
  videoUrl: "/exercises/cardio.mp4",
};

export function getExerciseVisual(muscleGroup: string): ExerciseVisualStyle {
  const found = MUSCLE_GROUP_VISUALS.find((entry) => entry.match.test(muscleGroup));
  return found?.style ?? DEFAULT_VISUAL;
}
