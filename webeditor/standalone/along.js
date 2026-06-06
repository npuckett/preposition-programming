/*
 * Preposition Programming — ALONG
 * Tutorial: https://prepositionprogramming.com/preposition-along.html
 *
 * CONCEPT
 * ALONG means following the length, edge, or course of something—not crossing it.
 *
 * TRY IT
 * Click or tap to start the circle moving along the curved path.
 *
 * KEY CODE (from the tutorial page)
 *   let path = [{x:50,y:150},{x:150,y:100},{x:250,y:200},{x:350,y:150}];
 *   let progress = 0; // 0 … path.length - 1
 *   let a = path[floor(progress)];
 *   let b = path[ceil(progress)];
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const pathPoints = [];
const mover = { x: 0, y: 0, radius: 12 };

let pathProgress = 0;
let isMoving = false;
let hasCompleted = false;
const trail = [];

function setup() {
  createCanvas(400, 300);
  for (let i = 0; i <= 100; i++) {
    const x = map(i, 0, 100, 50, 350);
    const y = 150 + sin(map(i, 0, 100, 0, p.TWO_PI * 2)) * 60;
    pathPoints.push({ x, y });
  }

  mover.x = pathPoints[0].x;
  mover.y = pathPoints[0].y;

  bindPointerInput({
    onPress: () => {
      if (!isMoving && !hasCompleted) {
        isMoving = true;
        trail.length = 0;
      } else if (hasCompleted) {
        pathProgress = 0;
        isMoving = true;
        hasCompleted = false;
        mover.x = pathPoints[0].x;
        mover.y = pathPoints[0].y;
        trail.length = 0;
      }
    },
  });
}

function draw() {
  applyBackground();

  if (isMoving && pathProgress < pathPoints.length - 1) {
    pathProgress += 0.8;
    const currentIndex = Math.floor(pathProgress);
    const nextIndex = Math.min(currentIndex + 1, pathPoints.length - 1);
    const t = pathProgress - currentIndex;
    mover.x = lerp(pathPoints[currentIndex].x, pathPoints[nextIndex].x, t);
    mover.y = lerp(pathPoints[currentIndex].y, pathPoints[nextIndex].y, t);
    trail.push({ x: mover.x, y: mover.y });
    if (trail.length > 150) trail.shift();
  } else if (pathProgress >= pathPoints.length - 1 && isMoving) {
    isMoving = false;
    hasCompleted = true;
  }

  for (let i = 1; i < pathPoints.length; i++) {
    drawDashedLine(pathPoints[i - 1].x,
      pathPoints[i - 1].y,
      pathPoints[i].x,
      pathPoints[i].y
    );
  }

  drawFigureObject(pathPoints[0].x, pathPoints[0].y, 7, {
    label: "start",
    tag: "1",
    emphasis: "outline",
  });
  drawFigureObject(pathPoints[pathPoints.length - 1].x, pathPoints[pathPoints.length - 1].y, 7, {
    label: "end",
    tag: "2",
    emphasis: "outline",
  });

  drawInkTrail(trail);

  if (isMoving && pathProgress < pathPoints.length - 2) {
    const currentIndex = Math.floor(pathProgress);
    const lookAhead = Math.min(currentIndex + 5, pathPoints.length - 1);
    drawArrow(pathPoints[currentIndex].x,
      pathPoints[currentIndex].y,
      pathPoints[lookAhead].x,
      pathPoints[lookAhead].y,
      1.2
    );
  }

  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "mover",
    tag: "m",
    emphasis: isMoving ? "hatch" : "none",
  });

  drawStatusBar(hasCompleted
      ? "Figure m traveled along the full path."
      : isMoving
        ? "Figure m moves along the dashed path."
        : "Click/tap to move figure m along the path.",
    isMoving || hasCompleted
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

