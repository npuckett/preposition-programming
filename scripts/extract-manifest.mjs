import fs from "node:fs";
import path from "node:path";

const editorIds = {
  above: "ddWIriyOk",
  below: "X3nB6HJLP",
  between: "zLIVDNbuF",
  among: "gTIDK9eFQ",
  beside: "AYzWnDhPy",
  behind: "T6n1O_dKq",
  beneath: "Gbdl8UOve",
  within: "dH7RokMtk",
  through: "cSHRaES3q",
  toward: "H93wrfKL5",
  away: "hgtGXDBXq",
  across: "3n6SHsUtS",
  along: "yIVftMasm",
  around: "KZc6sFR8I",
  into: "6EUFcUmF1",
  onto: "sWthbYYs3",
  past: "DjakxBC0M",
  over: "NtC8JgAhB",
  under: "2a5R_KyKS",
  before: "09_b4Rpy1",
  after: "GzGonI_p9",
  during: "_0kHqjHjb",
  since: "UdyLk3RHP",
  until: "T-UhaoxHZ",
};

const categories = {
  spatial: [
    "above",
    "below",
    "between",
    "among",
    "beside",
    "behind",
    "beneath",
    "within",
    "through",
  ],
  movement: [
    "toward",
    "away",
    "across",
    "along",
    "around",
    "into",
    "onto",
    "past",
    "over",
    "under",
  ],
  time: ["before", "after", "during", "since", "until"],
};

function getCategory(slug) {
  for (const [cat, slugs] of Object.entries(categories)) {
    if (slugs.includes(slug)) return cat;
  }
  return "spatial";
}

const root = path.resolve(import.meta.dirname, "..");
const prepositions = [];

for (const [slug, editorSketchId] of Object.entries(editorIds)) {
  const file = path.join(root, `preposition-${slug}.html`);
  const html = fs.readFileSync(file, "utf8");
  const tryItMatch = html.match(/<h3>Try It<\/h3>\s*<p>([\s\S]*?)<\/p>/);
  const conceptMatch = html.match(/<h3>Concept<\/h3>\s*<p>([\s\S]*?)<\/p>/);
  const stratMatch = html.match(
    /<h3>(?:Visual )?Translation Strategy<\/h3>([\s\S]*?)<h3>Key P5\.js Methods<\/h3>/
  );
  const methodsMatch = html.match(
    /<h3>Key P5\.js Methods<\/h3>([\s\S]*?)<h3>Code Structure<\/h3>/
  );
  const codeMatch = html.match(
    /<h3>Code Structure<\/h3>([\s\S]*?)<\/div>\s*<\/div>\s*<script/
  );

  prepositions.push({
    slug,
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    category: getCategory(slug),
    editorSketchId,
    tryIt: tryItMatch ? tryItMatch[1].replace(/<[^>]+>/g, "").trim() : "",
    conceptHtml: conceptMatch ? conceptMatch[1].trim() : "",
    strategyHtml: stratMatch ? stratMatch[1].trim() : "",
    methodsHtml: methodsMatch ? methodsMatch[1].trim() : "",
    codeHtml: codeMatch ? codeMatch[1].trim() : "",
  });
}

const outDir = path.join(root, "src/data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "prepositions.json"),
  JSON.stringify(prepositions, null, 2)
);
console.log(`Extracted ${prepositions.length} prepositions`);
