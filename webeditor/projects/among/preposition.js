import { applyBackground } from "./shared/palette.js";
import { drawFigureObject, drawLeaderLine, drawStatusBar } from "./shared/diagram.js";
import { bindPointerInput, pointerX, pointerY } from "./shared/input.js";

export default function createSketch(p) {
  const group = [];
  const moving = { x: 0, y: 0, radius: 16, targetX: 0, targetY: 0, isAmong: false };
  const nearbyRadius = 78;
  const members = 8;

  p.setup = function () {
    const cx = p.width * 0.52;
    const cy = p.height * 0.5;
    const ring = Math.min(p.width, p.height) * 0.22;
    for (let i = 0; i < members; i += 1) {
      const angle = (i / members) * p.TWO_PI;
      group.push({
        x: cx + p.cos(angle) * ring + p.random(-10, 10),
        y: cy + p.sin(angle) * ring + p.random(-10, 10),
        radius: p.random(11, 15),
      });
    }
    moving.x = p.width * 0.18;
    moving.y = p.height * 0.22;
    moving.targetX = moving.x;
    moving.targetY = moving.y;

    bindPointerInput(p, {
      onPress: () => {
        moving.targetX = pointerX(p);
        moving.targetY = pointerY(p);
      },
    });
  };

  p.draw = function () {
    applyBackground(p);
    moving.x = p.lerp(moving.x, moving.targetX, 0.07);
    moving.y = p.lerp(moving.y, moving.targetY, 0.07);

    let nearbyCount = 0;
    let nearest = null;
    let nearestDist = Infinity;

    for (const member of group) {
      const d = p.dist(moving.x, moving.y, member.x, member.y);
      if (d <= nearbyRadius) nearbyCount += 1;
      if (d < nearestDist) {
        nearestDist = d;
        nearest = member;
      }
    }

    moving.isAmong = nearbyCount >= 3;

    for (let i = 0; i < group.length; i += 1) {
      const member = group[i];
      drawFigureObject(p, member.x, member.y, member.radius, {
        label: `G${i + 1}`,
        tag: "",
        emphasis: "outline",
      });
    }

    if (moving.isAmong) {
      for (const member of group) {
        if (p.dist(moving.x, moving.y, member.x, member.y) <= nearbyRadius) {
          drawLeaderLine(p, moving.x, moving.y, member.x, member.y);
        }
      }
    } else if (nearest) {
      drawLeaderLine(p, moving.x, moving.y, nearest.x, nearest.y, "nearest");
    }

    drawFigureObject(p, moving.x, moving.y, moving.radius, {
      label: "M",
      tag: "1a",
      emphasis: moving.isAmong ? "solid" : "none",
    });

    const status = moving.isAmong
      ? `M is AMONG the group (${nearbyCount} nearby)`
      : `M is outside the group (${nearbyCount} nearby)`;
    drawStatusBar(p, status, moving.isAmong);
  };
}
