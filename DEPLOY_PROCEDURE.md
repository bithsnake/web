# Dentis Web Deployment Procedure (GitHub Pages)

This project uses two branches:

- `deploy/main`: source branch (Next.js code)
- `deploy-main-build`: static output branch (published by GitHub Pages)

## Golden Rule

Do not develop directly on `deploy-main-build`.
Only generated static files should live there.

## Normal Workflow

1. Start from source branch:

```powershell
git checkout deploy/main
git pull
```

2. Create a feature branch and work there:

```powershell
git checkout -b feat/<your-change>
# edit code
npm run build
```

3. Commit and push feature branch:

```powershell
git add .
git commit -m "feat: <description>"
git push -u origin feat/<your-change>
```

4. Merge feature into `deploy/main` (PR or local merge), then update local source branch:

```powershell
git checkout deploy/main
git pull
```

5. Build static output from source branch:

```powershell
npm run build
```

6. Publish new build to `deploy-main-build`:

```powershell
# from apps/web
if (Test-Path "E:\WEBDEV\dentis\apps\web-pages-deploy") { Remove-Item "E:\WEBDEV\dentis\apps\web-pages-deploy" -Recurse -Force }
git worktree add "E:\WEBDEV\dentis\apps\web-pages-deploy" -B deploy-main-build
Set-Location "E:\WEBDEV\dentis\apps\web-pages-deploy"
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Copy-Item "E:\WEBDEV\dentis\apps\web\out\*" "." -Recurse -Force
if (!(Test-Path ".nojekyll")) { New-Item -Path ".nojekyll" -ItemType File | Out-Null }
git add .
git commit -m "chore: refresh static build"
git push -f origin deploy-main-build
```

## GitHub Pages Settings

Repository -> Settings -> Pages:

- Source: `Deploy from a branch`
- Branch: `deploy-main-build`
- Folder: `/(root)`

## Troubleshooting

### CSS/JS 404 under `/web/_next/...`

Cause: missing `.nojekyll` in `deploy-main-build`.
Fix: ensure `.nojekyll` exists in root of `deploy-main-build` and push again.

### Site updates not visible

- Wait 1-5 minutes for Pages deploy
- Hard refresh browser (`Ctrl+F5`)
- Check Actions/Pages deploy status on GitHub

## Current Important Note

Your `next.config.ts` contains the required Pages settings (`basePath` and `assetPrefix` for `/web`).
Do not remove them unless you change repository name or deployment target.
