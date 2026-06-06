/*
 * Preposition Programming — BETWEEN
 * Tutorial: https://prepositionprogramming.com/preposition-between.html
 *
 * CONCEPT
 * BETWEEN means in the space separating two other things. Test whether a point's coordinate lies between two bounds on an axis.
 *
 * TRY IT
 * Drag all three circles. C is between A and B when its position falls in the range they define.
 *
 * KEY CODE (from the tutorial page)
 *   let a = { x: 100, y: 150 };
 *   let b = { x: 300, y: 150 };
 *   let c = { x: 200, y: 150 };
 *   let left = min(a.x, b.x);
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const circleA = { x: 0, y: 0, radius: 24, dragging: false };
const circleB = { x: 0, y: 0, radius: 24, dragging: false };
const circleC = { x: 0, y: 0, radius: 20, dragging: false };
const zone = { x: 0, y: 0, w: 0, h: 110 }

function setup() {
  createCanvas(400, 300);
  circleA.x = width * 0.24;
  circleA.y = height * 0.5;
  circleB.x = width * 0.76;
  circleB.y = height * 0.5;
  circleC.x = width * 0.5;
  circleC.y = height * 0.5;
  bindCircleDrag([circleA, circleB, circleC]);
}

function draw() {
  applyBackground();

  const boundaries = getBetweenBoundaries();
  zone.w = Math.max(0, boundaries.right - boundaries.left);
  zone.x = boundaries.left;
  zone.y = height * 0.5 - zone.h / 2;

  const isBetween = checkBetween(boundaries);
  drawZoneRect(zone.x, zone.y, zone.w, zone.h, isBetween);
  drawDimensionH(zone.y - 10,
    boundaries.left,
    boundaries.right,
    `SPAN ${Math.round(zone.w)}`
  );

  drawFigureObject(circleA.x, circleA.y, circleA.radius, {
    label: "A",
    tag: "1a",
    emphasis: "none",
  });
  drawFigureObject(circleB.x, circleB.y, circleB.radius, {
    label: "B",
    tag: "1b",
    emphasis: "none",
  });
  drawFigureObject(circleC.x, circleC.y, circleC.radius, {
    label: "C",
    tag: "1c",
    emphasis: isBetween ? "solid" : "hatch",
  });

  drawStatusBar(statusText(isBetween, boundaries), isBetween);
}

function getBetweenBoundaries() {
  if (circleA.x <= circleB.x) {
    return {
      left: circleA.x + circleA.radius,
      right: circleB.x - circleB.radius,
    };
  }
  return {
    left: circleB.x + circleB.radius,
    right: circleA.x - circleA.radius,
  };
}

function checkBetween(boundaries) {
  if (boundaries.right <= boundaries.left) return false;
  const cLeft = circleC.x - circleC.radius;
  const cRight = circleC.x + circleC.radius;
  return cLeft >= boundaries.left && cRight <= boundaries.right;
}

function statusText(isBetween, boundaries) {
  if (boundaries.right <= boundaries.left) {
    return "Anchors overlap — no BETWEEN span";
  }
  if (isBetween) return "C is BETWEEN A and B";
  if (circleC.x < boundaries.left) return "C is left of BETWEEN span";
  if (circleC.x > boundaries.right) return "C is right of BETWEEN span";
  return "C intersects a boundary edge";
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

