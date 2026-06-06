export const EDITOR_USER = "npuckett";

export const CDN = {
  p5: "2.2.3",
  p5Compat: "0.2.0",
  p5Phone: "1.11.0",
};

export const CANVAS = { width: 400, height: 300 };

export const BATCHES = {
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

BATCHES.all = [...BATCHES.spatial, ...BATCHES.movement, ...BATCHES.time];

export const SHARED_FILES = [
  "tokens.js",
  "palette.js",
  "diagram.js",
  "input.js",
];

export function projectName(title) {
  return `PP — ${title}`;
}

export function sketchUrl(projectId) {
  return `https://editor.p5js.org/${EDITOR_USER}/sketches/${projectId}`;
}

export function fullPreviewUrl(projectId) {
  return `https://editor.p5js.org/${EDITOR_USER}/full/${projectId}`;
}
