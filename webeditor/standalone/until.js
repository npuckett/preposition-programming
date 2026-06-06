/*
 * Preposition Programming — UNTIL
 * Tutorial: https://prepositionprogramming.com/preposition-until.html
 *
 * CONCEPT
 * UNTIL means continuing up to a boundary, then stopping when that condition is met.
 *
 * TRY IT
 * Click or tap to start the countdown. It runs until the target value is reached, then stops.
 *
 * KEY CODE (from the tutorial page)
 *   let progress = 0, target = 100, running = false;
 *   if (running && progress < target) progress += speed;
 *   if (progress >= target) { running = false; progress = target; }
 *   let w = map(progress, 0, target, 0, barWidth);
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const mover = {
  x: 200,
  y: 150,
  vx: 2.4,
  vy: 1.7,
  r: 10,
  moving: false,
};
let trail = [];

function startMoving() {
  mover.x = 200;
  mover.y = 150;
  mover.vx = random(-2.8, 2.8);
  mover.vy = random(-2.8, 2.8);
  if (p.abs(mover.vx) < 1) mover.vx = mover.vx < 0 ? -1.4 : 1.4;
  if (p.abs(mover.vy) < 1) mover.vy = mover.vy < 0 ? -1.2 : 1.2;
  trail = [{ x: mover.x, y: mover.y }];
  mover.moving = true;
}

function toggle() {
  mover.moving = !mover.moving;
  if (mover.moving && trail.length === 0) {
    trail.push({ x: mover.x, y: mover.y });
  }
}

function updateMover() {
  mover.x += mover.vx;
  mover.y += mover.vy;
  if (mover.x < mover.r || mover.x > width - mover.r) mover.vx *= -1;
  if (mover.y < mover.r || mover.y > height - mover.r - 20) mover.vy *= -1;
  mover.x = constrain(mover.x, mover.r, width - mover.r);
  mover.y = constrain(mover.y, mover.r, height - mover.r - 20);
  trail.push({ x: mover.x, y: mover.y });
  if (trail.length > 110) trail.shift();
}

function drawBounds() {
  drawDashedLine(12, 12, width - 12, 12);
  drawDashedLine(width - 12, 12, width - 12, height - 28);
  drawDashedLine(width - 12, height - 28, 12, height - 28);
  drawDashedLine(12, height - 28, 12, 12);
}

function drawMover() {
  drawFigureObject(mover.x, mover.y, mover.r, {
    label: "W",
    tag: "UNTIL",
    emphasis: mover.moving ? "solid" : "outline",
  });
  if (mover.moving) {
    drawArrow(mover.x, mover.y, mover.x + mover.vx * 7, mover.y + mover.vy * 7, 1);
  }
}

function drawStatus() {
  if (mover.moving) {
    drawStatusBar("UNTIL moving: click to stop.", true);
    return;
  }
  drawStatusBar("UNTIL stopped: click to move again.");
}

function setup() {
  createCanvas(400, 300);
  startMoving();
  bindPointerInput({ onPress: toggle });
}

function draw() {
  applyBackground();
  drawBounds();
  if (mover.moving) updateMover();
  drawInkTrail(trail);
  drawMover();
  drawStatus();
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

