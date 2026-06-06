/*
 * Preposition Programming — SINCE
 * Tutorial: https://prepositionprogramming.com/preposition-since.html
 *
 * CONCEPT
 * SINCE marks the start of a period that continues to the present. Accumulate state from that reference point onward.
 *
 * TRY IT
 * Click or tap to set a start point. The trail grows continuously from that moment forward.
 *
 * KEY CODE (from the tutorial page)
 *   let origin = { x: 0, y: 0 };
 *   let trail = [];
 *   let growing = false;
 *   origin.x = mouseX; origin.y = mouseY; trail = []; growing = true;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const origin = { x: 200, y: 150 };
let trail = [];
let active = false;
let step = 0;

function startAtPointer() {
  origin.x = constrain(pointerX(), 24, width - 24);
  origin.y = constrain(pointerY(), 28, height - 42);
  trail = [{ x: origin.x, y: origin.y }];
  step = 0;
  active = true;
}

function updateTrail() {
  step += 1;
  const angle = step * 0.18 + frameCount * 0.015;
  const radius = 0.55 * step;
  const x = origin.x + cos(angle) * radius;
  const y = origin.y + sin(angle) * radius;
  trail.push({ x, y });
  if (trail.length > 220) trail.shift();
}

function drawSpiral() {
  drawInkTrail(trail);
  if (trail.length > 1) {
    noFill();
    stroke(...PALETTE.ink);
    p.strokeWeight(0.9);
    beginShape();
    for (const point of trail) vertex(point.x, point.y);
    endShape();
  }
  drawFigureObject(origin.x, origin.y, 6, {
    label: "Origin",
    tag: "S",
    emphasis: "hatch",
  });
  if (trail.length > 0) {
    const tip = trail[trail.length - 1];
    drawFigureObject(tip.x, tip.y, 4, { label: "", tag: "", emphasis: "solid" });
    drawArrow(origin.x + 12, origin.y - 12, tip.x, tip.y, 0.9);
  }
}

function drawStatus() {
  if (!active) {
    drawStatusBar("Click to set origin for SINCE trail.");
    return;
  }
  drawStatusBar(`SINCE origin: ${trail.length} points accumulated`, true);
}

function setup() {
  createCanvas(400, 300);
  bindPointerInput({ onPress: startAtPointer });
}

function draw() {
  applyBackground();
  if (active) updateTrail();
  drawSpiral();
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

