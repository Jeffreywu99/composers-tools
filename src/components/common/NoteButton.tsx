import { PITCH_CLASS_NAMES_SHARP } from "../../types/music";

interface NoteButtonProps {
  pc: number;
  selected: boolean;
  onClick: (pc: number) => void;
  isBlack?: boolean;
  style?: React.CSSProperties;
}

export function NoteButton({ pc, selected, onClick, isBlack, style }: NoteButtonProps) {
  const w = isBlack ? 26 : 38;
  const h = isBlack ? 50 : 62;
  return (
    <button
      onClick={() => onClick(pc)}
      className="select-none transition-all duration-150"
      style={{
        width: w,
        height: h,
        fontSize: isBlack ? 10 : 12,
        fontWeight: 500,
        borderRadius: isBlack ? "0 0 5px 5px" : "0 0 7px 7px",
        backgroundColor: selected
          ? "var(--color-accent)"
          : isBlack
            ? "var(--color-ink)"
            : "#fff",
        color: selected
          ? "#fff"
          : isBlack
            ? "rgba(255,255,255,0.75)"
            : "var(--color-ink)",
        border: selected
          ? "none"
          : isBlack
            ? "1px solid rgba(0,0,0,0.3)"
            : "1px solid var(--color-divider)",
        borderTop: isBlack ? "none" : undefined,
        boxShadow: selected
          ? "0 2px 10px rgba(192,133,74,0.4)"
          : isBlack
            ? "0 2px 4px rgba(0,0,0,0.15)"
            : "0 1px 3px rgba(0,0,0,0.06)",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: isBlack ? 3 : 5,
        zIndex: isBlack ? 10 : 1,
        position: isBlack ? "absolute" : "relative",
        transform: selected ? "translateY(1px)" : undefined,
        ...style,
      }}
    >
      {PITCH_CLASS_NAMES_SHARP[pc]}
    </button>
  );
}

/** Piano-style keyboard: 7 white keys + 5 black keys */
export function PitchClassGrid({
  selected,
  onToggle,
}: {
  selected: number[];
  onToggle: (pc: number) => void;
}) {
  const whiteKeys = [
    { pc: 0 }, { pc: 2 }, { pc: 4 }, { pc: 5 }, { pc: 7 }, { pc: 9 }, { pc: 11 },
  ];

  const blackKeys = [
    { pc: 1, afterWhiteIndex: 0 },
    { pc: 3, afterWhiteIndex: 1 },
    { pc: 6, afterWhiteIndex: 3 },
    { pc: 8, afterWhiteIndex: 4 },
    { pc: 10, afterWhiteIndex: 5 },
  ];

  const whiteWidth = 38;
  const whiteGap = 2;
  const totalWidth = whiteKeys.length * whiteWidth + (whiteKeys.length - 1) * whiteGap;

  return (
    <div style={{ position: "relative", width: totalWidth, height: 70 }}>
      {/* White keys */}
      <div style={{ display: "flex", gap: whiteGap, position: "absolute", bottom: 0 }}>
        {whiteKeys.map((wk) => (
          <NoteButton
            key={wk.pc}
            pc={wk.pc}
            selected={selected.includes(wk.pc)}
            onClick={onToggle}
          />
        ))}
      </div>

      {/* Black keys */}
      {blackKeys.map((bk) => {
        const left =
          (bk.afterWhiteIndex + 1) * whiteWidth + bk.afterWhiteIndex * whiteGap - 13;
        return (
          <NoteButton
            key={bk.pc}
            pc={bk.pc}
            isBlack
            selected={selected.includes(bk.pc)}
            onClick={onToggle}
            style={{ left, top: 0 }}
          />
        );
      })}
    </div>
  );
}
