import { useTranslation } from "react-i18next";
import { PanelLeftClose, PanelLeft, Music, Grid3X3, type LucideIcon } from "lucide-react";
import { useToolRegistry } from "../../stores/toolRegistry";

const iconMap: Record<string, LucideIcon> = {
  music: Music,
  matrix: Grid3X3,
};

export function Sidebar() {
  const { t } = useTranslation();
  const { tools, activeToolId, setActiveTool, sidebarCollapsed, toggleSidebar } =
    useToolRegistry();

  return (
    <aside
      className="flex flex-col shrink-0 transition-all duration-300 overflow-hidden"
      style={{
        width: sidebarCollapsed ? 52 : 240,
        backgroundColor: "var(--color-parchment)",
        borderRight: "1px solid var(--color-divider)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{ height: 56, paddingLeft: sidebarCollapsed ? 14 : 20, paddingRight: 12 }}
      >
        {!sidebarCollapsed && (
          <h1
            className="text-sm font-semibold tracking-[0.06em]"
            style={{ color: "var(--color-accent-deep)" }}
          >
            {t("app.title")}
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:opacity-60 transition-opacity"
          style={{ color: "var(--color-ink-muted)" }}
          title={
            sidebarCollapsed
              ? (t("sidebar.expand") as string)
              : (t("sidebar.collapse") as string)
          }
        >
          {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "var(--color-divider)", opacity: 0.6 }} />

      {/* Tool list */}
      <nav
        className="flex-1 overflow-y-auto flex flex-col"
        style={{ padding: "14px 10px", gap: 2 }}
      >
        {!sidebarCollapsed && (
          <div
            className="px-2 pb-3 text-[11px] font-medium tracking-[0.1em] uppercase"
            style={{ color: "var(--color-ink-muted)", opacity: 0.6 }}
          >
            {t("sidebar.tools")}
          </div>
        )}
        {tools.map((tool) => {
          const Icon = iconMap[tool.icon] || Music;
          const isActive = activeToolId === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="w-full flex items-center rounded-lg transition-all duration-200"
              style={{
                gap: 10,
                padding: sidebarCollapsed ? "10px 0" : "9px 12px",
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                backgroundColor: isActive ? "var(--color-accent-glow)" : "transparent",
                color: isActive ? "var(--color-accent-deep)" : "var(--color-ink)",
                fontWeight: isActive ? 500 : 400,
                borderLeft: isActive
                  ? "2px solid var(--color-accent)"
                  : "2px solid transparent",
              }}
              title={sidebarCollapsed ? tool.name : undefined}
            >
              <Icon size={17} className="shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-[13px] truncate">{tool.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Language toggle */}
      {!sidebarCollapsed && (
        <div style={{ borderTop: "1px solid var(--color-divider)" }}>
          <div className="px-4 py-3">
            <LanguageToggle />
          </div>
        </div>
      )}
    </aside>
  );
}

function LanguageToggle() {
  const { language, setLanguage } = useToolRegistry();
  return (
    <div
      className="flex items-center gap-2 text-[11px]"
      style={{ color: "var(--color-ink-muted)" }}
    >
      <button
        onClick={() => setLanguage("zh-CN")}
        className="px-2 py-0.5 rounded transition-colors hover:opacity-70"
        style={{
          color: language === "zh-CN" ? "var(--color-accent-deep)" : undefined,
          fontWeight: language === "zh-CN" ? 600 : 400,
        }}
      >
        中文
      </button>
      <span style={{ opacity: 0.3 }}>/</span>
      <button
        onClick={() => setLanguage("en")}
        className="px-2 py-0.5 rounded transition-colors hover:opacity-70"
        style={{
          color: language === "en" ? "var(--color-accent-deep)" : undefined,
          fontWeight: language === "en" ? 600 : 400,
        }}
      >
        EN
      </button>
    </div>
  );
}
