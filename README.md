# FA 虚拟实验室 · 工程经济学课程项目网站

本仓库托管「FA 虚拟实验室」课程项目网站（原站点：http://www.fa-lab-team02-jiojiojio.icu/ ）。
为保证国内外均可稳定访问，网站通过 GitHub Pages 发布。

## 仓库结构

- **`main` 分支**：网站源代码（React + TypeScript + Vite + Tailwind）。
  - `src/`：前端源码
  - `public/`：静态资源（PDF 教材、实验报告、周报等）
  - 配置文件：`vite.config.ts`、`tailwind.config.*`、`tsconfig.*`、`package.json` 等
  - 注意：`node_modules/`（依赖，可重新安装）与构建产物 `dist/` 已被 `.gitignore` 忽略，不计入仓库。
- **`gh-pages` 分支**：构建后的静态站点（`dist/` 内容），由 GitHub Pages 直接对外提供服务。

## 本地开发

```bash
npm install      # 安装依赖（生成 node_modules/）
npm run dev      # 本地预览（默认 http://localhost:3000）
npm run build    # 构建，输出到 dist/
```

## 部署说明

网站已部署在 GitHub Pages：

```
https://<用户名>.github.io/<仓库名>/
```

`gh-pages` 分支根目录即线上站点根目录，已添加 `.nojekyll` 以禁用 Jekyll 处理。
若需保留原自定义域名（fa-lab-team02-jiojiojio.icu），可在仓库 Settings → Pages 中配置 Custom domain。

> 说明：因原始构建依赖包含一个本地插件（`kimi-plugin-inspect-react`），本仓库直接采用已构建好的 `dist/` 产物发布，避免因依赖不可用导致 CI 构建失败。
