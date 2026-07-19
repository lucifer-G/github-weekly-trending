(function () {
  let allData = null;
  let activeCat = "all";

  // ---- Load ----
  async function init() {
    try {
      const res = await fetch("data/repos.json");
      allData = await res.json();
      renderAll();
    } catch (e) {
      document.getElementById("repoGrid").innerHTML =
        '<div class="empty">❌ 加载数据失败，请稍后重试</div>';
    }
  }

  // ---- Render ----
  function renderAll() {
    renderHeader();
    renderNav();
    renderGrid();
    bindEvents();
  }

  function renderHeader() {
    const el = document.getElementById("updateTime");
    const cnt = document.getElementById("repoCount");
    if (allData.updated_at) {
      const d = new Date(allData.updated_at);
      el.innerHTML = '<span class="last-updated">📅 更新于 ' + d.toLocaleDateString("zh-CN") + "</span>";
    } else {
      el.textContent = "暂无数据";
    }
    cnt.textContent = "共 " + allData.total + " 个项目";
  }

  function renderNav() {
    const nav = document.getElementById("categoryNav");
    const cats = allData.categories || {};
    let html = '<button class="cat-btn active" data-cat="all">🔥 全部<span class="cat-count">(' + allData.total + ")</span></button>";

    const ordered = Object.entries(cats).sort((a, b) => b[1].length - a[1].length);
    for (const [name, repos] of ordered) {
      html +=
        '<button class="cat-btn" data-cat="' +
        escapeHtml(name) +
        '">' +
        escapeHtml(name) +
        ' <span class="cat-count">(' +
        repos.length +
        ")</span></button>";
    }
    nav.innerHTML = html;
  }

  function renderGrid() {
    const grid = document.getElementById("repoGrid");
    const query = (document.getElementById("searchInput").value || "").toLowerCase();
    const sort = document.getElementById("sortSelect").value;

    let repos = [];
    if (activeCat === "all") {
      for (const cat in allData.categories) {
        repos.push(...allData.categories[cat]);
      }
    } else {
      repos = allData.categories[activeCat] || [];
    }

    // Filter
    if (query) {
      repos = repos.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          (r.description || "").toLowerCase().includes(query)
      );
    }

    // Sort
    if (sort === "stars") repos.sort((a, b) => b.stars - a.stars);
    else if (sort === "name") repos.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "forks") repos.sort((a, b) => b.forks - a.forks);

    if (repos.length === 0) {
      grid.innerHTML = '<div class="empty">🔍 没有找到匹配的项目</div>';
      return;
    }

    grid.innerHTML = repos.map(cardHtml).join("");
  }

  function cardHtml(repo) {
    const desc = repo.description || "";
    const topics = (repo.topics || []).slice(0, 5);
    return (
      '<div class="repo-card">' +
      "<h3><a href=\"" +
      repo.url +
      '" target="_blank" rel="noopener">' +
      escapeHtml(repo.name) +
      "</a></h3>" +
      '<p class="desc">' +
      escapeHtml(desc) +
      "</p>" +
      '<div class="meta">' +
      '<span class="stars">⭐ ' +
      formatNum(repo.stars) +
      "</span>" +
      '<span class="forks">🍴 ' +
      formatNum(repo.forks) +
      "</span>" +
      '<span class="lang">🔹 ' +
      escapeHtml(repo.language) +
      "</span>" +
      "</div>" +
      (topics.length
        ? '<div class="topics">' +
          topics.map((t) => '<span class="topic-tag">' + escapeHtml(t) + "</span>").join("") +
          "</div>"
        : "") +
      "</div>"
    );
  }

  function bindEvents() {
    // Category nav
    document.getElementById("categoryNav").addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-btn");
      if (!btn) return;
      document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCat = btn.dataset.cat;
      renderGrid();
    });

    // Search
    document.getElementById("searchInput").addEventListener("input", renderGrid);

    // Sort
    document.getElementById("sortSelect").addEventListener("change", renderGrid);
  }

  // ---- Helpers ----
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatNum(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return String(n);
  }

  init();
})();
