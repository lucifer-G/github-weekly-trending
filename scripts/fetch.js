const https = require("https");

const CATEGORIES = [
  // DEV EFFICIENCY categories first (checked before broad AI categories)
  {
    name: "📱 Android / 移动开发",
    keywords: [
      "android", "aosp", "adb", "apk", "apktool", "android-sdk",
      "android-app", "kotlin", "jetpack-compose", "compose-multiplatform",
      "gradle-plugin", "android-development", "android-studio", "mobile-app",
      "flutter", "react-native", "android-tool", "magisk", "android-emulator",
      "shizuku", "mobile-security", "debloater", "sms-forwarder"
    ]
  },
  {
    name: "🧪 自动化测试 / 质量保障",
    keywords: [
      "test-automation", "automated-testing", "appium",
      "selenium-webdriver", "playwright-test", "playwright",
      "test-framework", "e2e-testing", "integration-testing",
      "unit-testing", "pytest", "jest", "mocha", "vitest", "cypress",
      "continuous-testing", "test-coverage", "fuzzing",
      "property-based-testing", "mock-server", "test-double",
      "seleniumbase", "schemathesis"
    ]
  },
  {
    name: "🏗 代码架构 / 静态分析",
    keywords: [
      "static-analysis", "code-review-tool", "dependency-graph",
      "code-quality-tool", "linter", "sonarqube", "code-analyzer",
      "ast-parser", "abstract-syntax-tree", "refactoring-tool",
      "call-graph", "code-visualization", "archguard",
      "code-inspector", "code-smell", "cyclomatic-complexity",
      "dependency-analyzer", "code-architecture", "static-program-analysis"
    ]
  },
  {
    name: "📊 日志分析 / 调试工具",
    keywords: [
      "log-analysis", "log-parser", "log-viewer", "log-aggregation",
      "log-management", "log-monitoring", "crash-reporting",
      "stack-trace-analyzer", "error-tracking", "debugger",
      "debugging-tool", "trace-viewer", "flame-graph",
      "memory-profiler", "cpu-profiler", "performance-profiling",
      "observability-platform", "apm-tool", "distributed-tracing",
      "x64dbg", "mitmproxy", "easylogger"
    ]
  },
  {
    name: "🤖 AI Agent / Agent框架",
    keywords: [
      "ai-agent", "agent-framework", "multi-agent", "agentic",
      "autonomous-agent", "llm-agent", "agent-swarm",
      "agent-orchestration", "agent-workflow", "tool-calling-agent"
    ]
  },
  {
    name: "🔌 MCP 服务器 / 工具",
    keywords: [
      "mcp-server", "mcp-client", "mcp-tool", "model-context-protocol"
    ]
  },
  {
    name: "🧩 Skill / 插件系统",
    keywords: [
      "codex-skill", "claude-skill", "agent-skill", "ai-plugin",
      "chatgpt-plugin", "plugin-system", "skill-framework"
    ]
  },
  {
    name: "🧠 LLM / 大语言模型",
    keywords: [
      "llm", "large-language-model", "gpt-5", "claude-opus", "gemini-pro",
      "llama-model", "openai-api", "anthropic-api", "deepseek-model",
      "qwen", "mistral-ai", "language-model", "prompt-engineering",
      "fine-tuning", "transformer-model", "tokenizer"
    ]
  },
  {
    name: "📚 知识库 / RAG",
    keywords: [
      "rag", "retrieval-augmented-generation", "knowledge-base",
      "vector-database", "embedding-model", "semantic-search", "langchain",
      "graphrag", "knowledge-graph"
    ]
  },
  {
    name: "🛠 开发工具 / CLI",
    keywords: [
      "developer-tools", "cli-tool", "vscode-extension",
      "ide-plugin", "terminal-emulator", "build-tool",
      "dev-container", "git-tool"
    ]
  },
  {
    name: "🌐 前端 / UI",
    keywords: [
      "frontend-framework", "react-component", "vue-component",
      "nextjs", "tailwindcss", "ui-library", "component-library",
      "design-system"
    ]
  }
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

function ghRequest(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: "api.github.com",
      path,
      headers: {
        "User-Agent": "trending-weekly/2.0",
        Accept: "application/vnd.github.v3+json",
      },
    };
    if (GITHUB_TOKEN) opts.headers.Authorization = `token ${GITHUB_TOKEN}`;
    https.get(opts, (res) => {
      let body = "";
      res.on("data", (d) => (body += d));
      res.on("end", () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function classifyRepo(repo) {
  const name = (repo.full_name || "").toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const topics = (repo.topics || []).map((t) => t.toLowerCase());
  const allText = [name, desc, ...topics].join(" ");

  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (allText.includes(kw)) return cat.name;
    }
  }
  return "🔥 其他热门";
}

function buildDateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function makePath(q, perPage = 10) {
  return `/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${perPage}`;
}

// Wait to respect rate limits (search: 10/min)
const DELAY = 7000;

async function fetchTrending() {
  const results = [];
  let totalCalls = 0;

  // ===== 1. Broad AI/tooling (recent) =====
  const broadTopics = [
    "ai", "llm", "mcp", "agent", "openai",
    "langchain", "rag", "developer-tools", "cli"
  ];
  for (const topic of broadTopics) {
    const data = await ghRequest(
      makePath(`topic:${topic} stars:>50 created:>=${buildDateStr(30)}`, 10)
    );
    totalCalls++;
    if (data.items) results.push(...data.items);
    console.log(`  [${totalCalls}] topic:${topic} -> ${(data.items||[]).length} items`);
    await new Promise((r) => setTimeout(r, DELAY));
  }

  // ===== 2. Android & mobile (all-time) =====
  const androidQs = [
    `topic:android stars:>100`,
    `topic:kotlin stars:>50`,
    `adb OR apk in:name,description stars:>10`,
    `android testing in:name,description stars:>5`,
    `topic:gradle stars:>30`,
  ];
  for (const q of androidQs) {
    const data = await ghRequest(makePath(q, 8));
    totalCalls++;
    if (data.items) results.push(...data.items);
    console.log(`  [${totalCalls}] android: "${q.slice(0,40)}" -> ${(data.items||[]).length} items`);
    await new Promise((r) => setTimeout(r, DELAY));
  }

  // ===== 3. Testing (all-time) =====
  const testQs = [
    `topic:testing stars:>100`,
    `pytest OR playwright OR cypress OR jest in:name,description stars:>20`,
    `appium in:name,description stars:>10`,
  ];
  for (const q of testQs) {
    const data = await ghRequest(makePath(q, 8));
    totalCalls++;
    if (data.items) results.push(...data.items);
    console.log(`  [${totalCalls}] testing: "${q.slice(0,40)}" -> ${(data.items||[]).length} items`);
    await new Promise((r) => setTimeout(r, DELAY));
  }

  // ===== 4. Architecture/static-analysis (all-time) =====
  const archQs = [
    `static analysis in:name,description stars:>20`,
    `linter in:name,description stars:>50`,
    `topic:static-analysis stars:>10`,
  ];
  for (const q of archQs) {
    const data = await ghRequest(makePath(q, 8));
    totalCalls++;
    if (data.items) results.push(...data.items);
    console.log(`  [${totalCalls}] arch: "${q.slice(0,40)}" -> ${(data.items||[]).length} items`);
    await new Promise((r) => setTimeout(r, DELAY));
  }

  // ===== 5. Logging/debugging (all-time) =====
  const logQs = [
    `debugging in:name,description stars:>50`,
    `logger in:name stars:>20`,
    `topic:debugging stars:>20`,
    `topic:logging stars:>20`,
  ];
  for (const q of logQs) {
    const data = await ghRequest(makePath(q, 8));
    totalCalls++;
    if (data.items) results.push(...data.items);
    console.log(`  [${totalCalls}] logging: "${q.slice(0,40)}" -> ${(data.items||[]).length} items`);
    await new Promise((r) => setTimeout(r, DELAY));
  }

  // ===== 6. Broad recent =====
  const broadQ = `stars:>100 created:>=${buildDateStr(14)} language:python,typescript,javascript,kotlin,java`;
  const broadData = await ghRequest(makePath(broadQ, 20));
  totalCalls++;
  if (broadData.items) results.push(...broadData.items);
  console.log(`  [${totalCalls}] broad recent -> ${(broadData.items||[]).length} items`);

  console.log(`Total API calls: ${totalCalls}`);

  // Deduplicate
  const seen = new Set();
  const unique = [];
  for (const r of results) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      unique.push({
        id: r.id,
        name: r.full_name,
        url: r.html_url,
        description: r.description || "(暂无描述)",
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language || "Unknown",
        topics: r.topics || [],
        category: classifyRepo(r),
        updated_at: r.updated_at,
      });
    }
  }

  unique.sort((a, b) => b.stars - a.stars);

  const grouped = {};
  for (const repo of unique) {
    const cat = repo.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(repo);
  }

  return {
    updated_at: new Date().toISOString(),
    total: unique.length,
    categories: grouped,
  };
}

fetchTrending()
  .then((data) => {
    const fs = require("fs");
    const path = require("path");
    const outPath = path.join(__dirname, "..", "data", "repos.json");
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`\nWritten ${data.total} repos to ${outPath}`);
    console.log("Categories:");
    const ordered = Object.entries(data.categories).sort((a, b) => b[1].length - a[1].length);
    for (const [cat, repos] of ordered) {
      console.log(`  ${cat}: ${repos.length}`);
    }
  })
  .catch((err) => {
    console.error("Fetch failed:", err.message);
    process.exit(1);
  });
