/*
 * Preposition Programming — BENEATH
 * Tutorial: https://prepositionprogramming.com/preposition-beneath.html
 *
 * CONCEPT
 * BENEATH means under something, often covered by it. Like below, but usually closer—and this sketch requires full containment inside a beneath zone.
 *
 * TRY IT
 * Drag the rectangle into the zone beneath the surface. It counts as beneath only when fully inside that region.
 *
 * KEY CODE (from the tutorial page)
 *   let surface = { x: 50, y: 100, w: 300, h: 10 };
 *   let mover = { x: 170, y: 130, w: 60, h: 40 };
 *   let zoneY = surface.y + surface.h;
 *   let zoneH = 60;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

const surface = { x: 0, y: 0, width: 300, height: 10, dragging: false };
const mover = { x: 0, y: 0, width: 62, height: 38, dragging: false };
const zoneDepth = 70;

function setup() {
  createCanvas(400, 300);
  surface.x = width * 0.18;
  surface.y = height * 0.34;
  mover.x = width * 0.42;
  mover.y = height * 0.6;

  bindPointerInput({
    onPress: () => {
      const x = pointerX();
      const y = pointerY();
      if (hitRect(x, y, mover)) {
        mover.dragging = true;
      } else if (hitRect(x, y, surface)) {
        surface.dragging = true;
      }
    },
    onDrag: () => {
      const x = pointerX();
      const y = pointerY();
      if (mover.dragging) {
        mover.x = constrain(x - mover.width / 2, 0, width - mover.width);
        mover.y = constrain(y - mover.height / 2, 0, height - mover.height);
      }
      if (surface.dragging) {
        surface.x = constrain(x - surface.width / 2, 0, width - surface.width);
        surface.y = constrain(y - surface.height / 2, 0, height - surface.height);
      }
    },
    onRelease: () => {
      mover.dragging = false;
      surface.dragging = false;
    },
  });
}

function draw() {
  applyBackground();

  const zone = {
    x: surface.x,
    y: surface.y + surface.height,
    width: surface.width,
    height: zoneDepth,
  };
  const isBeneath = rectFullyWithin(mover, zone);

  drawZoneRect(zone.x, zone.y, zone.width, zone.height, isBeneath);
  drawLevelLine(surface.y + surface.height, "surface");
  drawArrow(surface.x + surface.width * 0.5,
    surface.y + surface.height,
    surface.x + surface.width * 0.5,
    zone.y + zone.height * 0.4
  );

  drawFigureRect(mover.x, mover.y, mover.width, mover.height, {
    label: "M",
    tag: "1a",
    emphasis: isBeneath ? "solid" : "none",
  });
  drawFigureRect(surface.x, surface.y, surface.width, surface.height, {
    label: "S",
    tag: "1b",
    emphasis: "hatch",
  });

  drawStatusBar(isBeneath ? "M is BENEATH S" : "M is not fully beneath S",
    isBeneath
  );
}

function rectFullyWithin(inner, outer) {
  return (inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}

function hitRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}
// --- Pointer input (wired by bindPointerInput / bindCircleDrag in setup) ---
function mousePressed() {
  if (_ppInput.onPress) _ppInput.onPress();
}

function mouseDragged() {
  if (_ppInput.onDrag) _ppInput.onDrag();
}

function mouseReleased() {
  if (_ppInput.onRelease) _ppInput.onRelease();
}

function touchStarted() {
  if (_ppInput.onPress) _ppInput.onPress();
  return false;
}

function touchMoved() {
  if (_ppInput.onDrag) _ppInput.onDrag();
  return false;
}

function touchEnded() {
  if (_ppInput.onRelease) _ppInput.onRelease();
  return false;
}

