/*
 * Preposition Programming — PAST
 * Tutorial: https://prepositionprogramming.com/preposition-past.html
 *
 * CONCEPT
 * PAST means beyond a reference point—movement continues after passing it.
 *
 * TRY IT
 * Click or tap to launch the circle past the reference point. Status updates once it moves beyond it.
 *
 * KEY CODE (from the tutorial page)
 *   let ref = { x: 200, y: 150 };
 *   let mover = { x: 50, y: 150, speed: 3, hasPassed: false };
 *   if (isMoving) mover.x += mover.speed;
 *   if (!mover.hasPassed && mover.x > ref.x) mover.hasPassed = true;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const reference = { x: 200, y: 150, radius: 20 };
const mover = { x: 50, y: 150, radius: 12.5, speed: 2, isMoving: false, hasPassed: false };
const trail = [];

function setup() {
  createCanvas(400, 300);
  bindPointerInput({
    onPress: () => {
      if (!mover.isMoving) {
        mover.x = 50;
        mover.y = 150;
        mover.isMoving = true;
        mover.hasPassed = false;
        trail.length = 0;
      }
    },
  });
}

function draw() {
  applyBackground();

  if (mover.isMoving) {
    trail.push({ x: mover.x, y: mover.y });
    if (trail.length > 50) trail.shift();

    mover.x += mover.speed;
    if (!mover.hasPassed && mover.x > reference.x) mover.hasPassed = true;
    if (mover.x > width + 30) mover.isMoving = false;
  }

  drawInkTrail(trail);
  drawDashedLine(reference.x, 20, reference.x, height - 30);
  drawTargetMark(reference.x, reference.y, 10);
  drawFigureObject(reference.x, reference.y, reference.radius, {
    label: "reference",
    tag: "t",
    emphasis: "outline",
  });

  if (mover.isMoving) {
    drawArrow(mover.x, mover.y, mover.x + 24, mover.y, 1.2);
  }

  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "mover",
    tag: "m",
    emphasis: mover.hasPassed ? "solid" : mover.isMoving ? "hatch" : "none",
  });

  drawStatusBar(mover.hasPassed
      ? "Figure m has moved past reference t."
      : mover.isMoving
        ? "Figure m is moving toward and past t."
        : "Click/tap to move figure m past t.",
    mover.isMoving || mover.hasPassed
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

