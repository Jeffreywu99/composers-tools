use crate::music::set::PitchClassSet;

/// Result of symmetry analysis on a pitch-class set.
#[derive(Debug, Clone)]
pub struct SymmetryInfo {
    pub is_transpositionally_symmetric: bool,
    pub is_inversionally_symmetric: bool,
    /// T-levels under which the set maps to itself (empty if none)
    pub t_symmetry_indices: Vec<u8>,
    /// I-levels under which the set maps to itself (empty if none)
    pub i_symmetry_indices: Vec<u8>,
}

/// Analyze the symmetry of a pitch-class set.
pub fn analyze_symmetry(set: &PitchClassSet) -> SymmetryInfo {
    let values = set.values();
    let normalized = normalize_for_comparison(&values);

    // Check T-symmetry: for each Tn (n=1..11), transpose and see if set equals itself
    let mut t_indices = vec![];
    for n in 1..=11 {
        let transposed: Vec<u8> = values.iter().map(|&v| (v + n) % 12).collect();
        let trans_norm = normalize_for_comparison(&transposed);
        if trans_norm == normalized {
            t_indices.push(n);
        }
    }

    // Check I-symmetry: for each In (n=0..11), invert and see if set equals itself
    let mut i_indices = vec![];
    for n in 0..=11 {
        let inverted: Vec<u8> = values.iter().map(|&v| (n as i32 - v as i32).rem_euclid(12) as u8).collect();
        let inv_norm = normalize_for_comparison(&inverted);
        if inv_norm == normalized {
            i_indices.push(n);
        }
    }

    SymmetryInfo {
        is_transpositionally_symmetric: !t_indices.is_empty(),
        is_inversionally_symmetric: !i_indices.is_empty(),
        t_symmetry_indices: t_indices,
        i_symmetry_indices: i_indices,
    }
}

/// Sort and deduplicate for set comparison
fn normalize_for_comparison(values: &[u8]) -> Vec<u8> {
    let mut v: Vec<u8> = values.to_vec();
    v.sort();
    v.dedup();
    v
}

/// Format symmetry info as human-readable Chinese text
pub fn format_symmetry_zh(info: &SymmetryInfo) -> String {
    let mut parts = vec![];
    if info.is_transpositionally_symmetric {
        let ts: Vec<String> = info.t_symmetry_indices.iter().map(|n| format!("T{}", n)).collect();
        parts.push(format!("移调对称: {}", ts.join(", ")));
    }
    if info.is_inversionally_symmetric {
        let is: Vec<String> = info.i_symmetry_indices.iter().map(|n| format!("I{}", n)).collect();
        parts.push(format!("倒影对称: {}", is.join(", ")));
    }
    if parts.is_empty() {
        "无对称性".to_string()
    } else {
        parts.join("; ")
    }
}

/// Format symmetry info as human-readable English text
pub fn format_symmetry_en(info: &SymmetryInfo) -> String {
    let mut parts = vec![];
    if info.is_transpositionally_symmetric {
        let ts: Vec<String> = info.t_symmetry_indices.iter().map(|n| format!("T{}", n)).collect();
        parts.push(format!("T-symmetric: {}", ts.join(", ")));
    }
    if info.is_inversionally_symmetric {
        let is: Vec<String> = info.i_symmetry_indices.iter().map(|n| format!("I{}", n)).collect();
        parts.push(format!("I-symmetric: {}", is.join(", ")));
    }
    if parts.is_empty() {
        "None".to_string()
    } else {
        parts.join("; ")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn diminished_seventh_is_t_symmetric() {
        // {0, 3, 6, 9}: T3 maps to itself
        let set = PitchClassSet::new(vec![0, 3, 6, 9], false);
        let info = analyze_symmetry(&set);
        assert!(info.is_transpositionally_symmetric);
        assert!(info.t_symmetry_indices.contains(&3));
        assert!(info.t_symmetry_indices.contains(&6));
    }

    #[test]
    fn major_triad_not_symmetric() {
        let set = PitchClassSet::new(vec![0, 4, 7], false);
        let info = analyze_symmetry(&set);
        assert!(!info.is_transpositionally_symmetric);
        assert!(!info.is_inversionally_symmetric);
    }

    #[test]
    fn whole_tone_is_t_symmetric() {
        // {0, 2, 4, 6, 8, 10}: T2 maps to itself
        let set = PitchClassSet::new(vec![0, 2, 4, 6, 8, 10], false);
        let info = analyze_symmetry(&set);
        assert!(info.is_transpositionally_symmetric);
        assert!(info.t_symmetry_indices.contains(&2));
    }
}
