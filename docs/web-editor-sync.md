# p5 Web Editor sync

Repeatable workflow for publishing preposition sketches to [editor.p5js.org](https://editor.p5js.org/) under **npuckett**. Adapted from [p5-phone/docs/web-editor/batch-sync.md](https://github.com/npuckett/p5-phone/blob/main/docs/web-editor/batch-sync.md).

**Migration log:** [webeditorLinks.md](../webeditorLinks.md)

## Prerequisites

- [ ] Logged into [editor.p5js.org](https://editor.p5js.org/) as `npuckett`
- [ ] `npm install` in this repo
- [ ] Standalone sketches in `webeditor/standalone/` (generated from site copy + sketch logic)

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
| `npm run serve:cors:webeditor` | CORS static server on port **8876** |
| `npm run sync:webeditor -- --batch all --prepare` | Export + write upload payloads |
| `npm run sync:webeditor -- --print-update-script --batch all` | DevTools script to **PUT** updates (keeps sketch IDs) |
| `npm run apply:webeditor-links` | Copy verified IDs → `src/data/prepositions.json` |
| `npm run build` | Rebuild site with editor links |

Batches: `spatial` (9) · `movement` (10) · `time` (5) · `all` (24)

## Update existing sketches (standalone rollout)

When sketch IDs in `webeditorLinks.md` are already verified, use **PUT** so URLs stay the same:

1. **Export + prepare**

   ```bash
   npm run sync:webeditor -- --export --batch all --prepare
   npm run serve:cors:webeditor
   ```

2. **Update in browser** (logged in on editor.p5js.org)

   ```bash
   npm run sync:webeditor -- --print-update-script --batch all
   ```

   Paste the script in DevTools. Uploads run **one sketch at a time**.

3. **Verify** — open full-preview URLs (`…/npuckett/full/{id}`). Code should be global-mode with header comments, not instance-mode `preposition.js`.

## Create new sketches (first-time batch)

Use POST when no `editorSketchId` exists yet:

```bash
npm run sync:webeditor -- --print-browser-script --batch spatial
```

Then `--apply-results` and `apply:webeditor-links` as below.

## Record new IDs

Save console output as `webeditor/.sync/results-{batch}.json`, then:

```bash
npm run sync:webeditor -- --apply-results webeditor/.sync/results-spatial.json
npm run apply:webeditor-links
npm run build
```

## API reference

From an authenticated editor session:

- `GET /editor/session`
- `POST /editor/projects` — create
- `PUT /editor/projects/{projectId}` — update in place

Public URLs:

- Sketch: `https://editor.p5js.org/npuckett/sketches/{id}`
- Full preview: `https://editor.p5js.org/npuckett/full/{id}`
