use crate::music::set::PitchClassSet;

/// Compute the normal form (Forte's method).
/// Returns pitch class values sorted in normal order.
pub fn normal_form(set: &PitchClassSet) -> Vec<u8> {
    let n = set.cardinality();
    if n <= 1 {
        return set.values();
    }

    let values = set.values();
    let mut best: Vec<u8> = values.clone();

    // For each rotation of the sorted set
    for rot in 0..n {
        let rotated: Vec<u8> = values
            .iter()
            .cycle()
            .skip(rot)
            .take(n)
            .copied()
            .collect();

        // Transpose so first element is 0
        let first = rotated[0];
        let normalized: Vec<u8> = rotated.iter().map(|&x| (x as i32 - first as i32).rem_euclid(12) as u8).collect();

        if is_better(&normalized, &best) {
            best = normalized.clone();
        }
    }

    best
}

/// Compare two normal form candidates. Returns true if `a` is more compact than `b`.
fn is_better(a: &[u8], b: &[u8]) -> bool {
    let n = a.len();
    // Compare intervals from the end backward (compactness criterion)
    for k in (1..n).rev() {
        let a_dist = a[k];
        let b_dist = b[k];
        match a_dist.cmp(&b_dist) {
            std::cmp::Ordering::Less => return true,
            std::cmp::Ordering::Greater => return false,
            std::cmp::Ordering::Equal => {}
        }
    }
    // If all intervals equal, compare first non-zero entry
    for i in 1..n {
        match a[i].cmp(&b[i]) {
            std::cmp::Ordering::Less => return true,
            std::cmp::Ordering::Greater => return false,
            std::cmp::Ordering::Equal => {}
        }
    }
    false
}

/// Transpose a set so its first element becomes 0
pub fn transpose_to_zero(values: &[u8]) -> Vec<u8> {
    if values.is_empty() {
        return vec![];
    }
    let first = values[0];
    values.iter().map(|&x| (x as i32 - first as i32).rem_euclid(12) as u8).collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::music::set::PitchClassSet;

    #[test]
    fn normal_form_major_triad() {
        // C E G = {0, 4, 7}
        let set = PitchClassSet::new(vec![0, 4, 7], false);
        let nf = normal_form(&set);
        // Normal form of {0,4,7} is [0,4,7] (already compact)
        assert_eq!(nf, vec![0, 4, 7]);
    }

    #[test]
    fn normal_form_rotated() {
        // E G C = {4, 7, 0} -> sorted: {0, 4, 7} -> normal form [0, 4, 7]
        let set = PitchClassSet::new(vec![4, 7, 0], false);
        let nf = normal_form(&set);
        assert_eq!(nf, vec![0, 4, 7]);
    }

    #[test]
    fn normal_form_4_notes() {
        // {0,4,6,9} → most compact rotation is [4,6,9,0]→[0,2,5,8]
        let set = PitchClassSet::new(vec![0, 4, 6, 9], false);
        let nf = normal_form(&set);
        assert_eq!(nf, vec![0, 2, 5, 8]);
    }

    #[test]
    fn normal_form_forte_5_1() {
        // Forte 5-1: {0, 1, 3, 5, 8} or similar
        // Actually 5-1 is {0,1,2,3,4} which has normal form [0,1,2,3,4]
        let set = PitchClassSet::new(vec![0, 1, 2, 3, 4], false);
        let nf = normal_form(&set);
        assert_eq!(nf, vec![0, 1, 2, 3, 4]);
    }
}
