import { PALETTE, applyBackground, inkStroke, mutedStroke } from "./palette.js";

export function drawCrosshair(p, x, y, size = 8) {
  mutedStroke(p, 0.75);
  p.line(x - size, y, x + size, y);
  p.line(x, y - size, x, y + size);
}

export function hatchCircle(p, x, y, r, spacing = 4, angle = 0.785) {
  const ctx = p.drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  p.push();
  p.translate(x, y);
  p.rotate(angle);
  p.stroke(...PALETTE.hatch);
  p.strokeWeight(0.6);
  for (let i = -r * 2; i < r * 2; i += spacing) {
    p.line(i, -r * 2, i, r * 2);
  }
  p.pop();
  ctx.restore();
}

export function drawLeaderLine(p, x1, y1, x2, y2, label = "") {
  p.drawingContext.setLineDash([4, 4]);
  mutedStroke(p, 0.75);
  p.line(x1, y1, x2, y2);
  p.drawingContext.setLineDash([]);

  if (label) {
    p.noStroke();
    p.fill(...PALETTE.muted);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(9);
    p.text(label, (x1 + x2) / 2, (y1 + y2) / 2 - 4);
  }
}

export function drawHatchRect(p, x, y, w, h, spacing = 6) {
  p.noFill();
  inkStroke(p, 0.5);
  p.rect(x, y, w, h);
  p.stroke(...PALETTE.hatch);
  p.strokeWeight(0.5);
  for (let i = -h; i < w + h; i += spacing) {
    p.line(x + i, y, x + i + h, y + h);
  }
}

export function drawLevelLine(p, y, label = "") {
  p.stroke(...PALETTE.light);
  p.strokeWeight(0.75);
  p.line(0, y, p.width, y);

  if (label && PALETTE.dashedLeaders) {
    drawLeaderLine(p, p.width * 0.82, y, p.width * 0.92, y - 18, label);
  }
}

export function drawDimensionV(p, x, y1, y2, label) {
  if (!PALETTE.dashedLeaders) return;
  mutedStroke(p, 0.75);
  p.drawingContext.setLineDash([4, 3]);
  p.line(x, y1, x, y2);
  p.drawingContext.setLineDash([]);
  const tick = 4;
  inkStroke(p, 0.75);
  p.line(x - tick, y1, x + tick, y1);
  p.line(x - tick, y2, x + tick, y2);
  p.noStroke();
  p.fill(...PALETTE.ink);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(10);
  p.textStyle(p.BOLD);
  p.text(label, x + 6, (y1 + y2) / 2);
  p.textStyle(p.NORMAL);
}

export function drawFigureObject(p, x, y, r, options = {}) {
  const {
    label = "",
    tag = "",
    emphasis = "none", // none | solid | hatch | outline
  } = options;

  if (emphasis === "hatch") {
    hatchCircle(p, x, y, r);
    inkStroke(p, 1.5);
    p.noFill();
    p.circle(x, y, r * 2);
  } else if (emphasis === "solid") {
    p.fill(...PALETTE.ink);
    inkStroke(p, 2);
    p.circle(x, y, r * 2);
  } else if (emphasis === "outline") {
    p.noFill();
    inkStroke(p, 1.25);
    p.circle(x, y, r * 2);
  } else {
    p.fill(...PALETTE.fill);
    inkStroke(p, 1.25);
    p.circle(x, y, r * 2);
  }

  if (tag && PALETTE.figureTags) {
    p.noStroke();
    p.fill(...PALETTE.muted);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(9);
    p.text(tag, x + r + 4, y - r);
  }

  if (label) {
    p.noStroke();
    p.fill(...PALETTE.ink);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(11);
    p.text(label, x, y - r - (tag ? 14 : 6));
  }
}

/** @deprecated use drawFigureObject */
export function drawLabeledCircle(p, obj, label, options = {}) {
  drawFigureObject(p, obj.x, obj.y, obj.radius ?? options.radius ?? 16, {
    label,
    tag: options.tag,
    emphasis: options.accent ? "solid" : options.hatch ? "hatch" : "none",
  });
}

export function drawStatusBar(p, text, strong = false) {
  p.noStroke();
  p.fill(...PALETTE.ink);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(11);
  if (strong) p.textStyle(p.BOLD);
  p.text(text, p.width / 2, p.height - 14);
  p.textStyle(p.NORMAL);
}

export function drawArrow(p, x1, y1, x2, y2, weight = 1.25) {
  inkStroke(p, weight);
  p.line(x1, y1, x2, y2);
  const angle = p.atan2(y2 - y1, x2 - x1);
  const headLen = 8;
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.line(0, 0, -headLen, -4);
  p.line(0, 0, -headLen, 4);
  p.pop();
}

export function drawTimeline(p, y, xStart, xEnd, labels = []) {
  inkStroke(p, 1);
  p.line(xStart, y, xEnd, y);
  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const x = p.lerp(xStart, xEnd, i / ticks);
    p.line(x, y - 5, x, y + 5);
    if (labels[i] && PALETTE.figureTags) {
      p.noStroke();
      p.fill(...PALETTE.muted);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(8);
      p.text(labels[i], x, y + 8);
    }
  }
}

export function drawTargetMark(p, x, y, size = 12) {
  p.noFill();
  inkStroke(p, 1.5);
  p.circle(x, y, size * 2);
  drawCrosshair(p, x, y, size * 0.6);
}

export { PALETTE, applyBackground };
