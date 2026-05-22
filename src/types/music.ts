/** A pitch class value, 0-11 (0 = C, 1 = C#/Db, ..., 11 = B) */
export type PitchClass = number;

export const PITCH_CLASS_NAMES_SHARP = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

export const PITCH_CLASS_NAMES_FLAT = [
  "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
] as const;

export interface ClassificationResult {
  normalForm: PitchClass[];
  primeForm: PitchClass[];
  intervalVector: [number, number, number, number, number, number];
  forteNumber: string | null;
  chroma: string;
  cardinality: number;
  cardinalityNameZh: string;
  cardinalityNameEn: string;
  symmetryZh: string;
  symmetryEn: string;
  subsets: PitchClass[][];
  complement: PitchClass[];
  isZRelated: boolean;
}

export interface TransformResult {
  notes: PitchClass[];
  noteNames: string[];
}

export type TransformationType = "Tn" | "In" | "R" | "RI";

export interface RandomConstraints {
  cardinality?: number;
  requireTSymmetry?: boolean;
  requireISymmetry?: boolean;
}

export interface ForteTableEntry {
  forteNumber: string;
  cardinality: number;
  primeForm: PitchClass[];
  intervalVector: [number, number, number, number, number, number];
  isZRelated: boolean;
}
