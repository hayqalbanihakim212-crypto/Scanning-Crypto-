import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWatchlist, deleteWatchlist } from "../lib/api";
import { Trash2, Star, BookMarked } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function WatchlistPanel() {
  const queryClient = useQueryClient();
  const { dark } = useTheme();

  const card = dark
    ? "bg-[#111a12] border-gray-800"
    : "bg-white border-gray-100";
  const header = dark
    ? "border-gray-800 text-gray-100"
    : "border-gray-50 text-gray-800";
  const badge = dark
    ? "bg-green-900/40 text-green-400"
    : "bg-green-50 text-green-700";
  const item = dark
    ? "divide-gray-800 hover:bg-white/5"
    : "divide-gray-50 hover:bg-gray-50";
  const itemText = dark ? "text-gray-200" : "text-gray-700";

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteWatchlist,
    onSuccess: () => queryClient.invalidateQueries(["watchlist"]),
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-2 border-t-green-600 ${dark ? "border-gray-700" : "border-gray-200"}`}
        />
      </div>
    );

  if (!watchlist.length)
    return (
      <div
        className={`rounded-2xl border shadow-sm p-12 text-center transition-colors duration-300 ${card}`}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${dark ? "bg-green-900/30" : "bg-green-50"}`}
        >
          <BookMarked className="text-green-600" size={24} />
        </div>
        <p
          className={`font-semibold mb-1 ${dark ? "text-gray-200" : "text-gray-700"}`}
        >
          Watchlist kosong
        </p>
        <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>
          Tambahkan coin dari halaman detail!
        </p>
      </div>
    );

  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${card}`}
    >
      <div
        className={`px-5 py-4 border-b flex items-center justify-between ${header}`}
      >
        <h3 className="font-semibold">Watchlist Saya</h3>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}
        >
          {watchlist.length} coin
        </span>
      </div>
      <ul className={`divide-y ${item}`}>
        {watchlist.map((coinId) => (
          <li
            key={coinId}
            className="flex items-center justify-between px-5 py-3.5 transition-colors duration-150 group"
          >
            <div className="flex items-center gap-3">
              <Star size={14} className="text-yellow-400" fill="currentColor" />
              <span
                className={`font-medium uppercase text-sm tracking-wide ${itemText}`}
              >
                {coinId}
              </span>
            </div>
            <button
              onClick={() => remove(coinId)}
              className="text-gray-400 hover:text-red-400 transition-all duration-150 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
