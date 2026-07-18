mod database {
    pub mod db;
}
mod models {
    pub mod score;
}
mod resources {
    pub mod bookmark;
}
mod routers {
    pub mod coins;

    use axum::Router;
    use crate::AppState;

    pub fn all_routers() -> Router<AppState> {
        Router::new().nest("/coins", coins::router())
    }
}
mod services {
    pub mod coingecko;
    pub mod scoring;
}
mod store {
    pub mod screener;
}

use axum::{ Router, http::Method };
use tower_http::cors::{ CorsLayer, Any };
use tracing_subscriber::{ layer::SubscriberExt, util::SubscriberInitExt };
use std::sync::Arc;
use moka::future::Cache;

use services::coingecko::CoinGeckoService;
use resources::bookmark::DbDatabase;

#[derive(Clone)]
pub struct AppState {
    pub coingecko: Arc<CoinGeckoService>,
    pub syariah_db: Arc<DbDatabase>,
    pub cache: Cache<String, String>,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    tracing_subscriber
        ::registry()
        .with(
            tracing_subscriber::EnvFilter::new(
                std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into())
            )
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    use database::db::DbConfig;
    let db_config = DbConfig::from_env();
    tracing::info!("Database URL: {}", db_config.base_url);
    tracing::info!("Memuat data Coin...");

    let coingecko = Arc::new(CoinGeckoService::new());
    let syariah_db = Arc::new(DbDatabase::load());
    let cache: Cache<String, String> = Cache::builder()
        .max_capacity(250)
        .time_to_live(std::time::Duration::from_secs(120))
        .build();

    let state = AppState { coingecko, syariah_db, cache };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any)
        .allow_origin(Any);

    let app = Router::new().nest("/api", routers::all_routers()).layer(cors).with_state(state);

    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".into());
    let addr = format!("0.0.0.0:{}", port);
    tracing::info!(" Aktif pada jaringan http://localhost:{}/api/coins", port);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
