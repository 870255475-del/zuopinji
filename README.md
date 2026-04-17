# 🎨 Next.js 作品集网站

一个现代化的个人作品集网站，支持访问密码保护、管理员后台、多种文件格式展示和多模板风格。

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-ff0055?style=flat-square&logo=framer)

## ✨ 功能特性

- 🔐 **访问密码保护** - 首页需要输入密码才能查看作品
- 👨‍💼 **管理员后台** - 管理作品、修改网站配置
- 📁 **多种文件格式** - 支持图片、视频、音频、B站视频、文档、外部链接
- 🎨 **多模板风格** - 网格布局、卡片布局、列表布局
- 📱 **响应式设计** - 完美适配手机、平板、电脑
- ✨ **流畅动画** - 使用 Framer Motion 实现精美过渡效果
- 🌙 **深色模式** - 支持自动切换深色主题
- 💾 **本地存储** - 无需数据库，JSON 文件存储

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

### 3. 默认密码

- **访问密码**: `123456`
- **管理员密码**: `114514`

## 📁 项目结构

```
portfolio-website/
├── src/
│   ├── app/
│   │   ├── page.tsx          # 首页（访问密码保护）
│   │   ├── gallery/page.tsx  # 作品展示页
│   │   ├── admin/page.tsx    # 管理员后台
│   │   ├── layout.tsx        # 布局文件
│   │   ├── globals.css       # 全局样式
│   │   └── api/              # API 路由
│   │       ├── config/       # 配置 API
│   │       └── works/        # 作品 API
│   ├── components/           # 组件（可扩展）
│   ├── data/                 # 数据存储
│   │   ├── config.json       # 网站配置
│   │   └── works.json        # 作品数据
│   └── lib/                  # 工具函数
│       └── data.ts           # 数据操作
├── public/                   # 静态资源
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## ⚙️ 配置说明

### 网站配置 (`src/data/config.json`)

```json
{
  "siteTitle": "我的作品集",
  "siteDescription": "欢迎来到我的个人作品集网站",
  "visitorPassword": "123456",
  "adminPassword": "114514",
  "contact": {
    "email": "contact@example.com",
    "phone": "138-0000-0000",
    "github": "https://github.com/yourusername",
    "twitter": "https://twitter.com/yourusername"
  },
  "template": "grid",
  "theme": "light"
}
```

### 作品数据 (`src/data/works.json`)

```json
{
  "works": [
    {
      "id": "1",
      "title": "作品标题",
      "description": "作品描述",
      "type": "image",
      "url": "https://example.com/image.jpg",
      "thumbnail": "https://example.com/thumb.jpg",
      "tags": ["标签1", "标签2"],
      "createdAt": "2024-01-01"
    }
  ]
}
```

## 📝 作品类型说明

| 类型 | 说明 | 配置方式 |
|------|------|----------|
| `image` | 图片作品 | 填写 `url`（图片链接） |
| `video` | 视频作品 | 填写 `url`（MP4/WebM链接） |
| `audio` | 音频作品 | 填写 `url`（MP3链接） |
| `bilibili` | B站视频 | 填写 `bvid`（BV号） |
| `link` | 外部链接 | 填写 `url`（跳转链接） |

### B站视频 BV号获取方法

1. 打开 B站视频页面
2. 查看浏览器地址栏 URL
3. 复制 `BV` 后面的字符

例如：`https://www.bilibili.com/video/BV1xx411c7XD/` → BV号为 `BV1xx411c7XD`

### 大文件分享推荐

对于较大的视频文件（1GB+），推荐使用以下方式：

1. **SwissTransfer** - 免费50GB，保留30天
   - 网址：https://www.swisstransfer.com
   - 无需注册，直接上传

2. **上传到B站** - 无限存储
   - 注册B站账号
   - 上传视频后获取BV号
   - 在后台添加B站类型的作品

## 🎨 模板风格

在管理后台可以切换三种展示模板：

1. **网格布局** - 经典的网格展示，适合图片作品
2. **卡片布局** - 现代卡片风格，左右布局
3. **列表布局** - 简洁的列表展示，适合文档类作品

## 🌐 部署教程（傻瓜式图文教程）

### 第一步：注册 GitHub 账号

1. 打开浏览器，访问 https://github.com
2. 点击 **Sign up**（注册）
3. 按提示填写：
   - 邮箱地址
   - 密码（建议复杂一点）
   - 用户名（这个很重要！会成为你的网址一部分）
   - 验证邮箱
4. 注册完成后登录

### 第二步：注册 Vercel 账号

1. 打开浏览器，访问 https://vercel.com
2. 点击 **Sign Up**（注册）
3. 选择 **Continue with GitHub**（使用 GitHub 账号登录）
4. 授权 Vercel 访问你的 GitHub
5. 完成注册

### 第三步：上传代码到 GitHub

#### 方法一：使用 GitHub 网页上传（最简单）

1. 登录 GitHub
2. 点击右上角 **+** → **New repository**（新建仓库）
3. 填写仓库信息：
   - Repository name: `portfolio`（仓库名称，可自定义）
   - Description: `我的作品集网站`（描述，可选）
   - 选择 **Public**（公开）或 **Private**（私有）
   - 勾选 **Add a README file**（添加 README 文件）
4. 点击 **Create repository**（创建仓库）

5. 进入你刚创建的仓库
6. 点击 **Add file** → **Upload files**（上传文件）
7. 将项目所有文件拖拽到上传区域
8. 点击 **Commit changes**（提交更改）

#### 方法二：使用 Git 命令行上传

1. 在项目文件夹打开终端
2. 初始化 Git 仓库：
   ```bash
   git init
   ```
3. 添加所有文件：
   ```bash
   git add .
   ```
4. 提交：
   ```bash
   git commit -m "Initial commit"
   ```
5. 添加远程仓库（把 `yourusername` 换成你的 GitHub 用户名）：
   ```bash
   git remote add origin https://github.com/yourusername/portfolio.git
   ```
6. 推送到 GitHub：
   ```bash
   git push -u origin main
   ```

### 第四步：在 Vercel 部署

1. 登录 Vercel
2. 点击 **Add New** → **Project**（添加新项目）
3. 在列表中找到你刚才创建的 GitHub 仓库
4. 点击 **Import**（导入）
5. 配置项目：
   - **Framework Preset**: 选择 `Next.js`（通常自动识别）
   - **Root Directory**: 保持默认（`.`）
   - 其他选项保持默认即可
6. 点击 **Deploy**（部署）

### 第五步：等待部署完成

1. Vercel 会自动构建和部署你的网站
2. 等待 1-3 分钟
3. 看到绿色的 ✓ 标记表示部署成功
4. 点击访问你的网站链接

### 第六步：绑定自定义域名（可选）

1. 在 Vercel 项目设置中找到 **Domains**
2. 输入你的域名
3. 按提示在域名服务商处添加 DNS 记录
4. 等待域名生效

### 第七步：修改网站内容

#### 方法一：通过 Vercel 后台修改 JSON 文件

1. 登录 Vercel
2. 进入你的项目
3. 点击 **Deployments**（部署）
4. 选择任意一个部署记录
5. 点击 **Files** → **View Source**（查看源码）
6. 找到 `src/data/` 文件夹
7. 点击 `config.json` 或 `works.json` 文件
8. 点击编辑按钮修改内容
9. 点击保存

⚠️ 注意：修改后需要重新部署才能生效

#### 方法二：修改代码后重新部署

1. 在本地修改 `src/data/` 下的 JSON 文件
2. 使用 Git 命令推送到 GitHub：
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```
3. Vercel 会自动检测到更新并重新部署

## 🔧 常见问题

### Q: 忘记了访问密码怎么办？

A: 在 Vercel 后台打开 `src/data/config.json`，找到 `visitorPassword` 字段查看或修改。

### Q: 忘记了管理员密码怎么办？

A: 在 Vercel 后台打开 `src/data/config.json`，找到 `adminPassword` 字段修改为新密码。

### Q: 如何添加大视频？

A: 不建议直接上传大视频，建议：
1. 将视频上传到 B站，获取 BV号
2. 在后台添加 B站类型的作品
3. 或者使用 SwissTransfer 生成外部链接

### Q: 图片显示不出来？

A: 检查图片链接是否：
1. 是完整的 URL（以 http:// 或 https:// 开头）
2. 图片链接可以公开访问
3. 图片格式受支持（jpg、png、gif、webp 等）

### Q: B站视频无法播放？

A: 检查：
1. BV号是否正确
2. 视频是否还在（未被删除）
3. 视频是否允许嵌入

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **存储**: 本地 JSON 文件
- **部署**: Vercel

## 📄 License

MIT License - 欢迎使用和修改！

---

Made with ❤️ using Next.js
