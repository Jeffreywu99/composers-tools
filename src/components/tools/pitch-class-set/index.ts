import PitchClassSetTool from "./PitchClassSetTool";
import { registerTool } from "../../../App";
import type { Tool } from "../../../types/tool";

const tool: Tool = {
  id: "pitch-class-set",
  name: "音级集合计算器",
  nameEn: "Pitch-Class Set Calculator",
  description: "计算音级集合的标准序、原型、音程向量、福特号，支持倒影/逆行/逆行倒影等变体操作",
  descriptionEn: "Compute normal form, prime form, interval vector, Forte number, with inversion/retrograde/R-I transformations",
  icon: "music",
  component: PitchClassSetTool,
  category: "analysis",
};

registerTool(tool);

export { PitchClassSetTool };
export default PitchClassSetTool;
