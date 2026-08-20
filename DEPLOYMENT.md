# 部署说明

## 推荐结构

- GitHub：保存源码、Markdown 内容和版本记录。
- EdgeOne Pages：作为中国大陆访问的主站，连接 GitHub 仓库自动构建。
- GitHub Pages：作为海外访问和预览备用站。

## GitHub Pages

仓库推送到 `main` 后，`.github/workflows/deploy.yml` 会自动执行检查、构建和发布。

首次启用时，在 GitHub 仓库的 **Settings -> Pages -> Source** 选择 **GitHub Actions**。工作流会根据仓库名自动设置 Astro 的 `base`：

- `rndyt-site`：`/rndyt-site/`
- `账号名.github.io`：`/`

## EdgeOne Pages

在 EdgeOne Pages 创建项目并连接 GitHub 仓库，构建设置使用：

- 构建命令：`npm run build`
- 输出目录：`dist`
- Node.js：22（或平台当前支持的 LTS 版本）
- 环境变量：`BASE_PATH=/`、`SITE_URL=https://你的域名`

EdgeOne 的免费额度、带宽和超额计费以控制台当前套餐页面为准；如果绑定 CDN、对象存储、独立域名或超出免费额度，可能产生额外费用。正式上线前应在腾讯云控制台确认当前价格和合规要求。

## 自定义域名

把 `SITE_URL` 改成实际的 `https://` 域名即可。中国大陆使用自定义域名和 CDN 时，通常需要按服务商要求完成 ICP 备案。
