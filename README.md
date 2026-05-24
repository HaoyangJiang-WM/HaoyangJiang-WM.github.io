# Haoyang Jiang — Personal Homepage

A deployable Vite + React + Tailwind academic homepage.

Live URL after GitHub Pages is enabled:

```text
https://haoyangjiang-wm.github.io
```

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm test
```

## Deploy

This repository includes `.github/workflows/deploy.yml` for GitHub Pages deployment from GitHub Actions.

Go to **Settings → Pages → Source → GitHub Actions**.

## Customize

Edit `src/App.jsx` to update:

- CV link
- LinkedIn link
- Google Scholar link
- Publication list
- Research/project descriptions

The current profile photo is loaded from the earlier `HaoyangJiang-WM/Data` repository raw file. You can later replace it with a local file under `public/profile.jpg` and set `PROFILE_PHOTO_SRC = "/profile.jpg"`.
