import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PitchClassGrid } from "../../common/NoteButton";
import { usePitchClassSet } from "../../../hooks/usePitchClassSet";
import { PITCH_CLASS_NAMES_SHARP } from "../../../types/music";

interface NoteInputProps {
  onClassify: () => void;
}

export function NoteInput({ onClassify }: NoteInputProps) {
  const { t } = useTranslation();
  const { currentSet, ordered, toggleNote, setOrdered, clear, setCurrentSet } =
    usePitchClassSet();
  const [textValue, setTextValue] = useState("");

  const handleToggle = (pc: number) => {
    toggleNote(pc);
    setTimeout(() => onClassify(), 0);
  };

  const handleTextSubmit = () => {
    const trimmed = textValue.trim();
    if (!trimmed) return;
    const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
    const parsed: number[] = [];
    for (const token of tokens) {
      const num = Number(token);
      if (!isNaN(num) && num >= 0 && num <= 11) {
        parsed.push(num);
        continue;
      }
      const noteIdx = PITCH_CLASS_NAMES_SHARP.indexOf(token as never);
      if (noteIdx !== -1) parsed.push(noteIdx);
    }
    if (parsed.length > 0) {
      setCurrentSet(parsed);
      setTextValue("");
      setTimeout(() => onClassify(), 0);
    }
  };

  const currentNames = currentSet.map((pc) => PITCH_CLASS_NAMES_SHARP[pc]).join(" ");

  return (
    <section>
      <label
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
          display: "block",
          marginBottom: 10,
        }}
      >
        {t("noteInput.clickButtons")}
      </label>

      <PitchClassGrid selected={currentSet} onToggle={handleToggle} />

      {/* Text input */}
      <div style={{ marginTop: 14 }}>
        <p style={{ fontSize: 12, color: "var(--color-ink-muted)", marginBottom: 6 }}>
          {t("noteInput.orTypeText")}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder={t("noteInput.textPlaceholder") as string}
            style={{
              flex: 1,
              padding: "8px 12px",
              fontSize: 13,
              borderRadius: 8,
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-divider)",
              color: "var(--color-ink)",
              outline: "none",
            }}
          />
          <button
            onClick={handleTextSubmit}
            style={{
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 8,
              border: "none",
              backgroundColor: "var(--color-accent)",
              color: "#fff",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
          >
            {t("common.apply")}
          </button>
        </div>
      </div>

      {/* Current set display */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
            padding: "6px 12px",
            borderRadius: 8,
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-divider)",
            color: "var(--color-ink)",
          }}
        >
          {currentSet.length > 0 ? `{${currentNames}}` : "—"}
        </div>
        <div
          style={{
            fontSize: 12,
            fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
            color: "var(--color-ink-muted)",
          }}
        >
          [{currentSet.join(", ")}]
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            cursor: "pointer",
            color: "var(--color-ink-muted)",
            marginLeft: "auto",
          }}
        >
          <input
            type="checkbox"
            checked={ordered}
            onChange={(e) => {
              setOrdered(e.target.checked);
              setTimeout(() => onClassify(), 0);
            }}
          />
          {t("noteInput.orderedToggle")}
        </label>

        <button
          onClick={() => { clear(); setTextValue(""); }}
          style={{
            padding: "6px 14px",
            fontSize: 12,
            borderRadius: 8,
            cursor: "pointer",
            color: "var(--color-danger)",
            border: "1px solid var(--color-divider)",
            backgroundColor: "transparent",
          }}
        >
          {t("common.clear")}
        </button>
      </div>
    </section>
  );
}
