import { applyBackground } from "./shared/palette.js";
import {
  drawFigureRect,
  drawZoneRect,
  drawFigureObject,
  drawCrosshair,
  drawStatusBar,
  drawArrow,
} from "./shared/diagram.js";
import { bindCircleDrag } from "./shared/input.js";

export default function createSketch(p) {
  const reference = { x: 0, y: 0, width: 86, height: 138 };
  const mover = { x: 0, y: 0, radius: 18, dragging: false };
  const zoneWidth = 62;
  const leftZone = { x: 0, y: 0, w: zoneWidth, h: 0 };
  const rightZone = { x: 0, y: 0, w: zoneWidth, h: 0 };

  p.setup = function () {
    reference.x = p.width * 0.5;
    reference.y = p.height * 0.5;
    mover.x = p.width * 0.22;
    mover.y = p.height * 0.5;
    bindCircleDrag(p, [mover]);
  };

  p.draw = function () {
    applyBackground(p);

    leftZone.h = reference.height;
    rightZone.h = reference.height;
    leftZone.x = reference.x - reference.width / 2 - zoneWidth;
    rightZone.x = reference.x + reference.width / 2;
    leftZone.y = reference.y - reference.height / 2;
    rightZone.y = reference.y - reference.height / 2;

    const inLeft = inZone(mover.x, mover.y, leftZone);
    const inRight = inZone(mover.x, mover.y, rightZone);
    const isBeside = inLeft || inRight;

    drawZoneRect(p, leftZone.x, leftZone.y, leftZone.w, leftZone.h, inLeft);
    drawZoneRect(p, rightZone.x, rightZone.y, rightZone.w, rightZone.h, inRight);

    drawArrow(
      p,
      reference.x - reference.width / 2,
      reference.y,
      leftZone.x + leftZone.w * 0.6,
      reference.y
    );
    drawArrow(
      p,
      reference.x + reference.width / 2,
      reference.y,
      rightZone.x + rightZone.w * 0.4,
      reference.y
    );

    drawFigureRect(
      p,
      reference.x - reference.width / 2,
      reference.y - reference.height / 2,
      reference.width,
      reference.height,
      { label: "A", tag: "1a", emphasis: "hatch" }
    );
    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "M",
      tag: "1b",
      emphasis: isBeside ? "solid" : "none",
    });
    drawCrosshair(p, mover.x, mover.y, 10);

    const status = inLeft
      ? "M is BESIDE A (left)"
      : inRight
        ? "M is BESIDE A (right)"
        : "M is not in a BESIDE zone";
    drawStatusBar(p, status, isBeside);
  };

  function inZone(x, y, zone) {
    return x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h;
  }
}
