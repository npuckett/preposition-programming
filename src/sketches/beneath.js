import { applyBackground } from "../js/shared/palette.js";
import {
  drawLevelLine,
  drawZoneRect,
  drawFigureRect,
  drawStatusBar,
  drawArrow,
} from "../js/shared/diagram.js";
import { bindPointerInput, pointerX, pointerY } from "../js/shared/input.js";

export default function createSketch(p) {
  const surface = { x: 0, y: 0, width: 300, height: 10, dragging: false };
  const mover = { x: 0, y: 0, width: 62, height: 38, dragging: false };
  const zoneDepth = 70;

  p.setup = function () {
    surface.x = p.width * 0.18;
    surface.y = p.height * 0.34;
    mover.x = p.width * 0.42;
    mover.y = p.height * 0.6;

    bindPointerInput(p, {
      onPress: () => {
        const x = pointerX(p);
        const y = pointerY(p);
        if (hitRect(x, y, mover)) {
          mover.dragging = true;
        } else if (hitRect(x, y, surface)) {
          surface.dragging = true;
        }
      },
      onDrag: () => {
        const x = pointerX(p);
        const y = pointerY(p);
        if (mover.dragging) {
          mover.x = p.constrain(x - mover.width / 2, 0, p.width - mover.width);
          mover.y = p.constrain(y - mover.height / 2, 0, p.height - mover.height);
        }
        if (surface.dragging) {
          surface.x = p.constrain(x - surface.width / 2, 0, p.width - surface.width);
          surface.y = p.constrain(y - surface.height / 2, 0, p.height - surface.height);
        }
      },
      onRelease: () => {
        mover.dragging = false;
        surface.dragging = false;
      },
    });
  };

  p.draw = function () {
    applyBackground(p);

    const zone = {
      x: surface.x,
      y: surface.y + surface.height,
      width: surface.width,
      height: zoneDepth,
    };
    const isBeneath = rectFullyWithin(mover, zone);

    drawZoneRect(p, zone.x, zone.y, zone.width, zone.height, isBeneath);
    drawLevelLine(p, surface.y + surface.height, "surface");
    drawArrow(
      p,
      surface.x + surface.width * 0.5,
      surface.y + surface.height,
      surface.x + surface.width * 0.5,
      zone.y + zone.height * 0.4
    );

    drawFigureRect(p, mover.x, mover.y, mover.width, mover.height, {
      label: "M",
      tag: "1a",
      emphasis: isBeneath ? "solid" : "none",
    });
    drawFigureRect(p, surface.x, surface.y, surface.width, surface.height, {
      label: "S",
      tag: "1b",
      emphasis: "hatch",
    });

    drawStatusBar(
      p,
      isBeneath ? "M is BENEATH S" : "M is not fully beneath S",
      isBeneath
    );
  };

  function rectFullyWithin(inner, outer) {
    return (
      inner.x >= outer.x &&
      inner.y >= outer.y &&
      inner.x + inner.width <= outer.x + outer.width &&
      inner.y + inner.height <= outer.y + outer.height
    );
  }

  function hitRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
  }
}
