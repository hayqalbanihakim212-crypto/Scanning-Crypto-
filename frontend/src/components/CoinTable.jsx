import { useNavigate } from "react-router-dom";
import ShariahBadge from "./ShariahBadge";
import { useTheme } from "../lib/theme";

export default function CoinTable({ coins, loading }) {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const th = dark
    ? "text-gray-500 border-gray-800"
    : "text-gray-400 border-gray-100";
  const row = dark
    ? "border-gray-800/50 hover:bg-green-900/10"
    : "border-gray-50 hover:bg-green-50/40";
  const name = dark
    ? "text-gray-100 group-hover:text-green-400"
    : "text-gray-900 group-hover:text-green-700";
  const sym = dark ? "text-gray-500" : "text-gray-400";
  const price = dark ? "text-gray-100" : "text-gray-900";
  const mcap = dark ? "text-gray-400" : "text-gray-500";
  const score = dark ? "text-gray-300" : "text-gray-600";
  const bar = dark ? "bg-gray-800" : "bg-gray-100";

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-2 border-t-green-600 ${dark ? "border-gray-700" : "border-gray-200"}`}
        />
      </div>
    );

  if (!coins?.length)
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-3xl mb-2">📭</p>
        <p className="text-sm">Tidak ada data coin.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className={`text-xs border-b ${th}`}>
            <th className="px-4 pb-3 text-left font-medium">Coin</th>
            <th className="px-4 pb-3 text-right font-medium">Harga</th>
            <th className="px-4 pb-3 text-right font-medium hidden sm:table-cell">
              24h %
            </th>
            <th className="px-4 pb-3 text-right font-medium hidden md:table-cell">
              Market Cap
            </th>
            <th className="px-4 pb-3 text-center font-medium">Shariah</th>
            <th className="px-4 pb-3 text-right font-medium hidden lg:table-cell">
              Skor
            </th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, i) => (
            <tr
              key={coin.id}
              onClick={() => navigate(`/coin/${coin.id}`)}
              className={`border-b cursor-pointer transition-all duration-150 group ${row}`}
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs w-5 text-right ${dark ? "text-gray-600" : "text-gray-300"}`}
                  >
                    {i + 1}
                  </span>
                  <img
                    src={coin.image ?? ""}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200"
                  />
                  <div>
                    <p className={`font-semibold transition-colors ${name}`}>
                      {coin.name}
                    </p>
                    <p className={`text-xs uppercase tracking-wide ${sym}`}>
                      {coin.symbol}
                    </p>
                  </div>
                </div>
              </td>
              <td className={`px-4 py-3.5 text-right font-semibold ${price}`}>
                ${coin.current_price?.toLocaleString() ?? "-"}
              </td>
              <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    (coin.price_change_percentage_24h ?? 0) >= 0
                      ? dark
                        ? "bg-green-900/40 text-green-400"
                        : "bg-green-50 text-green-700"
                      : dark
                        ? "bg-red-900/30 text-red-400"
                        : "bg-red-50 text-red-600"
                  }`}
                >
                  {(coin.price_change_percentage_24h ?? 0) >= 0 ? "+" : ""}
                  {coin.price_change_percentage_24h?.toFixed(2) ?? "-"}%
                </span>
              </td>
              <td
                className={`px-4 py-3.5 text-right hidden md:table-cell text-sm ${mcap}`}
              >
                ${(coin.market_cap / 1e9)?.toFixed(2)}B
              </td>
              <td className="px-4 py-3.5 text-center">
                <ShariahBadge status={coin.db_status} />
              </td>
              <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                <div className="flex items-center justify-end gap-2">
                  <div
                    className={`w-14 rounded-full h-1.5 overflow-hidden ${bar}`}
                  >
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${coin.db_score?.total ?? 0}%`,
                        background:
                          coin.db_score?.total >= 70
                            ? "#16a34a"
                            : coin.db_score?.total >= 40
                              ? "#d97706"
                              : "#dc2626",
                      }}
                    />
                  </div>
                  <span className={`font-semibold text-xs w-6 ${score}`}>
                    {coin.db_score?.total?.toFixed(0) ?? "-"}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
