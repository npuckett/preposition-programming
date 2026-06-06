import { applyBackground } from "./shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawDashedLine,
  drawInkTrail,
  drawStatusBar,
  drawTargetMark,
} from "./shared/diagram.js";
import { bindPointerInput } from "./shared/input.js";

export default function createSketch(p) {
  const reference = { x: 200, y: 150, radius: 20 };
  const mover = { x: 50, y: 150, radius: 12.5, speed: 2, isMoving: false, hasPassed: false };
  const trail = [];

  p.setup = function () {
    bindPointerInput(p, {
      onPress: () => {
        if (!mover.isMoving) {
          mover.x = 50;
          mover.y = 150;
          mover.isMoving = true;
          mover.hasPassed = false;
          trail.length = 0;
        }
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    if (mover.isMoving) {
      trail.push({ x: mover.x, y: mover.y });
      if (trail.length > 50) trail.shift();

      mover.x += mover.speed;
      if (!mover.hasPassed && mover.x > reference.x) mover.hasPassed = true;
      if (mover.x > p.width + 30) mover.isMoving = false;
    }

    drawInkTrail(p, trail);
    drawDashedLine(p, reference.x, 20, reference.x, p.height - 30);
    drawTargetMark(p, reference.x, reference.y, 10);
    drawFigureObject(p, reference.x, reference.y, reference.radius, {
      label: "reference",
      tag: "t",
      emphasis: "outline",
    });

    if (mover.isMoving) {
      drawArrow(p, mover.x, mover.y, mover.x + 24, mover.y, 1.2);
    }

    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "mover",
      tag: "m",
      emphasis: mover.hasPassed ? "solid" : mover.isMoving ? "hatch" : "none",
    });

    drawStatusBar(
      p,
      mover.hasPassed
        ? "Figure m has moved past reference t."
        : mover.isMoving
          ? "Figure m is moving toward and past t."
          : "Click/tap to move figure m past t.",
      mover.isMoving || mover.hasPassed
    );
  };
}
