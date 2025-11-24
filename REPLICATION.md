# Survival Race 网站复刻工作流程

本文档说明如何复刻 `https://survival-race.io/` 网站，用于学习研究目的。包括下载网站内容、本地运行以及视觉一致性验证。

## 1. 环境设置
安装项目依赖：
```bash
npm install
```

下载 Playwright Chromium 浏览器（用于截图对比）：
```bash
npx playwright install chromium
```

## 2. 同步网站内容
1. 下载原始网站 HTML：
   ```bash
   npm run download
   ```
   这会将 https://survival-race.io/ 的 HTML 保存到 `survival-race_home.html`

2. 提取 `<head>` 和 `<body>` 片段到 data 目录：
   ```bash
   npm run extract
   ```
   生成文件：
   - `data/home-head.html` - head 内容
   - `data/home-body.html` - body 内容

3. 下载静态资源（CSS、JS 文件）：
   ```bash
   npm run assets
   ```
   所有引用的资源会下载到 `public/assets/` 目录

4. 生成完整的静态快照用于基准对比：
   ```bash
   npm run original
   ```
   生成 `public/original.html` 文件

## 3. Next.js 渲染说明
- `app/layout.tsx` 提供全局的 `<html>` 和 `<body>` 外壳
- `lib/loadHtmlFragment.ts` 集中加载 `/data` 目录中的 HTML 片段
- `components/HeadInjector.tsx` 使用 `useServerInsertedHTML` 在 SSR 期间注入 `<head>` 内容
- `app/page.tsx` 使用这些工具注入 `home-head.html` 并通过 `dangerouslySetInnerHTML` 渲染 `home-body.html`
- `app/globals.css` 只导入 Tailwind，保持原始网站的 CSS 不变

## 4. 运行项目
开发模式：
```bash
npm run dev
```
访问 http://localhost:3000 查看复刻的网站

生产构建：
```bash
npm run build
npm run start
```

## 5. 截图对比和像素差异检测
1. 启动本地服务器（如果还没运行）：
   ```bash
   npm run start
   ```

2. 捕获截图（使用 Playwright Chromium，禁用 JavaScript，1440×900 视口，全页面）：
   ```bash
   npm run capture
   ```
   生成文件：
   - `screenshots/original.png` — 原始网站截图
   - `screenshots/clone.png` — 本地克隆截图

3. 生成差异对比图和统计数据：
   ```bash
   npm run compare
   ```
   - 打印不同像素的数量和百分比
   - 保存 `screenshots/diff.png` 差异图

## 6. 常见差异来源
- 原始网站加载广告、分析工具等动态内容，即使禁用 JavaScript，通常也会有 2-3% 的小差异
- 要减少噪音，可以在捕获截图前阻止第三方请求，或直接对比 `public/original.html`

需要刷新数据或进行自动化视觉回归检查时，重复以上步骤即可。
