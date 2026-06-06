/*
 * Preposition Programming — AROUND
 * Tutorial: https://prepositionprogramming.com/preposition-around.html
 *
 * CONCEPT
 * AROUND means moving on a curved path about something—orbiting or encircling a center.
 *
 * TRY IT
 * Click or tap to set an orbit center. The circle travels around it on a circular path.
 *
 * KEY CODE (from the tutorial page)
 *   let center = { x: 200, y: 150 };
 *   let r = 80, angle = 0;
 *   let x = center.x + cos(angle) * r;
 *   let y = center.y + sin(angle) * r;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const center = { x: 280, y: 150, radius: 50 };
const mover = { x: 0, y: 0, radius: 12 };

let angle = 0;
let orbitRadius = 80;
let isMoving = false;
const trail = [];
const speed = 0.03;

function setup() {
  createCanvas(400, 300);
  mover.x = center.x + orbitRadius;
  mover.y = center.y;

  bindPointerInput({
    onPress: () => {
      center.x = pointerX();
      center.y = pointerY();
      angle = 0;
      isMoving = true;
      trail.length = 0;
      mover.x = center.x + orbitRadius;
      mover.y = center.y;
    },
  });
}

function draw() {
  applyBackground();

  if (isMoving) {
    angle += speed;
    mover.x = center.x + cos(angle) * orbitRadius;
    mover.y = center.y + sin(angle) * orbitRadius;
    trail.push({ x: mover.x, y: mover.y });
    if (trail.length > 60) trail.shift();
  }

  const guideSteps = 36;
  for (let i = 0; i < guideSteps; i++) {
    const a1 = map(i, 0, guideSteps, 0, p.TWO_PI);
    const a2 = map(i + 1, 0, guideSteps, 0, p.TWO_PI);
    drawDashedLine(center.x + cos(a1) * orbitRadius,
      center.y + sin(a1) * orbitRadius,
      center.x + cos(a2) * orbitRadius,
      center.y + sin(a2) * orbitRadius
    );
  }

  drawTargetMark(center.x, center.y, 9);
  drawFigureObject(center.x, center.y, center.radius, {
    label: "center",
    tag: "c",
    emphasis: "outline",
  });

  drawInkTrail(trail);
  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "mover",
    tag: "m",
    emphasis: isMoving ? "hatch" : "none",
  });

  if (isMoving) {
    const tx = center.x + cos(angle + p.PI / 2) * 24;
    const ty = center.y + sin(angle + p.PI / 2) * 24;
    drawArrow(mover.x, mover.y, tx, ty, 1.2);
  }

  drawStatusBar(isMoving
      ? "Figure m moves around center c."
      : "Click/tap to set center c and orbit around it.",
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

