/*
 * Preposition Programming — BEFORE
 * Tutorial: https://prepositionprogramming.com/preposition-before.html
 *
 * CONCEPT
 * BEFORE means earlier than a reference event. In code, finish prerequisite steps before the primary action runs.
 *
 * TRY IT
 * Click or tap to start. Obstacles clear the path before the main mover can proceed.
 *
 * KEY CODE (from the tutorial page)
 *   obstacles.push({ x, y, hasCleared: false });
 *   let allClear = obstacles.every(o => o.hasCleared);
 *   if (allClear) { isClearing = false; isMoving = true; }
 *   text("Clearing path (" + cleared + "/" + total + ")", x, y);
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const mover = { x: 52, y: 148, r: 11, speed: 2.3, active: false };
const obstacles = [];
let trail = [];
let clearing = false;
let statusText = "Click to clear blockers before M moves.";

const laneY = 148;
const startX = 52;
const endX = 348;

function resetLayout() {
  obstacles.length = 0;
  trail = [];
  mover.x = startX;
  mover.y = laneY;
  mover.active = false;
  clearing = false;

  for (let i = 0; i < 4; i += 1) {
    const x = 112 + i * 58;
    const y = laneY;
    const targetY = random() < 0.5 ? random(44, 84) : random(206, 246);
    obstacles.push({
      x,
      y,
      homeX: x,
      homeY: y,
      targetX: x + random(-14, 14),
      targetY,
      cleared: false,
    });
  }
}

function startSequence() {
  resetLayout();
  clearing = true;
  statusText = "Blocking figures scattering to clear lane.";
}

function updateObstacles() {
  let allCleared = true;
  for (const obs of obstacles) {
    if (obs.cleared) continue;
    obs.x = lerp(obs.x, obs.targetX, 0.09);
    obs.y = lerp(obs.y, obs.targetY, 0.09);
    const d = dist(obs.x, obs.y, obs.targetX, obs.targetY);
    if (d < 1.2) obs.cleared = true;
    if (!obs.cleared) allCleared = false;
  }
  if (allCleared) {
    clearing = false;
    mover.active = true;
    statusText = "Lane cleared. M advancing right.";
  }
}

function updateMover() {
  trail.push({ x: mover.x, y: mover.y });
  if (trail.length > 80) trail.shift();
  mover.x += mover.speed;
  if (mover.x >= endX) {
    mover.x = endX;
    mover.active = false;
    statusText = "Sequence complete. Click to replay.";
  }
}

function drawSceneGuides() {
  drawTimeline(42, 42, 358, ["t0", "prep", "clear", "go", "done"]);
  drawDashedLine(startX, laneY, endX, laneY);
  drawArrow(startX + 8, laneY - 18, endX - 8, laneY - 18, 1);
}

function drawObstacles() {
  for (let i = 0; i < obstacles.length; i += 1) {
    const obs = obstacles[i];
    const emphasis = obs.cleared ? "outline" : "hatch";
    drawFigureObject(obs.x, obs.y, 9, {
      label: "",
      tag: `B${i + 1}`,
      emphasis,
    });
  }
}

function drawMover() {
  drawFigureObject(mover.x, mover.y, mover.r, {
    label: "M",
    tag: "MAIN",
    emphasis: mover.active ? "solid" : "outline",
  });
}

function drawLaneAnchors() {
  noFill();
  stroke(...PALETTE.muted);
  p.strokeWeight(1);
  circle(startX, laneY, 10);
  circle(endX, laneY, 10);
}

function drawStatus() {
  const clearedCount = obstacles.reduce((count, obs) => count + (obs.cleared ? 1 : 0), 0);
  if (clearing) {
    drawStatusBar(`BEFORE: clear ${clearedCount}/4 blockers`);
    return;
  }
  if (mover.active) {
    drawStatusBar(`BEFORE: M moves after ${clearedCount}/4 cleared`, true);
    return;
  }
  drawStatusBar(statusText);
}

function setup() {
  createCanvas(400, 300);
  resetLayout();
  bindPointerInput({
    onPress: () => {
      if (!clearing && !mover.active) startSequence();
    },
  });
}

function draw() {
  applyBackground();
  drawSceneGuides();
  if (clearing) updateObstacles();
  if (mover.active) updateMover();
  drawLaneAnchors();
  drawObstacles();
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

