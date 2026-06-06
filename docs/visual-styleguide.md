# Visual Style Guide — Preposition Programming

Reference for updating existing p5.js examples and authoring new ones.

**Selected dialect:** Technical Figure (grid-backed coordinate space)  
**Accent palette:** **Ink Only** (`monochrome`) — locked site-wide  
**Layout prototype:** rolled out to all example pages (figure-first two-column layout)

---

## Core principles

1. **Grid-first coordinates** — faint margin grid on every canvas; positions and measurements align to readable coordinate space.
2. **Ink-only structure** — ink, paper, grey tones, and hatching carry all forms. No spot color.
3. **Emphasis via weight** — active objects use solid fill, heavier stroke, or hatch fill (not hue).
4. **Greyscale legibility** — objects distinguishable without color.
5. **Annotation over decoration** — dashed leaders, figure tags, Δ labels explain the preposition.

---

## Selected dialect: Technical Figure

**Concept:** Numbered figure plate with dimension lines and callout brackets — diagram from a lab manual, grid-aware.

| Element | Treatment |
|---------|-----------|
| Background | Off-white `#FCFCFA` + **16px grid** `#D2D2D0` |
| Primary forms | Outline or 4% grey fill `#F5F5F3` |
| Dimension lines | Dashed leaders, tick marks at endpoints |
| Labels | Figure refs (`1a`, `1b`), measurements (`Δy`, `t₀`, `Y=64`) |
| Arrows | Open arrowheads; accent or heavy ink for active vector |
| Timeline | Tick-mark axis with stage labels |

**Implementation:** `src/js/shared/tokens.js` → `TECHNICAL_BASE` + `buildTechnicalStyle(paletteId)`

---

## Accent palette — Ink Only (locked)

| ID | Name | Treatment |
|----|------|-----------|
| `monochrome` | **Ink Only** | Active: solid ink fill + 2px stroke. Inactive: light fill or diagonal hatch. Measurements in ink. |

**Implementation:** `DEFAULT_ACCENT = "monochrome"` in `src/js/shared/palette.js`.

---

## Shared tokens (implementation)

```javascript
// TECHNICAL_BASE — always applied
bg:       [252, 252, 250]  // #FCFCFA
ink:      [17, 17, 17]     // #111111
muted:    [120, 120, 118]
light:    [210, 210, 208]  // grid lines
gridStep: 16

// Ink Only — accent equals ink; emphasis is weight/fill/hatch
accent:   [17, 17, 17]
```

Site sketches import from `src/js/shared/palette.js` (wraps technical + active accent).

**Mobile interaction:** [p5-phone](https://github.com/npuckett/p5-phone) is loaded on sketch pages. `sketch-host.js` calls `lockGestures()` on touch-primary devices after the canvas is created — prevents scroll, pinch-zoom, and pull-to-refresh while dragging sketch elements.

---

## Diagram primitives

| Primitive | Usage |
|-----------|--------|
| `drawBackground` / grid | Every frame via `applyBackground(p)` |
| `drawLevelLine` | Y-reference with optional `Y=` callout |
| `drawDimensionV` | Vertical Δ with dashed leader |
| `drawArrow` | Movement vectors |
| `drawTimeline` | Time-based prepositions |
| `drawFigureObject` | Circles with solid / hatch / outline emphasis + figure tags |
| `hatchCircle` | Diagonal hatch fill for secondary object |
| `drawStatusBar` | Bottom relationship caption (bold when active) |
| `drawDimensionH` | Horizontal Δ with dashed leader |
| `drawContainerRect` | Bounded region (within, into) |
| `drawZoneRect` | Emphasis band between anchors (between, beside) |
| `drawFigureRect` | Rectangular figure with tag + emphasis |
| `drawInkTrail` | Fading point trail for movement history |
| `drawDashedLine` | Generic dashed segment |

Source: `src/js/shared/diagram.js` · Input: `bindCircleDrag()` in `src/js/shared/input.js`

---

## Typography

| Context | Treatment |
|---------|-----------|
| Site prose | IBM Plex Sans |
| Code | IBM Plex Mono |
| Canvas labels | 9–11px, ink or muted |
| Measurements | 9–10px, ink (bold for Δ labels) |
| Status bar | 10px bottom center |

Use **A / B / m** and figure tags — not color names.

---

## Checklist (before merging a sketch)

- [ ] Grid visible at 320px width
- [ ] Ink-only emphasis (weight, fill, hatch — no hue)
- [ ] Greyscale legible
- [ ] Figure/measurement labels present where helpful
- [ ] Touch via shared `input.js`
- [ ] Status text states preposition clearly

---

## Example page copy (editorial standards)

All prose lives in `src/data/prepositions.json`. Regenerate from `scripts/editorial-pass.mjs` if bulk-editing.

| Field | Standard |
|-------|----------|
| **Concept** | `<strong>WORD</strong> means …` + one sentence mapping to screen/code |
| **Try it** | One sentence in the masthead lede: action + what to watch. No color names; use A/B labels |
| **Figure caption** | Short technical description under Fig. 1 (`figureCaption` in manifest) |
| **Strategy** | Opener: `Ways to express <em>word</em> in a sketch:` (spatial/movement) or `… in code:` (time). Three parallel bullets |
| **Key methods** | Sketch-specific only; grouped headings; em dashes after links; `rel="noopener noreferrer"` on external links |
| **Code pattern** | Four numbered steps; title is always **Code pattern** (not “Basic Pattern for …”) |

**Pointer input:** drag sketches list `mousePressed` / `mouseDragged` / `mouseReleased`; click sketches list `mousePressed` + `mouseX` / `mouseY`.

---

## Example page layout

Figure-first two-column layout on every preposition page:

- **Masthead** — category, title, try-it lede
- **Sticky figure panel** — Fig. tag, caption, canvas, inline editor link
- **Reading column** — concept, strategy, collapsible methods + code

Template: `src/_includes/example-v2.njk` · CSS: `src/styles/example-v2.css`

Each entry includes `figureCaption` in `src/data/prepositions.json` (see `scripts/editorial-pass.mjs`).

---

## Rollout order

1. ~~Lock accent palette~~ ✓ Ink Only
2. ~~Promote diagram helpers~~ ✓ `shared/diagram.js`
3. ~~Validate layout on Above v2 prototype~~ ✓
4. ~~Apply v2 layout site-wide~~ ✓
5. ~~Deep ink-only sketch styling for remaining examples~~ ✓ all 24 sketches hand-styled

---

## Archived dialects

Engraving and Modern Minimal were compared during prototyping and not selected. Technical Figure + Ink Only is the site standard.
