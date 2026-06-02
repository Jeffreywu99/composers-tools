# 跨平台协作开发指南（Windows + macOS）

## 概览

Composers Tools 基于 Tauri 2.0（Rust + WebView），天然跨平台。前端代码 100% 共用，Rust 代码几乎 100% 共用，仅少量平台特定逻辑需要条件编译。

---

## 一、环境搭建

### Windows

```bash
# 确认工具链
node -v          # v24.x
rustc -v         # 1.x
cargo tauri dev   # 启动开发
```

### macOS

```bash
# 1. 安装 Xcode Command Line Tools
xcode-select --install

# 2. 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# 3. 安装 Node.js（推荐 nvm）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
nvm use 22

# 4. 克隆项目
git clone <repo-url> composers-tools
cd composers-tools

# 5. 安装前端依赖
npm install

# 6. 安装 Tauri CLI
cargo install tauri-cli

# 7. 启动开发
cargo tauri dev
```

**macOS 首次 `cargo tauri dev` 会自动编译 Rust 依赖，耗时 5-10 分钟，这是正常的。**

### macOS 特殊注意

- **WebKit**: macOS 自带 WebKit（Tauri 使用系统 WebView），无需额外安装
- **Xcode**: 必须安装，Rust 编译需要 `xcrun` 和系统头文件
- **Apple Silicon (M1/M2/M3/M4)**: Rust 默认编译 `aarch64-apple-darwin`，Tauri 完全支持，无需额外配置

---

## 二、Git 协作流程

### 分支策略

```
master          ← 稳定版本，可运行
├── dev         ← 日常开发集成分支
├── feat/xxx    ← 功能分支
└── fix/xxx     ← 修复分支
```

**工作流**：
1. 从 `dev` 拉取最新代码
2. 创建功能分支 `feat/xxx`
3. 开发完成后提 PR → Code Review → 合并到 `dev`
4. 稳定后 `dev` → `master`

### 行尾一致性

- `.gitattributes` 已设置 `* text=auto eol=lf`，确保 Windows 和 macOS 行尾统一为 LF
- `core.autocrlf=input`，Windows 提交时自动转 LF

---

## 三、平台差异处理

### 需要条件编译的地方

#### 1. 临时文件目录

```rust
use std::env;

fn temp_dir() -> PathBuf {
    // Tauri 提供 app 数据目录，跨平台一致
    // 推荐用 app_data_dir 而非系统 temp
}
```

#### 2. 文件对话框

`tauri-plugin-dialog` 已经处理了平台差异，无需额外适配。

### 不需要条件编译的地方

- **前端 React/TS/CSS** — 100% 共用
- **Zustand 状态管理** — 100% 共用
- **Rust 音乐理论引擎** (`src-tauri/src/music/`) — 100% 共用
- **Tauri IPC 命令** — 100% 共用

---

## 四、代码规范

### 通用

- **缩进**: 2 spaces（前端）、4 spaces（Rust）
- **命名**: 前端 camelCase，Rust snake_case
- **注释**: 中文为主，代码标识符用英文
- **Commit**: Conventional Commits（`feat:`, `fix:`, `docs:` 等）

### Rust

```rust
// 命令命名：动词_名词，与前端 invoke 对应
#[tauri::command]
pub async fn my_command(input: String) -> Result<Output, String> { ... }

// 平台特定逻辑用 cfg 条件编译
#[cfg(target_os = "macos")]
fn platform_specific() { ... }
```

### React/TypeScript

```typescript
// 组件命名：PascalCase
// 工具注册：每个工具一个目录 + index.ts
// 状态：每个工具一个 Zustand store
```

---

## 五、CI/CD

### GitHub Actions 跨平台构建

```yaml
# .github/workflows/build.yml
jobs:
  build:
    strategy:
      matrix:
        include:
          - os: windows-latest
            target: x86_64-pc-windows-msvc
          - os: macos-latest
            target: aarch64-apple-darwin
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: npm install
      - run: cargo tauri build
```

---

## 六、常见问题

### Q: macOS 上 `cargo tauri dev` 报 WebKit 错误？
确保已安装 Xcode Command Line Tools：`xcode-select --install`

### Q: macOS 上 Rust 编译慢？
首次编译正常（5-10 min），后续增量编译很快。M 系列芯片编译速度远快于 Intel Mac。

### Q: 如何测试跨平台兼容性？
1. 本地 `cargo tauri dev` 能跑就基本没问题
2. 关键测试点：文件保存对话框、路径分隔符、系统 WebView 渲染
3. GitHub Actions 自动构建两个平台
