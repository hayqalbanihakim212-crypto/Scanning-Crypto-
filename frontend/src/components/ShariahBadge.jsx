import { useTheme } from "../lib/theme";

export default function ShariahBadge({ status }) {
  const { dark } = useTheme();

  if (!status)
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
        }`}
      >
        ? Tidak Diketahui
      </span>
    );

  const styles = dark
    ? {
        green: "bg-green-900/40 text-green-400 border border-green-800",
        yellow: "bg-amber-900/30 text-amber-300 border border-amber-800",
        red: "bg-red-900/30 text-red-400 border border-red-800",
        gray: "bg-gray-800 text-gray-400 border border-gray-700",
      }
    : {
        green: "bg-green-50 text-green-700 border border-green-100",
        yellow: "bg-amber-50 text-amber-700 border border-amber-100",
        red: "bg-red-50 text-red-600 border border-red-100",
        gray: "bg-gray-100 text-gray-500 border border-gray-200",
      };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${styles[status.color] || styles.gray}`}
    >
      {status.icon} {status.label}
    </span>
  );
}
