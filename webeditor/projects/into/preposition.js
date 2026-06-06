import { PALETTE, applyBackground } from "./shared/palette.js";
import {
  drawFigureObject,
  drawArrow,
  drawDashedLine,
  drawStatusBar,
  drawContainerRect,
} from "./shared/diagram.js";
import { bindPointerInput } from "./shared/input.js";

export default function createSketch(p) {
  const box = { x: 280, y: 150, width: 100, height: 80 };

  const start = { x: 80, y: 200 };
  const target = { x: 330, y: 170 };
  const mover = { x: 80, y: 200, radius: 10 };

  let progress = 0;
  let isMoving = false;

  p.setup = function () {
    bindPointerInput(p, {
      onPress: () => {
        progress = 0;
        isMoving = true;
        mover.x = start.x;
        mover.y = start.y;
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    if (isMoving && progress < 1) {
      progress += 0.015;
      mover.x = p.lerp(start.x, target.x, progress);
      const straightY = p.lerp(start.y, target.y, progress);
      const arcOffset = p.sin(progress * p.PI) * 80;
      mover.y = straightY - arcOffset;
      if (progress >= 1) isMoving = false;
    }

    const isInside =
      mover.x > box.x && mover.x < box.x + box.width && mover.y > box.y && mover.y < box.y + box.height;

    const samples = 20;
    for (let i = 1; i <= samples; i++) {
      const t0 = (i - 1) / samples;
      const t1 = i / samples;
      const x1 = p.lerp(start.x, target.x, t0);
      const y1 = p.lerp(start.y, target.y, t0) - p.sin(t0 * p.PI) * 80;
      const x2 = p.lerp(start.x, target.x, t1);
      const y2 = p.lerp(start.y, target.y, t1) - p.sin(t1 * p.PI) * 80;
      drawDashedLine(p, x1, y1, x2, y2);
    }

    if (isMoving) {
      const t2 = p.min(progress + 0.03, 1);
      const nx = p.lerp(start.x, target.x, t2);
      const ny = p.lerp(start.y, target.y, t2) - p.sin(t2 * p.PI) * 80;
      drawArrow(p, mover.x, mover.y, nx, ny, 1.2);
    }

    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "mover",
      tag: "m",
      emphasis: isMoving ? "hatch" : "none",
    });

    p.fill(...PALETTE.fill, 120);
    p.noStroke();
    p.rect(box.x, box.y, box.width, box.height);
    drawContainerRect(p, box.x, box.y, box.width, box.height, {
      label: "container",
      tag: "t",
    });

    drawStatusBar(
      p,
      isInside
        ? "Figure m is into target container t."
        : isMoving
          ? "Figure m moves into container t."
          : "Click/tap to run the into arc.",
      isMoving || isInside
    );
  };
}
