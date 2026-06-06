#!/usr/bin/env node
/**
 * Batch-sync local Web Editor projects to editor.p5js.org.
 *
 * Workflow (mirrors p5-phone docs/web-editor/batch-sync.md):
 * 1. npm run export:webeditor
 * 2. npm run serve:cors:webeditor   (optional — payloads built from disk)
 * 3. node scripts/sync-webeditor.mjs --batch spatial --prepare
 * 4. Open editor.p5js.org while logged in; run browser upload (see --print-browser-script)
 * 5. node scripts/sync-webeditor.mjs --apply-results webeditor/.sync/results-spatial.json
 * 6. npm run apply:webeditor-links && npm run build
 */
import fs from "node:fs";
import path from "node:path";
import { exportWebEditorProjects } from "./webeditor/export-projects.mjs";
import { buildProjectPayload } from "./webeditor/build-payload.mjs";
import { appendVerifiedRows, applyWebEditorLinks } from "./webeditor/apply-links.mjs";
import { BATCHES, CDN } from "./webeditor/constants.mjs";

const root = path.resolve(import.meta.dirname, "..");
const projectsRoot = path.join(root, "webeditor/projects");
const syncDir = path.join(root, "webeditor/.sync");

function parseArgs(argv) {
  const args = {
    batch: "all",
    prepare: false,
    export: false,
    applyResults: null,
    applyLinks: false,
    printBrowserScript: false,
    printUpdateScript: false,
    slugs: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--batch" && argv[i + 1]) {
      args.batch = argv[++i];
    } else if (arg === "--slug" && argv[i + 1]) {
      args.slugs = [argv[++i]];
    } else if (arg === "--prepare") {
      args.prepare = true;
    } else if (arg === "--export") {
      args.export = true;
    } else if (arg === "--apply-results" && argv[i + 1]) {
      args.applyResults = argv[++i];
    } else if (arg === "--apply-links") {
      args.applyLinks = true;
    } else if (arg === "--print-browser-script") {
      args.printBrowserScript = true;
    } else if (arg === "--print-update-script") {
      args.printUpdateScript = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/sync-webeditor.mjs [options]

Options:
  --export                 Regenerate webeditor/projects from webeditor/standalone/
  --batch <name>           spatial | movement | time | all (default: all)
  --slug <slug>            Single slug instead of a batch
  --prepare                Write payload JSON for browser upload
  --print-browser-script   Print per-sketch POST upload loop for DevTools
  --print-update-script    Print per-sketch PUT update loop (keeps existing sketch IDs)
  --apply-results <file>   Record results + update webeditorLinks.md
  --apply-links            Sync editorSketchId from webeditorLinks.md → prepositions.json

Examples:
  node scripts/sync-webeditor.mjs --export --batch spatial --prepare
  node scripts/sync-webeditor.mjs --apply-results webeditor/.sync/results-spatial.json
  node scripts/sync-webeditor.mjs --apply-links
`);
}

function resolveSlugs(args) {
  if (args.slugs) return args.slugs;
  const batch = BATCHES[args.batch];
  if (!batch) {
    throw new Error(`Unknown batch "${args.batch}". Use: ${Object.keys(BATCHES).join(", ")}`);
  }
  return batch;
}

function loadReplacesBySlug(slugs) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/prepositions.json"), "utf8"),
  );
  const map = {};
  for (const entry of manifest) {
    if (slugs.includes(entry.slug) && entry.editorSketchId) {
      map[entry.slug] = `https://editor.p5js.org/npuckett/sketches/${entry.editorSketchId}`;
    }
  }
  return map;
}

function prepareBatch(slugs, batchName) {
  fs.mkdirSync(syncDir, { recursive: true });
  const perSlugDir = path.join(syncDir, batchName);
  fs.mkdirSync(perSlugDir, { recursive: true });
  const payloads = [];

  for (const slug of slugs) {
    const projectDir = path.join(projectsRoot, slug);
    if (!fs.existsSync(projectDir)) {
      throw new Error(`Missing project export: ${projectDir}. Run with --export first.`);
    }

    const meta = JSON.parse(fs.readFileSync(path.join(projectDir, "meta.json"), "utf8"));
    const payload = buildProjectPayload({
      slug,
      title: meta.title,
      projectDir,
    });
    if (meta.editorSketchId) {
      payload.projectId = meta.editorSketchId;
    }
    payloads.push(payload);
    fs.writeFileSync(
      path.join(perSlugDir, `${slug}.json`),
      `${JSON.stringify(payload, null, 2)}\n`,
    );
  }

  const outFile = path.join(syncDir, `payloads-${batchName}.json`);
  fs.writeFileSync(outFile, `${JSON.stringify(payloads, null, 2)}\n`);
  console.log(`Wrote ${payloads.length} payload(s) → ${path.relative(root, outFile)}`);
  console.log(`Per-sketch payloads → ${path.relative(root, perSlugDir)}/`);
  return outFile;
}

function printBrowserUploadScript(batchName = "spatial") {
  console.log(`
// Paste in DevTools console on https://editor.p5js.org/ (logged in as npuckett).
// Requires: npm run serve:cors:webeditor  (port 8876)
// Uploads ONE sketch at a time — do not paste the whole batch array at once.

async function uploadOne(slug) {
  const item = await fetch("http://127.0.0.1:8876/.sync/${batchName}/" + slug + ".json").then((r) => r.json());
  const res = await fetch("/editor/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({ name: item.name, files: item.files, visibility: "Public" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(slug + ": " + JSON.stringify(data));
  const projectId = data.id || data._id || data.project?.id;
  console.log("OK", slug, projectId);
  return { slug: item.slug, title: item.title, projectId, p5Version: "${CDN.p5}", p5PhoneVersion: "${CDN.p5Phone}" };
}

// Example — spatial batch, one at a time:
const SLUGS = ${JSON.stringify(BATCHES[batchName] || BATCHES.spatial, null, 2)};
const results = [];
for (const slug of SLUGS) {
  results.push(await uploadOne(slug));
  await new Promise((r) => setTimeout(r, 500));
}
copy(JSON.stringify(results, null, 2));
console.log("Copied results JSON to clipboard");
results;
`);
}

function printBrowserUpdateScript(batchName = "all") {
  const slugs = BATCHES[batchName] || BATCHES.all;
  console.log(`
// Paste in DevTools console on https://editor.p5js.org/ (logged in as npuckett).
// Requires: npm run serve:cors:webeditor  (port 8876)
// Updates existing public sketches in place — sketch URLs stay the same.

async function updateOne(slug) {
  const item = await fetch("http://127.0.0.1:8876/.sync/${batchName}/" + slug + ".json").then((r) => r.json());
  const projectId = item.projectId;
  if (!projectId) throw new Error(slug + ": missing projectId in payload");
  const res = await fetch("/editor/projects/" + projectId, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({ name: item.name, files: item.files }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(slug + ": " + JSON.stringify(data));
  console.log("OK", slug, projectId);
  return { slug: item.slug, title: item.title, projectId, p5Version: "${CDN.p5}", p5PhoneVersion: "${CDN.p5Phone}" };
}

const SLUGS = ${JSON.stringify(slugs, null, 2)};
const results = [];
for (const slug of SLUGS) {
  results.push(await updateOne(slug));
  await new Promise((r) => setTimeout(r, 500));
}
copy(JSON.stringify(results, null, 2));
console.log("Copied results JSON to clipboard");
results;
`);
}

function applyResults(resultsFile) {
  const abs = path.isAbsolute(resultsFile)
    ? resultsFile
    : path.join(root, resultsFile);
  const results = JSON.parse(fs.readFileSync(abs, "utf8"));
  const slugs = results.map((r) => r.slug).filter(Boolean);
  appendVerifiedRows(results, { replacesBySlug: loadReplacesBySlug(slugs) });
  applyWebEditorLinks();
}

const args = parseArgs(process.argv);

if (args.printBrowserScript) {
  printBrowserUploadScript(args.batch);
  process.exit(0);
}

if (args.printUpdateScript) {
  printBrowserUpdateScript(args.batch);
  process.exit(0);
}

if (args.export) {
  exportWebEditorProjects({ slugs: resolveSlugs(args) });
}

if (args.prepare) {
  const slugs = resolveSlugs(args);
  if (!args.export) {
    exportWebEditorProjects({ slugs });
  }
  prepareBatch(slugs, args.slugs ? slugs[0] : args.batch);
}

if (args.applyResults) {
  applyResults(args.applyResults);
}

if (args.applyLinks) {
  applyWebEditorLinks();
}

if (
  !args.prepare &&
  !args.applyResults &&
  !args.applyLinks &&
  !args.printBrowserScript &&
  !args.printUpdateScript &&
  !args.export
) {
  printHelp();
}
