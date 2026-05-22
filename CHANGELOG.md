# Changelog

## v0.2.0 — 2026-05-18

### 新增

- **十二音矩阵工具**：输入原型序列 P0（12 个不重复音级），自动生成 12×12 矩阵
  - 钢琴键盘顺序点击或文本输入音符，满 12 个自动计算
  - 13×13 表格展示，含 P / I / R / RI 行列标签
  - 高亮 P0 行、I0 列、首音对角线
  - 导出为 PNG（`html-to-image` + 原生保存对话框，可选保存位置）
  - 保存为 JSON（含音级数字 + 音名）
  - 中英文双语支持
- 新增 `tauri-plugin-dialog` 依赖，提供原生文件保存对话框
- 新增 `write_file` Rust 命令
- 界面错误提示横幅

### 技术

- Rust：`twelve_tone.rs` — 矩阵算法 + 验证 + 8 个单元测试
- 命令：`compute_twelve_tone_matrix`、`write_file`
- 前端：`RowInput` / `MatrixDisplay` / `TwelveToneTool` 组件
- 状态：Zustand store `twelveToneStore` + hook `useTwelveTone`

---

## v0.1.0 — 2026-05-18

### 新增

- **音级集合计算器**：首个功能模块
  - 钢琴键盘按钮或文本输入音级
  - 计算标准序、原型、音程向量、福特号
  - 变体操作：移调 Tn、倒影 In、逆行 R、逆行倒影 RI
  - 集合属性：基数、对称性、子集、补集
  - 随机生成 + 福特全集浏览
  - 历史记录
  - 中英文双语支持
- Tauri 2.0 + React 19 + TypeScript + Vite + Tailwind CSS 4 项目初始化
- 简约温暖 UI 风格（米白底 + 暖棕金强调色）
- Rust 音乐理论引擎：pitch_class、set、normal_form、prime_form、interval_vector、forte、transformations、symmetry、classification、subsets、random
