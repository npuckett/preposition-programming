/*
 * Preposition Programming — AFTER
 * Tutorial: https://prepositionprogramming.com/preposition-after.html
 *
 * CONCEPT
 * AFTER means following a reference event. Trigger secondary effects once the primary event has occurred.
 *
 * TRY IT
 * Click or tap to launch toward the impact point. Particles scatter after the collision.
 *
 * KEY CODE (from the tutorial page)
 *   let shot = { x: 50, y: 150, moving: false };
 *   let impact = { x: 200, y: 150, happened: false };
 *   if (dist(shot.x, shot.y, impact.x, impact.y) < threshold) {
 *   &nbsp;&nbsp;impact.happened = true;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const impact = { x: 288, y: 148, r: 12 };
const projectile = {
  x: 56,
  y: 148,
  speed: 4.2,
  r: 7,
  active: false,
};
let preCollision = true;
let projectileTrail = [];
let particles = [];

function spawnParticles() {
  particles = [];
  const count = 12;
  for (let i = 0; i < count; i += 1) {
    const angle = (p.TWO_PI * i) / count + random(-0.2, 0.2);
    const speed = random(1.8, 3.8);
    particles.push({
      x: impact.x,
      y: impact.y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      life: 1,
      trail: [],
    });
  }
}

function launch() {
  projectile.x = 56;
  projectile.y = 148;
  projectile.active = true;
  preCollision = true;
  projectileTrail = [];
  particles = [];
}

function updateProjectile() {
  projectileTrail.push({ x: projectile.x, y: projectile.y });
  if (projectileTrail.length > 70) projectileTrail.shift();
  const dx = impact.x - projectile.x;
  const dy = impact.y - projectile.y;
  const d = p.sqrt(dx * dx + dy * dy);
  if (d <= projectile.speed + impact.r) {
    projectile.active = false;
    preCollision = false;
    spawnParticles();
    return;
  }
  const angle = atan2(dy, dx);
  projectile.x += cos(angle) * projectile.speed;
  projectile.y += sin(angle) * projectile.speed;
}

function updateParticles() {
  for (const pt of particles) {
    if (pt.life <= 0.02) continue;
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.vx *= 0.96;
    pt.vy *= 0.96;
    pt.life *= 0.97;
    pt.trail.push({ x: pt.x, y: pt.y });
    if (pt.trail.length > 24) pt.trail.shift();
  }
}

function drawGuides() {
  drawArrow(56, 116, impact.x - 20, 136, 1);
  drawTargetMark(impact.x, impact.y, 10);
  drawFigureObject(impact.x, impact.y, impact.r, {
    label: "Impact",
    tag: "I",
    emphasis: preCollision ? "outline" : "hatch",
  });
}

function drawProjectile() {
  drawInkTrail(projectileTrail);
  if (!projectile.active) return;
  drawFigureObject(projectile.x, projectile.y, projectile.r, {
    label: "",
    tag: "P",
    emphasis: "solid",
  });
}

function drawParticles() {
  for (const pt of particles) {
    if (pt.life <= 0.02) continue;
    drawInkTrail(pt.trail);
    const emphasis = pt.life > 0.32 ? "solid" : "outline";
    drawFigureObject(pt.x, pt.y, 3.2, { label: "", tag: "", emphasis });
  }
}

function drawStatus() {
  if (projectile.active) {
    drawStatusBar("AFTER: before collision");
    return;
  }
  if (!preCollision) {
    drawStatusBar("AFTER: after collision", true);
    return;
  }
  drawStatusBar("Click to launch toward impact.");
}

function setup() {
  createCanvas(400, 300);
  bindPointerInput({ onPress: launch });
}

function draw() {
  applyBackground();
  drawGuides();
  if (projectile.active) updateProjectile();
  updateParticles();
  drawProjectile();
  drawParticles();
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

