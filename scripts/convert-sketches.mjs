import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, "jsFiles");
const targetDir = path.join(root, "src/sketches");

const EVENT_HANDLERS = [
  "setup",
  "draw",
  "mousePressed",
  "mouseDragged",
  "mouseReleased",
  "touchStarted",
  "touchMoved",
  "touchEnded",
  "keyPressed",
  "keyReleased",
  "windowResized",
];

const P5_CALLS = [
  "createCanvas",
  "resizeCanvas",
  "background",
  "fill",
  "stroke",
  "noStroke",
  "noFill",
  "ellipse",
  "rect",
  "line",
  "text",
  "textAlign",
  "textSize",
  "dist",
  "color",
  "strokeWeight",
  "push",
  "pop",
  "translate",
  "rotate",
  "atan2",
  "cos",
  "sin",
  "lerp",
  "map",
  "random",
  "floor",
  "min",
  "max",
  "beginShape",
  "vertex",
  "endShape",
  "point",
  "triangle",
  "quad",
  "arc",
  "constrain",
  "nf",
  "ceil",
  "round",
  "abs",
  "sq",
  "sqrt",
  "red",
  "green",
  "blue",
  "alpha",
  "createVector",
];

const P5_IDENTIFIERS = [
  "mouseX",
  "mouseY",
  "pmouseX",
  "pmouseY",
  "width",
  "height",
  "touches",
  "mouseIsPressed",
  "frameCount",
  "millis",
  "key",
  "keyCode",
  "PI",
  "TWO_PI",
  "HALF_PI",
];

function prefixCalls(code) {
  let result = code;
  for (const token of P5_CALLS.sort((a, b) => b.length - a.length)) {
    result = result.replace(
      new RegExp(`(?<![.\\w])${token}(?=\\s*\\()`, "g"),
      `p.${token}`
    );
  }
  return result;
}

function prefixIdentifiers(code) {
  let result = code;
  for (const token of P5_IDENTIFIERS.sort((a, b) => b.length - a.length)) {
    result = result.replace(
      new RegExp(`(?<![.\\w])${token}\\b`, "g"),
      `p.${token}`
    );
  }
  return result;
}

function convertSketch(source) {
  let code = source.replace(/\.parent\(['"]canvas['"]\)/g, "");

  for (const handler of EVENT_HANDLERS) {
    code = code.replace(
      new RegExp(`function\\s+${handler}\\s*\\(`, "g"),
      `p.${handler} = function(`
    );
  }

  code = prefixCalls(code);
  code = prefixIdentifiers(code);

  code = code.replace(/\s*p\.createCanvas\([^)]*\);\s*/g, "\n");
  code = code.replace(/p\.background\(\s*240\s*,\s*248\s*,\s*255\s*\)/g, "p.background(...PALETTE.bg)");
  code = code.replace(/p\.background\(\s*240\s*\)/g, "p.background(...PALETTE.bg)");

  return `import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
${code}
}
`;
}

const STYLED_SKETCHES = new Set(["above", "between", "toward", "before"]);

export function convertAllSketches() {
  fs.mkdirSync(targetDir, { recursive: true });
  const files = fs
    .readdirSync(sourceDir)
    .filter((f) => /^sketch-[a-z]+\.js$/.test(f));

  let converted = 0;
  for (const file of files) {
    const slug = file.replace("sketch-", "").replace(".js", "");
    if (STYLED_SKETCHES.has(slug)) continue;

    const source = fs.readFileSync(path.join(sourceDir, file), "utf8");
    fs.writeFileSync(path.join(targetDir, `${slug}.js`), convertSketch(source));
    converted++;
  }

  console.log(`Converted ${converted} sketches to instance mode (${STYLED_SKETCHES.size} styled sketches preserved)`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  convertAllSketches();
}
