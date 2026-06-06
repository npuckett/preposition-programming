import { applyBackground } from "./shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawStatusBar,
  drawZoneRect,
  drawDashedLine,
  drawInkTrail,
} from "./shared/diagram.js";
import { bindPointerInput } from "./shared/input.js";

export default function createSketch(p) {
  const bridge = { x: 200, y: 120, width: 80, height: 60 };
  const start = { x: 50, y: 200 };
  const end = { x: 350, y: 200 };
  const cp1 = { x: 150, y: 270 };
  const cp2 = { x: 250, y: 270 };
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
      mover.x = p.bezierPoint(start.x, cp1.x, cp2.x, end.x, progress);
      mover.y = p.bezierPoint(start.y, cp1.y, cp2.y, end.y, progress);
      trail.push({ x: mover.x, y: mover.y });
      if (trail.length > 90) trail.shift();
      if (progress >= 1) {
        isMoving = false;
        hasCompleted = true;
      }
    }

    drawZoneRect(
      p,
      bridge.x - bridge.width / 2,
      bridge.y - bridge.height / 2,
      bridge.width,
      bridge.height,
      true
    );
    drawDashedLine(p, bridge.x - bridge.width / 2, bridge.y + bridge.height / 2, bridge.x - bridge.width / 2, 280);
    drawDashedLine(p, bridge.x + bridge.width / 2, bridge.y + bridge.height / 2, bridge.x + bridge.width / 2, 280);

    for (let i = 1; i <= 26; i++) {
      const t0 = (i - 1) / 26;
      const t1 = i / 26;
      drawDashedLine(
        p,
        p.bezierPoint(start.x, cp1.x, cp2.x, end.x, t0),
        p.bezierPoint(start.y, cp1.y, cp2.y, end.y, t0),
        p.bezierPoint(start.x, cp1.x, cp2.x, end.x, t1),
        p.bezierPoint(start.y, cp1.y, cp2.y, end.y, t1)
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
      const nx = p.bezierPoint(start.x, cp1.x, cp2.x, end.x, nt);
      const ny = p.bezierPoint(start.y, cp1.y, cp2.y, end.y, nt);
      drawArrow(p, mover.x, mover.y, nx, ny, 1.2);
    }

    drawStatusBar(
      p,
      hasCompleted
        ? "Figure m moved under the bridge."
        : isMoving
          ? "Figure m follows a dip under the bridge."
          : "Click/tap to move figure m under.",
      isMoving || hasCompleted
    );
  };
}
