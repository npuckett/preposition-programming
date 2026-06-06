import { applyBackground } from "../js/shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawDashedLine,
  drawInkTrail,
  drawStatusBar,
} from "../js/shared/diagram.js";
import { bindPointerInput } from "../js/shared/input.js";

export default function createSketch(p) {
  const pathPoints = [];
  const mover = { x: 0, y: 0, radius: 12 };

  let pathProgress = 0;
  let isMoving = false;
  let hasCompleted = false;
  const trail = [];

  p.setup = function () {
    for (let i = 0; i <= 100; i++) {
      const x = p.map(i, 0, 100, 50, 350);
      const y = 150 + p.sin(p.map(i, 0, 100, 0, p.TWO_PI * 2)) * 60;
      pathPoints.push({ x, y });
    }

    mover.x = pathPoints[0].x;
    mover.y = pathPoints[0].y;

    bindPointerInput(p, {
      onPress: () => {
        if (!isMoving && !hasCompleted) {
          isMoving = true;
          trail.length = 0;
        } else if (hasCompleted) {
          pathProgress = 0;
          isMoving = true;
          hasCompleted = false;
          mover.x = pathPoints[0].x;
          mover.y = pathPoints[0].y;
          trail.length = 0;
        }
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    if (isMoving && pathProgress < pathPoints.length - 1) {
      pathProgress += 0.8;
      const currentIndex = Math.floor(pathProgress);
      const nextIndex = Math.min(currentIndex + 1, pathPoints.length - 1);
      const t = pathProgress - currentIndex;
      mover.x = p.lerp(pathPoints[currentIndex].x, pathPoints[nextIndex].x, t);
      mover.y = p.lerp(pathPoints[currentIndex].y, pathPoints[nextIndex].y, t);
      trail.push({ x: mover.x, y: mover.y });
      if (trail.length > 150) trail.shift();
    } else if (pathProgress >= pathPoints.length - 1 && isMoving) {
      isMoving = false;
      hasCompleted = true;
    }

    for (let i = 1; i < pathPoints.length; i++) {
      drawDashedLine(
        p,
        pathPoints[i - 1].x,
        pathPoints[i - 1].y,
        pathPoints[i].x,
        pathPoints[i].y
      );
    }

    drawFigureObject(p, pathPoints[0].x, pathPoints[0].y, 7, {
      label: "start",
      tag: "1",
      emphasis: "outline",
    });
    drawFigureObject(p, pathPoints[pathPoints.length - 1].x, pathPoints[pathPoints.length - 1].y, 7, {
      label: "end",
      tag: "2",
      emphasis: "outline",
    });

    drawInkTrail(p, trail);

    if (isMoving && pathProgress < pathPoints.length - 2) {
      const currentIndex = Math.floor(pathProgress);
      const lookAhead = Math.min(currentIndex + 5, pathPoints.length - 1);
      drawArrow(
        p,
        pathPoints[currentIndex].x,
        pathPoints[currentIndex].y,
        pathPoints[lookAhead].x,
        pathPoints[lookAhead].y,
        1.2
      );
    }

    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "mover",
      tag: "m",
      emphasis: isMoving ? "hatch" : "none",
    });

    drawStatusBar(
      p,
      hasCompleted
        ? "Figure m traveled along the full path."
        : isMoving
          ? "Figure m moves along the dashed path."
          : "Click/tap to move figure m along the path.",
      isMoving || hasCompleted
    );
  };
}
