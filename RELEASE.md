# 作曲工具 发布说明

## v0.2.0 — 2026-05-18

### 新增

- **十二音矩阵工具**：输入原型序列 P0（12 个不重复音级），自动生成 12×12 P/R/I/RI 矩阵
  - 钢琴键盘顺序点击或文本输入音符，满 12 个自动计算
  - 13×13 表格展示，含行列标签，高亮 P0 行 / I0 列 / 首音对角线
  - PNG 导出（html-to-image + 原生保存对话框）
  - JSON 导出（含音级数字 + 音名）
- `tauri-plugin-dialog` 原生文件保存对话框
- `write_file` Rust 命令
- 界面错误提示横幅

### 技术

- Rust：`twelve_tone.rs` 矩阵算法 + 验证
- 前端：`RowInput` / `MatrixDisplay` / `TwelveToneTool` 组件
- 状态：Zustand store `twelveToneStore`

---

## v0.1.0 — 2026-05-18

### 概述

作曲工具（Composers Tools）是一个跨平台作曲辅助桌面软件，基于 Tauri 2.0 构建。首个版本集成**音级集合计算器**——现代音乐分析的基础工具。

## 技术栈

| 层级 | 技术 |
|---|---|
| 桌面壳层 | Tauri 2.0 (Rust + WebView) |
| 前端 | React 19 + TypeScript + Vite 6 |
| 状态管理 | Zustand 5 |
| 样式 | Tailwind CSS v4 |
| 国际化 | i18next (中文/English) |
| 打包 | MSI + NSIS (Windows), DMG (macOS 待验证) |

## 音级集合计算器

### 核心算法（Rust 引擎，34 个单元测试全过）
- 音级类型 (PitchClass)，模 12 运算
- 标准序 (Normal Form) — Forte 算法
- 原型 (Prime Form) — 比较原集与倒影的最紧凑形式
- 音程向量 — [ic1..ic6]
- 福特号自动查表 — 生成全部 208 种集合类
- 变体操作 — Tn (移调), In (倒影), R (逆行), RI (逆行倒影)
- 对称性分析 — T-对称 / I-对称 检测
- 子集/母集/补集分析
- 随机生成（支持基数和对称性约束）

### 前端功能
- 钢琴式音级键盘（7 白键 + 5 黑键，正确位置）
- 文本输入解析（"C E G" 或 "0 4 7"）
- 有序/无序音列切换
- 实时分类面板（标准序、原型、音程向量、福特号、音级内涵）
- 变体操作面板（Tn/In/R/RI + n 值滑块）
- 集合属性面板（基数、对称性、子集、补集）
- 随机生成面板（基数滑块 + 对称筛选）
- 历史记录（可回退/恢复）
- 子集/补集点击导航
- 福特号全集浏览器（按基数筛选，208 种集合类可查）
- 分类结果一键复制 JSON
- 键盘快捷键（QWERTY 钢琴映射 + 空格清除 + 回车分类）

### UI 设计
- 暖色手稿风：纸色底 #FBF7F0，琥珀金 #C0854A，深墨 #2C1810
- 羊皮纸侧栏，衬线字体，柔和阴影
- 纸张纹理噪声叠加
- 自定义音乐符号应用图标

## 安装

- **MSI**：`Composers Tools_0.1.0_x64_en-US.msi` (3.7 MB)
- **NSIS**：`Composers Tools_0.1.0_x64-setup.exe` (2.5 MB)
- **系统要求**：Windows 10+ x64, WebView2 Runtime

## 已知限制

- macOS 打包未验证
- Forte 编号为算法自动排序（与 Forte 标准表可能有细微差异）
- 无音频预览

## 项目结构

```
composers-tools/
├── src/                    # React 前端
│   ├── components/
│   │   ├── layout/         # AppShell, Sidebar, ToolContainer
│   │   ├── tools/pitch-class-set/  # 音级集合工具 (8 组件)
│   │   └── common/         # NoteButton, InfoCard, ToolHeader
│   ├── hooks/              # usePitchClassSet, useKeyboardShortcuts
│   ├── stores/             # pitchClassSetStore, toolRegistry
│   ├── lib/                # tauri.ts (IPC 桥接)
│   ├── types/              # music.ts, tool.ts
│   └── i18n/               # zh-CN.json, en.json
├── src-tauri/              # Rust 后端
│   ├── src/music/          # 音乐理论引擎 (11 模块)
│   └── src/commands/       # Tauri IPC 命令
├── tests/e2e/              # Playwright E2E 测试
└── RELEASE.md              # 本文件
```

## 开发命令

```bash
cargo tauri dev      # 开发模式
cargo test            # Rust 测试 (34 tests)
npm run dev           # 仅前端
cargo tauri build     # 生产打包
npx playwright test   # E2E 测试
```
