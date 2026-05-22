import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PitchClassGrid } from "../../common/NoteButton";
import { useTwelveTone } from "../../../hooks/useTwelveTone";
import { PITCH_CLASS_NAMES_SHARP } from "../../../types/music";

interface RowInputProps {
  onCompute: () => void;
}

export function RowInput({ onCompute }: RowInputProps) {
  const { t } = useTranslation();
  const { primeRow, addNote, removeLast, setPrimeRow, clear } = useTwelveTone();
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    if (primeRow.length === 12) {
      onCompute();
    }
  }, [primeRow, onCompute]);

  const handleNoteClick = (pc: number) => {
    addNote(pc);
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
      setPrimeRow(parsed);
      setTextValue("");
    }
  };

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
        {t("twelveTone.clickNotes", "按顺序点击音符")}
      </label>

      <PitchClassGrid selected={primeRow} onToggle={handleNoteClick} />

      <div style={{ marginTop: 14 }}>
        <p style={{ fontSize: 12, color: "var(--color-ink-muted)", marginBottom: 6 }}>
          {t("twelveTone.orTypeText", "或输入12个音符")}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder={t("twelveTone.textPlaceholder", "例如：C C# D D# E F F# G G# A A# B") as string}
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
            {t("common.apply", "应用")}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {primeRow.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginBottom: 10,
            }}
          >
            {primeRow.map((pc, i) => (
              <div
                key={`${pc}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "4px 8px",
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 6,
                  backgroundColor:
                    i === 0
                      ? "var(--color-accent)"
                      : "var(--color-surface)",
                  color:
                    i === 0 ? "#fff" : "var(--color-ink)",
                  border: "1px solid var(--color-divider)",
                }}
              >
                <span style={{ fontSize: 9, opacity: 0.7, marginRight: 2 }}>
                  {i + 1}
                </span>
                {PITCH_CLASS_NAMES_SHARP[pc]}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              fontSize: 13,
              fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
              padding: "6px 12px",
              borderRadius: 8,
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-divider)",
              color: "var(--color-ink-muted)",
            }}
          >
            —
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color:
                primeRow.length === 12
                  ? "var(--color-success)"
                  : "var(--color-ink-muted)",
            }}
          >
            {t("twelveTone.progress", "{{current}} / 12 个音符").replace(
              "{{current}}",
              String(primeRow.length)
            )}
          </span>

          <button
            onClick={() => removeLast()}
            disabled={primeRow.length === 0}
            style={{
              padding: "6px 14px",
              fontSize: 12,
              borderRadius: 8,
              cursor: primeRow.length === 0 ? "default" : "pointer",
              color: "var(--color-ink-muted)",
              border: "1px solid var(--color-divider)",
              backgroundColor: "transparent",
              opacity: primeRow.length === 0 ? 0.4 : 1,
            }}
          >
            {t("common.undo", "撤销")}
          </button>

          <button
            onClick={() => {
              clear();
              setTextValue("");
            }}
            disabled={primeRow.length === 0}
            style={{
              padding: "6px 14px",
              fontSize: 12,
              borderRadius: 8,
              cursor: primeRow.length === 0 ? "default" : "pointer",
              color: "var(--color-danger)",
              border: "1px solid var(--color-divider)",
              backgroundColor: "transparent",
              opacity: primeRow.length === 0 ? 0.4 : 1,
            }}
          >
            {t("common.clear", "清除")}
          </button>

          {primeRow.length === 12 && (
            <button
              onClick={onCompute}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 8,
                border: "none",
                backgroundColor: "var(--color-accent)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {t("common.apply", "生成矩阵")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
