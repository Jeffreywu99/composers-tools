import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePitchClassSetStore } from "../../../stores/pitchClassSetStore";
import { InfoCard } from "../../common/InfoCard";
import { PITCH_CLASS_NAMES_SHARP } from "../../../types/music";

export function ClassificationPanel() {
  const { t } = useTranslation();
  const classification = usePitchClassSetStore((s) => s.classification);

  if (!classification) {
    return (
      <section>
        <Label>{t("classification.title")}</Label>
        <p style={{ fontSize: 13, color: "var(--color-ink-muted)", opacity: 0.5 }}>
          输入音符后自动显示
        </p>
      </section>
    );
  }

  const pfNames = classification.primeForm
    .map((pc) => PITCH_CLASS_NAMES_SHARP[pc])
    .join(" ");
  const nfNames = classification.normalForm
    .map((pc) => PITCH_CLASS_NAMES_SHARP[pc])
    .join(" ");

  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <Label style={{ marginBottom: 0 }}>{t("classification.title")}</Label>
        <CopyButton data={classification} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <InfoCard
          label={t("classification.normalForm") as string}
          value={
            <span>
              <SpanMono>[{classification.normalForm.join(", ")}]</SpanMono>
              <SpanMuted> {nfNames}</SpanMuted>
            </span>
          }
        />
        <InfoCard
          label={t("classification.primeForm") as string}
          value={
            <span>
              <SpanMono>({classification.primeForm.join(", ")})</SpanMono>
              <SpanMuted> {pfNames}</SpanMuted>
            </span>
          }
        />
        <InfoCard
          label={t("classification.intervalVector") as string}
          value={<SpanMono>&lt;{classification.intervalVector.join(", ")}&gt;</SpanMono>}
        />
        <InfoCard
          label={t("classification.forteNumber") as string}
          value={
            <SpanMono>
              {classification.forteNumber ?? "—"}
              {classification.isZRelated && (
                <span style={{ color: "var(--color-accent)", marginLeft: 2 }}>Z</span>
              )}
            </SpanMono>
          }
        />
        <InfoCard
          label={t("classification.chroma") as string}
          value={<SpanMono style={{ fontSize: 12 }}>{classification.chroma}</SpanMono>}
        />
      </div>
    </section>
  );
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--color-ink-muted)",
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CopyButton({ data }: { data: unknown }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        fontSize: 11,
        padding: "2px 10px",
        borderRadius: 5,
        border: "1px solid var(--color-divider)",
        backgroundColor: "var(--color-surface)",
        color: copied ? "var(--color-success)" : "var(--color-ink-muted)",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {copied ? "已复制" : "复制 JSON"}
    </button>
  );
}

function SpanMono({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function SpanMuted({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "var(--color-ink-muted)", fontSize: 12 }}>{children}</span>
  );
}
