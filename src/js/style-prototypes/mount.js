import {
  STYLES,
  STYLE_ORDER,
  EXAMPLES,
  COLOR_PALETTE_ORDER,
  COLOR_PALETTES,
  buildTechnicalStyle,
} from "./tokens.js";
import { SCENES } from "./scenes.js";

function mountCell(containerId, style, exampleId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const drawScene = SCENES[exampleId];

  new p5((p) => {
    p.setup = function () {
      const w = container.clientWidth || 280;
      const h = Math.max(200, Math.round(w * 0.72));
      p.createCanvas(w, h).parent(container);
      p.noLoop();
      drawScene(p, style);
    };
  }, container);
}

export function mountStylePrototypeMatrix() {
  for (const styleId of STYLE_ORDER) {
    for (const example of EXAMPLES) {
      mountCell(`proto-${styleId}-${example.id}`, STYLES[styleId], example.id);
    }
  }
}

export function mountColorPaletteMatrix() {
  for (const paletteId of COLOR_PALETTE_ORDER) {
    const style = buildTechnicalStyle(paletteId);
    for (const example of EXAMPLES) {
      mountCell(`color-${paletteId}-${example.id}`, style, example.id);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".style-prototype-matrix")) {
    mountStylePrototypeMatrix();
  }
  if (document.querySelector(".color-palette-matrix")) {
    mountColorPaletteMatrix();
  }
});
