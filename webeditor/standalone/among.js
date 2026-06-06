/*
 * Preposition Programming — AMONG
 * Tutorial: https://prepositionprogramming.com/preposition-among.html
 *
 * CONCEPT
 * AMONG means within a group of three or more things. Unlike between (two endpoints), among depends on proximity to several neighbors or to a group region.
 *
 * TRY IT
 * Tap or click anywhere to send the moving circle toward that point. It is among the group when it sits near the cluster center.
 *
 * KEY CODE (from the tutorial page)
 *   let group = [{x:100,y:100},{x:200,y:120},{x:150,y:180}];
 *   let cx = group.reduce((s,p)=>s+p.x,0)/group.length;
 *   let cy = group.reduce((s,p)=>s+p.y,0)/group.length;
 *   let d = dist(mover.x, mover.y, cx, cy);
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const group = [];
const moving = { x: 0, y: 0, radius: 16, targetX: 0, targetY: 0, isAmong: false };
const nearbyRadius = 78;
const members = 8;

function setup() {
  createCanvas(400, 300);
  const cx = width * 0.52;
  const cy = height * 0.5;
  const ring = Math.min(width, height) * 0.22;
  for (let i = 0; i < members; i += 1) {
    const angle = (i / members) * p.TWO_PI;
    groupush({
      x: cx + cos(angle) * ring + random(-10, 10),
      y: cy + sin(angle) * ring + random(-10, 10),
      radius: random(11, 15),
    });
  }
  moving.x = width * 0.18;
  moving.y = height * 0.22;
  moving.targetX = moving.x;
  moving.targetY = moving.y;

  bindPointerInput({
    onPress: () => {
      moving.targetX = pointerX();
      moving.targetY = pointerY();
    },
  });
}

function draw() {
  applyBackground();
  moving.x = lerp(moving.x, moving.targetX, 0.07);
  moving.y = lerp(moving.y, moving.targetY, 0.07);

  let nearbyCount = 0;
  let nearest = null;
  let nearestDist = Infinity;

  for (const member of group) {
    const d = dist(moving.x, moving.y, member.x, member.y);
    if (d <= nearbyRadius) nearbyCount += 1;
    if (d < nearestDist) {
      nearestDist = d;
      nearest = member;
    }
  }

  moving.isAmong = nearbyCount >= 3;

  for (let i = 0; i < group.length; i += 1) {
    const member = group[i];
    drawFigureObject(member.x, member.y, member.radius, {
      label: `G${i + 1}`,
      tag: "",
      emphasis: "outline",
    });
  }

  if (moving.isAmong) {
    for (const member of group) {
      if (dist(moving.x, moving.y, member.x, member.y) <= nearbyRadius) {
        drawLeaderLine(moving.x, moving.y, member.x, member.y);
      }
    }
  } else if (nearest) {
    drawLeaderLine(moving.x, moving.y, nearest.x, nearest.y, "nearest");
  }

  drawFigureObject(moving.x, moving.y, moving.radius, {
    label: "M",
    tag: "1a",
    emphasis: moving.isAmong ? "solid" : "none",
  });

  const status = moving.isAmong
    ? `M is AMONG the group (${nearbyCount} nearby)`
    : `M is outside the group (${nearbyCount} nearby)`;
  drawStatusBar(status, moving.isAmong);
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

