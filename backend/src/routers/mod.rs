pub mod coins;

use axum::Router;
use crate::AppState;

pub fn all_routers() -> Router<AppState> {
    Router::new().nest("/coins", coins::router())
}
