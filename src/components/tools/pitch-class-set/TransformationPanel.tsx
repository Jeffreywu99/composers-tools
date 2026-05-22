import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePitchClassSetStore } from "../../../stores/pitchClassSetStore";
import { PITCH_CLASS_NAMES_SHARP, type TransformationType } from "../../../types/music";

const TYPES: { value: TransformationType; label: string }[] = [
  { value: "Tn", label: "移调 Tn" },
  { value: "In", label: "倒影 In" },
  { value: "R", label: "逆行 R" },
  { value: "RI", label: "逆行倒影 RI" },
];

interface Props {
  onTransform: (type: TransformationType, n: number) => void;
}

export function TransformationPanel({ onTransform }: Props) {
  const { t } = useTranslation();
  const { currentSet, transformedSet, activeTransform } = usePitchClassSetStore(
    (s) => s
  );
  const [type, setType] = useState<TransformationType>("Tn");
  const [n, setN] = useState(0);

  const showNSlider = type === "Tn" || type === "In" || type === "RI";

  return (
    <section>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
          marginBottom: 10,
        }}
      >
        {t("transformation.title")}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {TYPES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setType(value)}
            style={{
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: type === value ? 500 : 400,
              borderRadius: 8,
              border:
                type === value
                  ? "1px solid var(--color-accent)"
                  : "1px solid var(--color-divider)",
              backgroundColor:
                type === value ? "var(--color-accent-glow)" : "var(--color-surface)",
              color:
                type === value ? "var(--color-accent-deep)" : "var(--color-ink)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {showNSlider && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent-deep)", minWidth: 40 }}>
            {type}
            <sub style={{ fontSize: 11 }}>{n}</sub>
          </span>
          <input
            type="range"
            min={0}
            max={11}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: 12, fontFamily: "'SF Mono', monospace", color: "var(--color-ink)", minWidth: 16, textAlign: "right" }}>
            {n}
          </span>
        </div>
      )}

      <button
        onClick={() => onTransform(type, n)}
        disabled={currentSet.length === 0}
        style={{
          padding: "8px 24px",
          fontSize: 13,
          fontWeight: 500,
          borderRadius: 8,
          border: "none",
          backgroundColor: currentSet.length === 0 ? "var(--color-divider)" : "var(--color-accent)",
          color: currentSet.length === 0 ? "var(--color-ink-muted)" : "#fff",
          cursor: currentSet.length === 0 ? "not-allowed" : "pointer",
          opacity: currentSet.length === 0 ? 0.4 : 1,
          transition: "all 0.15s ease",
        }}
      >
        {t("common.apply")}
      </button>

      {transformedSet && activeTransform && (
        <div
          style={{
            marginTop: 14,
            padding: "12px 16px",
            borderRadius: 8,
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-divider)",
          }}
        >
          <div style={{ fontSize: 11, color: "var(--color-ink-muted)", marginBottom: 4 }}>
            {t("transformation.result")}
          </div>
          <div
            style={{
              fontSize: 13,
              fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
              color: "var(--color-ink)",
            }}
          >
            {transformedSet.map((pc) => PITCH_CLASS_NAMES_SHARP[pc]).join(" ")}{" "}
            <span style={{ color: "var(--color-ink-muted)" }}>
              [{transformedSet.join(", ")}]
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
