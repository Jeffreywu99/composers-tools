import { useTranslation } from "react-i18next";
import { usePitchClassSetStore } from "../../../stores/pitchClassSetStore";
import { PITCH_CLASS_NAMES_SHARP } from "../../../types/music";

interface Props {
  onLoadSet: (notes: number[]) => void;
}

export function SetHistoryPanel({ onLoadSet }: Props) {
  const { t } = useTranslation();
  const { history, historyIndex } = usePitchClassSetStore(
    (s) => s
  );

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
        {t("history.title")}
      </div>

      {history.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--color-ink-muted)", opacity: 0.45 }}>
          {t("history.empty")}
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {history.map((notes, i) => {
            const isCurrent = i === historyIndex;
            const names = notes
              .map((pc) => PITCH_CLASS_NAMES_SHARP[pc])
              .join(" ");
            return (
              <button
                key={i}
                onClick={() => onLoadSet(notes)}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  borderRadius: 8,
                  backgroundColor: isCurrent ? "var(--color-accent-glow)" : "transparent",
                  color: isCurrent ? "var(--color-accent-deep)" : "var(--color-ink)",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.15s ease",
                  wordBreak: "break-all",
                }}
                title={`[${notes.join(", ")}]`}
              >
                <span
                  style={{
                    fontSize: 11,
                    marginRight: 6,
                    opacity: isCurrent ? 0.7 : 0.35,
                    fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
                  }}
                >
                  #{i + 1}
                </span>
                <span style={{ fontSize: 13, fontFamily: "'SF Mono', 'JetBrains Mono', monospace" }}>
                  {names}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
