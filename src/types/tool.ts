import type { ComponentType } from "react";

export type ToolCategory = "analysis" | "composition" | "reference";

export interface Tool {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  component: ComponentType;
  category: ToolCategory;
}
