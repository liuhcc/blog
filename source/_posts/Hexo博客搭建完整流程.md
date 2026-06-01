---
title: Hexo博客搭建完整流程
date: 2026-06-02 15:00:00
categories: Hexo
tags:
  - Hexo
  - GitHub Pages
  - 教程
  - 搜索
---

# Hexo + GitHub Pages 静态博客搭建完整流程

## 一、最终效果

- **博客地址**：`https://liuhcc.github.io/blog`
- **写文章方式**：本地写 Markdown → `hexo deploy` 一键部署
- **成本**：0元，不需要域名和服务器
- **架构**：项目站点模式（根域名留给其他网页）

---

## 二、项目位置与结构

### 位置

```
D:\Code\blog\
```

### 完整文件结构

```
blog/
├── _config.yml              ← 博客主配置（标题、URL、语言、部署等）
├── package.json             ← Node.js 依赖声明
├── scaffolds/               ← 文章模板（生成新文章时的默认结构）
│   ├── draft.md
│   ├── page.md
│   └── post.md
├── source/                  ← 所有内容放这里
│   ├── _posts/              ← Markdown 文章
│   │   ├── hello-world.md
│   │   ├── AI学习笔记.md
│   │   └── Java开发技巧.md
│   └── about/               ← 独立页面 "关于我"
│       └── index.md
├── themes/                  ← 自定义主题（从 node_modules 复制后修改）
│   └── landscape/
│       ├── _config.yml       ← 主题配置
│       ├── layout/           ← EJS 模板
│       │   ├── _partial/     ← 公共组件（head、header、sidebar、footer等）
│       │   └── _widget/      ← 侧边栏挂件
│       └── source/           ← 主题静态资源
│           ├── css/          ← Stylus 样式（含自定义的 _partial/）
│           └── js/           ← JavaScript
├── public/                  ← 生成的HTML（hexo generate 的输出）
├── node_modules/            ← 依赖包（不提交到Git）
└── .deploy_git/             ← 部署用临时git仓库
```

---

## 三、核心原理：项目站点模式

### 3.1 架构选择

最初方案是把博客部署在用户站点 `liuhcc.github.io`，但这样整个域名只给博客用。为了后续能写其他网页，改用了**项目站点**模式：

| 仓库名 | 访问地址 | 用途 |
|--------|----------|------|
| `liuhcc.github.io` | `liuhcc.github.io` | 个人主页 / 其他网页 |
| `blog` | `liuhcc.github.io/blog` | 博客 |

### 3.2 部署流程

```
本地写文章 → hexo deploy → 推送到 blog 仓库 main 分支 → GitHub Pages 自动生效
```

**具体来说**：`hexo-deployer-git` 插件负责：
1. `hexo generate` 生成静态 HTML 到 `public/` 目录
2. 将 `public/` 推送到 GitHub 仓库的 `main` 分支
3. GitHub Pages 从 `main` 分支读取 HTML，网站就更新了

### 3.3 关键配置

**_config.yml 中的三个核心配置**：

```yaml
url: https://liuhcc.github.io/blog    # 网站URL，含子目录
root: /blog/                           # 资源根路径，与子目录一致
deploy:
  type: git
  repo: https://github.com/liuhcc/blog.git  # 项目仓库
  branch: main
```

### 3.4 日常操作

```bash
# 写文章
npx hexo new "文章标题"
# 编辑 source/_posts/文章标题.md

# 本地预览
npx hexo server -p 5000

# 部署上线
npx hexo deploy
```

`hexo deploy` 会自动生成并推送到 GitHub，约1分钟后刷新网站即可看到新文章。

---

## 四、如何新增不同栏目

### 4.1 栏目的概念

Hexo 有三种内容组织方式：

| 类型 | 说明 | 示例 | 生成位置 |
|------|------|------|----------|
| **Categories（分类）** | 文章的归属大类，一个文章通常属于1个分类 | AI、Java、随笔 | /categories/AI/ |
| **Tags（标签）** | 文章的关键词，一个文章可以有多个标签 | Hexo、教程、学习笔记 | /tags/Hexo/ |
| **Pages（独立页面）** | 不按时间排列的独立页面 | 关于我、友情链接 | /about/ |

### 4.2 新建不同分类的文章

在文章的 Front Matter（开头的 `---` 区域）中指定 category：

```markdown
---
title: 我的文章标题
date: 2026-06-01
categories: AI          # ← 指定分类
tags:
  - 深度学习
  - Python
---
文章内容...
```

Hexo 会自动生成 `/categories/AI/` 页面，列出所有属于 AI 分类的文章。

**目前已有分类**：
- 随笔（hello-world）
- AI（AI学习笔记）
- Java（Java开发技巧）

### 4.3 新建标签

```markdown
---
title: 我的文章
categories: Java
tags:                    # ← 多个标签用列表
  - Spring
  - 微服务
  - 教程
---
```

Hexo 自动生成 `/tags/Spring/`、`/tags/微服务/`、`/tags/教程/` 页面。

### 4.4 新建独立页面（如"关于我"）

```bash
hexo --cwd /d/Code/blog new page "friends"
```

这会在 `source/friends/index.md` 创建一个新页面，访问地址为 `/friends/`。

然后在导航菜单中添加链接（见 4.5）。

### 4.5 修改导航菜单

编辑 **`_config.landscape.yml`** 中的 `menu` 部分：

```yaml
menu:
  Home: /
  Archives: /archives
  Categories: /categories    # ← 新增分类页
  Tags: /tags                # ← 新增标签页
  About: /about              # ← 新增关于页
  Friends: /friends          # ← 新增友情链接页
```

### 4.6 新建分类的整体步骤总结

```bash
# 1. 创建文章，指定新分类
hexo --cwd /d/Code/blog new "投资理财笔记"

# 2. 编辑文章，把 categories 改成 "投资理财"
#    编辑 source/_posts/投资理财笔记.md

# 3. 如果要在导航栏显示这个分类，编辑 _config.landscape.yml
#    在 menu 下添加: 理财: /categories/投资理财

# 4. 提交推送
cd /d/Code/blog && git add -A && git commit -m "新增投资理财分类"
git push origin source
```

---

## 五、主题定制：可展开分类树

### 5.1 为什么要自定义主题

Hexo 默认主题 landscape 的侧边栏只有平铺的分类/标签列表，文章多了之后不便于快速定位。我们添加了一个**可展开的目录树**组件，点击分类箭头即可展开该分类下的文章列表。

### 5.2 主题定制原则

**不要直接修改 `node_modules/` 中的主题**，因为 `npm install` 会覆盖你的修改。正确做法是：

```bash
cp -r node_modules/hexo-theme-landscape themes/landscape
```

之后所有修改都在 `themes/landscape/` 下进行。Hexo 优先使用 `themes/` 下的主题。

### 5.3 新建侧边栏挂件

**创建 `themes/landscape/layout/_widget/category_tree.ejs`**：

```ejs
<% if (site.categories.length){ %>
  <div class="widget-wrap">
    <h3 class="widget-title"><%= __('categories') %></h3>
    <div class="widget">
      <ul class="category-tree">
        <% site.categories.each(function(category){ %>
          <li class="category-node">
            <span class="category-toggle"></span>
            <a class="category-name" href="<%- url_for(category.path) %>"><%= category.name %></a>
            <span class="category-count"><%= category.posts.length %></span>
            <ul class="category-posts">
              <% category.posts.each(function(post){ %>
                <li class="post-leaf">
                  <a href="<%- url_for(post.path) %>" title="<%= post.title %>"><%= post.title %></a>
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

- `site.categories` 是 Hexo 内置的分类数据
- `category.posts` 是每个分类下的文章列表
- 子 `<ul>` 默认隐藏，点击箭头后展开

### 5.4 添加样式

**新建 `themes/landscape/source/css/_partial/category-tree.styl`**：

```stylus
.category-tree
  list-style: none
  margin: 0
  padding: 0

.category-toggle
  display: inline-block
  width: 16px
  cursor: pointer
  &:before
    content: "\f0da"
    font-family: font-icon
  .open > &
    transform: rotate(90deg)

.category-posts
  display: none
  margin: 2px 0 2px 20px
  .open > &
    display: block

.post-leaf a
  color: color-sidebar-text
  &:hover
    color: color-link
```

**在 `style.styl` 末尾引入**：`@import "_partial/category-tree"`

### 5.5 添加JavaScript

**在 `themes/landscape/source/js/script.js` 末尾添加**：

```javascript
// Category tree toggle
$('.category-toggle').on('click', function(e){
  e.preventDefault();
  var $node = $(this).parent('.category-node');
  var $posts = $node.children('.category-posts');
  if ($node.hasClass('open')) {
    $posts.slideUp(150);
    $node.removeClass('open');
  } else {
    $posts.slideDown(150);
    $node.addClass('open');
  }
});
```

### 5.6 注册挂件

**在 `themes/landscape/_config.yml` 的 widgets 列表最前面添加**：

```yaml
widgets:
- category_tree    # ← 新增：可展开分类树
- category         # 原有：平铺分类列表
- tag
- tagcloud
- archive
- recent_posts
```

重启 `hexo server` 即可在侧边栏看到可展开的分类树。

---

## 六、本地搜索

### 6.1 为什么做本地搜索

原主题的搜索是 Google 站内搜索，需要联网且只能在部署后使用。我们用 `hexo-generator-searchdb` 实现了**纯前端本地搜索**，本地预览和线上都能用。

### 6.2 安装与配置

```bash
npm install hexo-generator-searchdb --save
```

**在 `_config.yml` 中添加**：

```yaml
search:
  path: search.json    # 生成的搜索索引文件
  field: post          # 只索引文章
  content: true        # 包含文章正文内容
```

### 6.3 添加搜索弹窗

**新建 `themes/landscape/layout/_partial/search-modal.ejs`**：

```ejs
<div id="search-overlay" class="search-overlay" data-search-url="<%- url_for('search.json') %>">
  <div class="search-modal">
    <div class="search-header">
      <input type="text" id="search-input" class="search-input" placeholder="搜索..." autocomplete="off">
      <span id="search-close" class="search-close">&times;</span>
    </div>
    <div id="search-results" class="search-results" data-placeholder="搜索">
      <div class="search-hint">搜索</div>
    </div>
  </div>
</div>
```

`data-search-url` 用 EJS 动态生成路径，自动适配 `/blog/` 子目录。

**在 `after-footer.ejs` 末尾引入**：`<%- partial('_partial/search-modal') %>`

### 6.4 修改header

**移除 `header.ejs` 中的 Google 搜索表单**（原 `<div id="search-form-wrap">`），只保留搜索按钮。点击按钮时弹出我们的搜索弹窗。

### 6.5 搜索样式

**新建 `themes/landscape/source/css/_partial/search.styl`**：

```stylus
.search-overlay
  display: none
  position: fixed
  top: 0; left: 0
  width: 100%; height: 100%
  background: rgba(0, 0, 0, 0.5)
  z-index: 9999
  justify-content: center
  padding-top: 15vh
  &.active
    display: flex

.search-modal
  background: #fff
  width: 90%
  max-width: 600px
  border-radius: 6px
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25)

.search-input
  flex: 1
  border: none
  outline: none
  font-size: 16px
  padding: 8px

.search-results
  max-height: 50vh
  overflow-y: auto

.search-result-item
  display: block
  padding: 12px 20px
  border-bottom: 1px solid #eee
  &:hover, &.active
    background: #eee

.search-highlight
  color: color-link
  font-weight: bold
```

**在 `style.styl` 中引入**：`@import "_partial/search"`

### 6.6 搜索逻辑

**在 `script.js` 中替换原有搜索代码**（核心逻辑）：

```javascript
// 加载搜索索引
$.getJSON($overlay.data('search-url'), function(data) {
  searchData = data;
});

// 实时过滤
var doSearch = function(query) {
  var results = searchData.filter(function(item) {
    return item.title.includes(query) || item.content.includes(query);
  });
  renderResults(results, query);
};

// 键盘导航
$(document).on('keydown', function(e){
  if (e.key === 'Escape')  关闭弹窗;
  if (e.key === 'ArrowDown') 下一条结果;
  if (e.key === 'ArrowUp')   上一条结果;
  if (e.key === 'Enter')     跳转到选中结果;
});
```

### 6.7 功能特点

- 支持标题和正文**全文搜索**
- 输入即时过滤，**无需按回车**
- **键盘导航**：↑↓选择，Enter跳转，Esc关闭
- **高亮匹配**关键词
- 显示文章分类和日期
- 本地和线上**都能用**

---

## 七、已完成的操作清单

### 环境
- Node.js v24.14.1
- Git 2.53.0
- hexo-cli 4.3.2

### 初始化
```bash
npm install -g hexo-cli
hexo init blog
npm config set registry https://registry.npmmirror.com
npm install
npm install hexo-deployer-git --save
npm install hexo-generator-searchdb --save
```

### 配置文件

**_config.yml（主配置）**：
- title: liuhuaicai's blog
- url: https://liuhcc.github.io/blog
- root: /blog/
- language: zh-CN
- timezone: Asia/Shanghai
- 部署目标：https://github.com/liuhcc/blog.git (main 分支)
- 搜索：search.json，包含正文内容

**主题定制（themes/landscape/）**：
- 从 node_modules 复制主题到 themes/ 后修改
- 新增可展开分类树挂件（category_tree）
- 新增本地搜索弹窗（search-modal）
- 移除 Google 搜索表单
- 导航菜单：Home、Archives、Categories、Tags、About
- 侧边栏：分类树、分类、标签、标签云、归档、最新文章
- GitHub 图标链接

### 部署方式

`npx hexo deploy` 一键生成并推送到 GitHub Pages。

---

## 八、还需要你做的操作

### 第一步：开启 GitHub Pages

在 GitHub 的 `blog` 仓库 → Settings → Pages 中，将 Source 设为 `main` 分支并保存。

### 第二步：等待生效

设置后约 1-2 分钟，博客即可通过 **https://liuhcc.github.io/blog/** 访问。

### 第三步：之后每次发文章

```bash
# 创建文章
npx hexo new "文章标题"

# 编辑 source/_posts/文章标题.md，写内容

# 本地预览（可选）
npx hexo server -p 5000
# 浏览器打开 http://localhost:5000

# 部署上线
npx hexo deploy
```

---

## 九、常见问题

**Q: 为什么 hexo 命令要加 `npx`？**
A: hexo 是项目本地依赖，用 `npx` 调用当前项目的 hexo，避免全局版本冲突。

**Q: 文章格式是什么？**
A: Markdown。开头有一段 `---` 包裹的 Front Matter（标题、日期、分类、标签），下面写正文。

**Q: 如何修改主题？**
A: 将主题从 `node_modules/` 复制到 `themes/` 后再修改。**绝对不要直接改 node_modules 里的文件**，因为 `npm install` 会覆盖。

**Q: 想换主题怎么办？**
A: 去 https://hexo.io/themes/ 选主题，clone 到 themes/ 目录，修改 `_config.yml` 中 `theme:` 字段。

**Q: 搜索不工作？**
A: 检查 `search.json` 是否生成（访问 `/blog/search.json`），确认 `_config.yml` 中 search 配置正确。

**Q: 本地 hexo 命令怎么简化？**
A: 在 `package.json` 的 scripts 中已配置：
```json
"scripts": {
  "build": "hexo generate",
  "server": "hexo server",
  "deploy": "hexo deploy"
}
```
可以直接用 `npm run server`、`npm run deploy`。
