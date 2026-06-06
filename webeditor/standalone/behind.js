/*
 * Preposition Programming — BEHIND
 * Tutorial: https://prepositionprogramming.com/preposition-behind.html
 *
 * CONCEPT
 * BEHIND means at the back, partially hidden by something in front. In 2D, draw order sets layering—shapes drawn earlier appear behind shapes drawn later.
 *
 * TRY IT
 * Drag both circles. One is always drawn first (behind). Overlap percentage updates when they intersect.
 *
 * KEY CODE (from the tutorial page)
 *   let back = { x: 120, y: 150, r: 55 };
 *   let front = { x: 200, y: 150, r: 55 };
 *   ellipse(back.x, back.y, back.r * 2); // behind
 *   ellipse(front.x, front.y, front.r * 2); // in front
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const circleA = { x: 0, y: 0, radius: 56, dragging: false };
const circleB = { x: 0, y: 0, radius: 56, dragging: false }

function setup() {
  createCanvas(400, 300);
  circleA.x = width * 0.36;
  circleA.y = height * 0.5;
  circleB.x = width * 0.64;
  circleB.y = height * 0.5;
  bindCircleDrag([circleB, circleA]);
}

function draw() {
  applyBackground();

  const distance = dist(circleA.x, circleA.y, circleB.x, circleB.y);
  const overlap = overlapPercent(distance, circleA.radius, circleB.radius);
  const hasOverlap = overlap > 0;

  drawFigureObject(circleA.x, circleA.y, circleA.radius, {
    label: "A",
    tag: "1a",
    emphasis: hasOverlap ? "hatch" : "none",
  });
  drawFigureObject(circleB.x, circleB.y, circleB.radius, {
    label: "B",
    tag: "1b",
    emphasis: "solid",
  });

  const status = hasOverlap
    ? `A is BEHIND B — overlap ${Math.round(overlap)}%`
    : "A is BEHIND B — no overlap";
  drawStatusBar(status, hasOverlap);
}

function overlapPercent(distance, r1, r2) {
  const sum = r1 + r2;
  if (distance >= sum) return 0;
  const penetration = sum - distance;
  const maxPenetration = 2 * Math.min(r1, r2);
  return constrain((penetration / maxPenetration) * 100, 0, 100);
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

