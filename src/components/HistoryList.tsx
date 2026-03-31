import type { ScanResult } from "../types";

interface Props {
  history: ScanResult[];
  onSelect: (r: ScanResult) => void;
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 1) return "przed chwilą";
  if (diff < 60) return `${diff} min temu`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h temu`;
  return date.toLocaleDateString("pl-PL");
}

export function HistoryList({ history, onSelect }: Props) {
  if (history.length === 0) return null;

  const todayCarbs = history
    .filter(
      (r) => new Date(r.timestamp).toDateString() === new Date().toDateString(),
    )
    .reduce((sum, r) => sum + r.total_carbs_g, 0);

  return (
    <div className="px-4 mt-6">
      <div className="flex gap-3 mb-4">
        <div className="flex-1 bg-[#16161f] border border-[#2a2a3a] rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">dzisiaj</p>
          <p className="text-xl font-medium text-purple-400">
            {todayCarbs}
            <span className="text-xs text-gray-500 ml-1">g WW</span>
          </p>
        </div>
        <div className="flex-1 bg-[#16161f] border border-[#2a2a3a] rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">skany</p>
          <p className="text-xl font-medium text-purple-400">
            {history.length}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
        Historia
      </p>
      <div className="flex flex-col gap-2">
        {history.map((r) => (
          <div
            key={r.id}
            onClick={() => onSelect(r)}
            className="bg-[#16161f] border border-[#2a2a3a] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer active:bg-[#1e1e2e]"
          >
            <div>
              <p className="text-sm text-gray-200">{r.label}</p>
              <p className="text-xs text-gray-500">
                {timeAgo(new Date(r.timestamp))}
              </p>
            </div>
            <p className="text-purple-400 font-medium">{r.total_carbs_g}g</p>
          </div>
        ))}
      </div>
    </div>
  );
}
