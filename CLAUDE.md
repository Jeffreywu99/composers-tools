# Composers Tools — 作曲家工具箱

跨平台作曲辅助软件（Windows + macOS），集成多种作曲工具模块。

## 技术栈

- **壳层**：Tauri 2.0（Rust 后端 + WebView 前端）
- **前端**：React 19 + TypeScript + Vite
- **状态管理**：Zustand
- **样式**：Tailwind CSS
- **国际化**：i18next（中文为主，英文备用）
- **打包**：Tauri bundler（MSI/NSIS for Windows, DMG for macOS）

## 项目结构

```
composers-tools/
├── src/                       # React 前端
│   ├── components/
│   │   ├── layout/            # AppShell, Sidebar, ToolContainer
│   │   ├── tools/             # 每个工具一个子目录
│   │   │   ├── pitch-class-set/
│   │   │   └── twelve-tone/
│   │   └── common/            # 通用 UI 组件
│   ├── hooks/                 # 自定义 hooks
│   ├── stores/                # Zustand stores
│   ├── lib/                   # 工具函数、类型包装
│   ├── types/                 # TypeScript 类型定义
│   └── i18n/                  # 中英文翻译文件
├── src-tauri/                 # Tauri Rust 后端
│   ├── src/
│   │   ├── music/             # 音乐理论引擎（核心算法）
│   │   └── commands/          # Tauri IPC 命令处理
│   ├── Cargo.toml
│   └── tauri.conf.json
├── tests/                     # 集成测试 + E2E
└── plan.md                    # 详细架构方案
```

## 开发命令

```bash
cargo tauri dev      # 启动开发服务器（前端热更新 + Rust 重编译）
cargo test            # 运行 Rust 单元测试
npm run dev           # 仅启动 Vite 前端（不包含 Tauri）
npm run build         # 构建前端
cargo tauri build     # 完整打包（生成安装包）
```

## 开发约定

- **计算在 Rust，UI 在 React**：所有音乐理论算法在 `src-tauri/src/music/` 中实现，前端通过 `invoke()` 调用
- **工具注册表**：新增工具创建 `src/components/tools/<tool-name>/index.ts`，调用 `registerTool()`，再在 `src/App.tsx` 中副作用导入 `import "./components/tools/<tool-name>"` 即可，无需修改布局/路由代码
- **类型在前端和后端各定义一次**：前端 `src/types/music.ts` 与 Rust 结构体保持一致
- **状态管理**：每个工具一个 Zustand store，不共享全局大 store
- **文件导出**：使用 `tauri-plugin-dialog` 的原生保存对话框 + Rust `write_file` 命令，不依赖浏览器下载

## 已有工具

| 工具 ID | 中文名 | 类别 | 说明 |
|---|---|---|---|
| `pitch-class-set` | 音级集合计算器 | analysis | 标准序、原型、音程向量、福特号、变体操作 |
| `twelve-tone` | 十二音矩阵 | composition | 原型序列 → 12×12 P/R/I/RI 矩阵，支持 PNG/JSON 导出 |

## 插件依赖

- `tauri-plugin-shell`：打开外部链接
- `tauri-plugin-dialog`：原生文件保存对话框
- `html-to-image`：前端 DOM 截图（矩阵导出 PNG）

## UI 设计

- **风格**：简约温暖。大面积留白，卡片式布局
- **色板**：米白底 `#FFF8F0`，暖棕金强调 `#C4956A`，深棕文字 `#3D2B1F`
- **圆角**：8-12px，柔和阴影
- **字体**：中文系统默认，英文 Inter
- **动画**：200ms ease，克制不喧宾夺主
- **语言**：默认中文，支持切换到 English

## 音级集合术语

| 中文 | English | 说明 |
|---|---|---|
| 音级 | Pitch Class | 0-11 整数 |
| 倒影 | Inversion | I(n) = n - pc |
| 逆行 | Retrograde | R = 逆序 |
| 逆行倒影 | R-I | RI = R ∘ I |
| 标准序 | Normal Form | 最紧凑升序排列 |
| 原型 | Prime Form | 最紧凑的整体形式 |
| 音程向量 | Interval Vector | 6 维向量 [ic1..ic6] |
| 福特号 | Forte Number | 如 3-11 |

## 十二音矩阵术语

| 中文 | English | 说明 |
|---|---|---|
| 原型序列 | Prime Row (P0) | 12 个不重复音级的有序排列 |
| 原型 | Prime (P) | Pn = P0 移调 n 个半音 |
| 倒影 | Inversion (I) | In = I0 移调 n 个半音 |
| 逆行 | Retrograde (R) | Rn = Pn 的逆序 |
| 逆行倒影 | Retrograde Inversion (RI) | RIn = In 的逆序 |
| 矩阵 | Matrix | 12×12 表格，Matrix[r][c] = (P0[c] + I0[r] - P0[0]) mod 12 |

## 版本历史

| 版本 | 日期 | 变更 |
|---|---|---|
| v0.1.0 | 2026-05-18 | 音级集合计算器，项目初始化 |
| v0.2.0 | 2026-05-18 | 十二音矩阵工具，原生文件保存对话框 |
