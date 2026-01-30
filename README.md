<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Omikuji — 本地运行与 GitHub Pages 部署

本仓库包含运行与部署所需的一切；部署仅通过 GitHub Actions 推送到 GitHub Pages。

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

本项目使用 GitHub Actions 部署到 GitHub Pages。

1. 在仓库 **Settings → Pages** 中，将 **Source** 选为 **GitHub Actions**。
2. 推送 `main` 分支后，Actions 会自动构建并部署。站点地址：使用自定义域名为 `https://omi.soranx.com`，否则为 `https://<username>.github.io/omikuji/`。
3. 若使用自定义域名：在仓库根目录的 **CNAME** 文件中填写域名（如 `omi.soranx.com`），workflow 会将其复制到部署产物；并在 Settings → Pages 中配置 Custom domain 与 DNS。
