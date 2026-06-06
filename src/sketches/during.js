import { applyBackground } from "../js/shared/palette.js";
import {
  drawArrow,
  drawDashedLine,
  drawFigureObject,
  drawStatusBar,
} from "../js/shared/diagram.js";
import { bindPointerInput } from "../js/shared/input.js";

export default function createSketch(p) {
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
    traveler.x = p.lerp(start.x, end.x, traveler.t);
    traveler.y = p.lerp(start.y, end.y, traveler.t);

    if (p.frameCount % 8 === 0) {
      particles.push({
        x: traveler.x,
        y: traveler.y,
        vx: p.random(-0.45, 0.45),
        vy: p.random(-0.45, 0.45),
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
    drawDashedLine(p, start.x, start.y, end.x, end.y);
    drawArrow(p, start.x + 10, start.y - 18, end.x - 10, end.y - 18, 1);
    drawFigureObject(p, start.x, start.y, 9, { label: "A", tag: "START", emphasis: "outline" });
    drawFigureObject(p, end.x, end.y, 9, { label: "B", tag: "END", emphasis: "outline" });
  }

  function drawTraveler() {
    drawFigureObject(p, traveler.x, traveler.y, 10, {
      label: "",
      tag: "T",
      emphasis: traveler.moving ? "solid" : "outline",
    });
  }

  function drawParticles() {
    for (const pt of particles) {
      if (pt.life <= 0.02) continue;
      drawFigureObject(p, pt.x, pt.y, 2.4, {
        label: "",
        tag: "",
        emphasis: "outline",
      });
    }
  }

  function drawStatus() {
    if (traveler.moving) {
      const percent = Math.floor(traveler.t * 100);
      drawStatusBar(p, `DURING journey: ${percent}% , ${particles.length} dots`, true);
      return;
    }
    drawStatusBar(p, statusText);
  }

  p.setup = function setup() {
    bindPointerInput(p, {
      onPress: () => {
        if (!traveler.moving) resetJourney();
      },
    });
  };

  p.draw = function draw() {
    applyBackground(p);
    drawLane();
    if (traveler.moving) updateTraveler();
    updateParticles();
    drawParticles();
    drawTraveler();
    drawStatus();
  };
}
