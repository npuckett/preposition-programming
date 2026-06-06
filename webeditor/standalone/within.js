/*
 * Preposition Programming — WITHIN
 * Tutorial: https://prepositionprogramming.com/preposition-within.html
 *
 * CONCEPT
 * WITHIN means inside the boundaries of something else. Test whether a point—usually the object's center—sits inside the container edges.
 *
 * TRY IT
 * Drag both circles. Each is within the container when its center lies inside the rectangle.
 *
 * KEY CODE (from the tutorial page)
 *   let box = { x: 100, y: 80, w: 200, h: 140 };
 *   function isWithin(obj, box) {
 *   &nbsp;&nbsp;return obj.x >= box.x && obj.x <= box.x + box.w &&
 *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; obj.y >= box.y && obj.y <= box.y + box.h;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const container = { x: 0, y: 0, width: 220, height: 150 };
const circleA = { x: 0, y: 0, radius: 20, dragging: false };
const circleB = { x: 0, y: 0, radius: 16, dragging: false }

function setup() {
  createCanvas(400, 300);
  container.x = width * 0.3;
  container.y = height * 0.24;
  container.width = width * 0.46;
  container.height = height * 0.5;
  circleA.x = container.x + container.width * 0.35;
  circleA.y = container.y + container.height * 0.45;
  circleB.x = width * 0.15;
  circleB.y = height * 0.16;
  bindCircleDrag([circleA, circleB]);
}

function draw() {
  applyBackground();

  const aWithin = checkWithin(circleA);
  const bWithin = checkWithin(circleB);

  drawContainerRect(container.x, container.y, container.width, container.height, {
    label: "CONTAINER",
    tag: "1",
  });

  drawFigureObject(circleA.x, circleA.y, circleA.radius, {
    label: "A",
    tag: "1a",
    emphasis: aWithin ? "solid" : "none",
  });
  drawFigureObject(circleB.x, circleB.y, circleB.radius, {
    label: "B",
    tag: "1b",
    emphasis: bWithin ? "solid" : "hatch",
  });

  const status =
    aWithin && bWithin
      ? "A and B are WITHIN container"
      : aWithin
        ? "A is WITHIN container; B is outside"
        : bWithin
          ? "B is WITHIN container; A is outside"
          : "Neither A nor B is WITHIN container";
  drawStatusBar(status, aWithin || bWithin);
}

function checkWithin(circle) {
  return (circle.x >= container.x &&
    circle.x <= container.x + container.width &&
    circle.y >= container.y &&
    circle.y <= container.y + container.height
  );
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

