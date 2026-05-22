/// Validate that a prime row has exactly 12 unique pitch classes (0-11).
pub fn validate_prime_row(row: &[u8]) -> Result<(), String> {
    if row.len() != 12 {
        return Err(format!(
            "Prime row must have exactly 12 pitch classes, got {}",
            row.len()
        ));
    }
    let mut seen = [false; 12];
    for &pc in row {
        if pc > 11 {
            return Err(format!("Pitch class {} is out of range (0-11)", pc));
        }
        if seen[pc as usize] {
            return Err("Prime row must contain 12 unique pitch classes".into());
        }
        seen[pc as usize] = true;
    }
    Ok(())
}

/// Compute I0: the inversion of P0 starting on the same first note.
/// Formula: I0[i] = (2 * P0[0] - P0[i]) mod 12
fn compute_i0(p0: &[u8; 12]) -> [u8; 12] {
    let first = p0[0] as i32;
    let mut i0 = [0u8; 12];
    for i in 0..12 {
        i0[i] = ((2 * first - p0[i] as i32).rem_euclid(12)) as u8;
    }
    i0
}

/// Compute the full 12x12 twelve-tone matrix.
/// Formula: Matrix[r][c] = (P0[c] + I0[r] - P0[0]) mod 12
pub fn compute_matrix(p0: &[u8; 12]) -> [[u8; 12]; 12] {
    let i0 = compute_i0(p0);
    let first = p0[0] as i32;
    let mut matrix = [[0u8; 12]; 12];

    for r in 0..12 {
        for c in 0..12 {
            matrix[r][c] = ((p0[c] as i32 + i0[r] as i32 - first).rem_euclid(12)) as u8;
        }
    }

    matrix
}

pub fn row_labels() -> Vec<String> {
    (0..12).map(|i| format!("P{}", i)).collect()
}

pub fn col_labels() -> Vec<String> {
    (0..12).map(|i| format!("I{}", i)).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_row_passes() {
        let row: Vec<u8> = vec![0, 1, 3, 4, 6, 7, 9, 10, 11, 2, 5, 8];
        assert!(validate_prime_row(&row).is_ok());
    }

    #[test]
    fn wrong_length_fails() {
        let row: Vec<u8> = vec![0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        assert!(validate_prime_row(&row).is_err());
    }

    #[test]
    fn duplicate_fails() {
        let row: Vec<u8> = vec![0, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        assert!(validate_prime_row(&row).is_err());
    }

    #[test]
    fn out_of_range_fails() {
        let row: Vec<u8> = vec![0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
        assert!(validate_prime_row(&row).is_err());
    }

    #[test]
    fn matrix_first_row_equals_p0() {
        let p0: [u8; 12] = [0, 1, 3, 4, 6, 7, 9, 10, 11, 2, 5, 8];
        let matrix = compute_matrix(&p0);
        for c in 0..12 {
            assert_eq!(matrix[0][c], p0[c]);
        }
    }

    #[test]
    fn matrix_first_column_equals_i0() {
        let p0: [u8; 12] = [0, 1, 3, 4, 6, 7, 9, 10, 11, 2, 5, 8];
        let i0 = compute_i0(&p0);
        let matrix = compute_matrix(&p0);
        for r in 0..12 {
            assert_eq!(matrix[r][0], i0[r]);
        }
    }

    #[test]
    fn known_schoenberg_op25() {
        let p0: [u8; 12] = [4, 5, 7, 1, 6, 3, 8, 2, 11, 0, 9, 10];
        let matrix = compute_matrix(&p0);
        assert_eq!(matrix[0], p0);
        assert_eq!(matrix[0][0], 4);
        assert_eq!(matrix[3][0], 7);
    }

    #[test]
    fn chromatic_row_produces_correct_matrix() {
        let p0: [u8; 12] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let matrix = compute_matrix(&p0);
        assert_eq!(matrix[0][0], 0);
        assert_eq!(matrix[0][11], 11);
        assert_eq!(matrix[1][0], 11);
        assert_eq!(matrix[1][1], 0);
        assert_eq!(matrix[11][0], 1);
    }

    #[test]
    fn row_col_labels() {
        assert_eq!(row_labels().len(), 12);
        assert_eq!(row_labels()[0], "P0");
        assert_eq!(row_labels()[11], "P11");
        assert_eq!(col_labels()[0], "I0");
        assert_eq!(col_labels()[11], "I11");
    }
}
