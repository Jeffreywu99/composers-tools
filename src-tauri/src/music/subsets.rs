use crate::music::set::PitchClassSet;

/// Find all subsets of the given set, up to a specific size.
/// Returns all non-empty proper subsets as sorted vectors of pitch class values.
pub fn all_subsets(set: &PitchClassSet) -> Vec<Vec<u8>> {
    let values = set.values();
    let n = values.len();
    if n <= 1 {
        return vec![];
    }

    let mut results = Vec::new();
    // All non-empty proper subsets
    for mask in 1u32..(1u32 << n) - 1 {
        let subset: Vec<u8> = (0..n)
            .filter(|i| (mask >> i) & 1 == 1)
            .map(|i| values[i])
            .collect();
        results.push(subset);
    }
    results
}

/// Find the complement of a set (all pitch classes 0-11 not in the set).
pub fn complement(set: &PitchClassSet) -> PitchClassSet {
    let values = set.values();
    let comp: Vec<u8> = (0..12).filter(|v| !values.contains(v)).collect();
    PitchClassSet::new(comp, false)
}

/// Check if `needle` is a subset of `haystack`.
pub fn is_subset(needle: &PitchClassSet, haystack: &PitchClassSet) -> bool {
    let hay_values = haystack.values();
    needle.elements.iter().all(|pc| hay_values.contains(&pc.value()))
}

/// Check if `needle` is a superset of `haystack`.
pub fn is_superset(needle: &PitchClassSet, haystack: &PitchClassSet) -> bool {
    is_subset(haystack, needle)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn complement_of_major_triad() {
        // {C, E, G} = {0, 4, 7}, complement = {1, 2, 3, 5, 6, 8, 9, 10, 11}
        let set = PitchClassSet::new(vec![0, 4, 7], false);
        let comp = complement(&set);
        assert_eq!(comp.cardinality(), 9);
        assert!(!comp.values().contains(&0));
        assert!(!comp.values().contains(&4));
        assert!(!comp.values().contains(&7));
    }

    #[test]
    fn subsets_of_trichord() {
        let set = PitchClassSet::new(vec![0, 4, 7], false);
        let subs = all_subsets(&set);
        // 3 notes: 2^3 - 2 = 6 non-empty proper subsets
        assert_eq!(subs.len(), 6);
    }

    #[test]
    fn is_subset_check() {
        let subset = PitchClassSet::new(vec![0, 4], false);
        let superset = PitchClassSet::new(vec![0, 4, 7], false);
        assert!(is_subset(&subset, &superset));
        assert!(is_superset(&superset, &subset));
        assert!(!is_subset(&superset, &subset));
    }
}
