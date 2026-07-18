import WatchlistPanel from "../components/WatchlistPanel";
import { useTheme } from "../lib/theme";

export default function Watchlist() {
  const { dark } = useTheme();
  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-7">
        <h1
          className={`text-2xl font-bold mb-0.5 ${dark ? "text-gray-100" : "text-gray-900"}`}
        >
          Watchlist Saya
        </h1>
        <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>
          Pantau coin pilihan kamu
        </p>
      </div>
      <WatchlistPanel />
    </div>
  );
}
