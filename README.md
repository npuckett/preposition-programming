# Preposition Programming

Interactive p5.js tutorials that translate spatial, directional, and temporal prepositions into code.

**[Visit the site](https://prepositionprogramming.com/)**

## Development

This site uses [Eleventy](https://www.11ty.dev/) to generate pages from a central manifest and p5.js 2.x sketches in instance mode.

```bash
npm install
npm run dev    # local preview at http://localhost:8080
npm run build  # output to dist/
```

GitHub Pages deploys the `dist/` folder via GitHub Actions.

## Project structure

```
src/
  data/prepositions.json   # manifest: copy, editor URLs, categories
  preposition-pages.njk    # template for all 24 example pages
  sketches/                # p5 2.x instance-mode sketches
  js/                      # shell navigation, sketch-host, shared palette/diagram
  styles/                  # token-based CSS
style-lab/                 # visual prototypes (above, between, toward, before)
dist/                      # build output (deployed)
jsFiles/                   # legacy global-mode sketches (source for conversion script)
```

## Visual system

Sketches use a black/white/grey science-diagram palette with a single red accent (`src/js/shared/palette.js`) and shared drawing helpers (`src/js/shared/diagram.js`). See `style-lab/index.html` for the reference prototypes.

## Preposition examples

24 interactive tutorials covering spatial relationships, movement & direction, and time-based prepositions. Each page links to a forkable copy in the [p5 Web Editor](https://editor.p5js.org/npuckett/).
