import { useState } from "react";
import { ScanScreen } from "./components/ScanScreen";
import { ResultCard } from "./components/ResultCard";
import { HistoryList } from "./components/HistoryList";
import { ProductSearch } from "./components/ProductSearch";
import { useOpenAI } from "./hooks/useOpenAI";
import type { ScanResult } from "./types";

type Mode = "scan" | "search";

export default function App() {
  const { analyzeImage, loading, error } = useOpenAI();
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [selected, setSelected] = useState<ScanResult | null>(null);
  const [mode, setMode] = useState<Mode>("scan");

  async function handleScan(base64: string, labelMode = false) {
    const result = await analyzeImage(base64, labelMode);
    if (result) {
      setHistory((prev) => [result, ...prev]);
      setSelected(result);
    }
  }

  function handleProductResult(result: ScanResult) {
    setHistory((prev) => [result, ...prev]);
    setSelected(result);
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white pb-10">
      {/* Nagłówek */}
      <div className="text-center pt-8 mb-4">
        <div className="text-2xl font-medium tracking-wide">
          <span className="text-purple-400">Gluco</span>
          <span className="text-purple-300">Lens</span>
        </div>
      </div>

      {/* Przełącznik trybów */}
      <div className="flex gap-2 px-4 mb-6 max-w-sm mx-auto">
        <button
          onClick={() => setMode("scan")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode === "scan" ? "bg-purple-700 text-white" : "bg-[#16161f] text-gray-400 border border-[#2a2a3a]"}`}
        >
          📸 Skanuj
        </button>
        <button
          onClick={() => setMode("search")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode === "search" ? "bg-purple-700 text-white" : "bg-[#16161f] text-gray-400 border border-[#2a2a3a]"}`}
        >
          🔍 Szukaj
        </button>
      </div>

      {mode === "scan" && <ScanScreen onScan={handleScan} loading={loading} />}

      {mode === "search" && <ProductSearch onResult={handleProductResult} />}

      {error && (
        <p className="text-center text-red-400 text-sm mt-4 px-4">{error}</p>
      )}

      <HistoryList history={history} onSelect={setSelected} />

      {selected && (
        <ResultCard result={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
