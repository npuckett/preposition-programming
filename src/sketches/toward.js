import { PALETTE, applyBackground } from "../js/shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawTargetMark,
  drawInkTrail,
  drawStatusBar,
} from "../js/shared/diagram.js";
import { bindPointerInput, pointerX, pointerY } from "../js/shared/input.js";

export default function createSketch(p) {
  const mover = {
    x: 200,
    y: 150,
    targetX: 200,
    targetY: 150,
    speed: 0.05,
    radius: 10,
    trail: [],
  };

  let isMoving = false;

  p.setup = function () {
    mover.targetX = p.width / 2;
    mover.targetY = p.height / 2;

    bindPointerInput(p, {
      onPress: () => {
        mover.targetX = pointerX(p);
        mover.targetY = pointerY(p);
        mover.trail = [];
        isMoving = true;
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    if (isMoving) {
      mover.x = p.lerp(mover.x, mover.targetX, mover.speed);
      mover.y = p.lerp(mover.y, mover.targetY, mover.speed);
      mover.trail.push({ x: mover.x, y: mover.y });
      if (mover.trail.length > 50) mover.trail.shift();

      const distance = p.dist(mover.x, mover.y, mover.targetX, mover.targetY);
      if (distance < 5) isMoving = false;
    }

    drawInkTrail(p, mover.trail);
    drawTargetMark(p, mover.targetX, mover.targetY, 11);

    if (isMoving) {
      drawArrow(p, mover.x, mover.y, mover.targetX, mover.targetY, 1.25);
    }

    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "mover",
      tag: "m",
      emphasis: isMoving ? "hatch" : "none",
    });

    p.noStroke();
    p.fill(...PALETTE.muted);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(9);
    p.text("target", mover.targetX, mover.targetY + 12);

    drawStatusBar(
      p,
      isMoving
        ? "Figure m moves toward target t."
        : "Click/tap to set a target and move toward it.",
      isMoving
    );
  };
}
