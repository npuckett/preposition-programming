import { applyBackground } from "./shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawInkTrail,
  drawStatusBar,
  drawZoneRect,
  drawDashedLine,
} from "./shared/diagram.js";
import { bindPointerInput } from "./shared/input.js";

export default function createSketch(p) {
  const room = { x: 50, y: 80, width: 300, height: 140 };
  const barrierX = room.x + room.width / 2;

  const startPoint = { x: 70, y: 150 };
  const endPoint = { x: 330, y: 150 };

  const mover = { x: 70, y: 150, radius: 15 };
  let progress = 0;
  let isMoving = false;
  let hasCrossed = false;
  const trail = [];

  p.setup = function () {
    mover.x = startPoint.x;
    mover.y = startPoint.y;

    bindPointerInput(p, {
      onPress: () => {
        if (!isMoving) {
          progress = 0;
          isMoving = true;
          hasCrossed = false;
          mover.x = startPoint.x;
          mover.y = startPoint.y;
          trail.length = 0;
        }
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    if (isMoving && progress < 1) {
      progress += 0.02;
      mover.x = p.lerp(startPoint.x, endPoint.x, progress);
      mover.y = p.lerp(startPoint.y, endPoint.y, progress);
      trail.push({ x: mover.x, y: mover.y });
      if (trail.length > 80) trail.shift();
    } else if (progress >= 1 && isMoving) {
      isMoving = false;
      hasCrossed = true;
    }

    drawZoneRect(p, room.x, room.y, room.width, room.height, true);
    drawDashedLine(p, barrierX, room.y, barrierX, room.y + room.height);
    drawInkTrail(p, trail);

    drawFigureObject(p, startPoint.x, startPoint.y, 6, { label: "start", tag: "1", emphasis: "outline" });
    drawFigureObject(p, endPoint.x, endPoint.y, 6, { label: "end", tag: "2", emphasis: "outline" });
    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "mover",
      tag: "m",
      emphasis: isMoving ? "hatch" : "none",
    });

    if (isMoving) {
      const aheadX = p.min(mover.x + 26, endPoint.x);
      drawArrow(p, mover.x, mover.y, aheadX, mover.y, 1.25);
    }

    drawStatusBar(
      p,
      hasCrossed
        ? "Figure m moved across the middle barrier."
        : isMoving
          ? "Figure m is moving across from side 1 to side 2."
          : "Click/tap to move figure m across.",
      isMoving || hasCrossed
    );
  };
}
