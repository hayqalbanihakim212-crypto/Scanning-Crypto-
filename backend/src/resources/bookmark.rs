use std::collections::HashMap;
use crate::models::score::{ DbScore, DbStatus };

pub struct DbDatabase {
    pub data: HashMap<String, DbScore>,
}

impl DbDatabase {
    pub fn load() -> Self {
        let mut data = HashMap::new();

        data.insert("bitcoin".into(), DbScore::calculation(80.0, 75.0, 70.0, 65.0, 60.0));
        data.insert("ethereum".into(), DbScore::calculation(75.0, 70.0, 72.0, 68.0, 65.0));
        data.insert("binancecoin".into(), DbScore::calculation(65.0, 60.0, 68.0, 60.0, 58.0));
        data.insert("ripple".into(), DbScore::calculation(70.0, 72.0, 65.0, 62.0, 60.0));
        data.insert("dogecoin".into(), DbScore::calculation(20.0, 30.0, 40.0, 25.0, 35.0));
        data.insert("solana".into(), DbScore::calculation(70.0, 68.0, 65.0, 72.0, 60.0));
        data.insert("tether".into(), DbScore::calculation(40.0, 50.0, 55.0, 45.0, 50.0));
        data.insert("chainlink".into(), DbScore::calculation(80.0, 78.0, 72.0, 75.0, 65.0));
        data.insert("cardano".into(), DbScore::calculation(72.0, 70.0, 68.0, 75.0, 62.0));
        data.insert("polkadot".into(), DbScore::calculation(70.0, 68.0, 65.0, 72.0, 60.0));

        Self { data }
    }

    pub fn get_score(&self, coin_id: &str) -> DbScore {
        self.data
            .get(coin_id)
            .cloned()
            .unwrap_or_else(|| { DbScore::calculation(50.0, 50.0, 50.0, 50.0, 50.0) })
    }

    pub fn get_status(&self, coin_id: &str) -> DbStatus {
        self.get_score(coin_id).covertion_to_status()
    }
}
