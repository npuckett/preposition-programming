/*
 * Preposition Programming — AWAY
 * Tutorial: https://prepositionprogramming.com/preposition-away.html
 *
 * CONCEPT
 * AWAY means moving in the opposite direction from a reference point. Use the vector from source to object, then continue outward along it.
 *
 * TRY IT
 * Click or tap to set a source point. The circle moves away from it, increasing distance each frame.
 *
 * KEY CODE (from the tutorial page)
 *   let mover = { x: 200, y: 150, speed: 2 };
 *   let source = { x: 100, y: 100 };
 *   let dx = mover.x - source.x;
 *   let dy = mover.y - source.y;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const mover = {
  x: 200,
  y: 150,
  speed: 2,
  radius: 12.5,
  isMoving: false,
};

const source = { x: 100, y: 100, visible: false };
const trail = [];
let movementFrames = 0;
const maxMovementFrames = 100;
const maxDistance = 120;

function setup() {
  createCanvas(400, 300);
  mover.x = width / 2;
  mover.y = height / 2;

  bindPointerInput({
    onPress: () => {
      source.x = pointerX();
      source.y = pointerY();
      source.visible = true;
      mover.isMoving = true;
      movementFrames = 0;
      trail.length = 0;
    },
  });
}

function draw() {
  applyBackground();

  const distance = dist(mover.x, mover.y, source.x, source.y);
  const dx = mover.x - source.x;
  const dy = mover.y - source.y;

  if (mover.isMoving &&
    movementFrames < maxMovementFrames &&
    distance < maxDistance &&
    distance > 0
  ) {
    const moveX = (dx / distance) * mover.speed;
    const moveY = (dy / distance) * mover.speed;
    const nextX = mover.x + moveX;
    const nextY = mover.y + moveY;

    if (nextX > 20 && nextX < width - 20 && nextY > 20 && nextY < height - 20) {
      mover.x = nextX;
      mover.y = nextY;
      trail.push({ x: mover.x, y: mover.y });
      if (trail.length > 50) trail.shift();
      movementFrames += 1;
    } else {
      mover.isMoving = false;
    }
  } else if (distance >= maxDistance || movementFrames >= maxMovementFrames) {
    mover.isMoving = false;
  }

  if (source.visible) {
    noFill();
    stroke(...PALETTE.light);
    p.strokeWeight(1);
    circle(source.x, source.y, maxDistance * 2);
    drawTargetMark(source.x, source.y, 10);
    noStroke();
    fill(...PALETTE.muted);
    textAlign(CENTER, TOP);
    textSize(9);
    text("source s", source.x, source.y + 12);
  }

  drawInkTrail(trail);

  if (mover.isMoving && source.visible && distance > 5) {
    drawDashedLine(source.x, source.y, mover.x, mover.y);
    drawArrow(source.x, source.y, mover.x, mover.y, 1.15);
  }

  drawFigureObject(mover.x, mover.y, mover.radius, {
    label: "mover",
    tag: "m",
    emphasis: mover.isMoving ? "hatch" : "none",
  });

  drawStatusBar(mover.isMoving
      ? "Figure m moves away from source s."
      : "Click/tap to set source s and move away.",
    mover.isMoving
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

