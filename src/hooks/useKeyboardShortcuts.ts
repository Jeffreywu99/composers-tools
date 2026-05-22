import { useEffect } from "react";
import { usePitchClassSetStore } from "../stores/pitchClassSetStore";

const KEY_MAP: Record<string, number> = {
  // White keys (lower piano row)
  q: 0, // C
  w: 2, // D
  e: 4, // E
  r: 5, // F
  t: 7, // G
  y: 9, // A
  u: 11, // B
  // Black keys (upper piano row)
  2: 1, // C#
  3: 3, // D#
  5: 6, // F#
  6: 8, // G#
  7: 10, // A#
};

interface Options {
  onClassify: () => void;
  onClear: () => void;
}

export function useKeyboardShortcuts({ onClassify, onClear }: Options) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const key = e.key.toLowerCase();

      // Space = clear
      if (e.key === " ") {
        e.preventDefault();
        onClear();
        return;
      }

      // Enter = classify
      if (e.key === "Enter") {
        e.preventDefault();
        onClassify();
        return;
      }

      // Note keys
      const pc = KEY_MAP[key];
      if (pc !== undefined) {
        e.preventDefault();
        usePitchClassSetStore.getState().toggleNote(pc);
        setTimeout(() => onClassify(), 0);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClassify, onClear]);
}
