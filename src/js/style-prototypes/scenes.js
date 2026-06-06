import {
  drawBackground,
  drawObject,
  drawLevelLine,
  drawDimensionV,
  drawArrow,
  drawTarget,
  drawTimeline,
  drawStatus,
  drawStippleZone,
} from "./draw.js";

export function drawAbove(p, style) {
  drawBackground(p, style);

  const a = { x: p.width * 0.35, y: p.height * 0.32, r: 18 };
  const b = { x: p.width * 0.62, y: p.height * 0.58, r: 18 };
  const aboveIsA = a.y < b.y;

  drawLevelLine(p, a.y, style, style.dashedLeaders ? `Y=${Math.round(a.y)}` : "");
  drawLevelLine(p, b.y, style, style.dashedLeaders ? `Y=${Math.round(b.y)}` : "");

  if (style.dashedLeaders) {
    drawDimensionV(p, p.width * 0.78, a.y, b.y, style, "Δy");
  }

  if (style.id === "engraving") {
    drawStippleZone(p, 8, a.y - 4, p.width - 16, 6, style);
  }

  drawObject(p, a.x, a.y, a.r, style, {
    label: style.id === "engraving" ? "A" : "A",
    tag: style.figureTags ? "1a" : "",
    accent: aboveIsA && style.id !== "engraving",
    outlineOnly: style.id === "engraving" && !aboveIsA,
  });
  drawObject(p, b.x, b.y, b.r, style, {
    label: "B",
    tag: style.figureTags ? "1b" : "",
    accent: !aboveIsA && style.id === "minimal",
    outlineOnly: style.id === "engraving" && aboveIsA,
  });

  const status =
    style.id === "technical"
      ? "Fig. 1 — A above B (smaller Y)"
      : aboveIsA
        ? "A is ABOVE B"
        : "B is ABOVE A";
  drawStatus(p, status, style, style.id === "minimal" && aboveIsA);
}

export function drawToward(p, style) {
  drawBackground(p, style);

  const mover = { x: p.width * 0.28, y: p.height * 0.55 };
  const target = { x: p.width * 0.72, y: p.height * 0.38 };

  if (style.id === "engraving") {
    p.stroke(...style.hatch);
    p.strokeWeight(1);
    for (let i = 1; i < 8; i++) {
      const t = i / 8;
      const x = p.lerp(mover.x, target.x, t);
      const y = p.lerp(mover.y, target.y, t);
      p.point(x, y);
      p.point(x + 1, y);
    }
  } else if (style.id === "technical") {
    p.drawingContext.setLineDash([4, 4]);
    p.stroke(...style.light);
    p.strokeWeight(0.75);
    p.line(mover.x, mover.y, target.x, target.y);
    p.drawingContext.setLineDash([]);
    p.noStroke();
    p.fill(...style.muted);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("d", (mover.x + target.x) / 2, (mover.y + target.y) / 2 - 4);
  }

  drawTarget(p, target.x, target.y, style);
  drawArrow(p, mover.x, mover.y, target.x, target.y, style, true);
  drawObject(p, mover.x, mover.y, 10, style, {
    label: style.figureTags ? "" : "",
    tag: style.figureTags ? "2" : "",
    accent: true,
  });

  if (style.figureTags) {
    p.noStroke();
    p.fill(...style.muted);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.text("target", target.x + 14, target.y - 6);
  }

  const status =
    style.id === "technical"
      ? "vector v → target"
      : style.id === "minimal"
        ? "moving TOWARD"
        : "motion toward target";
  drawStatus(p, status, style, style.id !== "technical");
}

export function drawBefore(p, style) {
  drawBackground(p, style);

  const y = p.height * 0.52;
  const x0 = p.width * 0.12;
  const x1 = p.width * 0.88;

  drawTimeline(
    p,
    y,
    style,
    style.figureTags ? ["t₀", "t₁", "t₂", "t₃", "t₄", ""] : []
  );

  const obstacles = [
    { x: p.width * 0.38, cleared: true },
    { x: p.width * 0.52, cleared: true },
    { x: p.width * 0.66, cleared: false },
  ];

  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    drawObject(p, o.x, y, 8, style, {
      tag: style.figureTags ? String.fromCharCode(97 + i) : "",
      accent: false,
      outlineOnly: o.cleared && style.id === "engraving",
    });
    if (o.cleared && style.id === "minimal") {
      p.noFill();
      p.stroke(...style.light);
      p.circle(o.x, o.y, 18);
    }
  }

  const moverX = x0 + 20;
  drawObject(p, moverX, y, 7, style, {
    tag: style.figureTags ? "m" : "",
    accent: true,
    outlineOnly: style.id === "engraving",
  });

  if (style.dashedLeaders) {
    const leaderColor = style.inkOnly ? style.ink : style.accent;
    p.drawingContext.setLineDash([3, 3]);
    p.stroke(...leaderColor);
    p.line(moverX + 10, y - 20, x1 - 10, y - 20);
    p.drawingContext.setLineDash([]);
    p.noStroke();
    p.fill(...leaderColor);
    p.textSize(8);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("after clearance →", (moverX + x1) / 2, y - 22);
  }

  const status =
    style.id === "technical"
      ? "stage t₁ — clearing before motion"
      : "obstacles must clear BEFORE movement";
  drawStatus(p, status, style, style.id === "minimal");
}

export const SCENES = {
  above: drawAbove,
  toward: drawToward,
  before: drawBefore,
};
