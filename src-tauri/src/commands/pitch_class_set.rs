use serde::{Deserialize, Serialize};
use crate::music::{
    set::PitchClassSet,
    normal_form::normal_form,
    prime_form::prime_form,
    interval_vector::interval_vector,
    forte::{self, ForteEntry},
    transformations,
    symmetry::{self, analyze_symmetry},
    classification,
    random::{self, RandomConstraints},
    subsets,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClassificationResult {
    pub normal_form: Vec<u8>,
    pub prime_form: Vec<u8>,
    pub interval_vector: [u8; 6],
    pub forte_number: Option<String>,
    pub chroma: String,
    pub cardinality: usize,
    pub cardinality_name_zh: String,
    pub cardinality_name_en: String,
    pub symmetry_zh: String,
    pub symmetry_en: String,
    pub subsets: Vec<Vec<u8>>,
    pub complement: Vec<u8>,
    pub is_z_related: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransformResult {
    pub notes: Vec<u8>,
    pub note_names: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RandomConstraintsInput {
    pub cardinality: Option<u8>,
    pub require_t_symmetry: Option<bool>,
    pub require_i_symmetry: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ForteTableEntry {
    pub forte_number: String,
    pub cardinality: u8,
    pub prime_form: Vec<u8>,
    pub interval_vector: [u8; 6],
    pub is_z_related: bool,
}

#[tauri::command]
pub fn classify_set(notes: Vec<u8>, ordered: bool) -> Result<ClassificationResult, String> {
    if notes.is_empty() {
        return Err("Empty set".into());
    }

    let set = PitchClassSet::new(notes, ordered);
    let nf = normal_form(&set);
    let pf = prime_form(&set);
    let iv = interval_vector(&pf);
    let forte_entry: Option<ForteEntry> = forte::lookup(&set);
    let chroma = set.chroma_string();
    let sym = analyze_symmetry(&set);
    let subs = subsets::all_subsets(&set);
    let comp = subsets::complement(&set).values();

    let cardinality = set.cardinality();

    Ok(ClassificationResult {
        normal_form: nf,
        prime_form: pf,
        interval_vector: iv,
        forte_number: forte_entry.as_ref().map(|e| e.forte_number.clone()),
        chroma,
        cardinality,
        cardinality_name_zh: classification::cardinality_name_zh(cardinality).to_string(),
        cardinality_name_en: classification::cardinality_name_en(cardinality).to_string(),
        symmetry_zh: symmetry::format_symmetry_zh(&sym),
        symmetry_en: symmetry::format_symmetry_en(&sym),
        subsets: subs,
        complement: comp,
        is_z_related: forte_entry.map(|e| e.is_z_related).unwrap_or(false),
    })
}

#[tauri::command]
pub fn transform(
    notes: Vec<u8>,
    ordered: bool,
    transform_type: String,
    n: i32,
) -> Result<TransformResult, String> {
    let set = PitchClassSet::new(notes, ordered);

    let result = match transform_type.as_str() {
        "Tn" => transformations::transpose(&set, n),
        "In" => transformations::invert(&set, n),
        "R" => transformations::retrograde(&set),
        "RI" => transformations::retrograde_inversion(&set, n),
        _ => return Err(format!("Unknown transform type: {}", transform_type)),
    };

    let values = result.values();
    let names: Vec<String> = values.iter().map(|&v| {
        crate::music::pitch_class::PitchClass::new(v as i32).to_name_sharp().to_string()
    }).collect();

    Ok(TransformResult {
        notes: values,
        note_names: names,
    })
}

#[tauri::command]
pub fn generate_random(constraints: RandomConstraintsInput) -> Result<Vec<u8>, String> {
    let rc = RandomConstraints {
        cardinality: constraints.cardinality,
        require_t_symmetry: constraints.require_t_symmetry.unwrap_or(false),
        require_i_symmetry: constraints.require_i_symmetry.unwrap_or(false),
    };

    random::generate_random(&rc).ok_or_else(|| "No matching set found".into())
}

#[tauri::command]
pub fn get_forte_table() -> Result<Vec<ForteTableEntry>, String> {
    let entries = forte::all_entries();
    Ok(entries
        .into_iter()
        .map(|e| ForteTableEntry {
            forte_number: e.forte_number,
            cardinality: e.cardinality,
            prime_form: e.prime_form,
            interval_vector: e.interval_vector,
            is_z_related: e.is_z_related,
        })
        .collect())
}
