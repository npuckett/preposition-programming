import { PALETTE, pColor, inkStroke, mutedStroke, accentStroke } from "./palette.js";

export function drawCrosshair(p, x, y, size = 8) {
  mutedStroke(p, 0.75);
  p.line(x - size, y, x + size, y);
  p.line(x, y - size, x, y + size);
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
    p.textSize(10);
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

export function drawLevelLine(p, y, color = PALETTE.muted) {
  p.stroke(...color);
  p.strokeWeight(0.75);
  p.line(0, y, p.width, y);
}

export function drawLabeledCircle(p, obj, label, options = {}) {
  const {
    fill = PALETTE.objectA,
    stroke = PALETTE.ink,
    accent = false,
    radius = obj.radius,
  } = options;

  if (accent) {
    p.fill(...PALETTE.accent);
    p.stroke(...PALETTE.accent);
  } else {
    p.fill(...fill);
    p.stroke(...stroke);
  }
  p.strokeWeight(1.5);
  p.ellipse(obj.x, obj.y, radius * 2, radius * 2);

  p.noStroke();
  p.fill(...PALETTE.ink);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(11);
  p.text(label, obj.x, obj.y - radius - 6);
}

export function drawStatusBar(p, text, accent = false) {
  p.noStroke();
  p.fill(...(accent ? PALETTE.accent : PALETTE.ink));
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(12);
  p.text(text, p.width / 2, p.height - 16);
}

export function drawArrow(p, x1, y1, x2, y2, color = PALETTE.accent) {
  p.stroke(...color);
  p.strokeWeight(1.5);
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

export function drawTimeline(p, y, xStart, xEnd) {
  inkStroke(p, 1);
  p.line(xStart, y, xEnd, y);

  for (let x = xStart; x <= xEnd; x += 40) {
    p.line(x, y - 4, x, y + 4);
  }
}

export function drawTargetMark(p, x, y, size = 12) {
  accentStroke(p, 1);
  p.noFill();
  p.ellipse(x, y, size * 2, size * 2);
  drawCrosshair(p, x, y, size * 0.6);
}

export function drawDiagramDot(p, x, y, size = 16, moving = false) {
  if (moving) {
    p.fill(...PALETTE.accent);
    p.stroke(...PALETTE.ink);
  } else {
    p.fill(...PALETTE.objectA);
    p.stroke(...PALETTE.ink);
  }
  p.strokeWeight(1.5);
  p.ellipse(x, y, size, size);
}

export { PALETTE, pColor };
