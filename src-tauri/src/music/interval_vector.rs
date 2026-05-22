use crate::music::pitch_class::PitchClass;

/// Compute the interval-class vector as [ic1, ic2, ic3, ic4, ic5, ic6].
/// Each entry counts how many unordered pairs produce that interval class.
pub fn interval_vector(values: &[u8]) -> [u8; 6] {
    let mut counts = [0u8; 6];
    let n = values.len();
    if n < 2 {
        return counts;
    }
    for i in 0..n - 1 {
        let a = PitchClass::new(values[i] as i32);
        for j in i + 1..n {
            let b = PitchClass::new(values[j] as i32);
            let ic = a.interval_class(&b) as usize;
            if ic >= 1 && ic <= 6 {
                counts[ic - 1] += 1;
            }
        }
    }
    counts
}

/// Format interval vector as string, e.g. "<1,0,1,1,1,0>"
pub fn format_iv(iv: &[u8; 6]) -> String {
    format!(
        "<{},{},{},{},{},{}>",
        iv[0], iv[1], iv[2], iv[3], iv[4], iv[5]
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn iv_major_triad() {
        // {C, E, G} = {0, 4, 7}: C-E=ic4, C-G=ic5, E-G=ic3 → IV=[0,0,1,1,1,0]
        let iv = interval_vector(&[0, 4, 7]);
        assert_eq!(iv, [0, 0, 1, 1, 1, 0]);
    }

    #[test]
    fn iv_diminished_seventh() {
        // {0, 3, 6, 9}: 4×ic3 + 2×ic6 → IV=[0,0,4,0,0,2]
        let iv = interval_vector(&[0, 3, 6, 9]);
        assert_eq!(iv, [0, 0, 4, 0, 0, 2]);
    }

    #[test]
    fn iv_single_note() {
        let iv = interval_vector(&[0]);
        assert_eq!(iv, [0, 0, 0, 0, 0, 0]);
    }

    #[test]
    fn iv_whole_tone() {
        // {0, 2, 4, 6, 8, 10}: 6×ic2 + 6×ic4 + 3×ic6 → IV=[0,6,0,6,0,3]
        let iv = interval_vector(&[0, 2, 4, 6, 8, 10]);
        assert_eq!(iv, [0, 6, 0, 6, 0, 3]);
    }
}
