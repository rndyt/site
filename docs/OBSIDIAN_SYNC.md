# Obsidian 博客同步

`~/Nutstore Files/ObsidianVault/Blog` 是博客文章的本地来源。macOS 每分钟检查一次变化；有变化时，同步脚本会转换内容、校验站点，并通过独立的后台发布副本提交到 GitHub，随后触发现有部署流程。后台发布不会提交日常开发工作区中的其他修改。

## 写文章

在 Obsidian 的 `Blog` 文件夹中新建 Markdown 文件。文件名决定文章网址，例如 `hello-world.md` 对应 `/blog/hello-world/`。

推荐属性：

```yaml
---
title: "文章标题"
description: "文章摘要"
date: 2026-09-04
tags: [Java, AI]
featured: false
preview: true
kind: article
---
```

缺少属性时，同步脚本会根据文件名、正文和文件日期自动补齐博客所需字段，但不会修改 Obsidian 中的原文件。

支持普通 Markdown 图片和 Obsidian 的 `![[图片.png]]` 嵌入。附件应放在 `Blog` 文件夹内部。Obsidian 的 `[[文章名]]` 双链会转换为博客文章链接；当存在同名文件时，应在双链中写相对路径。

## 发布行为

- 新增或修改文章：自动更新博客。
- 从 Obsidian 删除文章：下一次同步会从博客删除对应文章。
- 隐藏文件和 `.obsidian` 配置不会同步。
- 同步只提交 `src/content/blog`，不会把网站仓库中的其他修改一起提交。
- 仓库不在 `main` 分支、内容校验失败或网络不可用时不会推送，错误记录在 `/tmp/rndyt-obsidian-blog-sync.log`。

## 手动执行

```bash
npm run sync:obsidian
```

仅同步到网站仓库，不提交：

```bash
node scripts/sync-obsidian-blog.mjs "$HOME/Nutstore Files/ObsidianVault/Blog"
```
