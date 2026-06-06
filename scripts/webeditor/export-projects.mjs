import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BATCHES,
  CDN,
  CANVAS,
  SHARED_FILES,
} from "./constants.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const sketchDir = path.join(root, "src/sketches");
const sharedSrcDir = path.join(root, "src/js/shared");
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
  <script type="module" src="sketch.js"></script>
</body>
</html>
`;
}

function buildSketchEntry() {
  return `import createSketch from "./preposition.js";

new p5((p) => {
  createSketch(p);

  const userSetup = p.setup;
  p.setup = function () {
    p.createCanvas(${CANVAS.width}, ${CANVAS.height});
    if (typeof lockGestures === "function") {
      lockGestures();
    }
    if (typeof userSetup === "function") {
      userSetup.call(p);
    }
  };
});
`;
}

function rewritePrepositionImports(content) {
  return content.replace(
    /from "\.\.\/js\/shared\//g,
    'from "./shared/',
  );
}

function copySharedFiles(targetSharedDir) {
  fs.mkdirSync(targetSharedDir, { recursive: true });
  for (const file of SHARED_FILES) {
    fs.copyFileSync(
      path.join(sharedSrcDir, file),
      path.join(targetSharedDir, file),
    );
  }
}

function loadManifest() {
  const manifestPath = path.join(root, "src/data/prepositions.json");
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

export function exportWebEditorProjects({ slugs = BATCHES.all } = {}) {
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

    const sketchPath = path.join(sketchDir, `${slug}.js`);
    if (!fs.existsSync(sketchPath)) {
      console.warn(`Missing sketch source: ${sketchPath}`);
      continue;
    }

    const projectDir = path.join(projectsRoot, slug);
    fs.mkdirSync(projectDir, { recursive: true });

    const prepositionSource = rewritePrepositionImports(
      fs.readFileSync(sketchPath, "utf8"),
    );

    fs.writeFileSync(path.join(projectDir, "index.html"), buildIndexHtml(prep.title));
    fs.writeFileSync(path.join(projectDir, "sketch.js"), buildSketchEntry());
    fs.writeFileSync(path.join(projectDir, "preposition.js"), prepositionSource);
    copySharedFiles(path.join(projectDir, "shared"));

    fs.writeFileSync(
      path.join(projectDir, "meta.json"),
      `${JSON.stringify(
        {
          slug,
          title: prep.title,
          category: prep.category,
          editorSketchId: prep.editorSketchId || null,
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      )}\n`,
    );

    count += 1;
  }

  console.log(`Exported ${count} Web Editor project(s) to webeditor/projects/`);
  return count;
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  exportWebEditorProjects();
}
