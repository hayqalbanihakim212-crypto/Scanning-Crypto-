import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoinDetail, addWatchlist, checkWatchlist } from "../lib/api";
import ShariahBadge from "../components/ShariahBadge";
import ScoreChart from "../components/ScoreChart";
import {
  BookmarkPlus,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useTheme } from "../lib/theme";

export default function CoinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { dark } = useTheme();

  const { data: coin, isLoading } = useQuery({
    queryKey: ["coin", id],
    queryFn: () => getCoinDetail(id),
  });

  const { data: watchlistCheck } = useQuery({
    queryKey: ["watchlist-check", id],
    queryFn: () => checkWatchlist(id),
  });

  const { mutate: addToWatchlist } = useMutation({
    mutationFn: () => addWatchlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["watchlist"]);
      queryClient.invalidateQueries(["watchlist-check", id]);
    },
  });

  const card = dark
    ? "bg-[#111a12] border-gray-800"
    : "bg-white border-gray-100";
  const title = dark ? "text-gray-100" : "text-gray-900";
  const sub = dark ? "text-gray-400" : "text-gray-400";
  const statBg = dark
    ? "bg-gray-800/50 hover:bg-green-900/20"
    : "bg-gray-50 hover:bg-green-50/50";
  const statLabel = dark ? "text-gray-500" : "text-gray-400";
  const statVal = dark ? "text-gray-200" : "text-gray-800";
  const divider = dark ? "border-gray-800" : "border-gray-50";
  const back = dark
    ? "text-gray-500 hover:text-gray-200"
    : "text-gray-400 hover:text-gray-700";
  const disclaimer = dark
    ? "bg-gray-800/50 border-gray-700 text-gray-500"
    : "bg-gray-50 border-gray-100 text-gray-400";

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-2 border-t-green-600 ${dark ? "border-gray-700" : "border-gray-200"}`}
        />
      </div>
    );

  if (!coin)
    return <p className={`text-center py-10 ${sub}`}>Coin tidak ditemukan.</p>;

  const isUp = (coin.price_change_percentage_24h ?? 0) >= 0;

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 mb-6 transition-colors text-sm group ${back}`}
      >
        <ArrowLeft
          size={15}
          className="group-hover:-translate-x-1 transition-transform duration-200"
        />
        Kembali
      </button>

      <div
        className={`rounded-2xl border shadow-sm p-6 mb-4 transition-colors duration-300 ${card}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <img
              src={coin.image ?? ""}
              alt={coin.name}
              className="w-14 h-14 rounded-2xl shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className={`text-xl font-bold ${title}`}>{coin.name}</h1>
                <ShariahBadge status={coin.db_status} />
              </div>
              <p
                className={`uppercase text-xs font-medium tracking-widest ${sub}`}
              >
                {coin.symbol}
              </p>
            </div>
          </div>
          <button
            onClick={() => addToWatchlist()}
            disabled={watchlistCheck?.ada_di_watchlist}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              watchlistCheck?.ada_di_watchlist
                ? dark
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                  : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100"
                : "bg-green-700 text-white hover:bg-green-800 shadow-sm hover:shadow-md"
            }`}
          >
            <BookmarkPlus size={15} />
            {watchlistCheck?.ada_di_watchlist ? "Di Watchlist" : "Watchlist"}
          </button>
        </div>

        <div className={`flex items-end gap-3 mb-5 pb-5 border-b ${divider}`}>
          <span className={`text-3xl font-bold ${title}`}>
            ${coin.current_price?.toLocaleString()}
          </span>
          <span
            className={`flex items-center gap-1 text-sm font-semibold mb-0.5 px-2.5 py-1 rounded-full ${
              isUp
                ? dark
                  ? "bg-green-900/40 text-green-400"
                  : "bg-green-50 text-green-700"
                : dark
                  ? "bg-red-900/30 text-red-400"
                  : "bg-red-50 text-red-600"
            }`}
          >
            {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isUp ? "+" : ""}
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Market Cap",
              value: `$${(coin.market_cap / 1e9)?.toFixed(2)}B`,
            },
            {
              label: "Volume 24h",
              value: `$${(coin.total_volume / 1e9)?.toFixed(2)}B`,
            },
            { label: "High 24h", value: `$${coin.high_24h?.toLocaleString()}` },
            { label: "Low 24h", value: `$${coin.low_24h?.toLocaleString()}` },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 transition-colors duration-150 ${statBg}`}
            >
              <p className={`text-xs mb-1.5 ${statLabel}`}>{item.label}</p>
              <p className={`font-semibold text-sm ${statVal}`}>
                {item.value ?? "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ScoreChart score={coin.db_score} />

      {coin.db_status?.note && (
        <div
          className={`mt-4 rounded-2xl p-4 ${dark ? "bg-amber-900/20 border border-amber-800/50" : "bg-amber-50 border border-amber-100"}`}
        >
          <p
            className={`text-sm leading-relaxed ${dark ? "text-amber-300" : "text-amber-700"}`}
          >
            📋 <strong>Catatan Syariah:</strong> {coin.db_status.note}
          </p>
        </div>
      )}

      <div className={`mt-3 rounded-2xl p-4 border ${disclaimer}`}>
        <p className="text-xs text-center leading-relaxed">
          ⚠️ Analisis ini bukan fatwa resmi. Konsultasikan dengan ulama atau
          lembaga keuangan syariah terpercaya.
        </p>
      </div>
    </div>
  );
}
