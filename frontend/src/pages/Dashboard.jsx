import { useQuery } from "@tanstack/react-query";
import { getCoins, getAverageScore } from "../lib/api";
import CoinTable from "../components/CoinTable";
import { TrendingUp, Coins, Shield, BarChart2 } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function Dashboard() {
  const { dark } = useTheme();
  const { data: coins, isLoading } = useQuery({
    queryKey: ["coins"],
    queryFn: () => getCoins({ vs_currency: "usd", per_page: 20 }),
  });
  const { data: avg } = useQuery({
    queryKey: ["average"],
    queryFn: getAverageScore,
  });

  const halalCount =
    coins?.filter((c) => c.db_status?.color === "green").length ?? 0;
  const totalCount = coins?.length ?? 0;
  const halalPct =
    totalCount > 0 ? ((halalCount / totalCount) * 100).toFixed(1) : 0;

  const card = dark
    ? "bg-[#111a12] border-gray-800"
    : "bg-white border-gray-100";
  const title = dark ? "text-gray-100" : "text-gray-900";
  const sub = dark ? "text-gray-500" : "text-gray-400";
  const h2 = dark ? "text-gray-100" : "text-gray-900";
  const h2sub = dark ? "text-gray-500" : "text-gray-400";
  const border = dark ? "border-gray-800" : "border-gray-50";
  const progress = dark ? "bg-gray-800" : "bg-gray-100";
  const statLabel = dark ? "text-gray-500" : "text-gray-400";
  const statSub = dark ? "text-gray-500" : "text-gray-400";

  const stats = avg
    ? [
        {
          icon: BarChart2,
          iconBg: dark ? "bg-green-900/30" : "bg-green-50",
          iconColor: "text-green-600",
          label: "Market Status",
          value: avg.keterangan,
          valueColor: "text-green-600",
          sub: "Market Health",
        },
        {
          icon: Coins,
          iconBg: dark ? "bg-blue-900/30" : "bg-blue-50",
          iconColor: "text-blue-500",
          label: "Listed Coins",
          value: `${avg.total_coins}+`,
          valueColor: dark ? "text-gray-100" : "text-gray-900",
          sub: "Coin Dianalisis",
        },
        {
          icon: Shield,
          iconBg: dark ? "bg-purple-900/30" : "bg-purple-50",
          iconColor: "text-purple-500",
          label: "Halal Coins",
          value: `${halalPct}%`,
          valueColor: dark ? "text-gray-100" : "text-gray-900",
          sub: "Dari total coin",
        },
      ]
    : [];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-7">
        <h1 className={`text-2xl font-bold mb-0.5 ${title}`}>Dashboard</h1>
        <p className={`text-sm ${sub}`}>
          Data crypto realtime dengan analisis syariah
        </p>
      </div>

      {avg && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            {/* Hero */}
            <div className="lg:col-span-1 bg-green-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-600 rounded-full opacity-40" />
              <div className="absolute -right-2 bottom-4 w-16 h-16 bg-green-800 rounded-full opacity-30" />
              <div className="relative z-10">
                <p className="text-green-200 text-xs font-medium mb-2 uppercase tracking-wider">
                  Shariah Score
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-bold">
                    {avg.average_score?.toFixed(1)}
                  </span>
                  <span className="text-green-300 text-lg mb-1">/100</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  <span className="text-green-100 text-sm font-medium">
                    {avg.keterangan}
                  </span>
                </div>
                <div className="mt-4 bg-white/10 rounded-xl p-3">
                  <p className="text-green-100 text-xs leading-relaxed">
                    {halalPct}% dari {totalCount} coin memenuhi kriteria syariah
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all duration-200 ${card}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`${s.iconBg} p-2.5 rounded-xl transition-colors duration-300`}
                    >
                      <s.icon className={s.iconColor} size={18} />
                    </div>
                    <span className={`text-xs font-medium ${statLabel}`}>
                      {s.label}
                    </span>
                  </div>
                  <p className={`text-xl font-bold ${s.valueColor} mb-0.5`}>
                    {s.value}
                  </p>
                  <p className={`text-xs ${statSub}`}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div
            className={`rounded-2xl border shadow-sm p-5 mb-5 transition-colors duration-300 ${card}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-600"}`}
              >
                Rata-rata Skor Syariah
              </span>
              <span className="text-green-600 font-bold text-sm">
                {avg.average_score?.toFixed(1)}/100
              </span>
            </div>
            <div
              className={`w-full rounded-full h-2 overflow-hidden ${progress}`}
            >
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000"
                style={{ width: `${avg.average_score ?? 0}%` }}
              />
            </div>
          </div>
        </>
      )}

      {/* Table */}
      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${card}`}
      >
        <div className={`px-5 py-4 border-b ${border}`}>
          <h2 className={`font-semibold ${h2}`}>
            Top Coins — Shariah Screened
          </h2>
          <p className={`text-xs mt-0.5 ${h2sub}`}>
            Klik coin untuk melihat analisis detail
          </p>
        </div>
        <CoinTable coins={coins} loading={isLoading} />
      </div>
    </div>
  );
}
