import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "../lib/theme";

const COLORS = ["#16a34a", "#ca8a04", "#2563eb", "#7c3aed", "#ea580c"];

export default function ScoreChart({ score }) {
  const { dark } = useTheme();
  if (!score) return null;

  const card = dark
    ? "bg-[#111a12] border-gray-800"
    : "bg-white border-gray-100";
  const title = dark ? "text-gray-100" : "text-gray-800";
  const sub = dark ? "text-gray-500" : "text-gray-400";
  const itemBg = dark ? "bg-gray-800/50" : "bg-gray-50";
  const itemSub = dark ? "text-gray-500" : "text-gray-400";
  const divider = dark ? "border-gray-800" : "border-gray-50";
  const totalLabel = dark ? "text-gray-400" : "text-gray-400";
  const totalValue = dark ? "text-gray-100" : "text-gray-900";

  const data = [
    { name: "Shariah", value: score.shariah_compliance },
    { name: "Transparansi", value: score.transparency },
    { name: "Komunitas", value: score.community_support },
    { name: "Dev Activity", value: score.development_activity },
    { name: "Market", value: score.market_performance },
  ];

  return (
    <div
      className={`rounded-2xl border shadow-sm p-6 transition-colors duration-300 ${card}`}
    >
      <h3 className={`font-semibold mb-0.5 ${title}`}>
        Shariah Compliance Breakdown
      </h3>
      <p className={`text-xs mb-5 ${sub}`}>
        Analisis berdasarkan 5 kriteria utama
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: dark ? "#1a2e1a" : "#fff",
              border: dark ? "1px solid #2d4a2d" : "1px solid #f3f4f6",
              borderRadius: 10,
              fontSize: 12,
              color: dark ? "#e2e8e2" : "#111",
            }}
            formatter={(v) => [`${v.toFixed(1)}`, ""]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: dark ? "#6b7280" : "#9ca3af" }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {data.map((item, i) => (
          <div key={i} className={`text-center p-2 rounded-xl ${itemBg}`}>
            <div className={`text-xs mb-1 truncate ${itemSub}`}>
              {item.name}
            </div>
            <div className="font-bold text-sm" style={{ color: COLORS[i] }}>
              {item.value.toFixed(0)}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`mt-4 pt-4 border-t flex items-center justify-between ${divider}`}
      >
        <span className={`text-sm ${totalLabel}`}>Total Skor Syariah</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-2xl font-bold ${totalValue}`}>
            {score.total?.toFixed(1)}
          </span>
          <span className={`text-sm ${totalLabel}`}>/100</span>
        </div>
      </div>
    </div>
  );
}
