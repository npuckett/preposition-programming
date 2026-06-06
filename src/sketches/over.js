import { applyBackground } from "../js/shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawStatusBar,
  drawZoneRect,
  drawDashedLine,
  drawInkTrail,
} from "../js/shared/diagram.js";
import { bindPointerInput } from "../js/shared/input.js";

export default function createSketch(p) {
  const obstacle = { x: 200, y: 180, width: 80, height: 60 };
  const start = { x: 50, y: 200 };
  const end = { x: 350, y: 200 };
  const control = { x: 200, y: 100 };
  const mover = { x: 50, y: 200, radius: 12 };

  let progress = 0;
  let isMoving = false;
  let hasCompleted = false;
  const trail = [];

  p.setup = function () {
    bindPointerInput(p, {
      onPress: () => {
        progress = 0;
        isMoving = true;
        hasCompleted = false;
        mover.x = start.x;
        mover.y = start.y;
        trail.length = 0;
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    if (isMoving && progress < 1) {
      progress += 0.015;
      mover.x = p.bezierPoint(start.x, start.x, end.x, end.x, progress);
      mover.y = p.bezierPoint(start.y, control.y, control.y, end.y, progress);
      trail.push({ x: mover.x, y: mover.y });
      if (trail.length > 90) trail.shift();
      if (progress >= 1) {
        isMoving = false;
        hasCompleted = true;
      }
    }

    drawZoneRect(
      p,
      obstacle.x - obstacle.width / 2,
      obstacle.y - obstacle.height / 2,
      obstacle.width,
      obstacle.height,
      true
    );
    drawDashedLine(p, obstacle.x - obstacle.width / 2, 50, obstacle.x - obstacle.width / 2, 220);
    drawDashedLine(p, obstacle.x + obstacle.width / 2, 50, obstacle.x + obstacle.width / 2, 220);

    for (let i = 1; i <= 24; i++) {
      const t0 = (i - 1) / 24;
      const t1 = i / 24;
      drawDashedLine(
        p,
        p.bezierPoint(start.x, start.x, end.x, end.x, t0),
        p.bezierPoint(start.y, control.y, control.y, end.y, t0),
        p.bezierPoint(start.x, start.x, end.x, end.x, t1),
        p.bezierPoint(start.y, control.y, control.y, end.y, t1)
      );
    }

    drawInkTrail(p, trail);
    drawFigureObject(p, start.x, start.y, 7, { label: "start", tag: "1", emphasis: "outline" });
    drawFigureObject(p, end.x, end.y, 7, { label: "end", tag: "2", emphasis: "outline" });
    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "mover",
      tag: "m",
      emphasis: isMoving ? "hatch" : hasCompleted ? "solid" : "none",
    });

    if (isMoving) {
      const nt = p.min(progress + 0.02, 1);
      const nx = p.bezierPoint(start.x, start.x, end.x, end.x, nt);
      const ny = p.bezierPoint(start.y, control.y, control.y, end.y, nt);
      drawArrow(p, mover.x, mover.y, nx, ny, 1.2);
    }

    drawStatusBar(
      p,
      hasCompleted
        ? "Figure m moved over obstacle."
        : isMoving
          ? "Figure m follows an arc over the obstacle."
          : "Click/tap to move figure m over.",
      isMoving || hasCompleted
    );
  };
}
