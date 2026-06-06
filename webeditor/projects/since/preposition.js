import { PALETTE, applyBackground } from "./shared/palette.js";
import {
  drawArrow,
  drawFigureObject,
  drawInkTrail,
  drawStatusBar,
} from "./shared/diagram.js";
import { bindPointerInput, pointerX, pointerY } from "./shared/input.js";

export default function createSketch(p) {
  const origin = { x: 200, y: 150 };
  let trail = [];
  let active = false;
  let step = 0;

  function startAtPointer() {
    origin.x = p.constrain(pointerX(p), 24, p.width - 24);
    origin.y = p.constrain(pointerY(p), 28, p.height - 42);
    trail = [{ x: origin.x, y: origin.y }];
    step = 0;
    active = true;
  }

  function updateTrail() {
    step += 1;
    const angle = step * 0.18 + p.frameCount * 0.015;
    const radius = 0.55 * step;
    const x = origin.x + p.cos(angle) * radius;
    const y = origin.y + p.sin(angle) * radius;
    trail.push({ x, y });
    if (trail.length > 220) trail.shift();
  }

  function drawSpiral() {
    drawInkTrail(p, trail);
    if (trail.length > 1) {
      p.noFill();
      p.stroke(...PALETTE.ink);
      p.strokeWeight(0.9);
      p.beginShape();
      for (const point of trail) p.vertex(point.x, point.y);
      p.endShape();
    }
    drawFigureObject(p, origin.x, origin.y, 6, {
      label: "Origin",
      tag: "S",
      emphasis: "hatch",
    });
    if (trail.length > 0) {
      const tip = trail[trail.length - 1];
      drawFigureObject(p, tip.x, tip.y, 4, { label: "", tag: "", emphasis: "solid" });
      drawArrow(p, origin.x + 12, origin.y - 12, tip.x, tip.y, 0.9);
    }
  }

  function drawStatus() {
    if (!active) {
      drawStatusBar(p, "Click to set origin for SINCE trail.");
      return;
    }
    drawStatusBar(p, `SINCE origin: ${trail.length} points accumulated`, true);
  }

  p.setup = function setup() {
    bindPointerInput(p, { onPress: startAtPointer });
  };

  p.draw = function draw() {
    applyBackground(p);
    if (active) updateTrail();
    drawSpiral();
    drawStatus();
  };
}
