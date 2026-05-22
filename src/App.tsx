import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "./components/layout/AppShell";
import { useToolRegistry } from "./stores/toolRegistry";
import type { Tool } from "./types/tool";

// Side-effect imports: register all tools
import "./components/tools/pitch-class-set";
import "./components/tools/twelve-tone";

export default function App() {
  const { i18n } = useTranslation();
  const language = useToolRegistry((s) => s.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return <AppShell />;
}

/** Register a tool at app init — call in tool's index.ts */
export function registerTool(tool: Tool) {
  useToolRegistry.getState().registerTool(tool);
}
