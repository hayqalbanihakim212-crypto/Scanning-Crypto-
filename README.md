<div align="center">

# ☽ HalalCrypto — Scanning Crypto
### *Platform Screening Kripto Berbasis Prinsip Syariah*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Axum](https://img.shields.io/badge/Axum-orange?style=for-the-badge)](https://docs.rs/axum)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> Aplikasi web untuk menganalisis dan menyaring aset kripto berdasarkan perspektif **halal**, **syubhat**, dan **haram** dalam Islam — didukung data realtime dari CoinGecko.

### 🌐 [Lihat Demo Frontend →]https://hayqalbanihakim212-crypto.github.io/Scanning-Crypto-/

</div>

---

## Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard** | Overview market + rata-rata skor syariah seluruh coin |
| **Screener** | Filter coin berdasarkan status Halal / Syubhat / Haram |
| **Coin Detail** | Analisis detail per coin dengan pie chart 5 kriteria |
| **Watchlist** | Simpan & pantau coin pilihan |
| **Dark / Light Mode** | Tema adaptif tersimpan di localStorage |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)            │
│                                                     │
│  Pages          Components         Lib              │
│  ├── Dashboard  ├── CoinTable      ├── api.js       │
│  ├── Screener   ├── ShariahBadge   └── theme.js     │
│  ├── Watchlist  ├── ScoreChart                      │
│  └── CoinDetail ├── Sidebar                         │
│                 └── WatchlistPanel                  │
│                                                     │
│          React Query + React Router DOM             │
└──────────────────────┬──────────────────────────────┘
                       │ /api proxy (Vite)
┌──────────────────────▼──────────────────────────────┐
│                BACKEND (Rust + Axum)                │
│                                                     │
│  Routes: /api/coins/*                               │
│  ├── services/coingecko.rs  → CoinGecko API v3      │
│  ├── services/scoring.rs    → Scoring Engine        │
│  ├── resources/bookmark.rs  → Syariah Database      │
│  ├── store/screener.rs      → In-memory Cache       │
│  └── database/db.rs         → PostgreSQL Config     │
│                                                     │
│  Moka Cache (250 items · TTL 120s) · CORS: Any      │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│            CoinGecko API v3 (External)              │
│         /coins/markets — realtime prices            │
└─────────────────────────────────────────────────────┘
```

---

## ⚖️ Sistem Scoring Syariah

Setiap coin dinilai berdasarkan **5 kriteria** dengan bobot masing-masing:

| Kriteria | Bobot | Keterangan |
|----------|-------|------------|
| Shariah Compliance | **30%** | Kepatuhan terhadap hukum Islam |
| Transparency | **25%** | Keterbukaan proyek & tim |
| Community Support | **20%** | Dukungan komunitas |
| Development Activity | **15%** | Aktivitas pengembangan |
| Market Performance | **10%** | Performa pasar |

**Klasifikasi Status:**

```
Skor ≥ 70  →  ✓ HALAL    (progres nyata, tidak melanggar hukum Islam)
Skor 40–69 →  ! SYUBHAT  (masih dalam kajian)
Skor < 40  →  ✗ HARAM    (tidak memenuhi kriteria hukum Islam)
```

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| UI Library | Recharts, Lucide React |
| State | TanStack React Query |
| Backend | Rust, Axum |
| Cache | Moka (async, TTL 120s) |
| External API | CoinGecko API v3 |
| Database | PostgreSQL |

---

## 🚀 Cara Menjalankan Lokal

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend

```bash
cd backend
cp .env.example .env    # isi DATABASE_URL dan PORT
cargo run
# → http://localhost:8080/api/coins
```

> Vite akan otomatis proxy `/api` → `http://localhost:8080`

---

## 📁 Struktur Proyek

```
webcryptoHalal/
├── frontend/
│   ├── src/
│   │   ├── components/      # CoinTable, ShariahBadge, ScoreChart, Sidebar, ...
│   │   ├── pages/           # Dashboard, Screener, Watchlist, CoinDetail
│   │   └── lib/             # api.js, theme.js
│   └── vite.config.js
└── backend/
    └── src/
        ├── database/        # db.rs
        ├── models/          # score.rs
        ├── resources/       # bookmark.rs
        ├── routers/         # coins.rs
        ├── services/        # coingecko.rs, scoring.rs
        ├── store/           # screener.rs
        └── main.rs
```
---

<div align="center">
!! *Analisis ini bukan fatwa resmi. Konsultasikan dengan ulama atau lembaga keuangan syariah terpercaya.*
---
Made by [hayqalbanihakim212-crypto](https://github.com/hayqalbanihakim212-crypto)

</div>
