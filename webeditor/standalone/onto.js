/*
 * Preposition Programming — ONTO
 * Tutorial: https://prepositionprogramming.com/preposition-onto.html
 *
 * CONCEPT
 * ONTO means moving to rest on the top surface of something—the object ends supported by that surface.
 *
 * TRY IT
 * Click or tap above the platform to drop the circle onto its top surface.
 *
 * KEY CODE (from the tutorial page)
 *   let platform = { x: 200, y: 200, w: 120, h: 20 };
 *   let start = { x: 100, y: 50 };
 *   let landY = platform.y - radius;
 *   obj.x = lerp(start.x, platform.x, t);
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const surface = { x: 150, y: 200, width: 150, height: 20 };
const mover = {
  x: 80,
  y: 80,
  startX: 80,
  startY: 80,
  radius: 15,
  targetX: 225,
  targetY: 185,
  isOnSurface: false,
};

let progress = 0;
let isAnimating = false;

function setup() {
  createCanvas(400, 300);
  bindPointerInput({
    onPress: () => {
      const x = pointerX();
      const y = pointerY();
      if (y < surface.y - mover.radius && (mover.isOnSurface || !isAnimating)) {
        mover.startX = x;
        mover.startY = y;
        mover.x = x;
        mover.y = y;
        mover.isOnSurface = false;
        progress = 0;
        isAnimating = true;
      }
    },
  });
}

function draw() {
  applyBackground();

  if (isAnimating) {
    progress += 0.02;
    mover.x = lerp(mover.startX, mover.targetX, progress);
    mover.y = lerp(mover.startY, mover.targetY, progress);
    if (progress >= 1) {
      progress = 1;
      isAnimating = false;
      mover.isOnSurface = true;
    }
  }

  drawContainerRect(surface.x, surface.y, surface.width, surface.height, {
    label: "surface",
    tag: "t",
  });
  drawDashedLine(mover.targetX, mover.targetY - 30, mover.targetX, mover.targetY + 20);

  if (isAnimating) {
    drawArrow(mover.x, mover.y, mover.targetX, mover.targetY, 1.2);
  }

  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "mover",
    tag: "m",
    emphasis: isAnimating ? "hatch" : mover.isOnSurface ? "solid" : "none",
  });

  drawStatusBar(mover.isOnSurface
      ? "Figure m is onto target surface t."
      : isAnimating
        ? "Figure m drops onto surface t."
        : "Click/tap above the platform to drop onto it.",
    isAnimating || mover.isOnSurface
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

