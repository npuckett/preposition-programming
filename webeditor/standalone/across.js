/*
 * Preposition Programming — ACROSS
 * Tutorial: https://prepositionprogramming.com/preposition-across.html
 *
 * CONCEPT
 * ACROSS means from one side to the opposite side, often crossing over or through something in between.
 *
 * TRY IT
 * Click or tap to animate the circle from one side to the other, crossing the barrier between them.
 *
 * KEY CODE (from the tutorial page)
 *   let start = { x: 50, y: 150 };
 *   let end = { x: 350, y: 150 };
 *   let progress = 0;
 *   let x = lerp(start.x, end.x, progress);
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const room = { x: 50, y: 80, width: 300, height: 140 };
const barrierX = room.x + room.width / 2;

const startPoint = { x: 70, y: 150 };
const endPoint = { x: 330, y: 150 };

const mover = { x: 70, y: 150, radius: 15 };
let progress = 0;
let isMoving = false;
let hasCrossed = false;
const trail = [];

function setup() {
  createCanvas(400, 300);
  mover.x = startPoint.x;
  mover.y = startPoint.y;

  bindPointerInput({
    onPress: () => {
      if (!isMoving) {
        progress = 0;
        isMoving = true;
        hasCrossed = false;
        mover.x = startPoint.x;
        mover.y = startPoint.y;
        trail.length = 0;
      }
    },
  });
}

function draw() {
  applyBackground();

  if (isMoving && progress < 1) {
    progress += 0.02;
    mover.x = lerp(startPoint.x, endPoint.x, progress);
    mover.y = lerp(startPoint.y, endPoint.y, progress);
    trail.push({ x: mover.x, y: mover.y });
    if (trail.length > 80) trail.shift();
  } else if (progress >= 1 && isMoving) {
    isMoving = false;
    hasCrossed = true;
  }

  drawZoneRect(room.x, room.y, room.width, room.height, true);
  drawDashedLine(barrierX, room.y, barrierX, room.y + room.height);
  drawInkTrail(trail);

  drawFigureObject(startPoint.x, startPoint.y, 6, { label: "start", tag: "1", emphasis: "outline" });
  drawFigureObject(endPoint.x, endPoint.y, 6, { label: "end", tag: "2", emphasis: "outline" });
  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "mover",
    tag: "m",
    emphasis: isMoving ? "hatch" : "none",
  });

  if (isMoving) {
    const aheadX = p.min(mover.x + 26, endPoint.x);
    drawArrow(mover.x, mover.y, aheadX, mover.y, 1.25);
  }

  drawStatusBar(hasCrossed
      ? "Figure m moved across the middle barrier."
      : isMoving
        ? "Figure m is moving across from side 1 to side 2."
        : "Click/tap to move figure m across.",
    isMoving || hasCrossed
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

