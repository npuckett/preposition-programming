import { PALETTE, applyBackground } from "../js/shared/palette.js";
import {
  drawArrow,
  drawDashedLine,
  drawFigureObject,
  drawStatusBar,
  drawTimeline,
} from "../js/shared/diagram.js";
import { bindPointerInput } from "../js/shared/input.js";

export default function createSketch(p) {
  const mover = { x: 52, y: 148, r: 11, speed: 2.3, active: false };
  const obstacles = [];
  let trail = [];
  let clearing = false;
  let statusText = "Click to clear blockers before M moves.";

  const laneY = 148;
  const startX = 52;
  const endX = 348;

  function resetLayout() {
    obstacles.length = 0;
    trail = [];
    mover.x = startX;
    mover.y = laneY;
    mover.active = false;
    clearing = false;

    for (let i = 0; i < 4; i += 1) {
      const x = 112 + i * 58;
      const y = laneY;
      const targetY = p.random() < 0.5 ? p.random(44, 84) : p.random(206, 246);
      obstacles.push({
        x,
        y,
        homeX: x,
        homeY: y,
        targetX: x + p.random(-14, 14),
        targetY,
        cleared: false,
      });
    }
  }

  function startSequence() {
    resetLayout();
    clearing = true;
    statusText = "Blocking figures scattering to clear lane.";
  }

  function updateObstacles() {
    let allCleared = true;
    for (const obs of obstacles) {
      if (obs.cleared) continue;
      obs.x = p.lerp(obs.x, obs.targetX, 0.09);
      obs.y = p.lerp(obs.y, obs.targetY, 0.09);
      const d = p.dist(obs.x, obs.y, obs.targetX, obs.targetY);
      if (d < 1.2) obs.cleared = true;
      if (!obs.cleared) allCleared = false;
    }
    if (allCleared) {
      clearing = false;
      mover.active = true;
      statusText = "Lane cleared. M advancing right.";
    }
  }

  function updateMover() {
    trail.push({ x: mover.x, y: mover.y });
    if (trail.length > 80) trail.shift();
    mover.x += mover.speed;
    if (mover.x >= endX) {
      mover.x = endX;
      mover.active = false;
      statusText = "Sequence complete. Click to replay.";
    }
  }

  function drawSceneGuides() {
    drawTimeline(p, 42, 42, 358, ["t0", "prep", "clear", "go", "done"]);
    drawDashedLine(p, startX, laneY, endX, laneY);
    drawArrow(p, startX + 8, laneY - 18, endX - 8, laneY - 18, 1);
  }

  function drawObstacles() {
    for (let i = 0; i < obstacles.length; i += 1) {
      const obs = obstacles[i];
      const emphasis = obs.cleared ? "outline" : "hatch";
      drawFigureObject(p, obs.x, obs.y, 9, {
        label: "",
        tag: `B${i + 1}`,
        emphasis,
      });
    }
  }

  function drawMover() {
    drawFigureObject(p, mover.x, mover.y, mover.r, {
      label: "M",
      tag: "MAIN",
      emphasis: mover.active ? "solid" : "outline",
    });
  }

  function drawLaneAnchors() {
    p.noFill();
    p.stroke(...PALETTE.muted);
    p.strokeWeight(1);
    p.circle(startX, laneY, 10);
    p.circle(endX, laneY, 10);
  }

  function drawStatus() {
    const clearedCount = obstacles.reduce((count, obs) => count + (obs.cleared ? 1 : 0), 0);
    if (clearing) {
      drawStatusBar(p, `BEFORE: clear ${clearedCount}/4 blockers`);
      return;
    }
    if (mover.active) {
      drawStatusBar(p, `BEFORE: M moves after ${clearedCount}/4 cleared`, true);
      return;
    }
    drawStatusBar(p, statusText);
  }

  p.setup = function setup() {
    resetLayout();
    bindPointerInput(p, {
      onPress: () => {
        if (!clearing && !mover.active) startSequence();
      },
    });
  };

  p.draw = function draw() {
    applyBackground(p);
    drawSceneGuides();
    if (clearing) updateObstacles();
    if (mover.active) updateMover();
    drawLaneAnchors();
    drawObstacles();
    drawMover();
    drawStatus();
  };
}
