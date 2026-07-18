pub struct DbConfig {
    pub base_url: String,
}

impl DbConfig {
    pub fn from_env() -> Self {
        Self {
            base_url: std::env
                ::var("DATABASE_URL")
                .unwrap_or_else(|_| "postgres://localhost/halal_crypto".into()),
        }
    }
}
