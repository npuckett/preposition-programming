import { applyBackground } from "../js/shared/palette.js";
import { drawZoneRect, drawFigureRect, drawFigureObject, drawStatusBar } from "../js/shared/diagram.js";
import { bindCircleDrag } from "../js/shared/input.js";

export default function createSketch(p) {
  const barrier = { x: 0, y: 0, width: 42, height: 0 };
  const mover = { x: 0, y: 0, radius: 16, dragging: false };
  let entrySide = null;
  let state = "outside"; // outside | inside | exited

  p.setup = function () {
    barrier.x = p.width * 0.5 - 21;
    barrier.y = p.height * 0.16;
    barrier.height = p.height * 0.66;
    mover.x = p.width * 0.23;
    mover.y = p.height * 0.5;
    bindCircleDrag(p, [mover]);
  };

  p.draw = function () {
    applyBackground(p);

    const inside = isInsideBarrier(mover.x, mover.y);
    updateState(inside);

    drawZoneRect(p, barrier.x, barrier.y, barrier.width, barrier.height, inside);
    drawFigureRect(p, barrier.x, barrier.y, barrier.width, barrier.height, {
      label: "BARRIER",
      tag: "1",
      emphasis: "hatch",
    });
    drawFigureObject(p, mover.x, mover.y, mover.radius, {
      label: "M",
      tag: "1a",
      emphasis: state === "inside" ? "solid" : state === "exited" ? "hatch" : "none",
    });

    drawStatusBar(p, statusText(), state !== "outside");
  };

  function isInsideBarrier(x, y) {
    return x >= barrier.x && x <= barrier.x + barrier.width && y >= barrier.y && y <= barrier.y + barrier.height;
  }

  function sideOfBarrier(x) {
    return x < barrier.x + barrier.width / 2 ? "left" : "right";
  }

  function updateState(inside) {
    if (inside) {
      if (state === "outside") {
        entrySide = sideOfBarrier(mover.x);
      }
      state = "inside";
      return;
    }

    if (state === "inside") {
      const exitSide = sideOfBarrier(mover.x);
      state = entrySide && exitSide !== entrySide ? "exited" : "outside";
      if (state === "outside") entrySide = null;
    }
  }

  function statusText() {
    if (state === "inside") return `M is moving THROUGH barrier (from ${entrySide})`;
    if (state === "exited") return "M moved THROUGH barrier";
    return "M is outside barrier";
  }
}
