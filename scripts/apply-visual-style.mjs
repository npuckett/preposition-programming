/**
 * Apply diagram palette to auto-converted sketches.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sketchDir = path.join(root, "src/sketches");
const styled = new Set(["above", "between", "toward", "before"]);

const colorReplacements = [
  [/p\.fill\(\s*0\s*\)/g, "p.fill(...PALETTE.ink)"],
  [/p\.fill\(\s*60\s*\)/g, "p.fill(...PALETTE.ink)"],
  [/p\.fill\(\s*50\s*\)/g, "p.fill(...PALETTE.ink)"],
  [/p\.fill\(\s*100\s*\)/g, "p.fill(...PALETTE.muted)"],
  [/p\.fill\(\s*150\s*\)/g, "p.fill(...PALETTE.muted)"],
  [/p\.stroke\(\s*50\s*\)/g, "p.stroke(...PALETTE.ink)"],
  [/p\.stroke\(\s*200\s*\)/g, "p.stroke(...PALETTE.light)"],
  [/p\.color\(\s*100,\s*150,\s*255[^)]*\)/g, "p.color(...PALETTE.objectA)"],
  [/p\.color\(\s*255,\s*100,\s*100[^)]*\)/g, "p.color(...PALETTE.accent)"],
  [/p\.color\(\s*100,\s*255,\s*100[^)]*\)/g, "p.color(...PALETTE.accent)"],
  [/p\.color\(\s*150\s*\)/g, "p.color(...PALETTE.muted)"],
  [/p\.color\(\s*100\s*\)/g, "p.color(...PALETTE.muted)"],
];

for (const file of fs.readdirSync(sketchDir).filter((f) => f.endsWith(".js"))) {
  const slug = file.replace(".js", "");
  if (styled.has(slug)) continue;

  let content = fs.readFileSync(path.join(sketchDir, file), "utf8");
  if (!content.includes("PALETTE")) continue;

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

console.log("Applied palette substitutions to converted sketches");
