import { create } from "zustand";
import type { Tool } from "../types/tool";

interface ToolRegistryState {
  tools: Tool[];
  activeToolId: string | null;
  sidebarCollapsed: boolean;
  language: "zh-CN" | "en";

  registerTool: (tool: Tool) => void;
  setActiveTool: (id: string) => void;
  toggleSidebar: () => void;
  setLanguage: (lang: "zh-CN" | "en") => void;
}

export const useToolRegistry = create<ToolRegistryState>((set) => ({
  tools: [],
  activeToolId: null,
  sidebarCollapsed: false,
  language: "zh-CN",

  registerTool: (tool) =>
    set((state) => ({
      tools: [...state.tools.filter((t) => t.id !== tool.id), tool],
    })),

  setActiveTool: (id) => set({ activeToolId: id }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setLanguage: (lang) => set({ language: lang }),
}));
