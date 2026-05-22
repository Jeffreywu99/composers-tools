use crate::music::pitch_class::PitchClass;

/// A collection of pitch classes, optionally ordered.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PitchClassSet {
    pub elements: Vec<PitchClass>,
    pub ordered: bool,
}

impl PitchClassSet {
    pub fn new(elements: Vec<u8>, ordered: bool) -> Self {
        let mut pcs: Vec<PitchClass> = elements.iter().map(|&n| PitchClass::new(n as i32)).collect();
        if !ordered {
            pcs.sort();
            pcs.dedup();
        }
        Self {
            elements: pcs,
            ordered,
        }
    }

    pub fn from_pitch_classes(elements: Vec<PitchClass>, ordered: bool) -> Self {
        let mut pcs = elements;
        if !ordered {
            pcs.sort();
            pcs.dedup();
        }
        Self {
            elements: pcs,
            ordered,
        }
    }

    pub fn cardinality(&self) -> usize {
        self.elements.len()
    }

    pub fn is_empty(&self) -> bool {
        self.elements.is_empty()
    }

    pub fn values(&self) -> Vec<u8> {
        self.elements.iter().map(|pc| pc.value()).collect()
    }

    /// 12-bit chroma string, e.g. "100010010000" for {C, E, G}
    pub fn chroma_string(&self) -> String {
        let mut bits = [false; 12];
        for pc in &self.elements {
            bits[pc.value() as usize] = true;
        }
        bits.iter().rev().map(|&b| if b { '1' } else { '0' }).collect()
    }
}
