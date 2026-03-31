import { useRef } from "react";

interface Props {
  onScan: (base64: string) => void;
  loading: boolean;
}

export function ScanScreen({ onScan, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      onScan(base64);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-8">
      <div className="text-2xl font-medium tracking-wide">
        <span className="text-purple-400">Gluco</span>
        <span className="text-purple-300">Lens</span>
      </div>

      <div
        onClick={() => !loading && inputRef.current?.click()}
        className="w-full max-w-sm h-56 bg-[#16161f] border border-[#2a2a3a] rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer relative overflow-hidden"
      >
        {/* narożniki */}
        <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-purple-600 rounded-tl" />
        <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-purple-600 rounded-tr" />
        <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-purple-600 rounded-bl" />
        <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-purple-600 rounded-br" />

        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Analizuję...</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-[#1e1e2e] rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 stroke-purple-500"
                fill="none"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-500">
              Dotknij aby zrobić zdjęcie
            </span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />

      <button
        onClick={() => !loading && inputRef.current?.click()}
        disabled={loading}
        className="w-full max-w-sm bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded-2xl py-4 text-base font-medium transition-colors"
      >
        {loading ? "Analizuję posiłek..." : "Skanuj posiłek"}
      </button>
    </div>
  );
}
