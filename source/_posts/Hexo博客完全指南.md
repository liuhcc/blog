---
title: Hexo博客完全指南：从零搭建到深度定制
date: 2026-06-02 18:00:00
description: '从零搭建并深度定制 Hexo 技术博客，涵盖 GitHub Pages 部署、搜索与日常写作流程。'
categories: Hexo
tags:
  - Hexo
  - GitHub Pages
  - 教程
  - 搜索
---

# Hexo博客完全指南：从零搭建到深度定制

> 本文以本项目为实例，完整记录基于 Hexo 7.3 + GitHub Pages 搭建个人技术博客的全过程，包括环境搭建、项目结构、主题定制、搜索集成、自动化部署，以及日常写作发布流程。

---

## 第一部分：从零搭建博客

### 1.1 前置环境

| 工具 | 版本 | 验证命令 |
|------|------|----------|
| Node.js | ≥14.x | `node -v` |
| Git | ≥2.x | `git --version` |
| npm | 自带 | `npm -v` |

### 1.2 安装 Hexo CLI

```bash
npm install -g hexo-cli
```

验证安装：

```bash
hexo version
```

### 1.3 初始化项目

```bash
# 创建博客项目
hexo init blog
cd blog

# 如果下载慢，切换国内镜像
npm config set registry https://registry.npmmirror.com

# 安装依赖
npm install
```

### 1.4 本地预览

```bash
npx hexo server -p 5000
```

浏览器打开 `http://localhost:5000`，此时能看到默认的 Hello World 页面。

### 1.5 安装必需插件

```bash
# Git 部署插件（使用 GitHub Actions 则不需要）
npm install hexo-deployer-git --save

# 本地搜索插件（必备）
npm install hexo-generator-searchdb --save
```

安装后 `package.json` 的依赖如下：

```json
{
  "dependencies": {
    "hexo": "^7.0.0",
    "hexo-deployer-git": "^4.0.0",
    "hexo-generator-archive": "^2.0.0",
    "hexo-generator-category": "^2.0.0",
    "hexo-generator-index": "^3.0.0",
    "hexo-generator-searchdb": "^1.5.0",
    "hexo-generator-tag": "^2.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^6.0.0",
    "hexo-renderer-stylus": "^3.0.0",
    "hexo-server": "^3.0.0",
    "hexo-theme-landscape": "^1.0.0"
  }
}
```

各插件作用：

| 插件 | 作用 |
|------|------|
| `hexo-server` | 本地开发服务器（`hexo server`） |
| `hexo-generator-index` | 生成首页文章列表 |
| `hexo-generator-archive` | 生成归档页面 |
| `hexo-generator-category` | 生成分类页面 |
| `hexo-generator-tag` | 生成标签页面 |
| `hexo-generator-searchdb` | 生成 search.json 搜索索引 |
| `hexo-renderer-ejs` | 渲染 EJS 模板 |
| `hexo-renderer-marked` | 将 Markdown 转为 HTML |
| `hexo-renderer-stylus` | 将 Stylus 编译为 CSS |
| `hexo-deployer-git` | 一键部署到 GitHub Pages |

### 1.6 配置 _config.yml

这是博客的**主配置文件**，控制站点元信息、URL、插件和部署行为。

```yaml
# ========== 站点信息 ==========
title: liuhcc's blog              # 浏览器标签栏显示的标题
subtitle: '技术分享与随笔'         # 首页副标题
description: '记录学习与思考'      # SEO 描述
author: liuhcc                    # 作者名
language: zh-CN                   # 界面语言（中文）
timezone: 'Asia/Shanghai'         # 时区

# ========== URL 配置 ==========
url: https://liuhcc.github.io/blog  # 部署后的线上地址
root: /blog/                        # 资源路径前缀（项目站点必须有）
permalink: :year/:month/:day/:title/ # 文章 URL 格式

# ========== 目录配置 ==========
source_dir: source      # 源文件目录
public_dir: public      # 生成文件目录
tag_dir: tags           # 标签页目录名
archive_dir: archives   # 归档页目录名
category_dir: categories # 分类页目录名

# ========== 文章配置 ==========
new_post_name: :title.md   # 新文章的默认文件名
default_layout: post       # 新文章的默认布局
external_link:
  enable: true             # 外部链接在新标签页打开

# ========== 首页配置 ==========
index_generator:
  path: ''
  per_page: 10            # 每页显示 10 篇文章
  order_by: -date         # 按日期降序排列

# ========== 代码高亮 ==========
syntax_highlighter: highlight.js
highlight:
  line_number: true       # 显示行号
  auto_detect: false
  wrap: true

# ========== 日期格式 ==========
date_format: YYYY-MM-DD
time_format: HH:mm:ss

# ========== 分页 ==========
per_page: 10              # 每页 10 篇文章
pagination_dir: page      # 分页路径 /page/2/

# ========== 搜索 ==========
search:
  path: search.json       # 搜索索引文件
  field: post             # 只搜索文章
  content: true           # 包含正文内容

# ========== 主题 ==========
theme: landscape          # 使用的主题名

# ========== 部署 ==========
deploy:
  type: git
  repo: https://github.com/liuhcc/blog.git
  branch: main
```

### 1.7 配置主题

主题配置文件位于 `themes/landscape/_config.yml`，控制导航菜单、侧边栏挂件等。

```yaml
# 导航菜单
menu:
  Home: /
  Archives: /archives

# RSS 订阅
rss: /atom.xml

# 社交链接（图标显示在右上角）
links:
#  github: https://github.com/your_github_account

# 侧边栏位置：left / right / bottom / false
sidebar: right

# 侧边栏挂件列表（按顺序排列）
widgets:
- category_tree     # ⭐ 自定义：可展开分类树
- category          # 平铺分类列表
- tag               # 标签列表
- tagcloud          # 标签云
- archive           # 归档
- recent_posts      # 最新文章

# 挂件行为
archive_type: 'monthly'       # 归档按月分组
show_count: false             # 不显示文章数量
recent_posts_limits: 5        # 最新文章显示 5 篇

# 图片灯箱
fancybox: true

# favicon 路径
favicon: /favicon.png
```

---

## 第二部分：项目结构详解

### 2.1 顶层目录

```
D:\Code\blog\
├── _config.yml              ← 🔧 主配置文件
├── package.json             ← Node.js 依赖声明
├── scaffolds/               ← 文章模板
├── source/                  ← 📝 所有内容源文件
├── themes/                  ← 🎨 主题
├── public/                  ← 📦 生成的静态网站（hexo generate 产生）
├── node_modules/            ← 依赖包（npm install 产生）
└── .deploy_git/             ← 部署用临时仓库（hexo deploy 产生）
```

### 2.2 source/ — 内容目录

```
source/
├── _posts/                  ← 所有博客文章
│   ├── hello-world.md       ← 文章 1
│   ├── AI学习笔记.md         ← 文章 2
│   ├── Java开发技巧.md       ← 文章 3
│   └── Hexo博客搭建完整流程.md ← 文章 4
└── about/                   ← 独立页面
    └── index.md             ← "关于我"页面
```

- `_posts/` 下的每个 `.md` 文件即为一篇文章，文件名不影响 URL
- 独立页面（如 `about/`）不会出现在首页文章列表中

### 2.3 themes/landscape/ — 主题目录

```
themes/landscape/
├── _config.yml                  ← 主题配置
├── languages/                   ← 国际化文本
│   └── zh-CN.yml               ← 中文翻译
├── layout/                      ← EJS 模板
│   ├── layout.ejs               ← 全局骨架（<html> → </html>）
│   ├── index.ejs                ← 首页
│   ├── post.ejs                 ← 文章详情页
│   ├── page.ejs                 ← 独立页面
│   ├── archive.ejs              ← 归档页
│   ├── category.ejs             ← 分类页
│   ├── tag.ejs                  ← 标签页
│   ├── _partial/                ← 公共组件
│   │   ├── head.ejs             ← <head> 区域
│   │   ├── header.ejs           ← 顶部导航栏
│   │   ├── sidebar.ejs          ← 侧边栏容器（遍历 widgets）
│   │   ├── footer.ejs           ← 页脚
│   │   ├── after-footer.ejs     ← </body> 前加载的脚本
│   │   ├── mobile-nav.ejs       ← 移动端导航
│   │   ├── search-modal.ejs     ← ⭐ 自定义：搜索弹窗
│   │   └── ...
│   └── _widget/                 ← 侧边栏挂件
│       ├── category_tree.ejs    ← ⭐ 自定义：可展开分类树
│       ├── category.ejs         ← 平铺分类列表
│       ├── tag.ejs              ← 标签列表
│       ├── tagcloud.ejs         ← 标签云
│       ├── archive.ejs          ← 归档
│       └── recent_posts.ejs     ← 最新文章
└── source/                      ← 主题静态资源
    ├── css/                     ← Stylus 样式
    │   ├── style.styl           ← 主样式（引入各 _partial/）
    │   ├── _variables.styl      ← 颜色、字体等变量
    │   ├── _partial/            ← 各组件样式
    │   │   ├── sidebar.styl
    │   │   ├── header.styl
    │   │   ├── article.styl
    │   │   ├── category-tree.styl ← ⭐ 自定义：分类树样式
    │   │   └── search.styl      ← ⭐ 自定义：搜索弹窗样式
    │   └── ...
    └── js/
        ├── jquery-3.6.4.min.js  ← jQuery 库
        └── script.js            ← 全局脚本（⭐ 含搜索和分类树逻辑）
```

### 2.4 核心文件职责速查

| 文件 | 职责 | 你会改吗 |
|------|------|----------|
| `_config.yml` | 站点元信息、插件、部署 | ✅ 初次配置后基本不改 |
| `themes/landscape/_config.yml` | 导航菜单、侧边栏挂件 | ✅ 偶尔改 |
| `themes/landscape/layout/_widget/*.ejs` | 侧边栏挂件 HTML 结构 | ✅ 自定义挂件时创建 |
| `themes/landscape/layout/_partial/*.ejs` | 页面公共组件 | ✅ 改搜索弹窗等 |
| `themes/landscape/source/css/_partial/*.styl` | 各组件样式 | ✅ 调整样式 |
| `themes/landscape/source/js/script.js` | 交互逻辑 | ✅ 添加交互 |
| `source/_posts/*.md` | 你的文章 | ✅ 每次写文章 |

### 2.5 页面渲染流程

以首页为例，Hexo 的渲染过程：

```
1. 用户访问 /
2. Hexo 渲染 index.ejs
3. index.ejs 使用 layout.ejs 骨架
4. layout.ejs 引入 _partial/head.ejs（页头）
5. layout.ejs 引入 _partial/header.ejs（导航栏）
6. layout.ejs 渲染 <%- body %>（index.ejs 的正文内容 = 文章列表）
7. layout.ejs 引入 _partial/sidebar.ejs（侧边栏）
   └── sidebar.ejs 遍历 theme.widgets
       └── 依次渲染每个 _widget/xxx.ejs
8. layout.ejs 引入 _partial/footer.ejs（页脚）
9. layout.ejs 引入 _partial/after-footer.ejs（脚本加载）
   └── 引入 search-modal.ejs（搜索弹窗 HTML）
```

---

## 第三部分：代码层次使用指南

### 3.1 主题定制原则

**核心原则：不要直接改 `node_modules/`**

```bash
# 正确做法：先复制到 themes/ 再改
cp -r node_modules/hexo-theme-landscape themes/landscape
```

`node_modules/` 在 `npm install` 时会被覆盖，你的修改会丢失。`themes/` 下的文件 Hexo 优先读取，不会被覆盖。

### 3.2 EJS 模板常用语法

Hexo 使用 EJS（Embedded JavaScript）作为模板引擎。以下是常用语法：

**输出变量**：

```ejs
<%= config.title %>           ← 输出并转义 HTML
<%- body %>                   ← 输出原始 HTML（不转义）
```

**条件判断**：

```ejs
<% if (site.categories.length){ %>
  有分类
<% } else { %>
  无分类
<% } %>
```

**循环**：

```ejs
<% site.categories.each(function(category){ %>
  <a href="<%- url_for(category.path) %>"><%= category.name %></a>
<% }) %>
```

**引入其他模板**：

```ejs
<%- partial('_partial/head') %>         ← 引入偏好的模板
<%- partial('_widget/category_tree') %> ← 引入挂件
```

**全局变量速查**：

| 变量 | 说明 | 示例 |
|------|------|------|
| `config.title` | 站点标题 | `liuhcc's blog` |
| `config.url` | 站点 URL | `https://liuhcc.github.io/blog` |
| `config.root` | 资源根路径 | `/blog/` |
| `theme.sidebar` | 侧边栏位置 | `right` |
| `theme.widgets` | 挂件列表 | `['category_tree','category',...]` |
| `site.posts` | 所有文章集合 | `.each()`, `.sort()` |
| `site.categories` | 所有分类集合 | `.each()`, `.name`, `.posts` |
| `site.tags` | 所有标签集合 | `.each()`, `.name` |
| `page.title` | 当前页面标题 | `文章标题` |
| `page.date` | 当前文章日期 | `2026-06-02` |
| `page.categories` | 当前文章分类 | `.each()` |
| `page.tags` | 当前文章标签 | `.each()` |
| `is_archive()` | 是否归档页 | `true/false` |
| `is_category()` | 是否分类页 | `true/false` |
| `is_tag()` | 是否标签页 | `true/false` |
| `is_post()` | 是否文章页 | `true/false` |
| `is_home()` | 是否首页 | `true/false` |
| `__('categories')` | 国际化文本 | `分类`（中文） |
| `url_for(path)` | 生成完整 URL | `url_for('about/') → /blog/about/` |

### 3.3 创建侧边栏挂件

以"可展开分类树"为例，完整步骤：

**Step 1：创建 EJS 模板**

`themes/landscape/layout/_widget/category_tree.ejs`：

```ejs
<% if (site.categories.length){ %>
  <div class="widget-wrap">
    <h3 class="widget-title"><%= __('categories') %></h3>
    <div class="widget">
      <ul class="category-tree">
        <% site.categories.each(function(category){ %>
          <li class="category-node">
            <span class="category-toggle"></span>
            <a class="category-name" href="<%- url_for(category.path) %>">
              <%= category.name %>
            </a>
            <span class="category-count"><%= category.posts.length %></span>
            <ul class="category-posts">
              <% category.posts.each(function(post){ %>
                <li class="post-leaf">
                  <a href="<%- url_for(post.path) %>" title="<%= post.title %>">
                    <%= post.title %>
                  </a>
                </li>
              <% }) %>
            </ul>
          </li>
        <% }) %>
      </ul>
    </div>
  </div>
<% } %>
```

关键点：
- `site.categories` — 自动包含所有分类
- `category.posts` — 每个分类下的文章
- `url_for()` — 自动添加 `/blog/` 前缀
- `__('categories')` — 自动显示 "分类"

**Step 2：添加样式**

`themes/landscape/source/css/_partial/category-tree.styl`：

```stylus
// 树根容器
.category-tree
  list-style: none
  margin: 0
  padding: 0

// 折叠箭头
.category-toggle
  display: inline-block
  width: 16px
  cursor: pointer
  transition: transform 0.2s ease
  &:before
    content: "\f0da"          // Font Awesome 右箭头图标
    font-family: font-icon
  .open > &
    transform: rotate(90deg)  // 展开时箭头旋转 90°

// 文章子列表，默认隐藏
.category-posts
  display: none
  margin: 2px 0 2px 20px
  .open > &
    display: block

// 文章链接
.post-leaf a
  color: color-sidebar-text   // 使用主题变量
  &:hover
    color: color-link
```

**Step 3：在 style.styl 中引入**

```stylus
@import "_partial/category-tree"
```

**Step 4：添加交互逻辑**

`themes/landscape/source/js/script.js`：

```javascript
// Category tree toggle
$('.category-toggle').on('click', function(e){
  e.preventDefault();
  var $node = $(this).parent('.category-node');
  var $posts = $node.children('.category-posts');
  if ($node.hasClass('open')) {
    $posts.slideUp(150);       // 收起动画
    $node.removeClass('open');
  } else {
    $posts.slideDown(150);     // 展开动画
    $node.addClass('open');
  }
});
```

**Step 5：注册挂件**

`themes/landscape/_config.yml`：

```yaml
widgets:
- category_tree    # ← 新增
- category
- ...
```

挂件按列表顺序从上到下排列。

### 3.4 添加本地搜索

**原理**：`hexo-generator-searchdb` 在构建时生成 `search.json`（包含所有文章的标题、URL、正文），前端 JS 加载这个 JSON 做实时过滤。

**Step 1：创建搜索弹窗模板**

`themes/landscape/layout/_partial/search-modal.ejs`：

```ejs
<div id="search-overlay" class="search-overlay"
     data-search-url="<%- url_for('search.json') %>">
  <div class="search-modal">
    <div class="search-header">
      <input type="text" id="search-input" class="search-input"
             placeholder="<%= __('search') %>..." autocomplete="off">
      <span id="search-close" class="search-close">&times;</span>
    </div>
    <div id="search-results" class="search-results"
         data-placeholder="<%= __('search') %>">
      <div class="search-hint"><%= __('search') %></div>
    </div>
  </div>
</div>
```

注意 `data-search-url="<%- url_for('search.json') %>"` — 用 EJS 动态生成路径，自动适配 `/blog/`。

**Step 2：在 after-footer.ejs 中引入**

```ejs
<%- partial('_partial/search-modal') %>
```

**Step 3：移除旧的 Google 搜索**

在 `header.ejs` 中删除 `<div id="search-form-wrap">`，只保留搜索按钮图标。

**Step 4：搜索 JS 逻辑**

核心逻辑（完整代码在 `script.js` 中）：

```javascript
// 加载搜索索引
var loadSearchData = function() {
  $.getJSON($overlay.data('search-url'), function(data) {
    searchData = data;
  });
};

// 实时过滤：标题或正文匹配
var doSearch = function(query) {
  var results = searchData.filter(function(item) {
    return item.title.includes(query) || item.content.includes(query);
  });
  renderResults(results, query);
};

// 键盘导航
$(document).on('keydown', function(e){
  if (e.key === 'Escape')        关闭弹窗;
  if (e.key === 'ArrowDown')     下一条;
  if (e.key === 'ArrowUp')       上一条;
  if (e.key === 'Enter')         跳转到选中文章;
});
```

### 3.5 Stylus 样式速查

Hexo landscape 使用 Stylus（缩进语法的 CSS 预处理器）。

常用主题变量（定义在 `_variables.styl`）：

```stylus
color-default = #555           // 正文颜色
color-grey = #999              // 灰色（次要文字）
color-border = #ddd            // 边框颜色
color-link = #258fb8           // 链接颜色
color-background = #eee        // 页面背景
color-sidebar-text = #777      // 侧边栏文字
color-widget-background = #ddd // 挂件背景
color-widget-border = #ccc     // 挂件边框
font-sans = -apple-system, ... // 无衬线字体
font-size = 14px
line-height = 1.6em
```

Stylus 语法特点：
- 无需花括号和分号
- 缩进表示嵌套
- `&` 引用父选择器
- 变量直接使用（无需 `$` 前缀）

---

## 第四部分：文章层次使用指南

### 4.1 创建新文章

```bash
npx hexo new "文章标题"
```

这会在 `source/_posts/` 下创建 `文章标题.md`，内容基于 `scaffolds/post.md` 模板。

### 4.2 Front Matter（文章元信息）

每篇文章开头必须有一段 `---` 包裹的 YAML 配置：

```markdown
---
title: 文章标题              ← 必填：文章标题
date: 2026-06-02 18:00:00   ← 必填：发布日期（可设未来日期）
categories: Hexo            ← 分类（一个文章通常一个分类）
tags:                       ← 标签（可多个）
  - Hexo
  - 教程
  - GitHub Pages
---

正文内容开始...
```

**分类 vs 标签**：

| 维度 | 分类（Category） | 标签（Tag） |
|------|-----------------|------------|
| 数量 | 通常 1 个 | 可多个 |
| 含义 | 文章归属大类 | 文章关键词 |
| URL | `/categories/Hexo/` | `/tags/教程/` |
| 层级 | 可嵌套（Hexo/教程） | 无层级 |

### 4.3 Markdown 写作

部分常用语法：

```markdown
## 二级标题

### 三级标题

**加粗文字**

`行内代码`

[链接文字](https://example.com)

![图片描述](图片URL)

> 引用文字

- 无序列表
- 无序列表

1. 有序列表
2. 有序列表

---

三个以上短横线形成分割线
```

代码块：

````markdown
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

```bash
npm install hexo --save
```

```yaml
key: value
```
````

表格：

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 值1 | 值2 | 值3 |
```

### 4.4 创建独立页面

```bash
npx hexo new page "about"
```

会创建 `source/about/index.md`，访问地址为 `/about/`。

独立页面不在首页文章列表中显示，适合"关于我"、"友情链接"等。

### 4.5 草稿机制

```bash
npx hexo new draft "草稿标题"
```

草稿存放在 `source/_drafts/`，不会发布。

```bash
# 本地预览包含草稿
npx hexo server --draft

# 发布草稿（移到 _posts/）
npx hexo publish "草稿标题"
```

### 4.6 文章 URL 计算

由 `_config.yml` 中的 `permalink` 决定：

```yaml
permalink: :year/:month/:day/:title/
```

例如 `title: Hexo博客完全指南` + `date: 2026-06-02`：

```
https://liuhcc.github.io/blog/2026/06/02/Hexo博客完全指南/
```

### 4.7 分类和标签如何生效

Hexo 在生成时自动扫描所有文章的 Front Matter：

1. 收集所有 `categories` → 生成 `/categories/XXX/` 页面
2. 收集所有 `tags` → 生成 `/tags/XXX/` 页面
3. 按日期生成 `/archives/` 归档页面

**不需要手动创建分类页或标签页**，全部自动。

### 4.8 文章模板定制

编辑 `scaffolds/post.md` 可以修改新文章的默认结构：

```markdown
---
title: {{ title }}
date: {{ date }}
categories:
tags:
---

## 前言

## 正文

## 总结
```

---

## 第五部分：推送新博客的标准流程

### 5.1 分支模型

| 分支 | 存放内容 | 谁写入 |
|------|---------|--------|
| `source` | Markdown 源码、配置、主题 | 你 `git push` |
| `main` | 生成的 HTML 网页 | GitHub Actions 自动写入 |

### 5.2 完整步骤

```bash
# 1. 进入项目目录
cd D:/Code/blog

# 2. 创建新文章
npx hexo new "文章标题"

# 3. 编辑文章
# 打开 source/_posts/文章标题.md
# 填写内容，设置 categories 和 tags

# 4. 本地预览（验证排版和链接）
npx hexo server -p 5000
# 浏览器打开 http://localhost:5000

# 5. 确认无误后，提交并推送
git add -A
git commit -m "新增文章：文章标题"
git push origin source
```

推送后 GitHub Actions 自动执行构建和部署，约 1 分钟后网站更新。

### 5.3 部署原理

```
git push source → GitHub Actions 触发 → npm install → npx hexo generate → 推送到 main 分支 → GitHub Pages 生效
```

`.github/workflows/deploy.yml` 文件定义了这条流水线，不需要本地运行 `hexo deploy`。

### 5.4 常用命令速查

```bash
# 写作
npx hexo new "标题"          # 创建文章
npx hexo new page "页面名"   # 创建独立页面
npx hexo new draft "标题"    # 创建草稿
npx hexo publish "标题"      # 发布草稿

# 预览
npx hexo server -p 5000      # 本地预览
npx hexo generate            # 生成静态文件（不部署）
npx hexo clean               # 清理缓存和 public/

# 发布
git add -A                   # 暂存所有改动
git commit -m "描述"         # 提交
git push origin source       # 推送（触发自动部署）
```

### 5.5 更新已有文章

```bash
# 1. 直接编辑 source/_posts/文章.md
# 2. 本地预览确认
npx hexo server -p 5000
# 3. 提交推送
git add -A && git commit -m "更新文章：xxx" && git push origin source
```

### 5.6 修改配置后如何生效

```bash
# 主题/配置有改动时
npx hexo clean               # 清理缓存
npx hexo server -p 5000      # 本地预览
# 确认无误
git add -A && git commit -m "更新配置" && git push origin source
```

### 5.7 首次部署注意事项

1. 在 GitHub 仓库 `Settings → Pages` 中开启 Pages，Source 设为 `main` 分支
2. 首次推送需要 `git push -u origin source`
3. 如果 GitHub 连接超时，需要配置代理或 VPN

---

## 第六部分：架构设计说明

### 6.1 为什么用项目站点而非用户站点

| 模式 | 仓库名 | 访问地址 | 特点 |
|------|--------|----------|------|
| 用户站点 | `liuhcc.github.io` | `liuhcc.github.io` | 整个域名只给一个项目 |
| 项目站点 | `blog` | `liuhcc.github.io/blog` | 根域名留给其他网页 |

选项目站点是为了将来可以在根域名放个人主页、作品集等。

### 6.2 关键配置关联

```
_config.yml 中的三要素：
┌─────────────────────────────────────────────┐
│ url:   https://liuhcc.github.io/blog        │  → 站点根地址
│ root:  /blog/                               │  → CSS/JS 的相对路径前缀
│ deploy.repo: https://github.com/liuhcc/...  │  → 部署目标
└─────────────────────────────────────────────┘
```

三者保持一致才能保证资源正确加载、链接正确跳转。

### 6.3 数据流总览

```
source/_posts/*.md  (你写的 Markdown)
    │
    ▼  git push origin source
    │
GitHub 仓库 source 分支
    │
    ▼  GitHub Actions 自动触发
    │   (.github/workflows/deploy.yml)
    │   ├─ npm install
    │   ├─ hexo generate (hexo-renderer-marked 解析)
    │   └─ 部署 public/ 到 main 分支
    │
GitHub 仓库 main 分支 (纯 HTML)
    │
    ▼  GitHub Pages 服务
    │
https://liuhcc.github.io/blog/

同时（hexo generate 阶段）：
    │
    ▼  hexo-generator-searchdb
    │
search.json (搜索索引)
    │
    ▼  前端 JS 加载
    │
搜索弹窗 ← 用户输入 → 实时过滤
```

---

## 附录：项目完整文件清单

```
D:\Code\blog\
├── _config.yml                           # 主配置
├── package.json                          # 依赖
├── scaffolds/
│   ├── draft.md                          # 草稿模板
│   ├── page.md                           # 页面模板
│   └── post.md                           # 文章模板
├── source/
│   ├── _posts/
│   │   ├── hello-world.md
│   │   ├── AI学习笔记.md
│   │   ├── Java开发技巧.md
│   │   └── Hexo博客完全指南.md
│   └── about/
│       └── index.md
├── themes/
│   └── landscape/
│       ├── _config.yml                   # 主题配置
│       ├── layout/
│       │   ├── layout.ejs                # 全局骨架
│       │   ├── index.ejs                 # 首页
│       │   ├── post.ejs                  # 文章页
│       │   ├── page.ejs                  # 独立页面
│       │   ├── archive.ejs               # 归档页
│       │   ├── category.ejs              # 分类页
│       │   ├── tag.ejs                   # 标签页
│       │   ├── _partial/
│       │   │   ├── head.ejs
│       │   │   ├── header.ejs
│       │   │   ├── sidebar.ejs
│       │   │   ├── footer.ejs
│       │   │   ├── after-footer.ejs
│       │   │   ├── mobile-nav.ejs
│       │   │   └── search-modal.ejs      # ⭐ 搜索弹窗
│       │   └── _widget/
│       │       ├── category_tree.ejs     # ⭐ 分类树
│       │       ├── category.ejs
│       │       ├── tag.ejs
│       │       ├── tagcloud.ejs
│       │       ├── archive.ejs
│       │       └── recent_posts.ejs
│       └── source/
│           ├── css/
│           │   ├── style.styl            # 主样式入口
│           │   ├── _variables.styl       # 变量定义
│           │   └── _partial/
│           │       ├── sidebar.styl
│           │       ├── header.styl
│           │       ├── article.styl
│           │       ├── category-tree.styl # ⭐ 分类树样式
│           │       └── search.styl       # ⭐ 搜索样式
│           └── js/
│               ├── jquery-3.6.4.min.js
│               └── script.js             # ⭐ 搜索 + 分类树逻辑
├── public/                               # 生成文件（不提交）
└── node_modules/                         # 依赖（不提交）
```

⭐ 标记为自定义新增文件。
