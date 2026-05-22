import { useCallback } from "react";
import { useTwelveToneStore } from "../stores/twelveToneStore";
import * as tauri from "../lib/tauri";

export function useTwelveTone() {
  const primeRow = useTwelveToneStore((s) => s.primeRow);
  const matrixResult = useTwelveToneStore((s) => s.matrixResult);
  const error = useTwelveToneStore((s) => s.error);
  const addNote = useTwelveToneStore((s) => s.addNote);
  const removeLast = useTwelveToneStore((s) => s.removeLast);
  const setPrimeRow = useTwelveToneStore((s) => s.setPrimeRow);
  const clear = useTwelveToneStore((s) => s.clear);

  const compute = useCallback(async () => {
    const row = useTwelveToneStore.getState().primeRow;

    if (row.length !== 12) {
      useTwelveToneStore
        .getState()
        .setError(`Need exactly 12 unique notes (currently ${row.length})`);
      return;
    }

    try {
      const result = await tauri.computeTwelveToneMatrix(row);
      useTwelveToneStore.getState().setMatrixResult(result);
      useTwelveToneStore.getState().setError(null);
    } catch (err) {
      useTwelveToneStore.getState().setError(
        err instanceof Error ? err.message : String(err)
      );
    }
  }, []);

  return {
    primeRow,
    matrixResult,
    error,
    addNote,
    removeLast,
    setPrimeRow,
    clear,
    compute,
  };
}
