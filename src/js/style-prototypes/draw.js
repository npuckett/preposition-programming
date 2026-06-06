/** Style-aware drawing primitives for prototype matrix. */

export function drawBackground(p, style) {
  p.background(...style.bg);
  if (style.showGrid) {
    p.stroke(...style.light);
    p.strokeWeight(0.5);
    const step = style.gridStep || 16;
    for (let x = 0; x < p.width; x += step) {
      p.line(x, 0, x, p.height);
    }
    for (let y = 0; y < p.height; y += step) {
      p.line(0, y, p.width, y);
    }
  }
}

function accentColor(style, forFill = false) {
  if (style.inkOnly) return style.ink;
  return forFill ? style.accent : style.accent;
}

export function hatchCircle(p, x, y, r, style, angle = 0.785) {
  const ctx = p.drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  p.push();
  p.translate(x, y);
  p.rotate(angle);
  p.stroke(...style.hatch);
  p.strokeWeight(0.6);
  for (let i = -r * 2; i < r * 2; i += 4) {
    p.line(i, -r * 2, i, r * 2);
  }
  p.pop();
  ctx.restore();
  p.noFill();
  p.stroke(...style.ink);
  p.strokeWeight(1.5);
  p.circle(x, y, r * 2);
}

export function drawObject(p, x, y, r, style, options = {}) {
  const {
    label = "",
    accent = false,
    tag = "",
    outlineOnly = false,
  } = options;

  if (style.hatchObjects && !outlineOnly) {
    if (accent) {
      p.fill(...style.accent);
      p.noStroke();
      p.circle(x, y, r * 2);
    } else {
      hatchCircle(p, x, y, r, style);
    }
  } else {
    if (outlineOnly) {
      p.noFill();
      p.stroke(...style.ink);
      p.strokeWeight(1.5);
    } else if (accent) {
      if (style.inkOnly) {
        p.fill(...style.ink);
        p.stroke(...style.ink);
        p.strokeWeight(2.5);
      } else {
        p.fill(...style.accent);
        p.stroke(...style.ink);
        p.strokeWeight(1.5);
      }
    } else {
      p.fill(...style.fill);
      p.stroke(...style.ink);
      p.strokeWeight(style.id === "minimal" ? 2 : 1.5);
    }
    p.circle(x, y, r * 2);
  }

  if (tag && style.figureTags) {
    p.noStroke();
    p.fill(...style.muted);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(9);
    p.text(tag, x + r + 4, y - r);
  }

  if (label) {
    p.noStroke();
    p.fill(...style.ink);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(style.id === "engraving" ? 10 : 11);
    p.text(label, x, y - r - (style.figureTags ? 14 : 6));
  }
}

export function drawLevelLine(p, y, style, label = "") {
  p.stroke(...style.light);
  p.strokeWeight(0.75);
  p.line(0, y, p.width, y);

  if (style.dashedLeaders && label) {
    p.drawingContext.setLineDash([3, 3]);
    p.stroke(...style.muted);
    p.line(p.width * 0.82, y, p.width * 0.92, y - 20);
    p.drawingContext.setLineDash([]);
    p.noStroke();
    p.fill(...style.muted);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(9);
    p.text(label, p.width * 0.84, y - 10);
  }
}

export function drawDimensionV(p, x, y1, y2, style, label) {
  if (!style.dashedLeaders) return;
  p.stroke(...style.muted);
  p.strokeWeight(0.75);
  p.drawingContext.setLineDash([4, 3]);
  p.line(x, y1, x, y2);
  p.drawingContext.setLineDash([]);
  const tick = 4;
  p.line(x - tick, y1, x + tick, y1);
  p.line(x - tick, y2, x + tick, y2);
  p.noStroke();
  p.fill(...accentColor(style));
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(10);
  p.text(label, x + 6, (y1 + y2) / 2);
}

export function drawArrow(p, x1, y1, x2, y2, style, accent = true) {
  const color = accent ? accentColor(style) : style.ink;
  p.stroke(...color);
  p.strokeWeight(accent && style.inkOnly ? 2 : style.id === "minimal" ? 2 : 1.25);
  p.line(x1, y1, x2, y2);
  const angle = p.atan2(y2 - y1, x2 - x1);
  const head = style.id === "minimal" ? 10 : 7;
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.line(0, 0, -head, -head * 0.45);
  p.line(0, 0, -head, head * 0.45);
  p.pop();
}

export function drawTarget(p, x, y, style) {
  p.noFill();
  p.stroke(...(style.inkOnly ? style.ink : style.id === "minimal" ? style.muted : style.accent));
  p.strokeWeight(style.inkOnly ? 2 : 1);
  p.circle(x, y, 22);
  p.stroke(...style.light);
  p.line(x - 10, y, x + 10, y);
  p.line(x, y - 10, x, y + 10);
}

export function drawTimeline(p, y, style, labels = []) {
  const x0 = p.width * 0.12;
  const x1 = p.width * 0.88;
  p.stroke(...style.ink);
  p.strokeWeight(style.id === "minimal" ? 1.5 : 1);
  p.line(x0, y, x1, y);

  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const x = p.lerp(x0, x1, i / ticks);
    p.line(x, y - 5, x, y + 5);
    if (labels[i] && style.figureTags) {
      p.noStroke();
      p.fill(...style.muted);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(8);
      p.text(labels[i], x, y + 8);
    }
  }
}

export function drawStatus(p, text, style, accent = false) {
  p.noStroke();
  if (accent && style.inkOnly) {
    p.fill(...style.ink);
    p.textStyle(p.BOLD);
  } else {
    p.textStyle(p.NORMAL);
    p.fill(...(accent ? accentColor(style) : style.ink));
  }
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(10);
  p.text(text, p.width / 2, p.height - 12);
}

export function drawStippleZone(p, x, y, w, h, style) {
  p.noFill();
  p.stroke(...style.light);
  p.rect(x, y, w, h);
  p.stroke(...style.hatch);
  p.strokeWeight(2);
  for (let i = 0; i < 40; i++) {
    const px = x + p.random(w);
    const py = y + p.random(h);
    p.point(px, py);
  }
}
