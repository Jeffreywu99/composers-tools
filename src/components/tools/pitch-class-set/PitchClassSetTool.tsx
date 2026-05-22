import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolHeader } from "../../common/ToolHeader";
import { NoteInput } from "./NoteInput";
import { ClassificationPanel } from "./ClassificationPanel";
import { TransformationPanel } from "./TransformationPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { RandomGeneratorPanel } from "./RandomGeneratorPanel";
import { SetHistoryPanel } from "./SetHistoryPanel";
import { ForteTablePanel } from "./ForteTablePanel";
import { usePitchClassSet } from "../../../hooks/usePitchClassSet";
import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts";

export default function PitchClassSetTool() {
  const { t, i18n } = useTranslation();
  const { classify, applyTransform, generate, setCurrentSet, clear } = usePitchClassSet();
  const lang = i18n.language;
  const [showForteTable, setShowForteTable] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({ onClassify: classify, onClear: clear });

  const title =
    lang === "zh-CN"
      ? (t("tool.pitchClassSet.name") as string)
      : "Pitch-Class Set Calculator";
  const description =
    lang === "zh-CN"
      ? (t("tool.pitchClassSet.description") as string)
      : "Compute normal form, prime form, interval vector, Forte number, with inversion/retrograde/R-I transformations";

  const handleLoadSet = useCallback(
    (notes: number[]) => {
      setCurrentSet(notes);
      setTimeout(() => classify(), 0);
    },
    [setCurrentSet, classify]
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <ToolHeader title={title} description={description} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr 260px",
          gap: 40,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <NoteInput onClassify={classify} />
          <SetHistoryPanel onLoadSet={handleLoadSet} />
        </div>

        {/* Center */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <ClassificationPanel />
          <TransformationPanel onTransform={applyTransform} />
          <div>
            <button
              onClick={() => setShowForteTable(!showForteTable)}
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-accent-deep)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showForteTable ? "收起福特表 ▲" : "浏览福特全集 ▼"}
            </button>
            {showForteTable && (
              <div style={{ marginTop: 12 }}>
                <ForteTablePanel onLoadSet={handleLoadSet} />
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <PropertiesPanel onLoadSet={handleLoadSet} />
          <RandomGeneratorPanel onGenerate={generate} />
        </div>
      </div>
    </div>
  );
}
