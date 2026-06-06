/**
 * Site-wide diagram palette — Technical Figure, Ink Only.
 * Greyscale + hatching; emphasis via weight and fill, not hue.
 */
import {
  TECHNICAL_BASE,
  COLOR_PALETTES,
  buildTechnicalStyle,
} from "../style-prototypes/tokens.js";

export const DEFAULT_ACCENT = "monochrome";

const active = buildTechnicalStyle(DEFAULT_ACCENT);

export const PALETTE = {
  bg: active.bg,
  ink: active.ink,
  muted: active.muted,
  light: active.light,
  hatch: active.hatch,
  fill: active.fill,
  fillDark: active.objectA,
  fillMid: active.objectB,
  accent: active.accent,
  accentMuted: active.accentMuted,
  objectA: active.objectA,
  objectB: active.objectB,
  gridStep: active.gridStep,
  showGrid: active.showGrid,
  inkOnly: true,
  dashedLeaders: active.dashedLeaders,
  figureTags: active.figureTags,
};

export { TECHNICAL_BASE, COLOR_PALETTES, buildTechnicalStyle };

export function pColor(p, rgba) {
  if (rgba.length === 4) {
    return p.color(rgba[0], rgba[1], rgba[2], rgba[3]);
  }
  return p.color(rgba[0], rgba[1], rgba[2]);
}

export function applyBackground(p) {
  p.background(...PALETTE.bg);
  if (!PALETTE.showGrid) return;
  p.stroke(...PALETTE.light);
  p.strokeWeight(0.5);
  const step = PALETTE.gridStep || 16;
  for (let x = 0; x <= p.width; x += step) {
    p.line(x, 0, x, p.height);
  }
  for (let y = 0; y <= p.height; y += step) {
    p.line(0, y, p.width, y);
  }
}

export function inkStroke(p, weight = 1) {
  p.stroke(...PALETTE.ink);
  p.strokeWeight(weight);
}

export function mutedStroke(p, weight = 1) {
  p.stroke(...PALETTE.muted);
  p.strokeWeight(weight);
}

export function inkFill(p) {
  p.fill(...PALETTE.ink);
}

export function mutedFill(p) {
  p.fill(...PALETTE.muted);
}

export function fillObject(p, variant = "a") {
  p.fill(...(variant === "b" ? PALETTE.objectB : PALETTE.objectA));
}
