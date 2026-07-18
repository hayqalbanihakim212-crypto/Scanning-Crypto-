export default function ScoreCard({ score }) {
  if (!score) return null;

  const items = [
    {
      label: "Shariah Compliance",
      value: score.shariah_compliance,
      color: "bg-green-500",
    },
    { label: "Transparency", value: score.transparency, color: "bg-blue-500" },
    {
      label: "Community Support",
      value: score.community_support,
      color: "bg-purple-500",
    },
    {
      label: "Dev Activity",
      value: score.development_activity,
      color: "bg-orange-500",
    },
    {
      label: "Market Performance",
      value: score.market_performance,
      color: "bg-pink-500",
    },
  ];

  const totalColor =
    score.total >= 70
      ? "text-green-600"
      : score.total >= 40
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900">
          Shariah Compliance Score
        </h3>
        <div className="text-right">
          <span className={`text-3xl font-bold ${totalColor}`}>
            {score.total?.toFixed(1)}
          </span>
          <span className="text-gray-400 text-sm ml-1">/100</span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{item.label}</span>
              <span>{item.value?.toFixed(1)}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
