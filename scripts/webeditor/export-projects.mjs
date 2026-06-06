import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BATCHES,
  CDN,
  CANVAS,
} from "./constants.mjs";
import { generateStandaloneSketches } from "./generate-standalone.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const standaloneDir = path.join(root, "webeditor/standalone");
const helpersPath = path.join(standaloneDir, "helpers.js");
const projectsRoot = path.join(root, "webeditor/projects");

function buildIndexHtml(title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Preposition Programming</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/p5@${CDN.p5}/lib/p5.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/p5.js-compatibility@${CDN.p5Compat}/src/preload.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/p5-phone@${CDN.p5Phone}/dist/p5-phone.min.js"></script>
</head>
<body>
  <script src="helpers.js"></script>
  <script src="sketch.js"></script>
</body>
</html>
`;
}

function loadManifest() {
  const manifestPath = path.join(root, "src/data/prepositions.json");
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function removeLegacyProjectFiles(projectDir) {
  for (const name of ["preposition.js"]) {
    const file = path.join(projectDir, name);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  const sharedDir = path.join(projectDir, "shared");
  if (fs.existsSync(sharedDir)) {
    fs.rmSync(sharedDir, { recursive: true, force: true });
  }
}

export function exportWebEditorProjects({ slugs = BATCHES.all, regenerate = true } = {}) {
  if (regenerate) {
    generateStandaloneSketches({ slugs });
  }

  if (!fs.existsSync(helpersPath)) {
    throw new Error(`Missing ${helpersPath}. Run generate-standalone first.`);
  }

  const helpersSource = fs.readFileSync(helpersPath, "utf8");
  const manifest = loadManifest();
  const bySlug = Object.fromEntries(manifest.map((p) => [p.slug, p]));

  fs.mkdirSync(projectsRoot, { recursive: true });

  let count = 0;
  for (const slug of slugs) {
    const prep = bySlug[slug];
    if (!prep) {
      console.warn(`Skipping unknown slug: ${slug}`);
      continue;
    }

    const sketchSourcePath = path.join(standaloneDir, `${slug}.js`);
    if (!fs.existsSync(sketchSourcePath)) {
      console.warn(`Missing standalone sketch: ${sketchSourcePath}`);
      continue;
    }

    const projectDir = path.join(projectsRoot, slug);
    fs.mkdirSync(projectDir, { recursive: true });
    removeLegacyProjectFiles(projectDir);

    const sketchSource = fs.readFileSync(sketchSourcePath, "utf8");

    fs.writeFileSync(path.join(projectDir, "index.html"), buildIndexHtml(prep.title));
    fs.writeFileSync(path.join(projectDir, "helpers.js"), helpersSource);
    fs.writeFileSync(path.join(projectDir, "sketch.js"), sketchSource);

    fs.writeFileSync(
      path.join(projectDir, "meta.json"),
      `${JSON.stringify(
        {
          slug,
          title: prep.title,
          category: prep.category,
          editorSketchId: prep.editorSketchId || null,
          format: "standalone-global",
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      )}\n`,
    );

    count += 1;
  }

  console.log(`Exported ${count} standalone Web Editor project(s) to webeditor/projects/`);
  return count;
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  exportWebEditorProjects();
}
