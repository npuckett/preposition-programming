import { applyBackground } from "./shared/palette.js";
import {
  drawArrow,
  drawDashedLine,
  drawFigureObject,
  drawInkTrail,
  drawStatusBar,
} from "./shared/diagram.js";
import { bindPointerInput } from "./shared/input.js";

export default function createSketch(p) {
  const mover = {
    x: 200,
    y: 150,
    vx: 2.4,
    vy: 1.7,
    r: 10,
    moving: false,
  };
  let trail = [];

  function startMoving() {
    mover.x = 200;
    mover.y = 150;
    mover.vx = p.random(-2.8, 2.8);
    mover.vy = p.random(-2.8, 2.8);
    if (p.abs(mover.vx) < 1) mover.vx = mover.vx < 0 ? -1.4 : 1.4;
    if (p.abs(mover.vy) < 1) mover.vy = mover.vy < 0 ? -1.2 : 1.2;
    trail = [{ x: mover.x, y: mover.y }];
    mover.moving = true;
  }

  function toggle() {
    mover.moving = !mover.moving;
    if (mover.moving && trail.length === 0) {
      trail.push({ x: mover.x, y: mover.y });
    }
  }

  function updateMover() {
    mover.x += mover.vx;
    mover.y += mover.vy;
    if (mover.x < mover.r || mover.x > p.width - mover.r) mover.vx *= -1;
    if (mover.y < mover.r || mover.y > p.height - mover.r - 20) mover.vy *= -1;
    mover.x = p.constrain(mover.x, mover.r, p.width - mover.r);
    mover.y = p.constrain(mover.y, mover.r, p.height - mover.r - 20);
    trail.push({ x: mover.x, y: mover.y });
    if (trail.length > 110) trail.shift();
  }

  function drawBounds() {
    drawDashedLine(p, 12, 12, p.width - 12, 12);
    drawDashedLine(p, p.width - 12, 12, p.width - 12, p.height - 28);
    drawDashedLine(p, p.width - 12, p.height - 28, 12, p.height - 28);
    drawDashedLine(p, 12, p.height - 28, 12, 12);
  }

  function drawMover() {
    drawFigureObject(p, mover.x, mover.y, mover.r, {
      label: "W",
      tag: "UNTIL",
      emphasis: mover.moving ? "solid" : "outline",
    });
    if (mover.moving) {
      drawArrow(p, mover.x, mover.y, mover.x + mover.vx * 7, mover.y + mover.vy * 7, 1);
    }
  }

  function drawStatus() {
    if (mover.moving) {
      drawStatusBar(p, "UNTIL moving: click to stop.", true);
      return;
    }
    drawStatusBar(p, "UNTIL stopped: click to move again.");
  }

  p.setup = function setup() {
    startMoving();
    bindPointerInput(p, { onPress: toggle });
  };

  p.draw = function draw() {
    applyBackground(p);
    drawBounds();
    if (mover.moving) updateMover();
    drawInkTrail(p, trail);
    drawMover();
    drawStatus();
  };
}
