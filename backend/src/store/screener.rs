use std::collections::HashSet;
use std::sync::Mutex;
use std::sync::OnceLock;
use crate::models::score::ScreenerResponse;

static WATCHLIST: OnceLock<Mutex<HashSet<String>>> = OnceLock::new();

fn get_watchlist() -> &'static Mutex<HashSet<String>> {
    WATCHLIST.get_or_init(|| Mutex::new(HashSet::new()))
}

pub fn delete(coin_id: &str) {
    let mut watchlist = get_watchlist().lock().unwrap();
    watchlist.remove(coin_id);
}

pub fn get_all() -> Vec<String> {
    let list = get_watchlist().lock().unwrap();
    list.iter().cloned().collect()
}

pub fn check_watchlist(coin_id: &str) -> bool {
    let list = get_watchlist().lock().unwrap();
    list.contains(coin_id)
}

static SCREENER_CACHE: OnceLock<Mutex<Vec<ScreenerResponse>>> = OnceLock::new();

fn get_screener_cache() -> &'static Mutex<Vec<ScreenerResponse>> {
    SCREENER_CACHE.get_or_init(|| Mutex::new(Vec::new()))
}

pub fn save_screener(data: Vec<ScreenerResponse>) {
    let mut cache = get_screener_cache().lock().unwrap();
    *cache = data;
}

pub fn post_screener() -> Vec<ScreenerResponse> {
    let cache = get_screener_cache().lock().unwrap();
    cache.clone()
}
