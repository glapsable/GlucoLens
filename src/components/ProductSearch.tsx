import { useState } from "react";
import type { ScanResult } from "../types";

interface OFFProduct {
  product_name: string;
  nutriments: { carbohydrates_100g: number };
}

interface Props {
  onResult: (result: ScanResult) => void;
}

export function ProductSearch({ onResult }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OFFProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OFFProduct | null>(null);
  const [weight, setWeight] = useState("100");
  const [error, setError] = useState<string | null>(null);

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(null);
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=6&fields=product_name,nutriments`,
      );
      const data = await res.json();
      const valid = (data.products as OFFProduct[]).filter(
        (p) => p.product_name && p.nutriments?.["carbohydrates_100g"] != null,
      );
      setResults(valid);
      if (valid.length === 0)
        setError("Nie znaleziono produktu. Spróbuj innej nazwy.");
    } catch {
      setError("Błąd połączenia. Sprawdź internet.");
    } finally {
      setLoading(false);
    }
  }

  function confirm() {
    if (!selected) return;
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    const carbs100 = selected.nutriments["carbohydrates_100g"];
    const carbs = Math.round(((carbs100 * w) / 100) * 10) / 10;
    const result: ScanResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      label: selected.product_name,
      total_carbs_g: carbs,
      items: [{ name: selected.product_name, weight_g: w, carbs_g: carbs }],
      image_url: "",
    };
    onResult(result);
    setQuery("");
    setResults([]);
    setSelected(null);
    setWeight("100");
  }

  return (
    <div className="flex flex-col gap-4 px-4 max-w-sm mx-auto">
      {/* Wyszukiwarka */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="np. chipsy Lay's, baton Lion..."
          className="flex-1 bg-[#16161f] border border-[#2a2a3a] text-gray-200 text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-purple-600"
        />
        <button
          onClick={search}
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded-xl px-4 py-3 text-sm font-medium"
        >
          {loading ? "..." : "Szukaj"}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {/* Wyniki */}
      {results.length > 0 && !selected && (
        <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl overflow-hidden">
          {results.map((p, i) => (
            <div
              key={i}
              onClick={() => setSelected(p)}
              className="flex justify-between items-center px-4 py-3 border-b border-[#1e1e2e] last:border-0 cursor-pointer active:bg-[#1e1e2e]"
            >
              <p className="text-sm text-gray-200 flex-1 pr-2">
                {p.product_name}
              </p>
              <p className="text-xs text-purple-400 whitespace-nowrap">
                {p.nutriments["carbohydrates_100g"]}g WW/100g
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Wybrany produkt + gramatura */}
      {selected && (
        <div className="bg-[#16161f] border border-[#3a2a5a] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-200 flex-1 pr-2">
              {selected.product_name}
            </p>
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-gray-500"
            >
              zmień
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {selected.nutriments["carbohydrates_100g"]}g węglowodanów / 100g
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Ile gramów zjesz?</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-20 bg-[#0f0f13] border border-[#3a2a5a] text-purple-300 text-sm rounded-lg px-3 py-2 text-center focus:outline-none"
            />
            <span className="text-sm text-gray-500">g</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <p className="text-sm text-gray-400">Węglowodany:</p>
            <p className="text-xl font-medium text-purple-400">
              {Math.round(
                ((selected.nutriments["carbohydrates_100g"] *
                  parseFloat(weight || "0")) /
                  100) *
                  10,
              ) / 10}
              g
            </p>
          </div>
          <button
            onClick={confirm}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white rounded-xl py-3 text-sm font-medium"
          >
            Dodaj do historii
          </button>
        </div>
      )}
    </div>
  );
}
