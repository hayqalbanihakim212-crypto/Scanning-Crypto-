import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Star,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../lib/theme";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/screener", label: "Screener", icon: SlidersHorizontal },
  { to: "/watchlist", label: "Watchlist", icon: Star },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { dark, setDark } = useTheme();

  const bg = dark
    ? "bg-[#111a12] border-[#1e2e1e]"
    : "bg-white border-gray-100";
  const logo = dark ? "text-white" : "text-gray-900";
  const activeLink = dark
    ? "bg-green-900/40 text-green-400"
    : "bg-green-50 text-green-700";
  const inactiveLink = dark
    ? "text-gray-400 hover:bg-white/5 hover:text-gray-200"
    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800";
  const footerBg = dark ? "bg-green-900/30" : "bg-green-50";
  const footerText = dark ? "text-green-300" : "text-green-700";
  const footerSub = dark ? "text-green-400/70" : "text-green-600/80";
  const toggleBg = dark
    ? "bg-white/10 hover:bg-white/20"
    : "bg-gray-100 hover:bg-gray-200";
  const toggleColor = dark ? "text-yellow-300" : "text-gray-600";

  return (
    <aside
      className={`w-56 min-h-screen border-r flex flex-col shadow-sm hidden md:flex transition-colors duration-300 ${bg}`}
    >
      {/* Logo + toggle */}
      <div
        className={`px-5 py-6 border-b ${dark ? "border-[#1e2e1e]" : "border-gray-50"} flex items-center justify-between`}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-green-700 text-white rounded-xl w-9 h-9 flex items-center justify-center text-base font-bold shadow-sm">
            ☽
          </div>
          <span className={`font-bold text-base ${logo}`}>
            Halal<span className="text-green-600">Crypto</span>
          </span>
        </Link>
        <button
          onClick={() => setDark(!dark)}
          className={`p-2 rounded-lg transition-all duration-200 ${toggleBg} ${toggleColor}`}
          title={dark ? "Light mode" : "Dark mode"}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              pathname === to ? activeLink : inactiveLink
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4">
        <div
          className={`${footerBg} rounded-xl p-3 transition-colors duration-300`}
        >
          <p className={`${footerText} text-xs font-semibold mb-0.5`}>
            Invest with Confidence
          </p>
          <p className={`${footerSub} text-xs`}>
            Semua aset dianalisis dengan metodologi syariah
          </p>
        </div>
      </div>
    </aside>
  );
}
