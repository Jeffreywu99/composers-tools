import TwelveToneTool from "./TwelveToneTool";
import { registerTool } from "../../../App";
import type { Tool } from "../../../types/tool";

const tool: Tool = {
  id: "twelve-tone",
  name: "十二音矩阵",
  nameEn: "Twelve-Tone Matrix",
  description:
    "输入十二音序列原型（P0），生成完整的12x12十二音矩阵，含P/R/I/RI标记",
  descriptionEn:
    "Enter a prime row (P0) to generate the full 12x12 twelve-tone matrix with P/R/I/RI labels",
  icon: "matrix",
  component: TwelveToneTool,
  category: "composition",
};

registerTool(tool);

export { TwelveToneTool };
export default TwelveToneTool;
