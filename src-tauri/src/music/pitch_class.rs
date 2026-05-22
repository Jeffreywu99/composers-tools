use std::fmt;

/// A pitch class is an integer modulo 12.
/// 0 = C, 1 = C#/Db, 2 = D, ..., 11 = B.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub struct PitchClass(u8);

impl PitchClass {
    pub fn new(n: i32) -> Self {
        Self(n.rem_euclid(12) as u8)
    }

    pub fn from_str(s: &str) -> Result<Self, ParseError> {
        let s = s.trim();
        // Handle numeric input
        if let Ok(n) = s.parse::<i32>() {
            if (0..=11).contains(&n) {
                return Ok(Self(n as u8));
            }
            return Err(ParseError::OutOfRange);
        }
        match s.to_uppercase().as_str() {
            "C" => Ok(Self(0)),
            "C#" | "CS" | "DB" | "D♭" => Ok(Self(1)),
            "D" => Ok(Self(2)),
            "D#" | "DS" | "EB" | "E♭" => Ok(Self(3)),
            "E" => Ok(Self(4)),
            "F" => Ok(Self(5)),
            "F#" | "FS" | "GB" | "G♭" => Ok(Self(6)),
            "G" => Ok(Self(7)),
            "G#" | "GS" | "AB" | "A♭" => Ok(Self(8)),
            "A" => Ok(Self(9)),
            "A#" | "AS" | "BB" | "B♭" => Ok(Self(10)),
            "B" => Ok(Self(11)),
            _ => Err(ParseError::InvalidName),
        }
    }

    pub fn value(&self) -> u8 {
        self.0
    }

    /// Name using sharps (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
    pub fn to_name_sharp(&self) -> &'static str {
        SHARP_NAMES[self.0 as usize]
    }

    /// Name using flats (C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B)
    pub fn to_name_flat(&self) -> &'static str {
        FLAT_NAMES[self.0 as usize]
    }

    pub fn transpose(&self, n: i32) -> Self {
        Self::new(self.0 as i32 + n)
    }

    /// Invert around axis n (standard: n = 0 gives I0)
    pub fn invert(&self, n: i32) -> Self {
        Self::new(n - self.0 as i32)
    }

    /// Interval class (shortest distance) from self to other
    pub fn interval_class(&self, other: &PitchClass) -> u8 {
        let diff = if self.0 <= other.0 {
            other.0 - self.0
        } else {
            self.0 - other.0
        };
        if diff > 6 { 12 - diff } else { diff }
    }
}

const SHARP_NAMES: [&str; 12] = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

const FLAT_NAMES: [&str; 12] = [
    "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
];

#[derive(Debug, PartialEq)]
pub enum ParseError {
    InvalidName,
    OutOfRange,
}

impl fmt::Display for PitchClass {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_name_sharp())
    }
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ParseError::InvalidName => write!(f, "invalid pitch class name"),
            ParseError::OutOfRange => write!(f, "pitch class must be 0-11"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn new_wraps_mod_12() {
        assert_eq!(PitchClass::new(0).value(), 0);
        assert_eq!(PitchClass::new(12).value(), 0);
        assert_eq!(PitchClass::new(-1).value(), 11);
        assert_eq!(PitchClass::new(15).value(), 3);
    }

    #[test]
    fn from_str_sharp_flat_digit() {
        assert_eq!(PitchClass::from_str("C").unwrap(), PitchClass::new(0));
        assert_eq!(PitchClass::from_str("C#").unwrap(), PitchClass::new(1));
        assert_eq!(PitchClass::from_str("Db").unwrap(), PitchClass::new(1));
        assert_eq!(PitchClass::from_str("0").unwrap(), PitchClass::new(0));
        assert_eq!(PitchClass::from_str("11").unwrap(), PitchClass::new(11));
    }

    #[test]
    fn transpose() {
        let c = PitchClass::new(0);
        assert_eq!(c.transpose(7).value(), 7); // G
        assert_eq!(c.transpose(-1).value(), 11); // B
    }

    #[test]
    fn invert() {
        // I0: C->C, E->Ab, G->F
        assert_eq!(PitchClass::new(0).invert(0).value(), 0);
        assert_eq!(PitchClass::new(4).invert(0).value(), 8); // E -> Ab
        assert_eq!(PitchClass::new(7).invert(0).value(), 5); // G -> F
    }

    #[test]
    fn interval_class_symmetry() {
        assert_eq!(
            PitchClass::new(0).interval_class(&PitchClass::new(4)),
            4
        );
        assert_eq!(
            PitchClass::new(4).interval_class(&PitchClass::new(0)),
            4
        );
        // C to B = 11 semitones, interval class = 1
        assert_eq!(
            PitchClass::new(0).interval_class(&PitchClass::new(11)),
            1
        );
    }
}
