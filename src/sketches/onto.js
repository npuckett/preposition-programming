import { applyBackground } from "../js/shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawStatusBar,
  drawContainerRect,
  drawDashedLine,
} from "../js/shared/diagram.js";
import { bindPointerInput, pointerX, pointerY } from "../js/shared/input.js";

export default function createSketch(p) {
  const surface = { x: 150, y: 200, width: 150, height: 20 };
  const mover = {
    x: 80,
    y: 80,
    startX: 80,
    startY: 80,
    radius: 15,
    targetX: 225,
    targetY: 185,
    isOnSurface: false,
  };

  let progress = 0;
  let isAnimating = false;

  p.setup = function () {
    bindPointerInput(p, {
      onPress: () => {
        const x = pointerX(p);
        const y = pointerY(p);
        if (y < surface.y - mover.radius && (mover.isOnSurface || !isAnimating)) {
          mover.startX = x;
          mover.startY = y;
          mover.x = x;
          mover.y = y;
          mover.isOnSurface = false;
          progress = 0;
          isAnimating = true;
        }
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    if (isAnimating) {
      progress += 0.02;
      mover.x = p.lerp(mover.startX, mover.targetX, progress);
      mover.y = p.lerp(mover.startY, mover.targetY, progress);
      if (progress >= 1) {
        progress = 1;
        isAnimating = false;
        mover.isOnSurface = true;
      }
    }

    drawContainerRect(p, surface.x, surface.y, surface.width, surface.height, {
      label: "surface",
      tag: "t",
    });
    drawDashedLine(p, mover.targetX, mover.targetY - 30, mover.targetX, mover.targetY + 20);

    if (isAnimating) {
      drawArrow(p, mover.x, mover.y, mover.targetX, mover.targetY, 1.2);
    }

    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "mover",
      tag: "m",
      emphasis: isAnimating ? "hatch" : mover.isOnSurface ? "solid" : "none",
    });

    drawStatusBar(
      p,
      mover.isOnSurface
        ? "Figure m is onto target surface t."
        : isAnimating
          ? "Figure m drops onto surface t."
          : "Click/tap above the platform to drop onto it.",
      isAnimating || mover.isOnSurface
    );
  };
}
