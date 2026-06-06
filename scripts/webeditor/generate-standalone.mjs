#!/usr/bin/env node
/**
 * Generate standalone global-mode p5 sketches for the Web Editor from
 * src/sketches/ + pedagogical copy in prepositions.json.
 *
 * Output: webeditor/standalone/{slug}.js (sketch body only; helpers are separate)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BATCHES } from "./constants.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const sketchDir = path.join(root, "src/sketches");
const manifestPath = path.join(root, "src/data/prepositions.json");
const outDir = path.join(root, "webeditor/standalone");

const HELPER_FUNCS = [
  "applyBackground",
  "drawLevelLine",
  "drawDimensionV",
  "drawDimensionH",
  "drawFigureObject",
  "drawStatusBar",
  "drawZoneRect",
  "drawFigureRect",
  "drawCrosshair",
  "drawArrow",
  "drawInkTrail",
  "drawTargetMark",
  "drawLeaderLine",
  "drawTimeline",
  "drawDashedLine",
  "drawContainerRect",
  "drawHatchRect",
  "hatchCircle",
  "inkStroke",
  "mutedStroke",
];

const P5_GLOBALS =
  /p\.(width|height|mouseX|mouseY|frameCount|dist|lerp|constrain|cos|sin|map|push|pop|translate|rotate|atan2|beginShape|endShape|vertex|circle|ellipse|line|rect|text|fill|stroke|noStroke|noFill|textAlign|textSize|textStyle|background|random|drawingContext|touches|CENTER|TOP|BOTTOM|LEFT|RIGHT|BOLD|NORMAL)\b/g;

const BOUND_INPUT_DISPATCH = `
// --- Pointer input (wired by bindPointerInput / bindCircleDrag in setup) ---
function mousePressed() {
  if (_ppInput.onPress) _ppInput.onPress();
}

function mouseDragged() {
  if (_ppInput.onDrag) _ppInput.onDrag();
}

function mouseReleased() {
  if (_ppInput.onRelease) _ppInput.onRelease();
}

function touchStarted() {
  if (_ppInput.onPress) _ppInput.onPress();
  return false;
}

function touchMoved() {
  if (_ppInput.onDrag) _ppInput.onDrag();
  return false;
}

function touchEnded() {
  if (_ppInput.onRelease) _ppInput.onRelease();
  return false;
}
`;

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractCodeHints(codeHtml) {
  const codes = [...codeHtml.matchAll(/<code>([^<]*)<\/code>/g)].map((m) =>
    m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"),
  );
  return codes.slice(0, 4).join("\n *   ");
}

function buildHeader(prep) {
  const concept = stripHtml(prep.conceptHtml).replace(/\s+/g, " ");
  const hints = extractCodeHints(prep.codeHtml);
  return `/*
 * Preposition Programming — ${prep.title.toUpperCase()}
 * Tutorial: https://prepositionprogramming.com/preposition-${prep.slug}.html
 *
 * CONCEPT
 * ${concept}
 *
 * TRY IT
 * ${prep.tryIt}
 *
 * KEY CODE (from the tutorial page)
 *   ${hints}
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */
`;
}

function extractCreateSketchBody(source) {
  const marker = "export default function createSketch(p) {";
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error("Missing createSketch export");
  }
  let depth = 0;
  const open = source.indexOf("{", start);
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(open + 1, i);
      }
    }
  }
  throw new Error("Unbalanced braces in createSketch");
}

function stripSketchIndent(text) {
  return text
    .split("\n")
    .map((line) => (line.startsWith("  ") ? line.slice(2) : line))
    .join("\n");
}

function dedent(text) {
  const lines = text.split("\n");
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^(\s*)/)[1].length);
  if (indents.length === 0) return text;
  const min = Math.min(...indents);
  if (min === 0) return text;
  return lines.map((line) => (line.length >= min ? line.slice(min) : line)).join("\n");
}

function usesBoundInput(body) {
  return body.includes("bindPointerInput") || body.includes("bindCircleDrag");
}

function wireManualHandlers(body) {
  const handlerMap = [
    ["mousePressed", "handleInputStart"],
    ["mouseDragged", "handleInputDrag"],
    ["mouseReleased", "handleInputEnd"],
  ];

  let out = body;
  for (const [event, fn] of handlerMap) {
    const assign = new RegExp(`p\\.${event}\\s*=\\s*${fn}\\s*;`);
    if (assign.test(out)) {
      out = out.replace(assign, "");
      out = out.replace(
        new RegExp(`function ${fn}\\(\\)`),
        `function ${event}()`,
      );
    }
  }

  out = out.replace(
    /p\.touchStarted\s*=\s*\(\)\s*=>\s*\{\s*handleInputStart\(\);\s*return false;\s*\};/g,
    "",
  );
  out = out.replace(
    /p\.touchMoved\s*=\s*\(\)\s*=>\s*\{\s*handleInputDrag\(\);\s*return false;\s*\};/g,
    "",
  );
  out = out.replace(
    /p\.touchEnded\s*=\s*\(\)\s*=>\s*\{\s*handleInputEnd\(\);\s*return false;\s*\};/g,
    "",
  );

  if (out.includes("function mousePressed()")) {
    out += `

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}
`;
  }

  return out;
}

function transformBody(body) {
  let out = stripSketchIndent(body);

  out = out.replace(/^import .+\n/gm, "");

  out = out.replace(/p\.setup\s*=\s*function\s*(\w+\s*)?\(\)\s*\{/g, "function setup() {");
  out = out.replace(/p\.draw\s*=\s*function\s*(\w+\s*)?\(\)\s*\{/g, "function draw() {");

  if (!out.includes("createCanvas(")) {
    out = out.replace(/function setup\(\)\s*\{/, "function setup() {\n  createCanvas(400, 300);");
  }

  for (const fn of HELPER_FUNCS) {
    out = out.replace(new RegExp(`${fn}\\(p,`, "g"), `${fn}(`);
    out = out.replace(new RegExp(`${fn}\\(p\\)`, "g"), `${fn}()`);
  }

  out = out.replace(/bindCircleDrag\(p,/g, "bindCircleDrag(");
  out = out.replace(/bindPointerInput\(p,/g, "bindPointerInput(");
  out = out.replace(/pointerX\(p\)/g, "pointerX()");
  out = out.replace(/pointerY\(p\)/g, "pointerY()");
  out = out.replace(/hitCircle\(p,/g, "hitCircle(");

  out = out.replace(P5_GLOBALS, "$1");

  // First argument p on its own line (multiline helper calls)
  out = out.replace(/^\s*p,\s*\n/gm, "");

  // Instance-mode }; before next function
  out = out.replace(/\};\s*(\n\s*function )/g, "}\n$1");

  out = dedent(out);

  const bound = usesBoundInput(out);
  if (bound) {
    out = out.replace(/p\.mousePressed\s*=\s*[^;]+;/g, "");
    out = out.replace(/p\.mouseDragged\s*=\s*[^;]+;/g, "");
    out = out.replace(/p\.mouseReleased\s*=\s*[^;]+;/g, "");
    out = out.replace(/p\.touchStarted\s*=\s*[^;]+;/g, "");
    out = out.replace(/p\.touchMoved\s*=\s*[^;]+;/g, "");
    out = out.replace(/p\.touchEnded\s*=\s*[^;]+;/g, "");
  } else {
    out = wireManualHandlers(out);
  }

  out = out.trim();
  out = out.replace(/\(\s+/g, "(");
  out = out.replace(/\n{3,}/g, "\n\n");

  if (bound) {
    out += BOUND_INPUT_DISPATCH;
  }

  return out;
}

export function generateStandaloneSketches({ slugs = BATCHES.all } = {}) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const bySlug = Object.fromEntries(manifest.map((p) => [p.slug, p]));

  fs.mkdirSync(outDir, { recursive: true });
  let count = 0;

  for (const slug of slugs) {
    const prep = bySlug[slug];
    const srcPath = path.join(sketchDir, `${slug}.js`);
    if (!prep || !fs.existsSync(srcPath)) {
      console.warn(`Skip ${slug}: missing manifest or source`);
      continue;
    }

    const source = fs.readFileSync(srcPath, "utf8");
    const body = transformBody(extractCreateSketchBody(source));
    const header = buildHeader(prep);
    const outPath = path.join(outDir, `${slug}.js`);

    fs.writeFileSync(outPath, `${header}\n${body}\n`);
    count += 1;
  }

  console.log(`Generated ${count} standalone sketch(s) → webeditor/standalone/`);
  return count;
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  generateStandaloneSketches();
}
