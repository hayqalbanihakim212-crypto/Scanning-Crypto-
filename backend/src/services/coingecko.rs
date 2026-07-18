use reqwest::Client;
use anyhow::Result;
use crate::models::score::CoinGecko;
use serde::Deserialize;

#[derive(Deserialize)]
struct CoinGeckoError {
    status: CoinGeckoErrorStatus,
}

#[derive(Deserialize)]
struct CoinGeckoErrorStatus {
    error_code: u32,
    error_message: String,
}

pub struct CoinGeckoService {
    client: Client,
    base_url: String,
}

impl CoinGeckoService {
    pub fn new() -> Self {
        Self {
            client: Client::new(),
            base_url: "https://api.coingecko.com/api/v3".into(),
        }
    }

    pub async fn get_market(
        &self,
        vs_currency: &str,
        per_page: u32,
        page: u32
    ) -> Result<Vec<CoinGecko>> {
        let url = format!(
            "{}/coins/markets?vs_currency={}&order=market_cap_desc&per_page={}&page={}&sparkline=false",
            self.base_url,
            vs_currency,
            per_page,
            page
        );

        let text = self.client
            .get(&url)
            .header("accept", "application/json")
            .header("User-Agent", "HalalCrypto/1.0 (https://github.com/hayqa/webcryptoHalal)")
            .send().await?
            .text().await?;

        if let Ok(err) = serde_json::from_str::<CoinGeckoError>(&text) {
            return Err(
                anyhow::anyhow!(
                    "CoinGecko error {}: {}",
                    err.status.error_code,
                    err.status.error_message
                )
            );
        }

        let coins = serde_json
            ::from_str::<Vec<CoinGecko>>(&text)
            .map_err(|e| anyhow::anyhow!("Parse error: {}", e))?;

        Ok(coins)
    }

    pub async fn get_coin_detail(&self, id: &str) -> Result<CoinGecko> {
        let url = format!("{}/coins/markets?vs_currency=usd&ids={}", self.base_url, id);

        let text = self.client
            .get(&url)
            .header("accept", "application/json")
            .header("User-Agent", "HalalCrypto/1.0 (https://github.com/hayqa/webcryptoHalal)")
            .send().await?
            .text().await?;

        if let Ok(err) = serde_json::from_str::<CoinGeckoError>(&text) {
            return Err(
                anyhow::anyhow!(
                    "CoinGecko error {}: {}",
                    err.status.error_code,
                    err.status.error_message
                )
            );
        }

        let mut coins = serde_json
            ::from_str::<Vec<CoinGecko>>(&text)
            .map_err(|e| anyhow::anyhow!("Parse error: {}", e))?;

        coins.pop().ok_or_else(|| anyhow::anyhow!("Coin '{}' tidak ditemukan", id))
    }
}
