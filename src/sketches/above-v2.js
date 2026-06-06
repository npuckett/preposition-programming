import { applyBackground } from "../js/shared/palette.js";
import {
  drawLevelLine,
  drawDimensionV,
  drawFigureObject,
  drawStatusBar,
  drawLeaderLine,
} from "../js/shared/diagram.js";
import { pointerX, pointerY, hitCircle } from "../js/shared/input.js";

export default function createSketch(p) {
  let circleA = { x: 0, y: 0, radius: 20, dragging: false };
  let circleB = { x: 0, y: 0, radius: 20, dragging: false };

  p.setup = function () {
    circleA.x = p.width * 0.35;
    circleA.y = p.height * 0.32;
    circleB.x = p.width * 0.62;
    circleB.y = p.height * 0.58;
  };

  p.draw = function () {
    applyBackground(p);

    const aboveIsA = circleA.y < circleB.y;
    const sameLevel = Math.abs(circleA.y - circleB.y) < 2;

    drawLevelLine(p, circleA.y, `Y=${Math.round(circleA.y)}`);
    drawLevelLine(p, circleB.y, `Y=${Math.round(circleB.y)}`);

    if (!sameLevel) {
      drawDimensionV(
        p,
        p.width * 0.78,
        Math.min(circleA.y, circleB.y),
        Math.max(circleA.y, circleB.y),
        "Δy"
      );
    }

    drawLeaderLine(
      p,
      circleA.x,
      circleA.y - circleA.radius - 4,
      circleA.x,
      8,
      ""
    );

    drawFigureObject(p, circleA.x, circleA.y, circleA.radius, {
      label: "A",
      tag: "1a",
      emphasis: sameLevel ? "none" : aboveIsA ? "solid" : "hatch",
    });
    drawFigureObject(p, circleB.x, circleB.y, circleB.radius, {
      label: "B",
      tag: "1b",
      emphasis: sameLevel ? "none" : aboveIsA ? "hatch" : "solid",
    });

    let status = sameLevel
      ? "Same Y — neither above nor below"
      : aboveIsA
        ? "A is ABOVE B"
        : "B is ABOVE A";
    drawStatusBar(p, status, !sameLevel);
  };

  function handleInputStart() {
    const x = pointerX(p);
    const y = pointerY(p);
    if (hitCircle(p, x, y, circleA.x, circleA.y, circleA.radius)) {
      circleA.dragging = true;
    } else if (hitCircle(p, x, y, circleB.x, circleB.y, circleB.radius)) {
      circleB.dragging = true;
    }
  }

  function handleInputDrag() {
    const x = pointerX(p);
    const y = pointerY(p);
    if (circleA.dragging) {
      circleA.x = x;
      circleA.y = y;
    }
    if (circleB.dragging) {
      circleB.x = x;
      circleB.y = y;
    }
  }

  function handleInputEnd() {
    circleA.dragging = false;
    circleB.dragging = false;
  }

  p.mousePressed = handleInputStart;
  p.mouseDragged = handleInputDrag;
  p.mouseReleased = handleInputEnd;
  p.touchStarted = () => {
    handleInputStart();
    return false;
  };
  p.touchMoved = () => {
    handleInputDrag();
    return false;
  };
  p.touchEnded = () => {
    handleInputEnd();
    return false;
  };
}
