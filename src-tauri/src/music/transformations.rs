use crate::music::set::PitchClassSet;

/// Transpose each element by n (mod 12).
pub fn transpose(set: &PitchClassSet, n: i32) -> PitchClassSet {
    let elements: Vec<u8> = set.elements.iter().map(|pc| pc.transpose(n).value()).collect();
    PitchClassSet::new(elements, set.ordered)
}

/// Inversion: each element e becomes (n - e) mod 12.
pub fn invert(set: &PitchClassSet, n: i32) -> PitchClassSet {
    let elements: Vec<u8> = set.elements.iter().map(|pc| pc.invert(n).value()).collect();
    PitchClassSet::new(elements, set.ordered)
}

/// Retrograde: reverse the element order.
/// Only meaningful for ordered sets. If unordered, behavior is the same as identity
/// (since unordered sets are always sorted).
pub fn retrograde(set: &PitchClassSet) -> PitchClassSet {
    let elements: Vec<u8> = set.elements.iter().rev().map(|pc| pc.value()).collect();
    PitchClassSet::new(elements, set.ordered)
}

/// Retrograde-inversion: invert then retrograde.
pub fn retrograde_inversion(set: &PitchClassSet, n: i32) -> PitchClassSet {
    let inverted = invert(set, n);
    retrograde(&inverted)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn transpose_c_major() {
        // {C, E, G} T7 -> {G, B, D} = {7, 11, 2}
        let set = PitchClassSet::new(vec![0, 4, 7], false);
        let result = transpose(&set, 7);
        assert_eq!(result.values(), vec![2, 7, 11]);
    }

    #[test]
    fn invert_i0() {
        // {C, E, G} I0 -> {C, Ab, F} = {0, 8, 5} sorted = {0, 5, 8}
        let set = PitchClassSet::new(vec![0, 4, 7], false);
        let result = invert(&set, 0);
        assert_eq!(result.values(), vec![0, 5, 8]);
    }

    #[test]
    fn retrograde_ordered() {
        // Ordered [C, E, G] -> [G, E, C] = [7, 4, 0]
        let set = PitchClassSet::new(vec![0, 4, 7], true);
        let result = retrograde(&set);
        assert_eq!(result.values(), vec![7, 4, 0]);
    }

    #[test]
    fn retrograde_inversion_ordered() {
        // Ordered [C, E, G], RI0 = retrograde of I0 = [F, Ab, C] = [5, 8, 0]
        let set = PitchClassSet::new(vec![0, 4, 7], true);
        let result = retrograde_inversion(&set, 0);
        assert_eq!(result.values(), vec![5, 8, 0]);
    }
}
