/**
 * Diagram palette — vintage science illustration aesthetic.
 * Black/white/grey with a single spot accent.
 */
export const PALETTE = {
  bg: [252, 252, 250],
  ink: [17, 17, 17],
  muted: [136, 136, 136],
  light: [220, 220, 218],
  hatch: [200, 200, 198],
  fill: [240, 240, 238],
  accent: [192, 57, 43],
  accentMuted: [192, 57, 43, 120],
  objectA: [60, 60, 60],
  objectB: [100, 100, 100],
  highlight: [192, 57, 43],
};

export function pColor(p, rgba) {
  if (rgba.length === 4) {
    return p.color(rgba[0], rgba[1], rgba[2], rgba[3]);
  }
  return p.color(rgba[0], rgba[1], rgba[2]);
}

export function applyBackground(p) {
  p.background(...PALETTE.bg);
}

export function inkStroke(p, weight = 1) {
  p.stroke(...PALETTE.ink);
  p.strokeWeight(weight);
}

export function mutedStroke(p, weight = 1) {
  p.stroke(...PALETTE.muted);
  p.strokeWeight(weight);
}

export function accentStroke(p, weight = 1.5) {
  p.stroke(...PALETTE.accent);
  p.strokeWeight(weight);
}

export function inkFill(p) {
  p.fill(...PALETTE.ink);
}

export function mutedFill(p) {
  p.fill(...PALETTE.muted);
}

export function accentFill(p) {
  p.fill(...PALETTE.accent);
}

export function fillObject(p, variant = "a") {
  p.fill(...(variant === "b" ? PALETTE.objectB : PALETTE.objectA));
}
