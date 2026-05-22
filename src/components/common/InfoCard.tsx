import type { ReactNode } from "react";

interface InfoCardProps {
  label: string;
  value: ReactNode;
}

export function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: 10,
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-divider)",
        boxShadow: "0 1px 2px rgba(44,24,16,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          marginBottom: 4,
          color: "var(--color-ink-muted)",
          letterSpacing: "0.05em",
          fontWeight: 500,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 450,
          color: "var(--color-ink)",
          lineHeight: 1.5,
        }}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}
