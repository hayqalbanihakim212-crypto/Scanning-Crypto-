import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./lib/theme";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Screener from "./pages/Screener";
import CoinDetail from "./pages/CoinDetail";
import Watchlist from "./pages/Watchlist";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/screener" element={<Screener />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/coin/:id" element={<CoinDetail />} />
        </Routes>
      </main>
    </div>
  );
}
