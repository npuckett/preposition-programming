/*
 * Preposition Programming — TOWARD
 * Tutorial: https://prepositionprogramming.com/preposition-toward.html
 *
 * CONCEPT
 * TOWARD means moving in the direction of something. Compute the vector from the object to the target and advance along it over time.
 *
 * TRY IT
 * Click or tap to set a target. The circle moves step by step toward that point each frame.
 *
 * KEY CODE (from the tutorial page)
 *   let mover = { x: 100, y: 100, speed: 2 };
 *   let target = { x: 300, y: 200 };
 *   let dx = target.x - mover.x;
 *   let dy = target.y - mover.y;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const mover = {
  x: 200,
  y: 150,
  targetX: 200,
  targetY: 150,
  speed: 0.05,
  radius: 10,
  trail: [],
};

let isMoving = false;

function setup() {
  createCanvas(400, 300);
  mover.targetX = width / 2;
  mover.targetY = height / 2;

  bindPointerInput({
    onPress: () => {
      mover.targetX = pointerX();
      mover.targetY = pointerY();
      mover.trail = [];
      isMoving = true;
    },
  });
}

function draw() {
  applyBackground();

  if (isMoving) {
    mover.x = lerp(mover.x, mover.targetX, mover.speed);
    mover.y = lerp(mover.y, mover.targetY, mover.speed);
    mover.trail.push({ x: mover.x, y: mover.y });
    if (mover.trail.length > 50) mover.trail.shift();

    const distance = dist(mover.x, mover.y, mover.targetX, mover.targetY);
    if (distance < 5) isMoving = false;
  }

  drawInkTrail(mover.trail);
  drawTargetMark(mover.targetX, mover.targetY, 11);

  if (isMoving) {
    drawArrow(mover.x, mover.y, mover.targetX, mover.targetY, 1.25);
  }

  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "mover",
    tag: "m",
    emphasis: isMoving ? "hatch" : "none",
  });

  noStroke();
  fill(...PALETTE.muted);
  textAlign(CENTER, TOP);
  textSize(9);
  text("target", mover.targetX, mover.targetY + 12);

  drawStatusBar(isMoving
      ? "Figure m moves toward target t."
      : "Click/tap to set a target and move toward it.",
    isMoving
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

