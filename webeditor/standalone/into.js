/*
 * Preposition Programming — INTO
 * Tutorial: https://prepositionprogramming.com/preposition-into.html
 *
 * CONCEPT
 * INTO means entering a space—from outside to inside. The sketch uses an arc path that crosses the container boundary.
 *
 * TRY IT
 * Click or tap to replay the arc motion into the container. Watch the object move from outside to inside.
 *
 * KEY CODE (from the tutorial page)
 *   let box = { x: 280, y: 150, w: 100, h: 80 };
 *   let start = { x: 80, y: 200 }, end = { x: 320, y: 190 };
 *   let x = lerp(start.x, end.x, t);
 *   let y = lerp(start.y, end.y, t) - sin(t * PI) * arcH;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const box = { x: 280, y: 150, width: 100, height: 80 };

const start = { x: 80, y: 200 };
const target = { x: 330, y: 170 };
const mover = { x: 80, y: 200, radius: 10 };

let progress = 0;
let isMoving = false;

function setup() {
  createCanvas(400, 300);
  bindPointerInput({
    onPress: () => {
      progress = 0;
      isMoving = true;
      mover.x = start.x;
      mover.y = start.y;
    },
  });
}

function draw() {
  applyBackground();

  if (isMoving && progress < 1) {
    progress += 0.015;
    mover.x = lerp(start.x, target.x, progress);
    const straightY = lerp(start.y, target.y, progress);
    const arcOffset = sin(progress * p.PI) * 80;
    mover.y = straightY - arcOffset;
    if (progress >= 1) isMoving = false;
  }

  const isInside =
    mover.x > box.x && mover.x < box.x + box.width && mover.y > box.y && mover.y < box.y + box.height;

  const samples = 20;
  for (let i = 1; i <= samples; i++) {
    const t0 = (i - 1) / samples;
    const t1 = i / samples;
    const x1 = lerp(start.x, target.x, t0);
    const y1 = lerp(start.y, target.y, t0) - sin(t0 * p.PI) * 80;
    const x2 = lerp(start.x, target.x, t1);
    const y2 = lerp(start.y, target.y, t1) - sin(t1 * p.PI) * 80;
    drawDashedLine(x1, y1, x2, y2);
  }

  if (isMoving) {
    const t2 = p.min(progress + 0.03, 1);
    const nx = lerp(start.x, target.x, t2);
    const ny = lerp(start.y, target.y, t2) - sin(t2 * p.PI) * 80;
    drawArrow(mover.x, mover.y, nx, ny, 1.2);
  }

  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "mover",
    tag: "m",
    emphasis: isMoving ? "hatch" : "none",
  });

  fill(...PALETTE.fill, 120);
  noStroke();
  rect(box.x, box.y, box.width, box.height);
  drawContainerRect(box.x, box.y, box.width, box.height, {
    label: "container",
    tag: "t",
  });

  drawStatusBar(isInside
      ? "Figure m is into target container t."
      : isMoving
        ? "Figure m moves into container t."
        : "Click/tap to run the into arc.",
    isMoving || isInside
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

