/**
 * Apply diagram palette and grid background to all sketches.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sketchDir = path.join(root, "src/sketches");

const colorReplacements = [
  [/p\.fill\(\s*0\s*\)/g, "p.fill(...PALETTE.ink)"],
  [/p\.fill\(\s*60\s*\)/g, "p.fill(...PALETTE.ink)"],
  [/p\.fill\(\s*50\s*\)/g, "p.fill(...PALETTE.ink)"],
  [/p\.fill\(\s*100\s*\)/g, "p.fill(...PALETTE.muted)"],
  [/p\.fill\(\s*150\s*\)/g, "p.fill(...PALETTE.muted)"],
  [/p\.stroke\(\s*50\s*\)/g, "p.stroke(...PALETTE.ink)"],
  [/p\.stroke\(\s*200\s*\)/g, "p.stroke(...PALETTE.light)"],
  [/p\.color\(\s*100,\s*150,\s*255[^)]*\)/g, "p.color(...PALETTE.objectA)"],
  [/p\.color\(\s*255,\s*100,\s*100[^)]*\)/g, "p.color(...PALETTE.objectB)"],
  [/p\.color\(\s*100,\s*255,\s*100[^)]*\)/g, "p.color(...PALETTE.objectA)"],
  [/p\.color\(\s*255,\s*150,\s*100[^)]*\)/g, "p.color(...PALETTE.objectB)"],
  [/p\.color\(\s*150\s*\)/g, "p.color(...PALETTE.muted)"],
  [/p\.color\(\s*100\s*\)/g, "p.color(...PALETTE.muted)"],
];

const INK_ONLY = new Set([
  "above", "below", "between", "among", "beside", "behind", "beneath", "within",
  "through", "toward", "away", "across", "along", "around", "into", "onto",
  "past", "over", "under", "before", "after", "during", "since", "until",
]);

for (const file of fs.readdirSync(sketchDir).filter((f) => f.endsWith(".js"))) {
  const slug = file.replace(".js", "");
  if (slug.endsWith("-v2") || INK_ONLY.has(slug)) continue;

  let content = fs.readFileSync(path.join(sketchDir, file), "utf8");

  if (!content.includes("diagram")) {
    content = content.replace(
      /import \{ PALETTE \} from "\.\.\/js\/shared\/palette\.js";/,
      `import { PALETTE } from "../js/shared/palette.js";\nimport * as diagram from "../js/shared/diagram.js";`
    );
  }

  if (!content.includes("applyBackground")) {
    content = content.replace(
      /p\.background\(\.\.\.PALETTE\.bg\)/g,
      "diagram.applyBackground(p)"
    );
    content = content.replace(
      /p\.background\(\s*240\s*,\s*248\s*,\s*255\s*\)/g,
      "diagram.applyBackground(p)"
    );
    content = content.replace(
      /p\.background\(\s*240\s*\)/g,
      "diagram.applyBackground(p)"
    );
  }

  for (const [pattern, replacement] of colorReplacements) {
    content = content.replace(pattern, replacement);
  }

  if (!content.includes("p.touchStarted")) {
    content = content.replace(
      /\n\}\n$/,
      `
  if (typeof p.mousePressed === "function") {
    p.touchStarted = function () {
      p.mousePressed();
      return false;
    };
  }
}
`
    );
  }

  fs.writeFileSync(path.join(sketchDir, file), content);
}

console.log("Applied ink-only palette and grid background to sketches");
