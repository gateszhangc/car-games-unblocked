# Survival Race 网站复刻项目

这个项目用于学习研究目的，复刻 https://survival-race.io/ 网站。

## 快速开始

### 1. 一键同步所有内容

```bash
# 下载并同步所有网站内容（推荐）
npm run sync-all
```

或者分步执行：

```bash
# 1. 下载原始网站 HTML
npm run download

# 2. 提取 head 和 body 片段到 data 目录
npm run extract

# 3. 下载所有静态资源（CSS、JS、图片）
npm run assets-all

# 4. 下载游戏页面
npm run game

# 5. 下载游戏资源文件
npm run game-assets

# 6. 生成完整的原始 HTML 快照
npm run original
```

### 2. 运行开发服务器

```bash
# 开发模式
npm run dev

# 或构建生产版本
npm run build
npm run start
```

访问 http://localhost:3000 查看复刻的网站。

### 3. 视觉对比（可选）

```bash
# 捕获原始网站和本地克隆的截图
npm run capture

# 生成像素差异对比图
npm run compare
```

截图保存在 `screenshots/` 目录：
- `original.png` - 原始网站
- `clone.png` - 本地克隆
- `diff.png` - 差异对比图

## 项目结构

```
├── app/                 # Next.js 应用页面
├── components/          # React 组件
├── data/               # 提取的 HTML 片段
├── lib/                # 工具函数
├── public/             # 静态资源
│   └── assets/         # 下载的 CSS/JS 文件
├── scripts/            # 自动化脚本
└── screenshots/        # 截图对比
```

## 注意事项

- 此项目仅用于学习研究目的
- 原始网站可能包含动态内容，因此会有小的视觉差异（通常 2-3%）
- JavaScript 在截图对比时被禁用以减少差异
