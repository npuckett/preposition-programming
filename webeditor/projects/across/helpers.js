/**
 * Shared drawing helpers — Technical Figure (Ink Only).
 * Used by Preposition Programming Web Editor sketches.
 * You can edit these, but most learning happens in the sketch sections below.
 */

const PALETTE = {
  bg: [252, 252, 250],
  ink: [17, 17, 17],
  muted: [120, 120, 118],
  light: [210, 210, 208],
  hatch: [200, 200, 198],
  fill: [245, 245, 243],
  objectA: [50, 50, 50],
  objectB: [90, 90, 90],
  showGrid: true,
  gridStep: 16,
  dashedLeaders: true,
  figureTags: true,
};

function applyBackground() {
  background(...PALETTE.bg);
  if (!PALETTE.showGrid) return;
  stroke(...PALETTE.light);
  strokeWeight(0.5);
  const step = PALETTE.gridStep || 16;
  for (let x = 0; x <= width; x += step) line(x, 0, x, height);
  for (let y = 0; y <= height; y += step) line(0, y, width, y);
}

function inkStroke(weight = 1) {
  stroke(...PALETTE.ink);
  strokeWeight(weight);
}

function mutedStroke(weight = 1) {
  stroke(...PALETTE.muted);
  strokeWeight(weight);
}

function drawCrosshair(x, y, size = 8) {
  mutedStroke(0.75);
  line(x - size, y, x + size, y);
  line(x, y - size, x, y + size);
}

function hatchCircle(x, y, r, spacing = 4, angle = 0.785) {
  const ctx = drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  push();
  translate(x, y);
  rotate(angle);
  stroke(...PALETTE.hatch);
  strokeWeight(0.6);
  for (let i = -r * 2; i < r * 2; i += spacing) line(i, -r * 2, i, r * 2);
  pop();
  ctx.restore();
}

function drawLeaderLine(x1, y1, x2, y2, label = "") {
  drawingContext.setLineDash([4, 4]);
  mutedStroke(0.75);
  line(x1, y1, x2, y2);
  drawingContext.setLineDash([]);
  if (label) {
    noStroke();
    fill(...PALETTE.muted);
    textAlign(CENTER, BOTTOM);
    textSize(9);
    text(label, (x1 + x2) / 2, (y1 + y2) / 2 - 4);
  }
}

function drawHatchRect(x, y, w, h, spacing = 6) {
  noFill();
  inkStroke(0.5);
  rect(x, y, w, h);
  stroke(...PALETTE.hatch);
  strokeWeight(0.5);
  for (let i = -h; i < w + h; i += spacing) line(x + i, y, x + i + h, y + h);
}

function drawLevelLine(y, label = "") {
  stroke(...PALETTE.light);
  strokeWeight(0.75);
  line(0, y, width, y);
  if (label && PALETTE.dashedLeaders) {
    drawLeaderLine(width * 0.82, y, width * 0.92, y - 18, label);
  }
}

function drawDimensionV(x, y1, y2, label) {
  if (!PALETTE.dashedLeaders) return;
  mutedStroke(0.75);
  drawingContext.setLineDash([4, 3]);
  line(x, y1, x, y2);
  drawingContext.setLineDash([]);
  const tick = 4;
  inkStroke(0.75);
  line(x - tick, y1, x + tick, y1);
  line(x - tick, y2, x + tick, y2);
  noStroke();
  fill(...PALETTE.ink);
  textAlign(LEFT, CENTER);
  textSize(10);
  textStyle(BOLD);
  text(label, x + 6, (y1 + y2) / 2);
  textStyle(NORMAL);
}

function drawDimensionH(y, x1, x2, label) {
  if (!PALETTE.dashedLeaders) return;
  mutedStroke(0.75);
  drawingContext.setLineDash([4, 3]);
  line(x1, y, x2, y);
  drawingContext.setLineDash([]);
  const tick = 4;
  inkStroke(0.75);
  line(x1, y - tick, x1, y + tick);
  line(x2, y - tick, x2, y + tick);
  noStroke();
  fill(...PALETTE.ink);
  textAlign(CENTER, BOTTOM);
  textSize(10);
  textStyle(BOLD);
  text(label, (x1 + x2) / 2, y - 6);
  textStyle(NORMAL);
}

function drawContainerRect(x, y, w, h, options = {}) {
  const { label = "", tag = "" } = options;
  noFill();
  inkStroke(1.25);
  rect(x, y, w, h);
  if (tag && PALETTE.figureTags) {
    noStroke();
    fill(...PALETTE.muted);
    textAlign(LEFT, TOP);
    textSize(9);
    text(tag, x + 4, y + 4);
  }
  if (label) {
    fill(...PALETTE.muted);
    textAlign(CENTER, TOP);
    text(label, x + w / 2, y + h + 6);
  }
}

function drawZoneRect(x, y, w, h, active = false) {
  if (active) {
    fill(...PALETTE.fill);
    inkStroke(1.25);
  } else {
    fill(...PALETTE.bg);
    mutedStroke(0.75);
  }
  rect(x, y, w, h);
}

function drawFigureRect(x, y, w, h, options = {}) {
  const { label = "", tag = "", emphasis = "none" } = options;
  const cx = x + w / 2;
  const cy = y + h / 2;

  if (emphasis === "hatch") {
    drawHatchRect(x, y, w, h);
  } else if (emphasis === "solid") {
    fill(...PALETTE.ink);
    inkStroke(2);
    rect(x, y, w, h);
  } else {
    fill(...PALETTE.fill);
    inkStroke(1.25);
    rect(x, y, w, h);
  }

  if (tag && PALETTE.figureTags) {
    noStroke();
    fill(...PALETTE.muted);
    textAlign(LEFT, BOTTOM);
    textSize(9);
    text(tag, x + w + 4, y);
  }
  if (label) {
    noStroke();
    fill(...PALETTE.ink);
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text(label, cx, y - (tag ? 14 : 4));
  }
}

function drawInkTrail(points) {
  if (points.length < 2) return;
  for (let i = 1; i < points.length; i++) {
    const alpha = map(i, 0, points.length - 1, 40, 200);
    stroke(...PALETTE.muted, alpha);
    strokeWeight(1);
    line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
  }
}

function drawDashedLine(x1, y1, x2, y2) {
  drawingContext.setLineDash([4, 4]);
  mutedStroke(0.75);
  line(x1, y1, x2, y2);
  drawingContext.setLineDash([]);
}

function drawFigureObject(x, y, r, options = {}) {
  const { label = "", tag = "", emphasis = "none" } = options;

  if (emphasis === "hatch") {
    hatchCircle(x, y, r);
    inkStroke(1.5);
    noFill();
    circle(x, y, r * 2);
  } else if (emphasis === "solid") {
    fill(...PALETTE.ink);
    inkStroke(2);
    circle(x, y, r * 2);
  } else if (emphasis === "outline") {
    noFill();
    inkStroke(1.25);
    circle(x, y, r * 2);
  } else {
    fill(...PALETTE.fill);
    inkStroke(1.25);
    circle(x, y, r * 2);
  }

  if (tag && PALETTE.figureTags) {
    noStroke();
    fill(...PALETTE.muted);
    textAlign(LEFT, BOTTOM);
    textSize(9);
    text(tag, x + r + 4, y - r);
  }
  if (label) {
    noStroke();
    fill(...PALETTE.ink);
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text(label, x, y - r - (tag ? 14 : 6));
  }
}

function drawStatusBar(text, strong = false) {
  noStroke();
  fill(...PALETTE.ink);
  textAlign(CENTER, CENTER);
  textSize(11);
  if (strong) textStyle(BOLD);
  text(text, width / 2, height - 14);
  textStyle(NORMAL);
}

function drawArrow(x1, y1, x2, y2, weight = 1.25) {
  inkStroke(weight);
  line(x1, y1, x2, y2);
  const angle = atan2(y2 - y1, x2 - x1);
  const headLen = 8;
  push();
  translate(x2, y2);
  rotate(angle);
  line(0, 0, -headLen, -4);
  line(0, 0, -headLen, 4);
  pop();
}

function drawTimeline(y, xStart, xEnd, labels = []) {
  inkStroke(1);
  line(xStart, y, xEnd, y);
  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const x = lerp(xStart, xEnd, i / ticks);
    line(x, y - 5, x, y + 5);
    if (labels[i] && PALETTE.figureTags) {
      noStroke();
      fill(...PALETTE.muted);
      textAlign(CENTER, TOP);
      textSize(8);
      text(labels[i], x, y + 8);
    }
  }
}

function drawTargetMark(x, y, size = 12) {
  noFill();
  inkStroke(1.5);
  circle(x, y, size * 2);
  drawCrosshair(x, y, size * 0.6);
}

// --- Pointer input (mouse + touch) ---

function pointerX() {
  return touches.length > 0 ? touches[0].x : mouseX;
}

function pointerY() {
  return touches.length > 0 ? touches[0].y : mouseY;
}

function hitCircle(x, y, cx, cy, radius) {
  return dist(x, y, cx, cy) < radius;
}

/** @type {{ onPress?: Function, onDrag?: Function, onRelease?: Function }} */
let _ppInput = {};

function bindPointerInput(handlers = {}) {
  _ppInput = handlers;
}

function bindCircleDrag(circles) {
  bindPointerInput({
    onPress: () => {
      const x = pointerX();
      const y = pointerY();
      for (const c of circles) {
        if (hitCircle(x, y, c.x, c.y, c.radius)) {
          c.dragging = true;
          return;
        }
      }
    },
    onDrag: () => {
      const x = pointerX();
      const y = pointerY();
      for (const c of circles) {
        if (c.dragging) {
          c.x = x;
          c.y = y;
        }
      }
    },
    onRelease: () => {
      for (const c of circles) {
        c.dragging = false;
      }
    },
  });
}
