import { applyBackground } from "../js/shared/palette.js";
import {
  drawArrow,
  drawFigureObject,
  drawInkTrail,
  drawStatusBar,
  drawTargetMark,
} from "../js/shared/diagram.js";
import { bindPointerInput } from "../js/shared/input.js";

export default function createSketch(p) {
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
      const angle = (p.TWO_PI * i) / count + p.random(-0.2, 0.2);
      const speed = p.random(1.8, 3.8);
      particles.push({
        x: impact.x,
        y: impact.y,
        vx: p.cos(angle) * speed,
        vy: p.sin(angle) * speed,
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
    const angle = p.atan2(dy, dx);
    projectile.x += p.cos(angle) * projectile.speed;
    projectile.y += p.sin(angle) * projectile.speed;
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
    drawArrow(p, 56, 116, impact.x - 20, 136, 1);
    drawTargetMark(p, impact.x, impact.y, 10);
    drawFigureObject(p, impact.x, impact.y, impact.r, {
      label: "Impact",
      tag: "I",
      emphasis: preCollision ? "outline" : "hatch",
    });
  }

  function drawProjectile() {
    drawInkTrail(p, projectileTrail);
    if (!projectile.active) return;
    drawFigureObject(p, projectile.x, projectile.y, projectile.r, {
      label: "",
      tag: "P",
      emphasis: "solid",
    });
  }

  function drawParticles() {
    for (const pt of particles) {
      if (pt.life <= 0.02) continue;
      drawInkTrail(p, pt.trail);
      const emphasis = pt.life > 0.32 ? "solid" : "outline";
      drawFigureObject(p, pt.x, pt.y, 3.2, { label: "", tag: "", emphasis });
    }
  }

  function drawStatus() {
    if (projectile.active) {
      drawStatusBar(p, "AFTER: before collision");
      return;
    }
    if (!preCollision) {
      drawStatusBar(p, "AFTER: after collision", true);
      return;
    }
    drawStatusBar(p, "Click to launch toward impact.");
  }

  p.setup = function setup() {
    bindPointerInput(p, { onPress: launch });
  };

  p.draw = function draw() {
    applyBackground(p);
    drawGuides();
    if (projectile.active) updateProjectile();
    updateParticles();
    drawProjectile();
    drawParticles();
    drawStatus();
  };
}
