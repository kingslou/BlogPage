/* 统一站点所需的节点与查询参数，页面类型由 HTML 声明。 */
const pageType = document.body.dataset.page;
/* 查询参数仅用于查找已知内容，不直接写入 HTML。 */
const pageParams = new URLSearchParams(window.location.search);

/** 对插入模板的文本做转义，避免新增内容包含 HTML 时被执行。 */
function escapeText(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

/** 生成文章列表项；链接使用固定页面与稳定的文章标识。 */
function articleRow(article, index) {
  return `<a class="article-row" href="article.html?id=${encodeURIComponent(article.id)}"><span class="article-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><div><div class="article-meta"><time datetime="${escapeText(article.date)}">${article.date.replaceAll("-", ".")}</time><span class="meta-separator">/</span><span>${escapeText(article.category)}</span><span class="meta-separator">/</span><span>${escapeText(article.readTime)}</span></div><h3>${escapeText(article.title)}</h3><p>${escapeText(article.summary)}</p></div><img class="article-thumbnail ${escapeText(article.crop)}" src="assets/architecture.png" width="400" height="117" alt="" loading="lazy"></a>`;
}

/** 首页只展示最近两篇手记，完整目录在独立文章页。 */
function renderHome() {
  document.getElementById("latest-articles").innerHTML = journalArticles.slice(0, 2).map(articleRow).join("");
}

/** 分类与搜索共同筛选文章，并在地址栏保留可分享的阅读状态。 */
function initializeArchive() {
  /* 分类白名单来自页面按钮，忽略地址栏中的无效分类。 */
  const categoryButtons = [...document.querySelectorAll("[data-category]")];
  /* 搜索控件同时用于响应输入和清空操作。 */
  const searchInput = document.getElementById("article-search");
  /* 初始分类与关键词可从分享链接恢复。 */
  let activeCategory = categoryButtons.some(button => button.dataset.category === pageParams.get("category")) ? pageParams.get("category") : "全部";
  searchInput.value = (pageParams.get("q") || "").slice(0, 100);

  /** 依据当前控件状态刷新结果、无结果提示和 URL。 */
  function updateArticles() {
    /* 大小写不敏感的关键词同时匹配标题、摘要与分类。 */
    const keyword = searchInput.value.trim().toLocaleLowerCase();
    /* 文章数据可信，输出时仍通过统一模板进行文本转义。 */
    const matches = journalArticles.filter(article => (activeCategory === "全部" || article.category === activeCategory) && `${article.title} ${article.summary} ${article.category}`.toLocaleLowerCase().includes(keyword));
    document.getElementById("article-list").innerHTML = matches.map(articleRow).join("");
    document.getElementById("result-count").textContent = `共 ${matches.length} 篇手记`;
    document.getElementById("empty-state").hidden = matches.length > 0;
    categoryButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === activeCategory)));
    /* 使用 replaceState 防止每输入一个字就增加一次浏览历史。 */
    const nextUrl = new URL(window.location.href);
    if (activeCategory === "全部") nextUrl.searchParams.delete("category");
    else nextUrl.searchParams.set("category", activeCategory);
    if (keyword) nextUrl.searchParams.set("q", searchInput.value.trim());
    else nextUrl.searchParams.delete("q");
    window.history.replaceState(null, "", nextUrl);
  }

  categoryButtons.forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    updateArticles();
  }));
  searchInput.addEventListener("input", updateArticles);
  document.getElementById("reset-search").addEventListener("click", () => {
    activeCategory = "全部";
    searchInput.value = "";
    updateArticles();
    searchInput.focus();
  });
  updateArticles();
}

/** 文章页展示完整正文；无效 id 展示可返回目录的明确提示。 */
function renderArticle() {
  /* 只允许访问内容源中已存在的文章。 */
  const article = journalArticles.find(item => item.id === pageParams.get("id"));
  /* 正文容器承载标题、配图与结构化段落。 */
  const container = document.getElementById("article-content");
  if (!article) {
    document.title = "未找到手记 · Kingslou";
    container.innerHTML = '<div class="empty-state"><p class="eyebrow">PAGE NOT FOUND</p><h1>这篇手记还未写下。</h1><p>链接可能有误，回到目录看看其他文章吧。</p><a class="button" href="articles.html">浏览全部手记 ↗</a></div>';
    return;
  }
  document.title = `${article.title} · Kingslou`;
  document.querySelector('meta[name="description"]').content = article.summary;
  container.innerHTML = `<header class="reading-header"><p class="eyebrow"><span class="red-rule"></span>${escapeText(article.category)} / FIELD NOTES</p><h1>${escapeText(article.title)}</h1><p class="reading-deck">${escapeText(article.summary)}</p><div class="article-meta"><span>文 / Kingslou</span><span class="meta-separator">/</span><time datetime="${escapeText(article.date)}">${article.date.replaceAll("-", ".")}</time><span class="meta-separator">/</span><span>阅读约 ${escapeText(article.readTime)}</span></div></header><img class="reading-hero ${escapeText(article.crop)}" src="assets/architecture.png" width="1512" height="1040" alt="远山与庭院的黑白建筑摄影"><div class="prose"><p>${escapeText(article.intro)}</p>${article.sections.map(section => `<h2>${escapeText(section.title)}</h2>${section.paragraphs.map(paragraph => `<p>${escapeText(paragraph)}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map(bullet => `<li>${escapeText(bullet)}</li>`).join("")}</ul>` : ""}`).join("")}<blockquote>${escapeText(article.takeaway)}</blockquote><p class="editorial-note">本文为方法型手记，供整理思路与行动参考。实际投入和结果因个人条件与具体情境而异。</p></div>`;
  /* 只有有效文章才开放复制链接；权限受限时给出手动复制提示。 */
  const shareButton = document.getElementById("share-article");
  shareButton.hidden = false;
  shareButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      document.getElementById("share-status").textContent = "链接已复制";
    } catch {
      document.getElementById("share-status").textContent = "请从浏览器地址栏复制文章链接";
    }
  });
}

if (pageType === "home") renderHome();
if (pageType === "archive") initializeArchive();
if (pageType === "article") renderArticle();
