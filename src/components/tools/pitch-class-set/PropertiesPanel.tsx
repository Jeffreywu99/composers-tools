import { useTranslation } from "react-i18next";
import { usePitchClassSetStore } from "../../../stores/pitchClassSetStore";
import { InfoCard } from "../../common/InfoCard";
import { PITCH_CLASS_NAMES_SHARP } from "../../../types/music";

interface Props {
  onLoadSet: (notes: number[]) => void;
}

export function PropertiesPanel({ onLoadSet }: Props) {
  const { t, i18n } = useTranslation();
  const classification = usePitchClassSetStore((s) => s.classification);
  const isZh = i18n.language === "zh-CN";

  if (!classification) return null;

  const complementNames = classification.complement
    .map((pc) => PITCH_CLASS_NAMES_SHARP[pc])
    .join(" ");

  return (
    <section>
      <Label>{t("properties.title")}</Label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <InfoCard
          label={t("properties.cardinality") as string}
          value={isZh ? classification.cardinalityNameZh : classification.cardinalityNameEn}
        />
        <InfoCard
          label={t("properties.symmetry") as string}
          value={
            <span style={{ fontSize: 13 }}>
              {isZh ? classification.symmetryZh : classification.symmetryEn}
            </span>
          }
        />
      </div>

      {/* Subsets — each is a clickable chip */}
      {classification.subsets.length > 0 && (
        <SubSection label={`${t("properties.subsets")} (${classification.subsets.length})`}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {classification.subsets.map((sub, i) => {
              const names = sub.map((pc) => PITCH_CLASS_NAMES_SHARP[pc]).join("");
              return (
                <button
                  key={i}
                  onClick={() => onLoadSet(sub)}
                  title={`[${sub.join(", ")}]`}
                  style={{
                    fontSize: 11,
                    fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
                    padding: "3px 8px",
                    borderRadius: 6,
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-divider)",
                    color: "var(--color-ink)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-accent-glow)";
                    e.currentTarget.style.borderColor = "var(--color-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-surface)";
                    e.currentTarget.style.borderColor = "var(--color-divider)";
                  }}
                >
                  {names} <span style={{ color: "var(--color-ink-muted)", fontSize: 10 }}>[{sub.join(",")}]</span>
                </button>
              );
            })}
          </div>
        </SubSection>
      )}

      {/* Complement — clickable chip */}
      {classification.complement.length > 0 && (
        <SubSection label={t("properties.complement") as string}>
          <button
            onClick={() => onLoadSet(classification.complement)}
            title={`[${classification.complement.join(", ")}]`}
            style={{
              fontSize: 12,
              fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
              padding: "6px 12px",
              borderRadius: 6,
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-divider)",
              color: "var(--color-ink)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-accent-glow)";
              e.currentTarget.style.borderColor = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-surface)";
              e.currentTarget.style.borderColor = "var(--color-divider)";
            }}
          >
            {complementNames}{" "}
            <span style={{ color: "var(--color-ink-muted)", fontSize: 11 }}>
              [{classification.complement.join(", ")}]
            </span>
          </button>
        </SubSection>
      )}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}

function SubSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 11, color: "var(--color-ink-muted)", marginBottom: 4 }}>
        {label}
      </div>
      {children}
    </div>
  );
}
