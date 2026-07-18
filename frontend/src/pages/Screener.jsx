import { useQuery } from "@tanstack/react-query";
import { getCoins } from "../lib/api";
import CoinTable from "../components/CoinTable";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTheme } from "../lib/theme";

const FILTERS = [
  { label: "Semua", color: null },
  { label: "Halal", color: "green" },
  { label: "Syubhat", color: "yellow" },
  { label: "Haram", color: "red" },
];

export default function Screener() {
  const [filter, setFilter] = useState("Semua");
  const { dark } = useTheme();

  const { data: coins, isLoading } = useQuery({
    queryKey: ["coins-screener"],
    queryFn: () => getCoins({ vs_currency: "usd", per_page: 50 }),
  });

  const filtered = coins?.filter(
    (coin) => filter === "Semua" || coin.db_status?.label === filter,
  );

  const counts = Object.fromEntries(
    FILTERS.map((f) => [
      f.label,
      f.label === "Semua"
        ? (coins?.length ?? 0)
        : (coins?.filter((c) => c.db_status?.label === f.label).length ?? 0),
    ]),
  );

  const card = dark
    ? "bg-[#111a12] border-gray-800"
    : "bg-white border-gray-100";
  const title = dark ? "text-gray-100" : "text-gray-900";
  const sub = dark ? "text-gray-500" : "text-gray-400";

  const getActive = (f) => {
    if (f.label !== filter)
      return dark
        ? "bg-white/5 text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-gray-200"
        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700";
    const map = {
      null: dark ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-white",
      green: dark
        ? "bg-green-900/40 text-green-400 border border-green-800"
        : "bg-green-50 text-green-700 border border-green-200",
      yellow: dark
        ? "bg-amber-900/30 text-amber-300 border border-amber-800"
        : "bg-amber-50 text-amber-700 border border-amber-200",
      red: dark
        ? "bg-red-900/30 text-red-400 border border-red-800"
        : "bg-red-50 text-red-600 border border-red-200",
    };
    return map[f.color];
  };

  const dotMap = {
    green: "bg-green-500",
    yellow: "bg-amber-400",
    red: "bg-red-500",
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-7">
        <h1 className={`text-2xl font-bold mb-0.5 ${title}`}>
          Screener Syariah
        </h1>
        <p className={`text-sm ${sub}`}>
          Filter coin berdasarkan status kehalalan
        </p>
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <SlidersHorizontal size={14} className={sub} />
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${getActive(f)}`}
          >
            {f.color && (
              <span className={`w-2 h-2 rounded-full ${dotMap[f.color]}`} />
            )}
            {f.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                dark ? "bg-white/10 text-current" : "bg-gray-100 text-gray-400"
              }`}
            >
              {counts[f.label]}
            </span>
          </button>
        ))}
      </div>

      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${card}`}
      >
        <CoinTable coins={filtered} loading={isLoading} />
      </div>
    </div>
  );
}
