use serde::Serialize;
use crate::music::twelve_tone;
use crate::music::pitch_class::PitchClass;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TwelveToneMatrixResult {
    pub prime_row: Vec<u8>,
    pub prime_row_names: Vec<String>,
    pub matrix: Vec<Vec<u8>>,
    pub matrix_names: Vec<Vec<String>>,
    pub row_labels: Vec<String>,
    pub col_labels: Vec<String>,
}

#[tauri::command]
pub fn compute_twelve_tone_matrix(
    prime_row: Vec<u8>,
) -> Result<TwelveToneMatrixResult, String> {
    twelve_tone::validate_prime_row(&prime_row)?;

    let mut p0 = [0u8; 12];
    p0.copy_from_slice(&prime_row);

    let matrix = twelve_tone::compute_matrix(&p0);

    let prime_row_names: Vec<String> = prime_row
        .iter()
        .map(|&v| PitchClass::new(v as i32).to_name_sharp().to_string())
        .collect();

    let matrix_names: Vec<Vec<String>> = matrix
        .iter()
        .map(|row| {
            row.iter()
                .map(|&v| PitchClass::new(v as i32).to_name_sharp().to_string())
                .collect()
        })
        .collect();

    Ok(TwelveToneMatrixResult {
        prime_row,
        prime_row_names,
        matrix: matrix.iter().map(|r| r.to_vec()).collect(),
        matrix_names,
        row_labels: twelve_tone::row_labels(),
        col_labels: twelve_tone::col_labels(),
    })
}

#[tauri::command]
pub fn write_file(path: String, contents: Vec<u8>) -> Result<(), String> {
    std::fs::write(&path, &contents).map_err(|e| e.to_string())
}
