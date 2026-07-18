use axum::{
    Router,
    routing::get,
    routing::delete as axum_delete,
    routing::post,
    extract::{ Path, State, Query },
    Json,
    http::StatusCode,
};
use serde::Deserialize;
use crate::AppState;
use crate::models::score::{ CoinGecko, ScreenerResponse };
use crate::store::screener::{ get_all, delete, check_watchlist, save_screener, post_screener };
use crate::services::scoring::{ status_score, validator_score, average };
use crate::database::db::DbConfig;

#[derive(Deserialize)]
pub struct CoinQuery {
    pub vs_currency: Option<String>,
    pub per_page: Option<u32>,
    pub page: Option<u32>,
}

#[derive(Deserialize)]
pub struct WatchlistBody {
    pub coin_id: String,
}

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(get_coins))
        .route("/screener", get(get_screener))
        .route("/screener/average", get(get_average_score))
        .route("/watchlist", get(get_watchlist_handler))
        .route("/watchlist", post(add_watchlist))
        .route("/watchlist/check/{id}", get(check_watchlist_handler))
        .route("/watchlist/{id}", axum_delete(delete_watchlist))
        .route("/config", get(get_config))
        .route("/{id}", get(get_coin_detail))
}

pub async fn get_coins(
    State(state): State<AppState>,
    Query(query): Query<CoinQuery>
) -> Result<Json<Vec<CoinGecko>>, (StatusCode, String)> {
    let currency = query.vs_currency.unwrap_or_else(|| "usd".into());
    let per_page = query.per_page.unwrap_or(10);
    let page = query.page.unwrap_or(1);

    let cache_key = format!("coins:{}:{}:{}", currency, per_page, page);

    if let Some(cache) = state.cache.get(&cache_key).await {
        let coins: Vec<CoinGecko> = serde_json::from_str(&cache).unwrap();
        tracing::info!("Cache hit: {}", cache_key);
        return Ok(Json(coins));
    }

    let mut coins = state.coingecko
        .get_market(&currency, per_page, page).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    for coin in &mut coins {
        let score = state.syariah_db.get_score(&coin.id);
        let status = status_score(&score);
        coin.db_status = Some(status);
        coin.db_score = Some(score);
    }

    let json_str = serde_json::to_string(&coins).unwrap();
    state.cache.insert(cache_key, json_str).await;

    Ok(Json(coins))
}

pub async fn get_coin_detail(
    State(state): State<AppState>,
    Path(id): Path<String>
) -> Result<Json<CoinGecko>, (StatusCode, String)> {
    let cache_key = format!("coin:{}", id);

    if let Some(cache) = state.cache.get(&cache_key).await {
        let coin: CoinGecko = serde_json::from_str(&cache).unwrap();
        tracing::info!("Cache hit: {}", cache_key);
        return Ok(Json(coin));
    }

    let mut coin = state.coingecko
        .get_coin_detail(&id).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let score = state.syariah_db.get_score(&coin.id);
    let status = status_score(&score);
    coin.db_status = Some(status);
    coin.db_score = Some(score);

    let json_str = serde_json::to_string(&coin).unwrap();
    state.cache.insert(cache_key, json_str).await;

    Ok(Json(coin))
}

pub async fn get_screener(State(_state): State<AppState>) -> Json<Vec<ScreenerResponse>> {
    let data = post_screener();
    let filtered: Vec<ScreenerResponse> = data
        .into_iter()
        .filter(|r| validator_score(r.db_score.total) >= 40.0)
        .collect();
    Json(filtered)
}

pub async fn get_average_score(State(state): State<AppState>) -> Json<serde_json::Value> {
    let mut coins = state.coingecko.get_market("usd", 50, 1).await.unwrap_or_default();

    let scores: Vec<f64> = coins
        .iter()
        .map(|coin| validator_score(state.syariah_db.get_score(&coin.id).total))
        .collect();

    let avg = average(&scores);

    let screener_data: Vec<ScreenerResponse> = coins
        .iter_mut()
        .map(|coin| {
            let score = state.syariah_db.get_score(&coin.id);
            let status = status_score(&score);
            ScreenerResponse {
                id: coin.id.clone(),
                symbol: coin.symbol.clone(),
                name: coin.name.clone(),
                image: coin.image.clone().unwrap_or_default(),
                current_price: coin.current_price,
                market_cap: coin.market_cap,
                market_cap_rank: coin.market_cap_rank,
                total_volume: coin.total_volume,
                price_change_percentage_24h: coin.price_change_percentage_24h,
                circulating_supply: coin.circulating_supply,
                total_supply: coin.total_supply,
                high_24h: coin.high_24h,
                low_24h: coin.low_24h,
                db_status: status,
                db_score: score,
            }
        })
        .collect();

    save_screener(screener_data);

    Json(
        serde_json::json!({
        "average_score": avg,
        "total_coins": scores.len(),
        "keterangan": if avg >= 70.0 { "Mayoritas Halal" }
                      else if avg >= 40.0 { "Mayoritas Syubhat" }
                      else { "Mayoritas Haram" }
    })
    )
}

pub async fn get_watchlist_handler() -> Json<Vec<String>> {
    Json(get_all())
}

pub async fn add_watchlist(Json(body): Json<WatchlistBody>) -> Json<serde_json::Value> {
    let already_exists = check_watchlist(&body.coin_id);
    if already_exists {
        return Json(
            serde_json::json!({
            "status": "sudah ada",
            "coin_id": body.coin_id,
            "watchlist": get_all()
        })
        );
    }
    Json(
        serde_json::json!({
        "status": "ditambahkan",
        "coin_id": body.coin_id,
        "watchlist": get_all()
    })
    )
}

pub async fn check_watchlist_handler(Path(id): Path<String>) -> Json<serde_json::Value> {
    let exists = check_watchlist(&id);
    Json(serde_json::json!({
        "coin_id": id,
        "ada_di_watchlist": exists
    }))
}

pub async fn delete_watchlist(Path(id): Path<String>) -> Json<Vec<String>> {
    delete(&id);
    Json(get_all())
}

pub async fn get_config() -> Json<serde_json::Value> {
    let config = DbConfig::from_env();
    Json(
        serde_json::json!({
        "database_url": config.base_url,
        "status": "terhubung"
    })
    )
}
