import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sketchDir = path.join(root, "src/sketches");
const outDir = path.join(root, "dist/webeditorjs");

export function exportWebEditorSketches() {
  if (!fs.existsSync(sketchDir)) return;

  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(sketchDir).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    let content = fs.readFileSync(path.join(sketchDir, file), "utf8");

    content = content
      .replace(/^import[\s\S]*?;\n/gm, "")
      .replace(/export default function createSketch\(p\) \{\n/, "")
      .replace(/\n\}$/, "");

    const header = `/*
 * p5.js 2.x sketch — exported for P5 Web Editor
 * Site version uses instance mode; paste into editor as global mode.
 * Remove p. prefixes and wrap in function setup() / function draw() if needed.
 */\n\n`;

    content = header + content.replace(/\bp\./g, "");

    fs.writeFileSync(path.join(outDir, `sketch-${file}`), content);
  }

  console.log(`Exported ${files.length} web editor sketches`);
}
