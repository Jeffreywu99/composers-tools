import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { RandomConstraints } from "../../../types/music";

interface Props {
  onGenerate: (constraints: RandomConstraints) => void;
}

export function RandomGeneratorPanel({ onGenerate }: Props) {
  const { t } = useTranslation();
  const [cardinality, setCardinality] = useState(3);
  const [symmetricOnly, setSymmetricOnly] = useState(false);

  const handleGenerate = useCallback(() => {
    onGenerate({
      cardinality,
      requireTSymmetry: symmetricOnly,
      requireISymmetry: symmetricOnly,
    });
  }, [cardinality, symmetricOnly, onGenerate]);

  const names = [
    "单音", "二音组", "三音组", "四音组", "五音组", "六音组",
    "七音组", "八音组", "九音组", "十音组", "十一音组", "全集",
  ];

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
        {t("random.title")}
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "var(--color-ink-muted)", marginBottom: 4 }}>
          {t("random.cardinality")}:{" "}
          <span style={{ fontWeight: 500, color: "var(--color-ink)" }}>
            {names[cardinality - 1]} ({cardinality})
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={12}
          value={cardinality}
          onChange={(e) => setCardinality(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "var(--color-ink-muted)",
            opacity: 0.4,
            marginTop: 2,
          }}
        >
          <span>1</span><span>12</span>
        </div>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          cursor: "pointer",
          color: "var(--color-ink-muted)",
          marginBottom: 14,
        }}
      >
        <input
          type="checkbox"
          checked={symmetricOnly}
          onChange={(e) => setSymmetricOnly(e.target.checked)}
        />
        {t("random.symmetricOnly")}
      </label>

      <button
        onClick={handleGenerate}
        style={{
          padding: "8px 24px",
          fontSize: 13,
          fontWeight: 500,
          borderRadius: 8,
          border: "none",
          backgroundColor: "var(--color-accent)",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {t("random.generate")}
      </button>
    </section>
  );
}
