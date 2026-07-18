use crate::models::score::{ DbScore, DbStatus };

pub fn status_score(score: &DbScore) -> DbStatus {
    match score.total as u32 {
        70..=100 => DbStatus::halal(Some("progres nyata dan tak berlawanan dengan hukum islam")),
        40..=69 => DbStatus::syubhat(Some("dalam kajian dan akan memakan waktu lama")),
        _ => DbStatus::haram(Some("tidak memenuhi kriteria hukum islam")),
    }
}

pub fn validator_score(nilai: f64) -> f64 {
    nilai.clamp(0.0, 100.0)
}

pub fn average(scores: &[f64]) -> f64 {
    if scores.is_empty() {
        return 0.0;
    }
    scores.iter().sum::<f64>() / (scores.len() as f64)
}
