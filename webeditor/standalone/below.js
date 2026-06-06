/*
 * Preposition Programming — BELOW
 * Tutorial: https://prepositionprogramming.com/preposition-below.html
 *
 * CONCEPT
 * BELOW means at a lower level than something else. On screen, that is a larger Y value, because Y increases downward from the top edge.
 *
 * TRY IT
 * Drag circles A and B. The status line and Y labels update as their vertical positions change.
 *
 * KEY CODE (from the tutorial page)
 *   let a = { x: 120, y: 160, r: 20 };
 *   let b = { x: 260, y: 80, r: 20 };
 *   let below = a.y > b.y;
 *   let belowY = targetY + 50;
 *
 * This is global-mode p5.js — edit the variables and tests below, then press Play.
 * Drawing helpers live in helpers.js (same project); focus on setup() and draw().
 */

let circleA = { x: 0, y: 0, radius: 20, dragging: false };
let circleB = { x: 0, y: 0, radius: 20, dragging: false }

function setup() {
  createCanvas(400, 300);
  circleA.x = width * 0.35;
  circleA.y = height * 0.58;
  circleB.x = width * 0.62;
  circleB.y = height * 0.32;
}

function draw() {
  applyBackground();

  const belowIsA = circleA.y > circleB.y;
  const sameLevel = Math.abs(circleA.y - circleB.y) < 2;

  drawLevelLine(circleA.y, `Y=${Math.round(circleA.y)}`);
  drawLevelLine(circleB.y, `Y=${Math.round(circleB.y)}`);

  if (!sameLevel) {
    drawDimensionV(width * 0.78,
      Math.min(circleA.y, circleB.y),
      Math.max(circleA.y, circleB.y),
      "Δy"
    );
  }

  drawFigureObject(circleA.x, circleA.y, circleA.radius, {
    label: "A",
    tag: "1a",
    emphasis: sameLevel ? "none" : belowIsA ? "solid" : "hatch",
  });
  drawFigureObject(circleB.x, circleB.y, circleB.radius, {
    label: "B",
    tag: "1b",
    emphasis: sameLevel ? "none" : belowIsA ? "hatch" : "solid",
  });

  const status = sameLevel
    ? "Same Y — neither above nor below"
    : belowIsA
      ? "A is BELOW B"
      : "B is BELOW A";
  drawStatusBar(status, !sameLevel);
}

function mousePressed() {
  const x = pointerX();
  const y = pointerY();
  if (hitCircle(x, y, circleA.x, circleA.y, circleA.radius)) {
    circleA.dragging = true;
  } else if (hitCircle(x, y, circleB.x, circleB.y, circleB.radius)) {
    circleB.dragging = true;
  }
}

function mouseDragged() {
  const x = pointerX();
  const y = pointerY();
  if (circleA.dragging) {
    circleA.x = x;
    circleA.y = y;
  }
  if (circleB.dragging) {
    circleB.x = x;
    circleB.y = y;
  }
}

function mouseReleased() {
  circleA.dragging = false;
  circleB.dragging = false;
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}
