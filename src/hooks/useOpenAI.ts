import { useState } from "react";
import type { ScanResult, FoodItem } from "../types";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyzeImage(imageBase64: string): Promise<ScanResult | null> {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          max_tokens: 800,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Jesteś asystentem dla diabetyka typu 1. Przeanalizuj zdjęcie posiłku i zwróć TYLKO JSON (bez markdown, bez \`\`\`):
{
  "label": "krótka nazwa posiłku",
  "items": [
    { "name": "nazwa produktu", "weight_g": szacowana waga w gramach, "carbs_g": węglowodany w gramach }
  ],
  "total_carbs_g": suma wszystkich węglowodanów
}
Zasady szacowania wagi:
- Jeśli na zdjęciu widoczna jest karta płatnicza (85x54mm), moneta lub inny znany obiekt — użyj go jako punktu odniesienia do oszacowania wagi.
- Szacuj wagę ostrożnie, raczej zawyżaj niż zaniżaj.
- Węglowodany obliczaj na podstawie rzeczywistych wartości odżywczych produktu i oszacowanej wagi.
- Jeśli nie widzisz jedzenia, zwróć pustą tablicę items i total_carbs_g: 0.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                    detail: "high",
                  },
                },
              ],
            },
          ],
        }),
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content ?? "";
      const parsed = JSON.parse(text);

      const result: ScanResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        label: parsed.label ?? "Posiłek",
        total_carbs_g: parsed.total_carbs_g ?? 0,
        items: (parsed.items ?? []) as FoodItem[],
        image_url: `data:image/jpeg;base64,${imageBase64}`,
      };

      return result;
    } catch {
      setError("Nie udało się przeanalizować zdjęcia. Spróbuj ponownie.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { analyzeImage, loading, error };
}
