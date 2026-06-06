/*
 * Preposition Programming — BESIDE
 * Tutorial: https://prepositionprogramming.com/preposition-beside.html
 *
 * CONCEPT
 * BESIDE means next to something, usually to the left or right. Here, the mover's center must fall inside a rectangular zone adjacent to the reference object.
 *
 * TRY IT
 * Drag the moving circle into the zones beside the reference shape. Crosshairs mark the center point being tested.
 *
 * KEY CODE (from the tutorial page)
 *   let leftZone = { x: ref.x - gap - w, y: ref.y, w, h };
 *   function inZone(px, py, z) {
 *   &nbsp;&nbsp;return px >= z.x && px <= z.x + z.w &&
 *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; py >= z.y && py <= z.y + z.h;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const reference = { x: 0, y: 0, width: 86, height: 138 };
const mover = { x: 0, y: 0, radius: 18, dragging: false };
const zoneWidth = 62;
const leftZone = { x: 0, y: 0, w: zoneWidth, h: 0 };
const rightZone = { x: 0, y: 0, w: zoneWidth, h: 0 }

function setup() {
  createCanvas(400, 300);
  reference.x = width * 0.5;
  reference.y = height * 0.5;
  mover.x = width * 0.22;
  mover.y = height * 0.5;
  bindCircleDrag([mover]);
}

function draw() {
  applyBackground();

  leftZone.h = reference.height;
  rightZone.h = reference.height;
  leftZone.x = reference.x - reference.width / 2 - zoneWidth;
  rightZone.x = reference.x + reference.width / 2;
  leftZone.y = reference.y - reference.height / 2;
  rightZone.y = reference.y - reference.height / 2;

  const inLeft = inZone(mover.x, mover.y, leftZone);
  const inRight = inZone(mover.x, mover.y, rightZone);
  const isBeside = inLeft || inRight;

  drawZoneRect(leftZone.x, leftZone.y, leftZone.w, leftZone.h, inLeft);
  drawZoneRect(rightZone.x, rightZone.y, rightZone.w, rightZone.h, inRight);

  drawArrow(reference.x - reference.width / 2,
    reference.y,
    leftZone.x + leftZone.w * 0.6,
    reference.y
  );
  drawArrow(reference.x + reference.width / 2,
    reference.y,
    rightZone.x + rightZone.w * 0.4,
    reference.y
  );

  drawFigureRect(reference.x - reference.width / 2,
    reference.y - reference.height / 2,
    reference.width,
    reference.height,
    { label: "A", tag: "1a", emphasis: "hatch" }
  );
  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "M",
    tag: "1b",
    emphasis: isBeside ? "solid" : "none",
  });
  drawCrosshair(mover.x, mover.y, 10);

  const status = inLeft
    ? "M is BESIDE A (left)"
    : inRight
      ? "M is BESIDE A (right)"
      : "M is not in a BESIDE zone";
  drawStatusBar(status, isBeside);
}

function inZone(x, y, zone) {
  return x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h;
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

