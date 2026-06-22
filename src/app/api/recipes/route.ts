import { NextRequest, NextResponse } from "next/server";
import { generateRecipes, AIServiceError } from "@/lib/ai-service";
import { RecipeCategory } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients, category } = body as {
      ingredients?: string[];
      category?: RecipeCategory;
    };

    if (!Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "Bitte ein Array von Zutaten-Namen übermitteln." },
        { status: 400 }
      );
    }

    const result = await generateRecipes(ingredients, category);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/recipes] Fehler:", error);
    const message =
      error instanceof AIServiceError
        ? error.message
        : "Die Rezept-Generierung ist fehlgeschlagen. Bitte versuche es erneut.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
