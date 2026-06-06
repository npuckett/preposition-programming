# p5 Web Editor sync

Repeatable workflow for publishing preposition sketches to [editor.p5js.org](https://editor.p5js.org/) under **npuckett**. Adapted from [p5-phone/docs/web-editor/batch-sync.md](https://github.com/npuckett/p5-phone/blob/main/docs/web-editor/batch-sync.md).

**Migration log:** [webeditorLinks.md](../webeditorLinks.md)

## Prerequisites

- [ ] Logged into [editor.p5js.org](https://editor.p5js.org/) as `npuckett`
- [ ] `npm install` in this repo
- [ ] Local sketches exported to `webeditor/projects/{slug}/`

## Project layout

Each export is a self-contained Web Editor project:

```text
webeditor/projects/above/
  index.html       # p5 2.2.3 + compat + p5-phone CDN
  sketch.js        # instance-mode entry (createCanvas + lockGestures)
  preposition.js   # same logic as src/sketches/above.js
  shared/          # palette, diagram, input, tokens (copied from src/js/shared)
  meta.json        # slug, title, legacy editorSketchId
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run export:webeditor` | Regenerate all 24 projects from `src/sketches/` |
| `npm run serve:cors:webeditor` | CORS static server on port **8876** (optional reference) |
| `npm run sync:webeditor -- --batch spatial --prepare` | Export + write `webeditor/.sync/payloads-spatial.json` |
| `npm run sync:webeditor -- --apply-results webeditor/.sync/results-spatial.json` | Record IDs in `webeditorLinks.md` |
| `npm run apply:webeditor-links` | Copy verified IDs → `src/data/prepositions.json` |
| `npm run build` | Rebuild site with updated editor links |

Batches: `spatial` (9) · `movement` (10) · `time` (5) · `all` (24)

## Batch sync steps

1. **Export**

   ```bash
   npm run sync:webeditor -- --export --batch spatial --prepare
   ```

2. **Upload** (logged-in browser on editor.p5js.org)

   - Keep `npm run serve:cors:webeditor` running (port 8876)
   - **Refresh the editor tab** if a prior upload attempt hung
   - Open DevTools → Console; paste the script from:

   ```bash
   npm run sync:webeditor -- --print-browser-script --batch spatial
   ```

   Uploads run **one sketch at a time** (~17 KB each). Do not inject the whole batch JSON in one automation call — that hung a prior attempt.

3. **Record results**

   Save console output as `webeditor/.sync/results-{batch}.json`, then:

   ```bash
   npm run sync:webeditor -- --apply-results webeditor/.sync/results-spatial.json
   npm run apply:webeditor-links
   npm run build
   ```

4. **Verify** — open each full-preview URL (`…/npuckett/full/{id}`) and confirm canvas + grid render without errors.

## API reference

From an authenticated editor session:

- `GET /editor/session`
- `POST /editor/projects` — create (new v2 sketches)
- `PUT /editor/projects/{projectId}` — update existing

Public URLs:

```text
https://editor.p5js.org/npuckett/sketches/{projectId}
https://editor.p5js.org/npuckett/full/{projectId}
```

## Validation checklist

- [ ] Payload includes `index.html`, `sketch.js`, `preposition.js`, `shared/*`
- [ ] Full preview shows grid + figure (ink-only)
- [ ] Row added to **Created and browser verified** in `webeditorLinks.md`
- [ ] `editorSketchId` updated in `prepositions.json`
- [ ] Site rebuild; “Open in p5 Web Editor” links resolve
