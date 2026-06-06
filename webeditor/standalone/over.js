/*
 * Preposition Programming — OVER
 * Tutorial: https://prepositionprogramming.com/preposition-over.html
 *
 * CONCEPT
 * OVER means above something while crossing from one side to the other, keeping clearance over it.
 *
 * TRY IT
 * Click or tap to animate the arc over the obstacle.
 *
 * KEY CODE (from the tutorial page)
 *   let obstacle = { x: 200, y: 180, w: 60, h: 40 };
 *   let start = { x: 80, y: 200 }, end = { x: 320, y: 200 };
 *   let arcH = start.y - obstacle.y + clearance;
 *   let x = lerp(start.x, end.x, t);
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const obstacle = { x: 200, y: 180, width: 80, height: 60 };
const start = { x: 50, y: 200 };
const end = { x: 350, y: 200 };
const control = { x: 200, y: 100 };
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
    mover.x = p.bezierPoint(start.x, start.x, end.x, end.x, progress);
    mover.y = p.bezierPoint(start.y, control.y, control.y, end.y, progress);
    trail.push({ x: mover.x, y: mover.y });
    if (trail.length > 90) trail.shift();
    if (progress >= 1) {
      isMoving = false;
      hasCompleted = true;
    }
  }

  drawZoneRect(obstacle.x - obstacle.width / 2,
    obstacle.y - obstacle.height / 2,
    obstacle.width,
    obstacle.height,
    true
  );
  drawDashedLine(obstacle.x - obstacle.width / 2, 50, obstacle.x - obstacle.width / 2, 220);
  drawDashedLine(obstacle.x + obstacle.width / 2, 50, obstacle.x + obstacle.width / 2, 220);

  for (let i = 1; i <= 24; i++) {
    const t0 = (i - 1) / 24;
    const t1 = i / 24;
    drawDashedLine(p.bezierPoint(start.x, start.x, end.x, end.x, t0),
      p.bezierPoint(start.y, control.y, control.y, end.y, t0),
      p.bezierPoint(start.x, start.x, end.x, end.x, t1),
      p.bezierPoint(start.y, control.y, control.y, end.y, t1)
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
    const nx = p.bezierPoint(start.x, start.x, end.x, end.x, nt);
    const ny = p.bezierPoint(start.y, control.y, control.y, end.y, nt);
    drawArrow(mover.x, mover.y, nx, ny, 1.2);
  }

  drawStatusBar(hasCompleted
      ? "Figure m moved over obstacle."
      : isMoving
        ? "Figure m follows an arc over the obstacle."
        : "Click/tap to move figure m over.",
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

