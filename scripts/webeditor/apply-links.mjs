import fs from "node:fs";
import path from "node:path";
import { fullPreviewUrl, sketchUrl } from "./constants.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const linksPath = path.join(root, "webeditorLinks.md");
const manifestPath = path.join(root, "src/data/prepositions.json");

const TABLE_HEADER =
  "| Slug | Title | Web Editor | Full preview | Replaces | Notes |";

function parseVerifiedTable(markdown) {
  const section = markdown.match(
    /## Created and browser verified\n([\s\S]*?)(?=\n## |\n*$)/,
  );
  if (!section) return new Map();

  const rows = new Map();
  for (const line of section[1].split("\n")) {
    if (!line.startsWith("|") || line.includes("---") || line.includes("Slug")) {
      continue;
    }
    const cols = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cols.length < 4) continue;
    const [slug, , editorLink] = cols;
    const projectId = editorLink.match(/sketches\/([^/]+)/)?.[1];
    if (slug && projectId) rows.set(slug, projectId);
  }
  return rows;
}

export function applyWebEditorLinks() {
  const markdown = fs.readFileSync(linksPath, "utf8");
  const links = parseVerifiedTable(markdown);
  if (links.size === 0) {
    console.log("No verified rows found in webeditorLinks.md");
    return 0;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  let updated = 0;

  for (const entry of manifest) {
    const projectId = links.get(entry.slug);
    if (!projectId) continue;
    if (entry.editorSketchId !== projectId) {
      entry.editorSketchId = projectId;
      updated += 1;
    }
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Updated ${updated} editorSketchId value(s) in prepositions.json`);
  return updated;
}

export function appendVerifiedRows(results, { replacesBySlug = {} } = {}) {
  let markdown = fs.readFileSync(linksPath, "utf8");
  const date = new Date().toISOString().slice(0, 10);

  const newRows = results
    .filter((r) => r.projectId && !r.error)
    .map((r) => {
      const replaces = replacesBySlug[r.slug] || "—";
      const notes = r.notes || `Created ${date}; p5@${r.p5Version || "2.2.3"}, p5-phone@${r.p5PhoneVersion || "1.11.0"}.`;
      return `| ${r.slug} | ${r.title} | ${sketchUrl(r.projectId)} | ${fullPreviewUrl(r.projectId)} | ${replaces} | ${notes} |`;
    });

  if (newRows.length === 0) {
    console.log("No successful results to append.");
    return;
  }

  const sectionHeader = "## Created and browser verified";
  if (!markdown.includes(sectionHeader)) {
    markdown += `\n${sectionHeader}\n\n${TABLE_HEADER}\n| --- | --- | --- | --- | --- | --- |\n`;
  }

  const existingSlugs = parseVerifiedTable(markdown);
  const rowsToAdd = newRows.filter((row) => {
    const slug = row.split("|")[1]?.trim();
    return slug && !existingSlugs.has(slug);
  });

  if (rowsToAdd.length === 0) {
    console.log("All results already recorded in webeditorLinks.md");
    return;
  }

  const insertAt = markdown.indexOf(sectionHeader);
  const separator = "| --- | --- | --- | --- | --- | --- |";
  const separatorAt = markdown.indexOf(separator, insertAt);
  const insertPoint =
    separatorAt === -1
      ? markdown.indexOf("\n", insertAt + sectionHeader.length)
      : markdown.indexOf("\n", separatorAt) + 1;

  markdown =
    markdown.slice(0, insertPoint) +
    `${rowsToAdd.join("\n")}\n` +
    markdown.slice(insertPoint);

  fs.writeFileSync(linksPath, markdown);
  console.log(`Appended ${rowsToAdd.length} row(s) to webeditorLinks.md`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  applyWebEditorLinks();
}
