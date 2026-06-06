import { applyBackground } from "../js/shared/palette.js";
import {
  drawZoneRect,
  drawDimensionH,
  drawFigureObject,
  drawStatusBar,
} from "../js/shared/diagram.js";
import { bindCircleDrag } from "../js/shared/input.js";

export default function createSketch(p) {
  const circleA = { x: 0, y: 0, radius: 24, dragging: false };
  const circleB = { x: 0, y: 0, radius: 24, dragging: false };
  const circleC = { x: 0, y: 0, radius: 20, dragging: false };
  const zone = { x: 0, y: 0, w: 0, h: 110 };

  p.setup = function () {
    circleA.x = p.width * 0.24;
    circleA.y = p.height * 0.5;
    circleB.x = p.width * 0.76;
    circleB.y = p.height * 0.5;
    circleC.x = p.width * 0.5;
    circleC.y = p.height * 0.5;
    bindCircleDrag(p, [circleA, circleB, circleC]);
  };

  p.draw = function () {
    applyBackground(p);

    const boundaries = getBetweenBoundaries();
    zone.w = Math.max(0, boundaries.right - boundaries.left);
    zone.x = boundaries.left;
    zone.y = p.height * 0.5 - zone.h / 2;

    const isBetween = checkBetween(boundaries);
    drawZoneRect(p, zone.x, zone.y, zone.w, zone.h, isBetween);
    drawDimensionH(
      p,
      zone.y - 10,
      boundaries.left,
      boundaries.right,
      `SPAN ${Math.round(zone.w)}`
    );

    drawFigureObject(p, circleA.x, circleA.y, circleA.radius, {
      label: "A",
      tag: "1a",
      emphasis: "none",
    });
    drawFigureObject(p, circleB.x, circleB.y, circleB.radius, {
      label: "B",
      tag: "1b",
      emphasis: "none",
    });
    drawFigureObject(p, circleC.x, circleC.y, circleC.radius, {
      label: "C",
      tag: "1c",
      emphasis: isBetween ? "solid" : "hatch",
    });

    drawStatusBar(p, statusText(isBetween, boundaries), isBetween);
  };

  function getBetweenBoundaries() {
    if (circleA.x <= circleB.x) {
      return {
        left: circleA.x + circleA.radius,
        right: circleB.x - circleB.radius,
      };
    }
    return {
      left: circleB.x + circleB.radius,
      right: circleA.x - circleA.radius,
    };
  }

  function checkBetween(boundaries) {
    if (boundaries.right <= boundaries.left) return false;
    const cLeft = circleC.x - circleC.radius;
    const cRight = circleC.x + circleC.radius;
    return cLeft >= boundaries.left && cRight <= boundaries.right;
  }

  function statusText(isBetween, boundaries) {
    if (boundaries.right <= boundaries.left) {
      return "Anchors overlap — no BETWEEN span";
    }
    if (isBetween) return "C is BETWEEN A and B";
    if (circleC.x < boundaries.left) return "C is left of BETWEEN span";
    if (circleC.x > boundaries.right) return "C is right of BETWEEN span";
    return "C intersects a boundary edge";
  }
}
