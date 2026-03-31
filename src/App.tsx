import { useState } from "react";
import { ScanScreen } from "./components/ScanScreen";
import { ResultCard } from "./components/ResultCard";
import { HistoryList } from "./components/HistoryList";
import { useOpenAI } from "./hooks/useOpenAI";
import type { ScanResult } from "./types";

export default function App() {
  const { analyzeImage, loading, error } = useOpenAI();
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [selected, setSelected] = useState<ScanResult | null>(null);

  async function handleScan(base64: string) {
    const result = await analyzeImage(base64);
    if (result) {
      setHistory((prev) => [result, ...prev]);
      setSelected(result);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white pb-10">
      <ScanScreen onScan={handleScan} loading={loading} />

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
