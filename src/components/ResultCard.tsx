import { useState } from "react";
import type { ScanResult, FoodItem } from "../types";

interface Props {
  result: ScanResult;
  onClose: () => void;
}

const CARBS_PER_100G: Record<string, number> = {};

function recalcCarbs(item: FoodItem, newWeight: number): number {
  const ratio = item.carbs_g / item.weight_g;
  return Math.round(ratio * newWeight * 10) / 10;
}

export function ResultCard({ result, onClose }: Props) {
  const [items, setItems] = useState<FoodItem[]>(result.items);

  const totalCarbs =
    Math.round(items.reduce((s, i) => s + i.carbs_g, 0) * 10) / 10;

  function handleWeightChange(idx: number, val: string) {
    const newWeight = parseFloat(val);
    if (isNaN(newWeight) || newWeight <= 0) return;
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              weight_g: newWeight,
              carbs_g: recalcCarbs(item, newWeight),
            }
          : item,
      ),
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#0f0f13] border border-[#2a2a3a] rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#2a2a3a] rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Wynik skanu</p>
            <p className="text-lg font-medium text-gray-100">{result.label}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-medium text-purple-400">{totalCarbs}</p>
            <p className="text-xs text-gray-500">g węglowodanów</p>
          </div>
        </div>

        <img
          src={result.image_url}
          alt="skan"
          className="w-full h-36 object-cover rounded-xl mb-4"
        />

        <p className="text-xs text-gray-500 mb-2">
          Popraw wagę jeśli znasz dokładną wartość:
        </p>

        <div className="bg-[#16161f] rounded-xl border border-[#2a2a3a] overflow-hidden mb-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-4 py-3 border-b border-[#1e1e2e] last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-200">{item.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    defaultValue={item.weight_g}
                    onChange={(e) => handleWeightChange(i, e.target.value)}
                    className="w-16 bg-[#0f0f13] border border-[#3a2a5a] text-purple-300 text-xs rounded px-2 py-1 text-center"
                  />
                  <span className="text-xs text-gray-500">g</span>
                </div>
              </div>
              <p className="text-sm text-purple-400 font-medium">
                {item.carbs_g}g WW
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#16161f] border border-[#3a2a5a] rounded-xl px-4 py-3 mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-300">Razem węglowodany</p>
          <p className="text-xl font-medium text-purple-400">{totalCarbs}g</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#16161f] border border-[#2a2a3a] text-gray-300 rounded-2xl py-3 text-sm"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}
