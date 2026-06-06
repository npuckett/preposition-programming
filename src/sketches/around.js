import { applyBackground } from "../js/shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawTargetMark,
  drawInkTrail,
  drawStatusBar,
  drawDashedLine,
} from "../js/shared/diagram.js";
import { bindPointerInput, pointerX, pointerY } from "../js/shared/input.js";

export default function createSketch(p) {
  const center = { x: 280, y: 150, radius: 50 };
  const mover = { x: 0, y: 0, radius: 12 };

  let angle = 0;
  let orbitRadius = 80;
  let isMoving = false;
  const trail = [];
  const speed = 0.03;

  p.setup = function () {
    mover.x = center.x + orbitRadius;
    mover.y = center.y;

    bindPointerInput(p, {
      onPress: () => {
        center.x = pointerX(p);
        center.y = pointerY(p);
        angle = 0;
        isMoving = true;
        trail.length = 0;
        mover.x = center.x + orbitRadius;
        mover.y = center.y;
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    if (isMoving) {
      angle += speed;
      mover.x = center.x + p.cos(angle) * orbitRadius;
      mover.y = center.y + p.sin(angle) * orbitRadius;
      trail.push({ x: mover.x, y: mover.y });
      if (trail.length > 60) trail.shift();
    }

    const guideSteps = 36;
    for (let i = 0; i < guideSteps; i++) {
      const a1 = p.map(i, 0, guideSteps, 0, p.TWO_PI);
      const a2 = p.map(i + 1, 0, guideSteps, 0, p.TWO_PI);
      drawDashedLine(
        p,
        center.x + p.cos(a1) * orbitRadius,
        center.y + p.sin(a1) * orbitRadius,
        center.x + p.cos(a2) * orbitRadius,
        center.y + p.sin(a2) * orbitRadius
      );
    }

    drawTargetMark(p, center.x, center.y, 9);
    drawFigureObject(p, center.x, center.y, center.radius, {
      label: "center",
      tag: "c",
      emphasis: "outline",
    });

    drawInkTrail(p, trail);
    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "mover",
      tag: "m",
      emphasis: isMoving ? "hatch" : "none",
    });

    if (isMoving) {
      const tx = center.x + p.cos(angle + p.PI / 2) * 24;
      const ty = center.y + p.sin(angle + p.PI / 2) * 24;
      drawArrow(p, mover.x, mover.y, tx, ty, 1.2);
    }

    drawStatusBar(
      p,
      isMoving
        ? "Figure m moves around center c."
        : "Click/tap to set center c and orbit around it.",
      isMoving
    );
  };
}
