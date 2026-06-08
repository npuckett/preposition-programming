# p5 Web Editor sync

Repeatable workflow for publishing preposition sketches to [editor.p5js.org](https://editor.p5js.org/) under **npuckett**. Uses [p5-webeditor-sync](https://github.com/npuckett/p5-webeditor-sync).

**Migration log:** [webeditorLinks.md](../webeditorLinks.md)

## Prerequisites

- [ ] `npm install` in this repo (includes `p5-webeditor-sync`)
- [ ] Standalone sketches in `webeditor/standalone/` (generated from site copy + sketch logic)
- [ ] One-time auth: `npx p5-webeditor-sync login` (or set `P5_EDITOR_COOKIE`)

## Source vs site sketches

| | Site (`src/sketches/`) | Web Editor (`webeditor/standalone/`) |
|--|------------------------|--------------------------------------|
| Mode | p5 instance (embedded in tutorial page) | **Global mode** — standard `setup()` / `draw()` |
| Comments | Minimal | Header with concept, try-it, key code from tutorial |
| Files | ES modules + shared helpers | `sketch.js` + `helpers.js` (easy to read and edit) |

Regenerate standalone sources:

```bash
npm run generate:webeditor   # webeditor/standalone/{slug}.js from src + manifest
npm run export:webeditor     # webeditor/projects/{slug}/ for upload
```

## Project layout (export)

Each export is a self-contained Web Editor project:

```text
webeditor/projects/above/
  index.html       # p5 2.2.3 + compat + p5-phone CDN
  helpers.js       # shared ink-only drawing + input helpers
  sketch.js        # global-mode sketch with tutorial header comments
  meta.json        # slug, title, editorSketchId, exportedAt
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run generate:webeditor` | Regenerate `webeditor/standalone/` from manifest + `src/sketches/` |
| `npm run export:webeditor` | Copy standalone → `webeditor/projects/` |
| `npm run prepare:webeditor` | Write upload payloads to `webeditor/.sync/` |
| `npm run sync:webeditor` | Create or update all sketches on editor.p5js.org |
| `npm run verify:webeditor` | Check full-preview pages for signature text |
| `npm run apply:webeditor-links` | Copy verified IDs → `src/data/prepositions.json` |
| `npm run build` | Rebuild site with editor links |

Batches: `spatial` (9) · `movement` (10) · `time` (5) · `all` (24)

Config: [`p5-webeditor.config.json`](../p5-webeditor.config.json)

## Sync workflow

1. **Generate and export**

   ```bash
   npm run generate:webeditor
   npm run export:webeditor
   ```

2. **Push** (creates new projects or updates existing IDs from registry / `meta.json`)

   ```bash
   npm run sync:webeditor
   ```

   Options via CLI:

   ```bash
   npx p5-webeditor-sync push --batch spatial --dry-run
   npx p5-webeditor-sync push --batch all --resume
   npx p5-webeditor-sync push --batch all --force
   ```

3. **Verify**

   ```bash
   npm run verify:webeditor
   ```

4. **Update site manifest** (if new sketch IDs)

   ```bash
   npm run apply:webeditor-links
   npm run build
   ```

Re-running push with no file changes uploads **zero** projects (content hash skip). Registry: `webeditor/.sync/registry.json`.

## Auth

See [p5-webeditor-sync docs/AUTH.md](https://github.com/npuckett/p5-webeditor-sync/blob/main/docs/AUTH.md).

```bash
npx p5-webeditor-sync login
npx p5-webeditor-sync session
```

## Deprecated

Removed from this repo:

- `npm run serve:cors:webeditor` (CORS server for DevTools scripts)
- `--print-browser-script` / `--print-update-script` (DevTools paste workflow)
- `scripts/sync-webeditor.mjs` orchestration (replaced by `p5-webeditor-sync` CLI)
