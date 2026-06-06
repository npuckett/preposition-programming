/*
 * Preposition Programming — THROUGH
 * Tutorial: https://prepositionprogramming.com/preposition-through.html
 *
 * CONCEPT
 * THROUGH means moving from one side of something to the other, passing inside or across its boundary. Track entry, interior, and exit as separate states.
 *
 * TRY IT
 * Drag the circle through the barrier. Labels track whether it is outside, inside, or has finished crossing.
 *
 * KEY CODE (from the tutorial page)
 *   let barrier = { x: 180, y: 50, w: 40, h: 200 };
 *   let entered = false, exited = false;
 *   let inside = x > barrier.x && x < barrier.x + barrier.w;
 *   if (inside && !entered) entered = true;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const barrier = { x: 0, y: 0, width: 42, height: 0 };
const mover = { x: 0, y: 0, radius: 16, dragging: false };
let entrySide = null;
let state = "outside"; // outside | inside | exited

function setup() {
  createCanvas(400, 300);
  barrier.x = width * 0.5 - 21;
  barrier.y = height * 0.16;
  barrier.height = height * 0.66;
  mover.x = width * 0.23;
  mover.y = height * 0.5;
  bindCircleDrag([mover]);
}

function draw() {
  applyBackground();

  const inside = isInsideBarrier(mover.x, mover.y);
  updateState(inside);

  drawZoneRect(barrier.x, barrier.y, barrier.width, barrier.height, inside);
  drawFigureRect(barrier.x, barrier.y, barrier.width, barrier.height, {
    label: "BARRIER",
    tag: "1",
    emphasis: "hatch",
  });
  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "M",
    tag: "1a",
    emphasis: state === "inside" ? "solid" : state === "exited" ? "hatch" : "none",
  });

  drawStatusBar(statusText(), state !== "outside");
}

function isInsideBarrier(x, y) {
  return x >= barrier.x && x <= barrier.x + barrier.width && y >= barrier.y && y <= barrier.y + barrier.height;
}

function sideOfBarrier(x) {
  return x < barrier.x + barrier.width / 2 ? "left" : "right";
}

function updateState(inside) {
  if (inside) {
    if (state === "outside") {
      entrySide = sideOfBarrier(mover.x);
    }
    state = "inside";
    return;
  }

  if (state === "inside") {
    const exitSide = sideOfBarrier(mover.x);
    state = entrySide && exitSide !== entrySide ? "exited" : "outside";
    if (state === "outside") entrySide = null;
  }
}

function statusText() {
  if (state === "inside") return `M is moving THROUGH barrier (from ${entrySide})`;
  if (state === "exited") return "M moved THROUGH barrier";
  return "M is outside barrier";
}
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

