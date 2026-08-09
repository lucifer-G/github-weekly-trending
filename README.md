# 🔥 GitHub 每周热门

> AI 时代最受欢迎的开源项目 · 每周一自动更新

**GitHub Weekly Trending** 是一个自动聚合 GitHub 热门开源项目的静态站点，覆盖 AI Agent、大语言模型（LLM）、MCP 工具、Android 开发与逆向工程、自动化测试、代码架构、前端 UI 等十余个分类，每周一通过 GitHub Actions 自动抓取并部署更新。

## 🌐 访问链接

| 链接 | 地址 |
|------|------|
| 🚀 **在线访问** | [lucifer-g.github.io/github-weekly-trending](https://lucifer-g.github.io/github-weekly-trending/) |
| 📦 **源码仓库** | [github.com/lucifer-G/github-weekly-trending](https://github.com/lucifer-G/github-weekly-trending) |

## ✨ 功能特性

- **多分类浏览** — 项目按领域自动归类，支持按分类筛选
- **实时搜索** — 按项目名或描述快速检索
- **多维排序** — 支持按 Star 数、Fork 数、名称排序
- **自动更新** — 每周一 08:00 UTC 自动抓取 GitHub 最新热门项目并部署
- **纯静态** — 基于 GitHub Pages 托管，零后端，加载迅速

## 📂 项目覆盖

| 分类 | 说明 |
|------|------|
| 🤖 AI Agent / Agent 框架 | 自主 Agent、多 Agent 协作框架 |
| 🧠 LLM / 大语言模型 | 大模型、推理、微调、Prompt 工程 |
| 🔌 MCP 服务器 / 工具 | Model Context Protocol 生态 |
| 🧩 Skill / 插件系统 | AI 插件与技能框架 |
| 📚 知识库 / RAG | 检索增强生成、向量数据库 |
| 📱 Android / 移动开发 | Android 开发、Kotlin、Flutter、逆向工程 |
| 🧪 自动化测试 / 质量保障 | Appium、Playwright、Cypress 等 |
| 🏗 代码架构 / 静态分析 | 代码审查、依赖分析、重构工具 |
| 📊 日志分析 / 调试工具 | 日志聚合、性能剖析、调试器 |
| 🛠 开发工具 / CLI | VS Code 插件、终端工具、构建工具 |
| 🌐 前端 / UI | React、Vue、组件库、设计系统 |

## 🛠 技术栈

- **数据抓取** — Node.js 脚本调用 GitHub Search API
- **前端展示** — 原生 HTML/CSS/JS，零框架依赖
- **自动部署** — GitHub Actions + GitHub Pages
- **定时调度** — Cron 定时触发（每周一）

## 🚀 本地运行

```bash
# 抓取最新数据（需要 GitHub Token）
GITHUB_TOKEN=your_token node scripts/fetch.js

# 启动本地服务器
npx serve .
# 或
python -m http.server 8080
```

然后访问 `http://localhost:8080` 即可。

## 📅 更新策略

- **每周一定时抓取** — GitHub Actions `cron: "0 8 * * 1"` 自动执行
- **手动触发** — 支持 `workflow_dispatch` 随时运行
- **Push 触发** — 推送到 master 分支时自动更新部署

## ⚠️ 注意事项

- 未配置 `GITHUB_TOKEN` 时 API 限速为 60 次/小时（配置后 30 次/分钟搜索限额）
- 每周抓取约 30+ 次 API 调用，在限速范围内安全运行
- 数据文件 `data/repos.json` 由 CI 自动维护，无需手动编辑

## 📄 许可

MIT License
