import { applyBackground } from "./shared/palette.js";
import { drawContainerRect, drawFigureObject, drawStatusBar } from "./shared/diagram.js";
import { bindCircleDrag } from "./shared/input.js";

export default function createSketch(p) {
  const container = { x: 0, y: 0, width: 220, height: 150 };
  const circleA = { x: 0, y: 0, radius: 20, dragging: false };
  const circleB = { x: 0, y: 0, radius: 16, dragging: false };

  p.setup = function () {
    container.x = p.width * 0.3;
    container.y = p.height * 0.24;
    container.width = p.width * 0.46;
    container.height = p.height * 0.5;
    circleA.x = container.x + container.width * 0.35;
    circleA.y = container.y + container.height * 0.45;
    circleB.x = p.width * 0.15;
    circleB.y = p.height * 0.16;
    bindCircleDrag(p, [circleA, circleB]);
  };

  p.draw = function () {
    applyBackground(p);

    const aWithin = checkWithin(circleA);
    const bWithin = checkWithin(circleB);

    drawContainerRect(p, container.x, container.y, container.width, container.height, {
      label: "CONTAINER",
      tag: "1",
    });

    drawFigureObject(p, circleA.x, circleA.y, circleA.radius, {
      label: "A",
      tag: "1a",
      emphasis: aWithin ? "solid" : "none",
    });
    drawFigureObject(p, circleB.x, circleB.y, circleB.radius, {
      label: "B",
      tag: "1b",
      emphasis: bWithin ? "solid" : "hatch",
    });

    const status =
      aWithin && bWithin
        ? "A and B are WITHIN container"
        : aWithin
          ? "A is WITHIN container; B is outside"
          : bWithin
            ? "B is WITHIN container; A is outside"
            : "Neither A nor B is WITHIN container";
    drawStatusBar(p, status, aWithin || bWithin);
  };

  function checkWithin(circle) {
    return (
      circle.x >= container.x &&
      circle.x <= container.x + container.width &&
      circle.y >= container.y &&
      circle.y <= container.y + container.height
    );
  }
}
