/*
 * Preposition Programming — UNDER
 * Tutorial: https://prepositionprogramming.com/preposition-under.html
 *
 * CONCEPT
 * UNDER means passing below something. The sketch animates a curved path that dips beneath a bridge-like barrier.
 *
 * TRY IT
 * Click or tap to run the arc beneath the obstacle. Keys 1–3 change depth; Space toggles the path guide.
 *
 * KEY CODE (from the tutorial page)
 *   let start = { x: 50, y: 200 }, end = { x: 350, y: 200 };
 *   let control = { x: 200, y: 260 };
 *   let x = bezierPoint(start.x, start.x, end.x, end.x, t);
 *   let y = bezierPoint(start.y, control.y, control.y, end.y, t);
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const bridge = { x: 200, y: 120, width: 80, height: 60 };
const start = { x: 50, y: 200 };
const end = { x: 350, y: 200 };
const cp1 = { x: 150, y: 270 };
const cp2 = { x: 250, y: 270 };
const mover = { x: 50, y: 200, radius: 12 };

let progress = 0;
let isMoving = false;
let hasCompleted = false;
const trail = [];

function setup() {
  createCanvas(400, 300);
  bindPointerInput({
    onPress: () => {
      progress = 0;
      isMoving = true;
      hasCompleted = false;
      mover.x = start.x;
      mover.y = start.y;
      trail.length = 0;
    },
  });
}

function draw() {
  applyBackground();

  if (isMoving && progress < 1) {
    progress += 0.015;
    mover.x = p.bezierPoint(start.x, cp1.x, cp2.x, end.x, progress);
    mover.y = p.bezierPoint(start.y, cp1.y, cp2.y, end.y, progress);
    trail.push({ x: mover.x, y: mover.y });
    if (trail.length > 90) trail.shift();
    if (progress >= 1) {
      isMoving = false;
      hasCompleted = true;
    }
  }

  drawZoneRect(bridge.x - bridge.width / 2,
    bridge.y - bridge.height / 2,
    bridge.width,
    bridge.height,
    true
  );
  drawDashedLine(bridge.x - bridge.width / 2, bridge.y + bridge.height / 2, bridge.x - bridge.width / 2, 280);
  drawDashedLine(bridge.x + bridge.width / 2, bridge.y + bridge.height / 2, bridge.x + bridge.width / 2, 280);

  for (let i = 1; i <= 26; i++) {
    const t0 = (i - 1) / 26;
    const t1 = i / 26;
    drawDashedLine(p.bezierPoint(start.x, cp1.x, cp2.x, end.x, t0),
      p.bezierPoint(start.y, cp1.y, cp2.y, end.y, t0),
      p.bezierPoint(start.x, cp1.x, cp2.x, end.x, t1),
      p.bezierPoint(start.y, cp1.y, cp2.y, end.y, t1)
    );
  }

  drawInkTrail(trail);
  drawFigureObject(start.x, start.y, 7, { label: "start", tag: "1", emphasis: "outline" });
  drawFigureObject(end.x, end.y, 7, { label: "end", tag: "2", emphasis: "outline" });
  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "mover",
    tag: "m",
    emphasis: isMoving ? "hatch" : hasCompleted ? "solid" : "none",
  });

  if (isMoving) {
    const nt = p.min(progress + 0.02, 1);
    const nx = p.bezierPoint(start.x, cp1.x, cp2.x, end.x, nt);
    const ny = p.bezierPoint(start.y, cp1.y, cp2.y, end.y, nt);
    drawArrow(mover.x, mover.y, nx, ny, 1.2);
  }

  drawStatusBar(hasCompleted
      ? "Figure m moved under the bridge."
      : isMoving
        ? "Figure m follows a dip under the bridge."
        : "Click/tap to move figure m under.",
    isMoving || hasCompleted
  );
};
// --- Pointer input (wired by bindPointerInput / bindCircleDrag in setup) ---
function mousePressed() {
  if (_ppInput.onPress) _ppInput.onPress();
}

function mouseDragged() {
  if (_ppInput.onDrag) _ppInput.onDrag();
}

function mouseReleased() {
  if (_ppInput.onRelease) _ppInput.onRelease();
}

function touchStarted() {
  if (_ppInput.onPress) _ppInput.onPress();
  return false;
}

function touchMoved() {
  if (_ppInput.onDrag) _ppInput.onDrag();
  return false;
}

function touchEnded() {
  if (_ppInput.onRelease) _ppInput.onRelease();
  return false;
}

