interface ToolHeaderProps {
  title: string;
  description?: string;
}

export function ToolHeader({ title, description }: ToolHeaderProps) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: "var(--color-ink)",
          letterSpacing: "0.03em",
          lineHeight: 1.3,
          marginBottom: description ? 8 : 0,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--color-ink-muted)",
            maxWidth: 560,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
