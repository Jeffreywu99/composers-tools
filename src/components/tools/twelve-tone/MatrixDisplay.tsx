import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useTwelveTone } from "../../../hooks/useTwelveTone";

export const MatrixDisplay = forwardRef<HTMLDivElement>(function MatrixDisplay(
  _props,
  ref
) {
  const { t } = useTranslation();
  const { matrixResult } = useTwelveTone();

  if (!matrixResult) {
    return (
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          color: "var(--color-ink-muted)",
          fontSize: 14,
          backgroundColor: "var(--color-surface)",
          borderRadius: 12,
          border: "1px dashed var(--color-divider)",
        }}
      >
        {t("twelveTone.validation.empty", "输入原型序列以生成矩阵")}
      </section>
    );
  }

  const { matrixNames, rowLabels, colLabels } = matrixResult;
  const rLabels = rowLabels.map((_, i) => `R${i}`);
  const riLabels = colLabels.map((_, i) => `RI${i}`);

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
        {t("twelveTone.matrix", "矩阵")}
      </label>

      <div
        ref={ref}
        data-matrix-table
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: 10,
          border: "1px solid var(--color-divider)",
          padding: 4,
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            fontSize: 12,
            fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <HeaderCell muted>P\I</HeaderCell>
              {colLabels.map((label) => (
                <HeaderCell key={label}>{label}</HeaderCell>
              ))}
              <HeaderCell muted>R</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {matrixNames.map((row, r) => (
              <tr key={r}>
                <HeaderCell bold>{rowLabels[r]}</HeaderCell>
                {row.map((name, c) => (
                  <td
                    key={c}
                    style={{
                      padding: "5px 4px",
                      textAlign: "center",
                      minWidth: 30,
                      fontWeight: r === 0 || c === 0 ? 600 : 400,
                      color: "var(--color-ink)",
                      backgroundColor:
                        r === 0 && c === 0
                          ? "var(--color-accent-glow)"
                          : r === 0
                            ? "rgba(192,133,74,0.06)"
                            : c === 0
                              ? "rgba(192,133,74,0.06)"
                              : undefined,
                      borderBottom: "1px solid var(--color-divider)",
                      borderRight: "1px solid var(--color-divider)",
                    }}
                  >
                    {name}
                  </td>
                ))}
                <HeaderCell muted>{rLabels[r]}</HeaderCell>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <HeaderCell muted />
              {riLabels.map((label, i) => (
                <HeaderCell key={i} muted>
                  {label}
                </HeaderCell>
              ))}
              <HeaderCell muted />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
});

function HeaderCell({
  children,
  bold,
  muted,
}: {
  children?: React.ReactNode;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <th
      style={{
        padding: "5px 4px",
        textAlign: "center",
        fontSize: 11,
        fontWeight: bold ? 600 : 400,
        color: muted ? "var(--color-ink-muted)" : "var(--color-accent-deep)",
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
        borderBottom: "1px solid var(--color-divider)",
        borderRight: "1px solid var(--color-divider)",
      }}
    >
      {children}
    </th>
  );
}
