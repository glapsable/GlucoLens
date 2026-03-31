import type { ScanResult } from "../types";

interface Props {
  result: ScanResult;
  onClose: () => void;
}

export function ResultCard({ result, onClose }: Props) {
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
            <p className="text-3xl font-medium text-purple-400">
              {result.total_carbs_g}
            </p>
            <p className="text-xs text-gray-500">g węglowodanów</p>
          </div>
        </div>

        <img
          src={result.image_url}
          alt="skan"
          className="w-full h-36 object-cover rounded-xl mb-4"
        />

        <div className="bg-[#16161f] rounded-xl border border-[#2a2a3a] overflow-hidden mb-4">
          {result.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between px-4 py-3 border-b border-[#1e1e2e] last:border-0"
            >
              <div>
                <p className="text-sm text-gray-200">{item.name}</p>
                <p className="text-xs text-gray-500">{item.weight_g}g</p>
              </div>
              <p className="text-sm text-purple-400 font-medium">
                {item.carbs_g}g WW
              </p>
            </div>
          ))}
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
