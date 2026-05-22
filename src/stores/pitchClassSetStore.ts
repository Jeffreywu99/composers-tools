import { create } from "zustand";
import type {
  PitchClass,
  ClassificationResult,
  TransformationType,
} from "../types/music";

interface PitchClassSetState {
  currentSet: PitchClass[];
  ordered: boolean;
  classification: ClassificationResult | null;
  transformedSet: PitchClass[] | null;
  activeTransform: { type: TransformationType; n: number } | null;
  history: PitchClass[][];
  historyIndex: number;

  setCurrentSet: (notes: PitchClass[]) => void;
  toggleNote: (pc: PitchClass) => void;
  setOrdered: (ordered: boolean) => void;
  setClassification: (result: ClassificationResult | null) => void;
  setTransformedSet: (notes: PitchClass[] | null) => void;
  setActiveTransform: (
    transform: { type: TransformationType; n: number } | null
  ) => void;
  clear: () => void;
  pushHistory: () => void;
  undoHistory: () => void;
  loadFromHistory: (index: number) => void;
}

export const usePitchClassSetStore = create<PitchClassSetState>((set, get) => ({
  currentSet: [],
  ordered: false,
  classification: null,
  transformedSet: null,
  activeTransform: null,
  history: [],
  historyIndex: -1,

  setCurrentSet: (notes) => set({ currentSet: notes }),

  toggleNote: (pc) => {
    const { currentSet } = get();
    if (currentSet.includes(pc)) {
      set({ currentSet: currentSet.filter((n) => n !== pc) });
    } else {
      set({ currentSet: [...currentSet, pc] });
    }
  },

  setOrdered: (ordered) => set({ ordered }),

  setClassification: (result) => set({ classification: result }),

  setTransformedSet: (notes) => set({ transformedSet: notes }),

  setActiveTransform: (transform) => set({ activeTransform: transform }),

  clear: () =>
    set({
      currentSet: [],
      classification: null,
      transformedSet: null,
      activeTransform: null,
    }),

  pushHistory: () => {
    const { currentSet, history, historyIndex } = get();
    if (currentSet.length === 0) return;
    const newHistory = [
      ...history.slice(0, historyIndex + 1),
      [...currentSet],
    ];
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undoHistory: () => {
    const { historyIndex } = get();
    if (historyIndex < 0) return;
    get().loadFromHistory(historyIndex - 1);
  },

  loadFromHistory: (index) => {
    const { history } = get();
    if (index < -1 || index >= history.length) return;
    const setToLoad = index === -1 ? [] : [...history[index]];
    set({
      currentSet: setToLoad,
      historyIndex: index,
      classification: null,
      transformedSet: null,
      activeTransform: null,
    });
  },
}));
