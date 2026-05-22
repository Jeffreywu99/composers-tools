import { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { save } from "@tauri-apps/plugin-dialog";
import { ToolHeader } from "../../common/ToolHeader";
import { RowInput } from "./RowInput";
import { MatrixDisplay } from "./MatrixDisplay";
import { useTwelveTone } from "../../../hooks/useTwelveTone";
import * as tauri from "../../../lib/tauri";

function dataUrlToBytes(dataUrl: string): number[] {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return Array.from(bytes);
}

export default function TwelveToneTool() {
  const { t, i18n } = useTranslation();
  const { compute, matrixResult, error } = useTwelveTone();
  const lang = i18n.language;
  const matrixRef = useRef<HTMLDivElement>(null);

  const title =
    lang === "zh-CN"
      ? (t("tool.twelveTone.name") as string)
      : "Twelve-Tone Matrix";
  const description =
    lang === "zh-CN"
      ? (t("tool.twelveTone.description") as string)
      : "Enter a prime row (P0) to generate the full 12x12 twelve-tone matrix with P/R/I/RI labels";

  const handleExportPNG = useCallback(async () => {
    const node = matrixRef.current;
    if (!node) return;

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(node, {
        backgroundColor: "#fffcf7",
        pixelRatio: 2,
        cacheBust: true,
      });

      const filePath = await save({
        defaultPath: "twelve-tone-matrix.png",
        filters: [{ name: "PNG Image", extensions: ["png"] }],
      });

      if (filePath) {
        const bytes = dataUrlToBytes(dataUrl);
        await tauri.writeFile(filePath, bytes);
      }
    } catch (err) {
      console.error("PNG export failed:", err);
    }
  }, []);

  const handleSaveJSON = useCallback(async () => {
    if (!matrixResult) return;

    try {
      const filePath = await save({
        defaultPath: "twelve-tone-matrix.json",
        filters: [{ name: "JSON", extensions: ["json"] }],
      });

      if (filePath) {
        const json = JSON.stringify(
          {
            primeRow: matrixResult.primeRow,
            primeRowNames: matrixResult.primeRowNames,
            matrix: matrixResult.matrix,
            matrixNames: matrixResult.matrixNames,
            rowLabels: matrixResult.rowLabels,
            colLabels: matrixResult.colLabels,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        );
        const encoder = new TextEncoder();
        const bytes = Array.from(encoder.encode(json));
        await tauri.writeFile(filePath, bytes);
      }
    } catch (err) {
      console.error("JSON save failed:", err);
    }
  }, [matrixResult]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <ToolHeader title={title} description={description} />

      {error && (
        <div
          style={{
            marginBottom: 20,
            padding: "10px 16px",
            fontSize: 13,
            borderRadius: 8,
            backgroundColor: "rgba(196,106,90,0.08)",
            border: "1px solid rgba(196,106,90,0.25)",
            color: "var(--color-danger)",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr 200px",
          gap: 40,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <RowInput onCompute={compute} />
        </div>

        <MatrixDisplay ref={matrixRef} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-ink-muted)",
              display: "block",
              marginBottom: 2,
            }}
          >
            {t("twelveTone.export", "导出")}
          </label>

          <ExportButton
            onClick={handleExportPNG}
            disabled={!matrixResult}
            color="var(--color-accent)"
          >
            {t("twelveTone.exportPNG", "导出为 PNG")}
          </ExportButton>

          <ExportButton
            onClick={handleSaveJSON}
            disabled={!matrixResult}
            color="var(--color-ink-muted)"
          >
            {t("twelveTone.saveJSON", "保存为 JSON")}
          </ExportButton>
        </div>
      </div>
    </div>
  );
}

function ExportButton({
  children,
  onClick,
  disabled,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 16px",
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 8,
        border: "1px solid var(--color-divider)",
        backgroundColor: disabled ? "var(--color-surface)" : "#fff",
        color: disabled ? "var(--color-ink-muted)" : color,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s ease",
        textAlign: "left",
      }}
    >
      {children}
    </button>
  );
}
