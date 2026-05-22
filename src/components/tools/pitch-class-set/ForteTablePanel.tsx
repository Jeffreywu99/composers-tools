import { useState, useEffect } from "react";
import { getForteTable } from "../../../lib/tauri";
import { PITCH_CLASS_NAMES_SHARP, type ForteTableEntry } from "../../../types/music";

interface Props {
  onLoadSet: (notes: number[]) => void;
}

export function ForteTablePanel({ onLoadSet }: Props) {
  const [entries, setEntries] = useState<ForteTableEntry[]>([]);
  const [filter, setFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getForteTable()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cardinalities = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const filtered = filter ? entries.filter((e) => e.cardinality === filter) : entries;

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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>福特号全集 ({entries.length})</span>
        <span style={{ fontSize: 10, fontWeight: 400, textTransform: "none" }}>
          点击行加载集合
        </span>
      </div>

      {/* Cardinality filter chips */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter(null)}
          style={{
            padding: "3px 10px",
            fontSize: 11,
            borderRadius: 6,
            border: "1px solid var(--color-divider)",
            backgroundColor: filter === null ? "var(--color-accent-glow)" : "var(--color-surface)",
            color: filter === null ? "var(--color-accent-deep)" : "var(--color-ink-muted)",
            cursor: "pointer",
          }}
        >
          全部
        </button>
        {cardinalities.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            style={{
              padding: "3px 10px",
              fontSize: 11,
              borderRadius: 6,
              border: "1px solid var(--color-divider)",
              backgroundColor: filter === c ? "var(--color-accent-glow)" : "var(--color-surface)",
              color: filter === c ? "var(--color-accent-deep)" : "var(--color-ink-muted)",
              cursor: "pointer",
            }}
          >
            {c}音
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: "var(--color-ink-muted)", padding: "20px 0", textAlign: "center" }}>
          加载中...
        </div>
      ) : (
        <div
          style={{
            maxHeight: 360,
            overflowY: "auto",
            border: "1px solid var(--color-divider)",
            borderRadius: 8,
            backgroundColor: "var(--color-surface)",
          }}
        >
          <table
            style={{
              width: "100%",
              fontSize: 12,
              fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "var(--color-parchment)",
                  borderBottom: "2px solid var(--color-divider)",
                }}
              >
                <th style={thStyle}>福特号</th>
                <th style={thStyle}>原型</th>
                <th style={thStyle}>音程向量</th>
                <th style={{ ...thStyle, textAlign: "center", width: 24 }}>Z</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const pfNames = entry.primeForm
                  .map((pc) => PITCH_CLASS_NAMES_SHARP[pc])
                  .join("");
                return (
                  <tr
                    key={entry.forteNumber}
                    onClick={() => onLoadSet(entry.primeForm)}
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid var(--color-divider)",
                      transition: "background-color 0.1s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-accent-glow)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 500, color: "var(--color-accent-deep)" }}>
                        {entry.forteNumber}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {pfNames}{" "}
                      <span style={{ color: "var(--color-ink-muted)", fontSize: 11 }}>
                        ({entry.primeForm.join(",")})
                      </span>
                    </td>
                    <td style={tdStyle}>
                      &lt;{entry.intervalVector.join(",")}&gt;
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {entry.isZRelated && (
                        <span style={{ color: "var(--color-accent)", fontSize: 11, fontWeight: 600 }}>
                          Z
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const thStyle: React.CSSProperties = {
  padding: "8px 12px",
  textAlign: "left",
  fontSize: 10,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--color-ink-muted)",
};

const tdStyle: React.CSSProperties = {
  padding: "7px 12px",
  verticalAlign: "middle",
};
