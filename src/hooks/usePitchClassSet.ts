import { useCallback, useRef } from "react";
import { usePitchClassSetStore } from "../stores/pitchClassSetStore";
import * as tauri from "../lib/tauri";
import type { TransformationType, RandomConstraints } from "../types/music";

const cache = new Map<string, unknown>();

function cacheKey(notes: number[], ordered: boolean): string {
  const sorted = [...notes].sort((a, b) => a - b);
  return `${sorted.join(",")}|${ordered ? "o" : "u"}`;
}

export function usePitchClassSet() {
  const currentSet = usePitchClassSetStore((s) => s.currentSet);
  const ordered = usePitchClassSetStore((s) => s.ordered);
  const classification = usePitchClassSetStore((s) => s.classification);
  const transformedSet = usePitchClassSetStore((s) => s.transformedSet);
  const activeTransform = usePitchClassSetStore((s) => s.activeTransform);
  const history = usePitchClassSetStore((s) => s.history);
  const historyIndex = usePitchClassSetStore((s) => s.historyIndex);

  const toggleNote = usePitchClassSetStore((s) => s.toggleNote);
  const setOrdered = usePitchClassSetStore((s) => s.setOrdered);
  const setCurrentSet = usePitchClassSetStore((s) => s.setCurrentSet);
  const clear = usePitchClassSetStore((s) => s.clear);
  const loadFromHistory = usePitchClassSetStore((s) => s.loadFromHistory);

  const classifyRef = useRef<(() => Promise<void>) | null>(null);

  const classify = useCallback(async () => {
    const { currentSet: notes, ordered: ord } = usePitchClassSetStore.getState();
    if (notes.length === 0) return;

    const key = cacheKey(notes, ord);
    const cached = cache.get(key);
    if (cached) {
      usePitchClassSetStore.getState().setClassification(cached as never);
      return;
    }

    try {
      const result = await tauri.classifySet(notes, ord);
      cache.set(key, result);
      usePitchClassSetStore.getState().setClassification(result);
      usePitchClassSetStore.getState().pushHistory();
    } catch (err) {
      console.error("Classification failed:", err);
    }
  }, []);

  classifyRef.current = classify;

  const applyTransform = useCallback(
    async (type: TransformationType, n: number) => {
      const { currentSet: notes, ordered: ord } = usePitchClassSetStore.getState();
      if (notes.length === 0) return;
      try {
        const result = await tauri.transform(notes, ord, type, n);
        usePitchClassSetStore.getState().setTransformedSet(result.notes);
        usePitchClassSetStore.getState().setActiveTransform({ type, n });
      } catch (err) {
        console.error("Transform failed:", err);
      }
    },
    []
  );

  const generate = useCallback(async (constraints: RandomConstraints) => {
    try {
      const notes = await tauri.generateRandom(constraints);
      usePitchClassSetStore.getState().setCurrentSet(notes);
      setTimeout(() => classifyRef.current?.(), 0);
    } catch (err) {
      console.error("Generate failed:", err);
    }
  }, []);

  return {
    currentSet,
    ordered,
    classification,
    transformedSet,
    activeTransform,
    history,
    historyIndex,
    toggleNote,
    setOrdered,
    setCurrentSet,
    clear,
    loadFromHistory,
    classify,
    applyTransform,
    generate,
  };
}
