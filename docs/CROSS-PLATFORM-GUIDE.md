# 跨平台协作开发指南（Windows + macOS）

## 概览

Composers Tools 基于 Tauri 2.0（Rust + WebView），天然跨平台。前端代码 100% 共用，Rust 代码几乎 100% 共用，仅少量平台特定逻辑需要条件编译。

---

## 一、环境搭建

### Windows（你的环境）

已就绪 ✅

```bash
# 确认工具链
node -v          # v24.x
rustc -v         # 1.x
cargo tauri dev   # 启动开发
```

### macOS（你的朋友）

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

### 仓库设置

项目已初始化 Git，推荐推到 GitHub：

```bash
# 在 GitHub 上创建仓库后
git remote add origin https://github.com/<your-username>/composers-tools.git
git push -u origin master
```

### 分支策略（推荐轻量级）

```
master          ← 稳定版本，可运行
├── dev         ← 日常开发集成分支
├── feat/lilypond-score   ← 功能分支
├── feat/sequence-transformer
└── fix/xxx      ← 修复分支
```

**工作流**：
1. 从 `dev` 拉取最新代码
2. 创建功能分支 `feat/xxx`
3. 开发完成后提 PR → Code Review → 合并到 `dev`
4. 稳定后 `dev` → `master`

### 行尾一致性（已配置 ✅）

- `.gitattributes` 已设置 `* text=auto eol=lf`，确保 Windows 和 macOS 行尾统一为 LF
- `core.autocrlf=input`，Windows 提交时自动转 LF

---

## 三、平台差异处理

### 需要条件编译的地方

#### 1. LilyPond 可执行文件路径（⚠️ 最重要）

| 平台 | 默认路径 |
|---|---|
| Windows | `C:\Program Files\LilyPond\lilypond.exe` |
| macOS | `/Applications/LilyPond.app/Contents/Resources/bin/lilypond` |

Rust 实现：
```rust
fn find_lilypond() -> Result<PathBuf> {
    // 1. 优先检查 PATH 环境变量
    if let Ok(p) = which::which("lilypond") {
        return Ok(p);
    }
    // 2. 回退到平台默认路径
    #[cfg(target_os = "windows")]
    { Ok(PathBuf::from(r"C:\Program Files\LilyPond\lilypond.exe")) }
    #[cfg(target_os = "macos")]
    { Ok(PathBuf::from("/Applications/LilyPond.app/Contents/Resources/bin/lilypond")) }
    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    { Err(anyhow!("LilyPond not found")) }
}
```

#### 2. 临时文件目录

```rust
use std::env;

fn temp_dir() -> PathBuf {
    // Tauri 提供 app 数据目录，跨平台一致
    // 推荐用 app_data_dir 而非系统 temp
}
```

#### 3. 文件对话框

`tauri-plugin-dialog` 已经处理了平台差异，无需额外适配。

### 不需要条件编译的地方

- **前端 React/TS/CSS** — 100% 共用
- **Zustand 状态管理** — 100% 共用
- **Rust 音乐理论引擎** (`src-tauri/src/music/`) — 100% 共用
- **Tauri IPC 命令** — 100% 共用
- **CodeMirror 编辑器** — 100% 共用

---

## 四、LilyPond 安装（macOS）

macOS 上的 LilyPond 安装方式与 Windows 不同：

### 方法 1：Homebrew（推荐）
```bash
brew install lilypond
# 安装后 lilypond 自动在 PATH 中
lilypond --version
```

### 方法 2：官方安装包
1. 从 https://lilypond.org/download.html 下载 macOS 版本
2. 挂载 .dmg，将 LilyPond.app 拖入 /Applications
3. 需要手动加入 PATH：
```bash
echo 'export PATH="/Applications/LilyPond.app/Contents/Resources/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 方法 3：编译安装
```bash
# 不推荐，依赖复杂，耗时长
```

---

## 五、协作分工建议

根据团队成员技能分配：

### 按技术栈分工

| 方向 | 适合谁 | 内容 |
|---|---|---|
| **前端 React** | 前端开发经验 | UI 组件、交互、样式、CodeMirror 集成 |
| **Rust 后端** | Rust 经验 / 愿意学 | 音乐理论引擎、AI 代理、LilyPond 编译 |
| **音乐理论** | 作曲/理论背景 | 算法验证、需求定义、测试用例 |
| **LilyPond** | 制谱经验 | 代码模板、输出验证、参考文档维护 |

### 按模块分工（推荐）

基于 ROADMAP，各模块耦合度低，适合并行开发：

| 模块 | 前端 | 后端 | 独立性 |
|---|---|---|---|
| LilyPond 乐谱输出 | CodeMirror + 预览 | compiler + ai_proxy | 高 |
| 序列变换器 | 新 UI | transformations 扩展 | 高 |
| 音阶/调式库 | 浏览器 UI | scale/mode 引擎 | 高 |
| 节奏模式生成 | 编辑器 UI | rhythm 引擎 | 中 |

**每个模块都可以独立开发、独立测试，不会互相阻塞。**

---

## 六、代码规范

### 通用

- **缩进**: 2 spaces（前端）、4 spaces（Rust）
- **命名**: 前端 camelCase，Rust snake_case
- **注释**: 中文为主，代码标识符用英文
- **Commit**: Conventional Commits（`feat:`, `fix:`, `docs:` 等）

### Rust

```rust
// 命令命名：动词_名词，与前端 invoke 对应
#[tauri::command]
pub async fn compile_lilypond(code: String) -> Result<CompileResult, String> { ... }

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

## 七、CI/CD（可选，后续添加）

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

## 八、常见问题

### Q: macOS 上 `cargo tauri dev` 报 WebKit 错误？
确保已安装 Xcode Command Line Tools：`xcode-select --install`

### Q: macOS 上 Rust 编译慢？
首次编译正常（5-10 min），后续增量编译很快。M 系列芯片编译速度远快于 Intel Mac。

### Q: LilyPond 编译结果两平台不一致？
LilyPond 的输出（PNG/PDF）在不同平台上可能有微小的字体/布局差异，这是正常的。确保两端用相同版本的 LilyPond（v2.26.0）。

### Q: AI API Key 怎么管理？
PRD 已设计 AI 走 Rust 后端代理，Key 存在本地配置文件（不进 Git）。两平台各自配置自己的 `.env` 或本地配置文件即可。

### Q: 如何测试跨平台兼容性？
1. 本地 `cargo tauri dev` 能跑就基本没问题
2. 关键测试点：LilyPond 路径、文件保存对话框、路径分隔符
3. 可后续加 GitHub Actions 自动构建两个平台
