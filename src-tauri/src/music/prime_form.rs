use crate::music::normal_form::{normal_form, transpose_to_zero};
use crate::music::set::PitchClassSet;

/// Compute the prime form (Forte's method).
/// Returns pitch class values starting at 0, using the more compact
/// of the normal form of the set and the normal form of its inversion.
pub fn prime_form(set: &PitchClassSet) -> Vec<u8> {
    if set.is_empty() {
        return vec![];
    }
    if set.cardinality() == 1 {
        return vec![0];
    }

    // Normal form of the original set
    let nf_orig = normal_form(set);

    // Normal form of the inverted set (invert each element around 0)
    let inverted_values: Vec<u8> = set
        .elements
        .iter()
        .map(|pc| pc.invert(0).value())
        .collect();
    let inverted_set = PitchClassSet::new(inverted_values, false);
    let nf_inv = normal_form(&inverted_set);

    // Compare: which is more "left-packed"
    if is_more_compact(&nf_inv, &nf_orig) {
        // Transpose inverted normal form to start at 0
        transpose_to_zero(&nf_inv)
    } else {
        nf_orig // Already starts at 0 (normal form always does)
    }
}

/// Returns true if `a` is more compact (smaller) than `b`.
/// Compare intervals from first to each successive element.
fn is_more_compact(a: &[u8], b: &[u8]) -> bool {
    for i in 0..a.len() {
        match a[i].cmp(&b[i]) {
            std::cmp::Ordering::Less => return true,
            std::cmp::Ordering::Greater => return false,
            std::cmp::Ordering::Equal => {}
        }
    }
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn prime_form_major_triad() {
        // {C, E, G} -> prime form (0,3,7) = Forte 3-11
        let set = PitchClassSet::new(vec![0, 4, 7], false);
        let pf = prime_form(&set);
        assert_eq!(pf, vec![0, 3, 7]);
    }

    #[test]
    fn prime_form_minor_triad() {
        // {C, Eb, G} = {0, 3, 7} -> prime form (0,3,7) same as major! = Forte 3-11
        let set = PitchClassSet::new(vec![0, 3, 7], false);
        let pf = prime_form(&set);
        assert_eq!(pf, vec![0, 3, 7]);
    }

    #[test]
    fn prime_form_diminished_seventh() {
        // {0, 3, 6, 9} -> prime form (0,3,6,9) = Forte 4-28
        let set = PitchClassSet::new(vec![0, 3, 6, 9], false);
        let pf = prime_form(&set);
        assert_eq!(pf, vec![0, 3, 6, 9]);
    }

    #[test]
    fn prime_form_whole_tone() {
        // {0, 2, 4, 6, 8, 10} -> prime form (0,2,4,6,8,10) = Forte 6-35
        let set = PitchClassSet::new(vec![0, 2, 4, 6, 8, 10], false);
        let pf = prime_form(&set);
        assert_eq!(pf, vec![0, 2, 4, 6, 8, 10]);
    }

    #[test]
    fn prime_form_chromatic_tetrachord() {
        // {0, 1, 3, 4} -> prime form (0,1,3,4) = Forte 4-3
        let set = PitchClassSet::new(vec![0, 1, 3, 4], false);
        let pf = prime_form(&set);
        assert_eq!(pf, vec![0, 1, 3, 4]);
    }
}
