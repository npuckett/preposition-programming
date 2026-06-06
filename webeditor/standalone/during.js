/*
 * Preposition Programming — DURING
 * Tutorial: https://prepositionprogramming.com/preposition-during.html
 *
 * CONCEPT
 * DURING means throughout the span of another process. Run secondary logic on each frame while the primary action is still underway.
 *
 * TRY IT
 * Click or tap to begin the journey from A to B. Particles emit continuously during the trip.
 *
 * KEY CODE (from the tutorial page)
 *   let traveler = { x: 50, y: 150, targetX: 350, targetY: 150, moving: false };
 *   if (traveler.moving) { /* update x, y toward target */ }
 *   if (traveler.moving && frameCount % 8 === 0) {
 *   &nbsp;&nbsp;particles.push({ x: traveler.x, y: traveler.y, vx, vy });
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const start = { x: 62, y: 148 };
const end = { x: 338, y: 148 };
const traveler = { x: start.x, y: start.y, speed: 0.03, t: 0, moving: false };
let particles = [];
let statusText = "Click to begin A -> B journey.";

function resetJourney() {
  traveler.x = start.x;
  traveler.y = start.y;
  traveler.t = 0;
  traveler.moving = true;
  particles = [];
  statusText = "DURING journey: emitting particles.";
}

function updateTraveler() {
  traveler.t = p.min(1, traveler.t + traveler.speed);
  traveler.x = lerp(start.x, end.x, traveler.t);
  traveler.y = lerp(start.y, end.y, traveler.t);

  if (frameCount % 8 === 0) {
    particles.push({
      x: traveler.x,
      y: traveler.y,
      vx: random(-0.45, 0.45),
      vy: random(-0.45, 0.45),
      life: 1,
    });
  }

  if (traveler.t >= 1) {
    traveler.moving = false;
    statusText = "Journey complete. Click to restart.";
  }
}

function updateParticles() {
  for (const pt of particles) {
    if (pt.life <= 0.02) continue;
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.vx *= 0.95;
    pt.vy *= 0.95;
    pt.life *= 0.97;
  }
}

function drawLane() {
  drawDashedLine(start.x, start.y, end.x, end.y);
  drawArrow(start.x + 10, start.y - 18, end.x - 10, end.y - 18, 1);
  drawFigureObject(start.x, start.y, 9, { label: "A", tag: "START", emphasis: "outline" });
  drawFigureObject(end.x, end.y, 9, { label: "B", tag: "END", emphasis: "outline" });
}

function drawTraveler() {
  drawFigureObject(traveler.x, traveler.y, 10, {
    label: "",
    tag: "T",
    emphasis: traveler.moving ? "solid" : "outline",
  });
}

function drawParticles() {
  for (const pt of particles) {
    if (pt.life <= 0.02) continue;
    drawFigureObject(pt.x, pt.y, 2.4, {
      label: "",
      tag: "",
      emphasis: "outline",
    });
  }
}

function drawStatus() {
  if (traveler.moving) {
    const percent = Math.floor(traveler.t * 100);
    drawStatusBar(`DURING journey: ${percent}% , ${particles.length} dots`, true);
    return;
  }
  drawStatusBar(statusText);
}

function setup() {
  createCanvas(400, 300);
  bindPointerInput({
    onPress: () => {
      if (!traveler.moving) resetJourney();
    },
  });
}

function draw() {
  applyBackground();
  drawLane();
  if (traveler.moving) updateTraveler();
  updateParticles();
  drawParticles();
  drawTraveler();
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

