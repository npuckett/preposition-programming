import { applyBackground } from "../js/shared/palette.js";
import { drawFigureObject, drawStatusBar } from "../js/shared/diagram.js";
import { bindCircleDrag } from "../js/shared/input.js";

export default function createSketch(p) {
  const circleA = { x: 0, y: 0, radius: 56, dragging: false };
  const circleB = { x: 0, y: 0, radius: 56, dragging: false };

  p.setup = function () {
    circleA.x = p.width * 0.36;
    circleA.y = p.height * 0.5;
    circleB.x = p.width * 0.64;
    circleB.y = p.height * 0.5;
    bindCircleDrag(p, [circleB, circleA]);
  };

  p.draw = function () {
    applyBackground(p);

    const distance = p.dist(circleA.x, circleA.y, circleB.x, circleB.y);
    const overlap = overlapPercent(distance, circleA.radius, circleB.radius);
    const hasOverlap = overlap > 0;

    drawFigureObject(p, circleA.x, circleA.y, circleA.radius, {
      label: "A",
      tag: "1a",
      emphasis: hasOverlap ? "hatch" : "none",
    });
    drawFigureObject(p, circleB.x, circleB.y, circleB.radius, {
      label: "B",
      tag: "1b",
      emphasis: "solid",
    });

    const status = hasOverlap
      ? `A is BEHIND B — overlap ${Math.round(overlap)}%`
      : "A is BEHIND B — no overlap";
    drawStatusBar(p, status, hasOverlap);
  };

  function overlapPercent(distance, r1, r2) {
    const sum = r1 + r2;
    if (distance >= sum) return 0;
    const penetration = sum - distance;
    const maxPenetration = 2 * Math.min(r1, r2);
    return p.constrain((penetration / maxPenetration) * 100, 0, 100);
  }
}
