# Kingslou · 主业之外，探索更多可能

一个关于副业探索、内容经营与个人成长的个人网站。采用选定的「极简杂志」设计：米白纸色、黑白建筑摄影、朱红点缀与宋体标题。

## 页面与功能

- 首页：主题介绍、最新手记、三个探索方向、个人介绍、清单下载。
- 文章目录：按分类筛选、关键词搜索、筛选状态保留在 URL。
- 文章详情：六篇完整方法型文章、独立分享链接、无效链接提示。
- 手机、平板与桌面布局；键盘焦点、跳过导航、减少动态效果偏好。

文章是建站时编写的方法型初始内容，不代表站主的真实副业经历或收益记录；发布时间为初始内容编排日期。发布真实经历时，可在 `content.js` 中替换。

## 本地预览

无需安装依赖，无需编译。使用任意静态 HTTP 服务，例如：

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

浏览器打开 <http://127.0.0.1:4173>。停止预览时按 `Ctrl+C`。

## 编辑内容

- `content.js`：文章标题、分类、日期、摘要及完整正文。文章 `id` 用于稳定链接，发布后尽量保留。
- `index.html`：首页介绍、探索方向、关于与社交链接。
- `styles.css`：颜色、字体与响应式排版。
- `resources/side-hustle-checklist.md`：可下载的副业验证清单。
- `assets/architecture.png`：网站使用的 AI 生成黑白建筑图片。
- `designs/`：最初五款设计图及生成提示词。最终选择第 1 款，并将主题改为副业。

所有资源使用相对路径，支持 GitHub Pages 项目站点 `/BlogPage/`。新增文章时沿用现有结构；段落内容会转义后展示，不需要手写 HTML。

## GitHub Pages

仓库：<https://github.com/kingslou/BlogPage>

在仓库 **Settings → Pages → Build and deployment** 中选择 **Deploy from a branch**，分支选 `main`，目录选 `/ (root)`。`.nojekyll` 让页面按静态资源直接托管。

启用后预期地址：<https://kingslou.github.io/BlogPage/>。是否已经上线以 GitHub Pages 的部署状态为准。

本项目不包含表单后端或访问统计。联系入口指向站主 GitHub；清单可直接下载。

## 素材说明

五款设计图与网站建筑图片均使用内置 image_gen 生成。建筑图片属于概念场景，不指代真实地点。生成提示词见 `designs/README.md`。
