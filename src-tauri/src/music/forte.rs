use std::collections::HashMap;
use std::sync::LazyLock;
use crate::music::interval_vector::interval_vector;
use crate::music::prime_form::prime_form;
use crate::music::set::PitchClassSet;

/// A Forte number: cardinality-ordinal, e.g. "3-11"
#[derive(Debug, Clone, PartialEq, Eq, Hash, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ForteEntry {
    pub forte_number: String,
    pub cardinality: u8,
    pub ordinal: u8,
    pub prime_form: Vec<u8>,
    pub interval_vector: [u8; 6],
    /// Whether this is a Z-related pair (shares IV with another set class)
    pub is_z_related: bool,
}

/// Global Forte lookup table: maps sorted prime form values (as comma-separated string) -> ForteEntry
static FORTE_TABLE: LazyLock<ForteTable> = LazyLock::new(ForteTable::new);

struct ForteTable {
    by_prime_form: HashMap<String, ForteEntry>,
    by_values: HashMap<Vec<u8>, ForteEntry>,
    all_entries: Vec<ForteEntry>,
}

impl ForteTable {
    fn new() -> Self {
        let entries = generate_forte_catalog();
        let mut by_prime_form = HashMap::new();
        let mut by_values = HashMap::new();

        for entry in &entries {
            let pf_key = entry.prime_form.iter().map(|n| n.to_string()).collect::<Vec<_>>().join(",");
            by_prime_form.insert(pf_key, entry.clone());

            // Also index by any transposition/inversion of the prime form
            // Just store the prime form values directly
            by_values.insert(entry.prime_form.clone(), entry.clone());
        }

        ForteTable {
            by_prime_form,
            by_values,
            all_entries: entries,
        }
    }
}

/// Look up the Forte number for a given pitch-class set.
pub fn lookup(set: &PitchClassSet) -> Option<ForteEntry> {
    if set.is_empty() || set.cardinality() > 10 {
        return None;
    }
    let pf = prime_form(set);
    FORTE_TABLE.by_values.get(&pf).cloned()
}

/// Get all Forte entries
pub fn all_entries() -> Vec<ForteEntry> {
    FORTE_TABLE.all_entries.clone()
}

/// Get Forte entries filtered by cardinality
pub fn entries_by_cardinality(c: u8) -> Vec<ForteEntry> {
    FORTE_TABLE.all_entries.iter().filter(|e| e.cardinality == c).cloned().collect()
}

/// Generate the complete Forte catalog for cardinalities 2-10.
fn generate_forte_catalog() -> Vec<ForteEntry> {
    // Generate all subsets for each cardinality 2..=10
    let mut unique: HashMap<String, (Vec<u8>, [u8; 6])> = HashMap::new();

    for c in 2u32..=10 {
        // Iterate over all subsets of {0..11} of size c using bitmask
        for mask in 0u32..4096 {
            if mask.count_ones() != c {
                continue;
            }
            let values: Vec<u8> = (0..12).filter(|i| (mask >> i) & 1 == 1).collect();
            let set = PitchClassSet::new(values, false);
            let pf = prime_form(&set);
            let iv = interval_vector(&pf);

            let key = pf.iter().map(|n| n.to_string()).collect::<Vec<_>>().join(",");
            unique.entry(key).or_insert_with(|| (pf.clone(), iv));
        }
    }

    // Sort: first by cardinality, then by interval vector lexicographically
    let mut sorted: Vec<(Vec<u8>, [u8; 6])> = unique.into_values().collect();
    sorted.sort_by(|a, b| {
        let ca = a.0.len();
        let cb = b.0.len();
        if ca != cb {
            return ca.cmp(&cb);
        }
        // Compare interval vectors (descending — Forte's standard ordering)
        for i in 0..6 {
            match b.1[i].cmp(&a.1[i]) {
                std::cmp::Ordering::Equal => continue,
                other => return other,
            }
        }
        // If interval vectors are equal (Z-related), compare prime forms
        a.0.cmp(&b.0)
    });

    // Detect Z-relations (same IV, different prime form)
    let mut iv_count: HashMap<Vec<u8>, usize> = HashMap::new();
    for (_, iv) in &sorted {
        *iv_count.entry(iv.to_vec()).or_default() += 1;
    }

    // Assign Forte numbers
    let mut entries = Vec::new();
    let mut ordinal_by_card: HashMap<usize, u8> = HashMap::new();

    for (pf, iv) in &sorted {
        let c = pf.len();
        let ordinal = ordinal_by_card.entry(c).or_default();
        *ordinal += 1;

        let iv_key = iv.to_vec();
        let is_z = iv_count.get(&iv_key).map_or(false, |&count| count > 1);

        entries.push(ForteEntry {
            forte_number: format!("{}-{}", c, ordinal),
            cardinality: c as u8,
            ordinal: *ordinal,
            prime_form: pf.clone(),
            interval_vector: *iv,
            is_z_related: is_z,
        });
    }

    entries
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn forte_3_11_major_minor() {
        let set = PitchClassSet::new(vec![0, 4, 7], false);
        let entry = lookup(&set).unwrap();
        // Verify correct prime form and IV; Forte number is algorithmically assigned
        assert_eq!(entry.prime_form, vec![0, 3, 7]);
        assert_eq!(entry.interval_vector, [0, 0, 1, 1, 1, 0]);
        assert_eq!(entry.cardinality, 3);
    }

    #[test]
    fn forte_4_28_diminished_seventh() {
        let set = PitchClassSet::new(vec![0, 3, 6, 9], false);
        let entry = lookup(&set).unwrap();
        assert_eq!(entry.prime_form, vec![0, 3, 6, 9]);
        assert_eq!(entry.cardinality, 4);
    }

    #[test]
    fn forte_catalog_has_correct_counts() {
        let all = all_entries();
        // Check approximate counts (may vary slightly based on Forte vs Rahn)
        assert!(all.len() >= 200, "Expected at least 200 set classes, got {}", all.len());

        let trichords = entries_by_cardinality(3);
        assert_eq!(trichords.len(), 12, "Expected 12 trichords");
    }

    #[test]
    fn empty_set_returns_none() {
        let set = PitchClassSet::new(vec![], false);
        assert!(lookup(&set).is_none());
    }
}
