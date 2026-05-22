use rand::Rng;
use crate::music::set::PitchClassSet;
use crate::music::symmetry::analyze_symmetry;

/// Constraints for random set generation.
#[derive(Debug, Clone)]
pub struct RandomConstraints {
    pub cardinality: Option<u8>,
    pub require_t_symmetry: bool,
    pub require_i_symmetry: bool,
}

/// Generate a random pitch-class set meeting the given constraints.
/// Returns the set's pitch class values (0-11).
pub fn generate_random(constraints: &RandomConstraints) -> Option<Vec<u8>> {
    let cardinality = constraints.cardinality.unwrap_or(3).max(1).min(12) as usize;

    // If symmetry required, filter from pre-generated candidates
    let mut rng = rand::thread_rng();

    // Try up to 10000 random sets to find one matching constraints
    for _ in 0..10000 {
        let values = random_subset(cardinality, &mut rng);
        let set = PitchClassSet::new(values, false);

        if constraints.require_t_symmetry || constraints.require_i_symmetry {
            let sym = analyze_symmetry(&set);
            let mut has_requested = false;
            if constraints.require_t_symmetry && sym.is_transpositionally_symmetric {
                has_requested = true;
            }
            if constraints.require_i_symmetry && sym.is_inversionally_symmetric {
                has_requested = true;
            }
            if !has_requested {
                continue;
            }
        }

        return Some(set.values());
    }

    None
}

/// Generate a random subset of a given cardinality from {0..11}.
fn random_subset(cardinality: usize, rng: &mut impl Rng) -> Vec<u8> {
    let mut pool: Vec<u8> = (0..12).collect();
    let mut result = Vec::with_capacity(cardinality);

    for _ in 0..cardinality {
        let idx = rng.gen_range(0..pool.len());
        result.push(pool.remove(idx));
    }

    result.sort();
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generate_trichord() {
        let constraints = RandomConstraints {
            cardinality: Some(3),
            require_t_symmetry: false,
            require_i_symmetry: false,
        };
        let result = generate_random(&constraints).unwrap();
        assert_eq!(result.len(), 3);
        // All values must be 0-11
        assert!(result.iter().all(|&v| v < 12));
    }

    #[test]
    fn generate_symmetric() {
        let constraints = RandomConstraints {
            cardinality: Some(4),
            require_t_symmetry: true,
            require_i_symmetry: false,
        };
        // Diminished seventh {0,3,6,9} is one possible result
        let result = generate_random(&constraints);
        if let Some(values) = result {
            let set = PitchClassSet::new(values, false);
            let sym = analyze_symmetry(&set);
            assert!(sym.is_transpositionally_symmetric);
        }
    }
}
