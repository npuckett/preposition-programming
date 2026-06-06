import { PALETTE, applyBackground } from "../js/shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawTargetMark,
  drawInkTrail,
  drawDashedLine,
  drawStatusBar,
} from "../js/shared/diagram.js";
import { bindPointerInput, pointerX, pointerY } from "../js/shared/input.js";

export default function createSketch(p) {
  const mover = {
    x: 200,
    y: 150,
    speed: 2,
    radius: 12.5,
    isMoving: false,
  };

  const source = { x: 100, y: 100, visible: false };
  const trail = [];
  let movementFrames = 0;
  const maxMovementFrames = 100;
  const maxDistance = 120;

  p.setup = function () {
    mover.x = p.width / 2;
    mover.y = p.height / 2;

    bindPointerInput(p, {
      onPress: () => {
        source.x = pointerX(p);
        source.y = pointerY(p);
        source.visible = true;
        mover.isMoving = true;
        movementFrames = 0;
        trail.length = 0;
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    const distance = p.dist(mover.x, mover.y, source.x, source.y);
    const dx = mover.x - source.x;
    const dy = mover.y - source.y;

    if (
      mover.isMoving &&
      movementFrames < maxMovementFrames &&
      distance < maxDistance &&
      distance > 0
    ) {
      const moveX = (dx / distance) * mover.speed;
      const moveY = (dy / distance) * mover.speed;
      const nextX = mover.x + moveX;
      const nextY = mover.y + moveY;

      if (nextX > 20 && nextX < p.width - 20 && nextY > 20 && nextY < p.height - 20) {
        mover.x = nextX;
        mover.y = nextY;
        trail.push({ x: mover.x, y: mover.y });
        if (trail.length > 50) trail.shift();
        movementFrames += 1;
      } else {
        mover.isMoving = false;
      }
    } else if (distance >= maxDistance || movementFrames >= maxMovementFrames) {
      mover.isMoving = false;
    }

    if (source.visible) {
      p.noFill();
      p.stroke(...PALETTE.light);
      p.strokeWeight(1);
      p.circle(source.x, source.y, maxDistance * 2);
      drawTargetMark(p, source.x, source.y, 10);
      p.noStroke();
      p.fill(...PALETTE.muted);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(9);
      p.text("source s", source.x, source.y + 12);
    }

    drawInkTrail(p, trail);

    if (mover.isMoving && source.visible && distance > 5) {
      drawDashedLine(p, source.x, source.y, mover.x, mover.y);
      drawArrow(p, source.x, source.y, mover.x, mover.y, 1.15);
    }

    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "mover",
      tag: "m",
      emphasis: mover.isMoving ? "hatch" : "none",
    });

    drawStatusBar(
      p,
      mover.isMoving
        ? "Figure m moves away from source s."
        : "Click/tap to set source s and move away.",
      mover.isMoving
    );
  };
}
