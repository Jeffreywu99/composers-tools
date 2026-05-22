import { create } from "zustand";
import type { PitchClass, TwelveToneMatrixResult } from "../types/music";

interface TwelveToneState {
  primeRow: PitchClass[];
  matrixResult: TwelveToneMatrixResult | null;
  error: string | null;

  addNote: (pc: PitchClass) => void;
  removeLast: () => void;
  setPrimeRow: (notes: PitchClass[]) => void;
  clear: () => void;
  setMatrixResult: (result: TwelveToneMatrixResult | null) => void;
  setError: (err: string | null) => void;
}

export const useTwelveToneStore = create<TwelveToneState>((set, get) => ({
  primeRow: [],
  matrixResult: null,
  error: null,

  addNote: (pc) => {
    const { primeRow } = get();
    if (primeRow.length >= 12) return;
    if (primeRow.includes(pc)) return;
    set({ primeRow: [...primeRow, pc], error: null });
  },

  removeLast: () => {
    const { primeRow } = get();
    if (primeRow.length === 0) return;
    set({ primeRow: primeRow.slice(0, -1), error: null, matrixResult: null });
  },

  setPrimeRow: (notes) => {
    const seen = new Set<number>();
    const deduped: number[] = [];
    for (const n of notes) {
      if (n >= 0 && n <= 11 && !seen.has(n)) {
        deduped.push(n);
        seen.add(n);
      }
    }
    set({
      primeRow: deduped.slice(0, 12),
      error: null,
      matrixResult: null,
    });
  },

  clear: () => set({ primeRow: [], matrixResult: null, error: null }),

  setMatrixResult: (result) => set({ matrixResult: result }),

  setError: (err) => set({ error: err }),
}));
