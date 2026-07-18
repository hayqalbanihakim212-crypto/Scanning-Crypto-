use serde::{ Deserialize, Serialize };

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CoinGecko {
    pub id: String,
    pub symbol: String,
    pub name: String,
    pub image: Option<String>,
    pub current_price: Option<f64>,
    pub market_cap: Option<f64>,
    pub market_cap_rank: Option<u32>,
    pub total_volume: Option<f64>,
    pub price_change_percentage_24h: Option<f64>,
    pub circulating_supply: Option<f64>,
    pub total_supply: Option<f64>,
    pub high_24h: Option<f64>,
    pub low_24h: Option<f64>,
    #[serde(skip_deserializing)]
    pub db_status: Option<DbStatus>,
    #[serde(skip_deserializing)]
    pub db_score: Option<DbScore>,
    #[serde(flatten)]
    pub extra: std::collections::HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbStatus {
    pub label: String,
    pub color: String,
    pub icon: String,
    pub note: Option<String>,
}

impl DbStatus {
    pub fn halal(note: Option<&str>) -> Self {
        Self {
            label: "Halal".into(),
            color: "green".into(),
            icon: "✓".into(),
            note: note.map(|s| s.to_string()),
        }
    }

    pub fn syubhat(note: Option<&str>) -> Self {
        Self {
            label: "Syubhat".into(),
            color: "yellow".into(),
            icon: "!".into(),
            note: note.map(|s| s.to_string()),
        }
    }

    pub fn haram(note: Option<&str>) -> Self {
        Self {
            label: "Haram".into(),
            color: "red".into(),
            icon: "x".into(),
            note: note.map(|s| s.to_string()),
        }
    }

    pub fn dont_know() -> Self {
        Self {
            label: "Tidak diketahui".into(),
            color: "gray".into(),
            icon: "?".into(),
            note: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbScore {
    pub total: f64,
    pub shariah_compliance: f64,
    pub transparency: f64,
    pub community_support: f64,
    pub development_activity: f64,
    pub market_performance: f64,
}

impl DbScore {
    pub fn calculation(
        shariah_compliance: f64,
        transparency: f64,
        community_support: f64,
        development_activity: f64,
        market_performance: f64
    ) -> Self {
        let total =
            shariah_compliance * 0.3 +
            transparency * 0.25 +
            community_support * 0.2 +
            development_activity * 0.15 +
            market_performance * 0.1;
        Self {
            total,
            shariah_compliance,
            transparency,
            community_support,
            development_activity,
            market_performance,
        }
    }

    pub fn covertion_to_status(&self) -> DbStatus {
        match self.total as u32 {
            70..=100 =>
                DbStatus::halal(Some("progres nyata dan tak berlawanan dengan hukum islam")),
            40..=69 => DbStatus::syubhat(Some("dalam kajian dan akan memakan waktu lama")),
            _ => DbStatus::haram(Some("tidak memenuhi kriteria hukum islam")),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScreenerResponse {
    pub id: String,
    pub symbol: String,
    pub name: String,
    pub image: String,
    pub current_price: Option<f64>,
    pub market_cap: Option<f64>,
    pub market_cap_rank: Option<u32>,
    pub total_volume: Option<f64>,
    pub price_change_percentage_24h: Option<f64>,
    pub circulating_supply: Option<f64>,
    pub total_supply: Option<f64>,
    pub high_24h: Option<f64>,
    pub low_24h: Option<f64>,
    pub db_status: DbStatus,
    pub db_score: DbScore,
}
