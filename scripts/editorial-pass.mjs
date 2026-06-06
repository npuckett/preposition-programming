/**
 * One-time editorial pass — writes src/data/prepositions.json
 * Run: node scripts/editorial-pass.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/prepositions.json");

const REF = (name, slug) =>
  `<a href="https://p5js.org/reference/p5/${slug}" target="_blank" rel="noopener noreferrer">${name}</a>`;

const MDN_AND =
  `<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND" target="_blank" rel="noopener noreferrer">&&</a>`;

function codeSection(title, body) {
  return `<div class="code-section"><strong>${title}</strong><br><br>${body}</div>`;
}

function strategy(intro, items) {
  const lis = items.map(([label, text]) => `<li><strong>${label}:</strong> ${text}</li>`).join("\n            ");
  return `<p>${intro}</p>\n        <ul>\n            ${lis}\n        </ul>`;
}

const POINTER_DRAG = `<strong>Pointer input</strong><br>
            • ${REF("mousePressed()", "mousePressed")}, ${REF("mouseDragged()", "mouseDragged")}, ${REF("mouseReleased()", "mouseReleased")} — drag objects<br>
            • ${REF("dist()", "dist")} — test whether the pointer is inside a circle`;

const POINTER_CLICK = `<strong>Pointer input</strong><br>
            • ${REF("mousePressed()", "mousePressed")} — start motion or set a target<br>
            • ${REF("mouseX", "mouseX")}, ${REF("mouseY", "mouseY")} — click position`;

const CANVAS = `<strong>Canvas coordinates</strong><br>
            • ${REF("createCanvas()", "createCanvas")} — origin (0, 0) is top-left<br>
            • Y increases downward; X increases to the right`;

const prepositions = [
  {
    slug: "above",
    title: "Above",
    category: "spatial",
    editorSketchId: "ddWIriyOk",
    tryIt: "Drag circles A and B. The status line and Y labels update as their vertical positions change.",
    conceptHtml:
      '<strong>ABOVE</strong> means at a higher level than something else. On screen, that is a <em>smaller</em> Y value, because Y increases downward from the top edge.',
    strategyHtml: strategy("Ways to express <em>above</em> in a sketch:", [
      ["Static placement", "Give one element a smaller Y than another"],
      ["Dynamic motion", "Move an element to sit higher on the canvas"],
      ["Conditional test", "Use <code>elementA.y &lt; elementB.y</code> to detect the relationship"],
    ]),
    methodsHtml: codeSection("Key methods", `${CANVAS}<br><br>
            <strong>Comparison</strong><br>
            • <code>elementA.y &lt; elementB.y</code> — A is above B<br><br>
            <strong>Drawing</strong><br>
            • ${REF("ellipse()", "ellipse")}, ${REF("line()", "line")} — marks and level guides<br><br>
            ${POINTER_DRAG}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Store positions</strong><br>
            <code>let a = { x: 120, y: 80, r: 20 };</code><br>
            <code>let b = { x: 260, y: 160, r: 20 };</code><br><br>
            2. <strong>Test the relationship</strong><br>
            <code>let above = a.y &lt; b.y;</code><br><br>
            3. <strong>Place relative to a target</strong><br>
            <code>let aboveY = targetY - 50;</code><br><br>
            4. <strong>Hit-test for dragging</strong><br>
            <code>if (dist(mouseX, mouseY, a.x, a.y) &lt; a.r) a.dragging = true;</code>`),
  },
  {
    slug: "below",
    title: "Below",
    category: "spatial",
    editorSketchId: "X3nB6HJLP",
    tryIt: "Drag circles A and B. The status line and Y labels update as their vertical positions change.",
    conceptHtml:
      '<strong>BELOW</strong> means at a lower level than something else. On screen, that is a <em>larger</em> Y value, because Y increases downward from the top edge.',
    strategyHtml: strategy("Ways to express <em>below</em> in a sketch:", [
      ["Static placement", "Give one element a larger Y than another"],
      ["Dynamic motion", "Move an element to sit lower on the canvas"],
      ["Conditional test", "Use <code>elementA.y &gt; elementB.y</code> to detect the relationship"],
    ]),
    methodsHtml: codeSection("Key methods", `${CANVAS}<br><br>
            <strong>Comparison</strong><br>
            • <code>elementA.y &gt; elementB.y</code> — A is below B<br><br>
            <strong>Drawing</strong><br>
            • ${REF("ellipse()", "ellipse")}, ${REF("line()", "line")} — marks and level guides<br><br>
            ${POINTER_DRAG}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Store positions</strong><br>
            <code>let a = { x: 120, y: 160, r: 20 };</code><br>
            <code>let b = { x: 260, y: 80, r: 20 };</code><br><br>
            2. <strong>Test the relationship</strong><br>
            <code>let below = a.y &gt; b.y;</code><br><br>
            3. <strong>Place relative to a target</strong><br>
            <code>let belowY = targetY + 50;</code><br><br>
            4. <strong>Hit-test for dragging</strong><br>
            <code>if (dist(mouseX, mouseY, a.x, a.y) &lt; a.r) a.dragging = true;</code>`),
  },
  {
    slug: "between",
    title: "Between",
    category: "spatial",
    editorSketchId: "zLIVDNbuF",
    tryIt: "Drag all three circles. C is between A and B when its position falls in the range they define.",
    conceptHtml:
      '<strong>BETWEEN</strong> means in the space separating two other things. Test whether a point\'s coordinate lies between two bounds on an axis.',
    strategyHtml: strategy("Ways to express <em>between</em> in a sketch:", [
      ["Horizontal", "Compare X against left and right bounds"],
      ["Vertical", "Compare Y against top and bottom bounds"],
      ["Both axes", "Require the point to be between on X and Y when needed"],
    ]),
    methodsHtml: codeSection("Key methods", `${CANVAS}<br><br>
            <strong>Range test</strong><br>
            • <code>minX &lt; x &amp;&amp; x &lt; maxX</code> — horizontal between<br>
            • ${MDN_AND} — combine boundary checks<br><br>
            <strong>Drawing</strong><br>
            • ${REF("ellipse()", "ellipse")}, ${REF("line()", "line")} — objects and span guides<br><br>
            ${POINTER_DRAG}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Store three positions</strong><br>
            <code>let a = { x: 100, y: 150 };</code><br>
            <code>let b = { x: 300, y: 150 };</code><br>
            <code>let c = { x: 200, y: 150 };</code><br><br>
            2. <strong>Find the span</strong><br>
            <code>let left = min(a.x, b.x);</code><br>
            <code>let right = max(a.x, b.x);</code><br><br>
            3. <strong>Test between</strong><br>
            <code>let isBetween = c.x &gt; left &amp;&amp; c.x &lt; right;</code><br><br>
            4. <strong>Hit-test for dragging</strong><br>
            <code>if (dist(mouseX, mouseY, c.x, c.y) &lt; c.r) c.dragging = true;</code>`),
  },
  {
    slug: "among",
    title: "Among",
    category: "spatial",
    editorSketchId: "gTIDK9eFQ",
    tryIt: "Tap or click anywhere to send the moving circle toward that point. It is among the group when it sits near the cluster center.",
    conceptHtml:
      '<strong>AMONG</strong> means within a group of three or more things. Unlike <em>between</em> (two endpoints), <em>among</em> depends on proximity to several neighbors or to a group region.',
    strategyHtml: strategy("Ways to express <em>among</em> in a sketch:", [
      ["Group center", "Compare distance to the average position of the group"],
      ["Neighbor count", "Count how many members fall within a radius"],
      ["Bounding region", "Test membership inside a hull or box around the group"],
    ]),
    methodsHtml: codeSection("Key methods", `${CANVAS}<br><br>
            <strong>Group math</strong><br>
            • ${REF("dist()", "dist")} — proximity to center or members<br>
            • Arrays — store many reference positions<br><br>
            <strong>Drawing</strong><br>
            • ${REF("ellipse()", "ellipse")} — group members and mover<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define the group</strong><br>
            <code>let group = [{x:100,y:100},{x:200,y:120},{x:150,y:180}];</code><br><br>
            2. <strong>Find the center</strong><br>
            <code>let cx = group.reduce((s,p)=&gt;s+p.x,0)/group.length;</code><br>
            <code>let cy = group.reduce((s,p)=&gt;s+p.y,0)/group.length;</code><br><br>
            3. <strong>Test membership</strong><br>
            <code>let d = dist(mover.x, mover.y, cx, cy);</code><br>
            <code>let isAmong = d &lt; groupRadius;</code><br><br>
            4. <strong>Move toward a click</strong><br>
            <code>targetX = mouseX; targetY = mouseY;</code>`),
  },
  {
    slug: "beside",
    title: "Beside",
    category: "spatial",
    editorSketchId: "AYzWnDhPy",
    tryIt: "Drag the moving circle into the zones beside the reference shape. Crosshairs mark the center point being tested.",
    conceptHtml:
      '<strong>BESIDE</strong> means next to something, usually to the left or right. Here, the mover\'s center must fall inside a rectangular zone adjacent to the reference object.',
    strategyHtml: strategy("Ways to express <em>beside</em> in a sketch:", [
      ["Adjacent zones", "Define rectangles to the left and right of a reference"],
      ["Center test", "Use the object's center, not its edge, for containment"],
      ["Feedback", "Change stroke or label when the zone test passes"],
    ]),
    methodsHtml: codeSection("Key methods", `${CANVAS}<br><br>
            <strong>Zone test</strong><br>
            • Compare X and Y against <code>left</code>, <code>right</code>, <code>top</code>, <code>bottom</code><br>
            • ${REF("rect()", "rect")} — draw zones and reference shape<br><br>
            <strong>Drawing</strong><br>
            • ${REF("line()", "line")} — crosshairs at the center point<br><br>
            ${POINTER_DRAG}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define zones beside the reference</strong><br>
            <code>let leftZone = { x: ref.x - gap - w, y: ref.y, w, h };</code><br><br>
            2. <strong>Test the center point</strong><br>
            <code>function inZone(px, py, z) {</code><br>
            <code>&nbsp;&nbsp;return px &gt;= z.x &amp;&amp; px &lt;= z.x + z.w &amp;&amp;</code><br>
            <code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; py &gt;= z.y &amp;&amp; py &lt;= z.y + z.h;</code><br>
            <code>}</code><br><br>
            3. <strong>Report beside</strong><br>
            <code>let beside = inZone(mover.x, mover.y, leftZone) ||</code><br>
            <code>&nbsp;&nbsp;inZone(mover.x, mover.y, rightZone);</code><br><br>
            4. <strong>Hit-test for dragging</strong><br>
            <code>if (dist(mouseX, mouseY, mover.x, mover.y) &lt; mover.r) dragging = true;</code>`),
  },
  {
    slug: "behind",
    title: "Behind",
    category: "spatial",
    editorSketchId: "T6n1O_dKq",
    tryIt: "Drag both circles. One is always drawn first (behind). Overlap percentage updates when they intersect.",
    conceptHtml:
      '<strong>BEHIND</strong> means at the back, partially hidden by something in front. In 2D, <em>draw order</em> sets layering—shapes drawn earlier appear behind shapes drawn later.',
    strategyHtml: strategy("Ways to express <em>behind</em> in a sketch:", [
      ["Draw order", "Render the back object before the front object"],
      ["Overlap test", "Use distance and radii to detect intersection"],
      ["Depth cues", "Optional size, opacity, or hatch to suggest depth"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Layering</strong><br>
            • Draw the back shape first, the front shape second<br><br>
            <strong>Overlap</strong><br>
            • ${REF("dist()", "dist")} — center-to-center distance<br>
            • <code>distance &lt; rA + rB</code> — circles overlap<br><br>
            <strong>Drawing</strong><br>
            • ${REF("ellipse()", "ellipse")}, ${REF("text()", "text")} — shapes and overlap readout<br><br>
            ${POINTER_DRAG}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Store two circles</strong><br>
            <code>let back = { x: 120, y: 150, r: 55 };</code><br>
            <code>let front = { x: 200, y: 150, r: 55 };</code><br><br>
            2. <strong>Draw back, then front</strong><br>
            <code>ellipse(back.x, back.y, back.r * 2); // behind</code><br>
            <code>ellipse(front.x, front.y, front.r * 2); // in front</code><br><br>
            3. <strong>Detect overlap</strong><br>
            <code>let d = dist(back.x, back.y, front.x, front.y);</code><br>
            <code>let overlapping = d &lt; back.r + front.r;</code><br><br>
            4. <strong>Estimate overlap amount</strong><br>
            <code>let overlap = back.r + front.r - d;</code>`),
  },
  {
    slug: "beneath",
    title: "Beneath",
    category: "spatial",
    editorSketchId: "Gbdl8UOve",
    tryIt: "Drag the rectangle into the zone beneath the surface. It counts as beneath only when fully inside that region.",
    conceptHtml:
      '<strong>BENEATH</strong> means under something, often covered by it. Like <em>below</em>, but usually closer—and this sketch requires full containment inside a beneath zone.',
    strategyHtml: strategy("Ways to express <em>beneath</em> in a sketch:", [
      ["Defined zone", "Mark the strip directly under a surface"],
      ["Full containment", "Require the whole object to fit inside the zone"],
      ["Direction cues", "Arrows or leaders show the beneath direction"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Zone setup</strong><br>
            • <code>zoneY = surface.y + surface.height</code><br><br>
            <strong>Containment</strong><br>
            • Test all four edges of the object against the zone<br>
            • ${REF("rect()", "rect")}, ${REF("line()", "line")} — surface, zone, arrows<br><br>
            ${POINTER_DRAG}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define surface and mover</strong><br>
            <code>let surface = { x: 50, y: 100, w: 300, h: 10 };</code><br>
            <code>let mover = { x: 170, y: 130, w: 60, h: 40 };</code><br><br>
            2. <strong>Define the beneath zone</strong><br>
            <code>let zoneY = surface.y + surface.h;</code><br>
            <code>let zoneH = 60;</code><br><br>
            3. <strong>Test full containment</strong><br>
            <code>let beneath = mover.y &gt;= zoneY &amp;&amp;</code><br>
            <code>&nbsp;&nbsp;mover.y + mover.h &lt;= zoneY + zoneH &amp;&amp;</code><br>
            <code>&nbsp;&nbsp;mover.x &gt;= surface.x &amp;&amp;</code><br>
            <code>&nbsp;&nbsp;mover.x + mover.w &lt;= surface.x + surface.w;</code><br><br>
            4. <strong>Draw zone feedback</strong><br>
            <code>rect(surface.x, zoneY, surface.w, zoneH);</code>`),
  },
  {
    slug: "within",
    title: "Within",
    category: "spatial",
    editorSketchId: "dH7RokMtk",
    tryIt: "Drag both circles. Each is within the container when its center lies inside the rectangle.",
    conceptHtml:
      '<strong>WITHIN</strong> means inside the boundaries of something else. Test whether a point—usually the object\'s center—sits inside the container edges.',
    strategyHtml: strategy("Ways to express <em>within</em> in a sketch:", [
      ["Boundary test", "Compare X and Y against container edges"],
      ["Center vs full shape", "Choose whether the center or entire bounds must fit"],
      ["Feedback", "Change label or emphasis when containment is true"],
    ]),
    methodsHtml: codeSection("Key methods", `${CANVAS}<br><br>
            <strong>Containment</strong><br>
            • ${REF("rect()", "rect")} — draw the container<br>
            • ${MDN_AND} — all four edge tests must pass<br><br>
            ${POINTER_DRAG}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define the container</strong><br>
            <code>let box = { x: 100, y: 80, w: 200, h: 140 };</code><br><br>
            2. <strong>Test the center point</strong><br>
            <code>function isWithin(obj, box) {</code><br>
            <code>&nbsp;&nbsp;return obj.x &gt;= box.x &amp;&amp; obj.x &lt;= box.x + box.w &amp;&amp;</code><br>
            <code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; obj.y &gt;= box.y &amp;&amp; obj.y &lt;= box.y + box.h;</code><br>
            <code>}</code><br><br>
            3. <strong>Update feedback</strong><br>
            <code>let inside = isWithin(circle, box);</code><br><br>
            4. <strong>Hit-test for dragging</strong><br>
            <code>if (dist(mouseX, mouseY, circle.x, circle.y) &lt; circle.r) circle.dragging = true;</code>`),
  },
  {
    slug: "through",
    title: "Through",
    category: "spatial",
    editorSketchId: "cSHRaES3q",
    tryIt: "Drag the circle through the barrier. Labels track whether it is outside, inside, or has finished crossing.",
    conceptHtml:
      '<strong>THROUGH</strong> means moving from one side of something to the other, passing inside or across its boundary. Track entry, interior, and exit as separate states.',
    strategyHtml: strategy("Ways to express <em>through</em> in a sketch:", [
      ["Crossing detection", "Notice when the object enters and leaves a barrier"],
      ["State flags", "Store <code>entered</code>, <code>inside</code>, and <code>exited</code>"],
      ["Motion required", "The relationship depends on movement, not static placement"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Barrier</strong><br>
            • ${REF("rect()", "rect")} — draw the region to cross<br><br>
            <strong>State</strong><br>
            • Booleans for each phase of the crossing<br>
            • ${REF("dist()", "dist")} — optional edge proximity<br><br>
            ${POINTER_DRAG}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define the barrier</strong><br>
            <code>let barrier = { x: 180, y: 50, w: 40, h: 200 };</code><br><br>
            2. <strong>Track crossing state</strong><br>
            <code>let entered = false, exited = false;</code><br><br>
            3. <strong>Update on movement</strong><br>
            <code>let inside = x &gt; barrier.x &amp;&amp; x &lt; barrier.x + barrier.w;</code><br>
            <code>if (inside &amp;&amp; !entered) entered = true;</code><br>
            <code>if (!inside &amp;&amp; entered) exited = true;</code><br><br>
            4. <strong>Label the phase</strong><br>
            <code>let status = exited ? "passed through" : inside ? "inside" : "approaching";</code>`),
  },
  {
    slug: "toward",
    title: "Toward",
    category: "movement",
    editorSketchId: "H93wrfKL5",
    tryIt: "Click or tap to set a target. The circle moves step by step toward that point each frame.",
    conceptHtml:
      '<strong>TOWARD</strong> means moving in the direction of something. Compute the vector from the object to the target and advance along it over time.',
    strategyHtml: strategy("Ways to express <em>toward</em> in a sketch:", [
      ["Direction vector", "Find Δx and Δy from current position to target"],
      ["Step each frame", "Move a fixed distance per <code>draw()</code> cycle"],
      ["Stop at arrival", "Halt when distance is less than one step"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Vector math</strong><br>
            • ${REF("dist()", "dist")} — remaining distance<br>
            • ${REF("atan2()", "atan2")}, ${REF("cos()", "cos")}, ${REF("sin()", "sin")} — direction<br>
            • ${REF("lerp()", "lerp")} — optional eased motion<br><br>
            <strong>Drawing</strong><br>
            • ${REF("ellipse()", "ellipse")}, ${REF("line()", "line")} — object and direction guide<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Store mover and target</strong><br>
            <code>let mover = { x: 100, y: 100, speed: 2 };</code><br>
            <code>let target = { x: 300, y: 200 };</code><br><br>
            2. <strong>Find direction</strong><br>
            <code>let dx = target.x - mover.x;</code><br>
            <code>let dy = target.y - mover.y;</code><br>
            <code>let d = dist(mover.x, mover.y, target.x, target.y);</code><br><br>
            3. <strong>Step toward target</strong><br>
            <code>if (d &gt; mover.speed) {</code><br>
            <code>&nbsp;&nbsp;mover.x += (dx / d) * mover.speed;</code><br>
            <code>&nbsp;&nbsp;mover.y += (dy / d) * mover.speed;</code><br>
            <code>}</code><br><br>
            4. <strong>Set target on click</strong><br>
            <code>target.x = mouseX; target.y = mouseY;</code>`),
  },
  {
    slug: "away",
    title: "Away",
    category: "movement",
    editorSketchId: "hgtGXDBXq",
    tryIt: "Click or tap to set a source point. The circle moves away from it, increasing distance each frame.",
    conceptHtml:
      '<strong>AWAY</strong> means moving in the opposite direction from a reference point. Use the vector from source to object, then continue outward along it.',
    strategyHtml: strategy("Ways to express <em>away</em> in a sketch:", [
      ["Outward vector", "Subtract source from object position to get direction"],
      ["Step each frame", "Add the normalized vector times speed"],
      ["Boundaries", `Use ${REF("constrain()", "constrain")} or wrap at canvas edges`],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Vector math</strong><br>
            • ${REF("dist()", "dist")} — distance from source<br>
            • ${REF("constrain()", "constrain")} — keep the object on screen<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Store mover and source</strong><br>
            <code>let mover = { x: 200, y: 150, speed: 2 };</code><br>
            <code>let source = { x: 100, y: 100 };</code><br><br>
            2. <strong>Find outward direction</strong><br>
            <code>let dx = mover.x - source.x;</code><br>
            <code>let dy = mover.y - source.y;</code><br>
            <code>let d = dist(mover.x, mover.y, source.x, source.y);</code><br><br>
            3. <strong>Step away</strong><br>
            <code>if (d &gt; 0) {</code><br>
            <code>&nbsp;&nbsp;mover.x += (dx / d) * mover.speed;</code><br>
            <code>&nbsp;&nbsp;mover.y += (dy / d) * mover.speed;</code><br>
            <code>}</code><br><br>
            4. <strong>Set source on click</strong><br>
            <code>source.x = mouseX; source.y = mouseY;</code>`),
  },
  {
    slug: "across",
    title: "Across",
    category: "movement",
    editorSketchId: "3n6SHsUtS",
    tryIt: "Click or tap to animate the circle from one side to the other, crossing the barrier between them.",
    conceptHtml:
      '<strong>ACROSS</strong> means from one side to the opposite side, often crossing over or through something in between.',
    strategyHtml: strategy("Ways to express <em>across</em> in a sketch:", [
      ["Start and end", "Place clear points on opposite sides"],
      ["Interpolation", "Advance progress from 0 to 1 across the span"],
      ["Barrier", "Optional obstacle the path must cross"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Motion</strong><br>
            • ${REF("lerp()", "lerp")} — smooth travel between endpoints<br>
            • Progress variable updated each frame<br><br>
            <strong>Drawing</strong><br>
            • ${REF("rect()", "rect")} — barrier; ${REF("ellipse()", "ellipse")} — mover<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define the crossing</strong><br>
            <code>let start = { x: 50, y: 150 };</code><br>
            <code>let end = { x: 350, y: 150 };</code><br>
            <code>let progress = 0;</code><br><br>
            2. <strong>Interpolate position</strong><br>
            <code>let x = lerp(start.x, end.x, progress);</code><br>
            <code>let y = lerp(start.y, end.y, progress);</code><br><br>
            3. <strong>Advance while moving</strong><br>
            <code>if (isMoving &amp;&amp; progress &lt; 1) progress += 0.02;</code><br><br>
            4. <strong>Mark completion</strong><br>
            <code>if (progress &gt;= 1) hasCrossed = true;</code>`),
  },
  {
    slug: "along",
    title: "Along",
    category: "movement",
    editorSketchId: "yIVftMasm",
    tryIt: "Click or tap to start the circle moving along the curved path.",
    conceptHtml:
      '<strong>ALONG</strong> means following the length, edge, or course of something—not crossing it.',
    strategyHtml: strategy("Ways to express <em>along</em> in a sketch:", [
      ["Waypoints", "Store an ordered list of path points"],
      ["Progress index", "Move between consecutive points over time"],
      ["Curves", "Use vertices, Bézier points, or parametric math for smooth paths"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Path</strong><br>
            • Arrays of points; ${REF("lerp()", "lerp")} between them<br>
            • ${REF("beginShape()", "beginShape")}, ${REF("vertex()", "vertex")} — draw the route<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define the path</strong><br>
            <code>let path = [{x:50,y:150},{x:150,y:100},{x:250,y:200},{x:350,y:150}];</code><br><br>
            2. <strong>Track progress along segments</strong><br>
            <code>let progress = 0; // 0 … path.length - 1</code><br><br>
            3. <strong>Interpolate between two points</strong><br>
            <code>let a = path[floor(progress)];</code><br>
            <code>let b = path[ceil(progress)];</code><br>
            <code>let t = progress - floor(progress);</code><br>
            <code>let x = lerp(a.x, b.x, t);</code><br><br>
            4. <strong>Advance each frame</strong><br>
            <code>if (isMoving) progress += speed;</code>`),
  },
  {
    slug: "around",
    title: "Around",
    category: "movement",
    editorSketchId: "KZc6sFR8I",
    tryIt: "Click or tap to set an orbit center. The circle travels around it on a circular path.",
    conceptHtml:
      '<strong>AROUND</strong> means moving on a curved path about something—orbiting or encircling a center.',
    strategyHtml: strategy("Ways to express <em>around</em> in a sketch:", [
      ["Circular motion", "Advance an angle each frame"],
      ["Orbit radius", "Keep fixed distance from the center"],
      ["Obstacle context", "Path goes around a shape rather than through it"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Trigonometry</strong><br>
            • ${REF("cos()", "cos")}, ${REF("sin()", "sin")} — <code>x = cx + cos(a)*r</code><br>
            • ${REF("TWO_PI", "TWO_PI")} — one full revolution<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Set center and radius</strong><br>
            <code>let center = { x: 200, y: 150 };</code><br>
            <code>let r = 80, angle = 0;</code><br><br>
            2. <strong>Position on the orbit</strong><br>
            <code>let x = center.x + cos(angle) * r;</code><br>
            <code>let y = center.y + sin(angle) * r;</code><br><br>
            3. <strong>Advance the angle</strong><br>
            <code>if (isOrbiting) angle += 0.05;</code><br><br>
            4. <strong>Set center on click</strong><br>
            <code>center.x = mouseX; center.y = mouseY;</code>`),
  },
  {
    slug: "into",
    title: "Into",
    category: "movement",
    editorSketchId: "6EUFcUmF1",
    tryIt: "Click or tap to replay the arc motion into the container. Watch the object move from outside to inside.",
    conceptHtml:
      '<strong>INTO</strong> means entering a space—from outside to inside. The sketch uses an arc path that crosses the container boundary.',
    strategyHtml: strategy("Ways to express <em>into</em> in a sketch:", [
      ["Entry path", "Animate along a curve toward an interior point"],
      ["Containment test", "Switch state when the object crosses the boundary"],
      ["Layering", "Draw the mover behind a semi-transparent container if needed"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Motion</strong><br>
            • ${REF("lerp()", "lerp")} plus ${REF("sin()", "sin")} for arc height<br><br>
            <strong>Boundary</strong><br>
            • Rectangle bounds test for inside/outside<br>
            • ${REF("rect()", "rect")} with alpha for the container<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define container and endpoints</strong><br>
            <code>let box = { x: 280, y: 150, w: 100, h: 80 };</code><br>
            <code>let start = { x: 80, y: 200 }, end = { x: 320, y: 190 };</code><br><br>
            2. <strong>Move along an arc</strong><br>
            <code>let x = lerp(start.x, end.x, t);</code><br>
            <code>let y = lerp(start.y, end.y, t) - sin(t * PI) * arcH;</code><br><br>
            3. <strong>Test inside</strong><br>
            <code>let inside = x &gt; box.x &amp;&amp; x &lt; box.x + box.w &amp;&amp;</code><br>
            <code>&nbsp;&nbsp;y &gt; box.y &amp;&amp; y &lt; box.y + box.h;</code><br><br>
            4. <strong>Draw back-to-front</strong><br>
            <code>ellipse(x, y, d, d); rect(box.x, box.y, box.w, box.h);</code>`),
  },
  {
    slug: "onto",
    title: "Onto",
    category: "movement",
    editorSketchId: "sWthbYYs3",
    tryIt: "Click or tap above the platform to drop the circle onto its top surface.",
    conceptHtml:
      '<strong>ONTO</strong> means moving to rest on the top surface of something—the object ends supported by that surface.',
    strategyHtml: strategy("Ways to express <em>onto</em> in a sketch:", [
      ["Landing point", "Target Y sits on the surface minus object radius"],
      ["Approach path", "Animate from above or along an arc"],
      ["Contact test", "Confirm the object has reached the surface"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Placement</strong><br>
            • <code>ontoY = platform.y - objectRadius</code><br>
            • ${REF("lerp()", "lerp")} — landing animation<br><br>
            <strong>Drawing</strong><br>
            • ${REF("rect()", "rect")} — platform; ${REF("ellipse()", "ellipse")} — object<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define platform and start</strong><br>
            <code>let platform = { x: 200, y: 200, w: 120, h: 20 };</code><br>
            <code>let start = { x: 100, y: 50 };</code><br><br>
            2. <strong>Compute landing position</strong><br>
            <code>let landY = platform.y - radius;</code><br><br>
            3. <strong>Animate onto surface</strong><br>
            <code>obj.x = lerp(start.x, platform.x, t);</code><br>
            <code>obj.y = lerp(start.y, landY, t);</code><br><br>
            4. <strong>Detect contact</strong><br>
            <code>let onSurface = obj.y + radius &gt;= platform.y;</code>`),
  },
  {
    slug: "past",
    title: "Past",
    category: "movement",
    editorSketchId: "DjakxBC0M",
    tryIt: "Click or tap to launch the circle past the reference point. Status updates once it moves beyond it.",
    conceptHtml:
      '<strong>PAST</strong> means beyond a reference point—movement continues after passing it.',
    strategyHtml: strategy("Ways to express <em>past</em> in a sketch:", [
      ["Reference landmark", "Mark the point or line being passed"],
      ["Comparison", "Flip state when position crosses the reference"],
      ["Trail", "Optional dots or line showing the path taken"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Detection</strong><br>
            • <code>object.x &gt; reference.x</code> — simple past test on X<br><br>
            <strong>Motion</strong><br>
            • Increment position each frame while moving<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define reference and mover</strong><br>
            <code>let ref = { x: 200, y: 150 };</code><br>
            <code>let mover = { x: 50, y: 150, speed: 3, hasPassed: false };</code><br><br>
            2. <strong>Move forward</strong><br>
            <code>if (isMoving) mover.x += mover.speed;</code><br><br>
            3. <strong>Detect past</strong><br>
            <code>if (!mover.hasPassed &amp;&amp; mover.x &gt; ref.x) mover.hasPassed = true;</code><br><br>
            4. <strong>Label the state</strong><br>
            <code>let status = mover.hasPassed ? "past" : "approaching";</code>`),
  },
  {
    slug: "over",
    title: "Over",
    category: "movement",
    editorSketchId: "NtC8JgAhB",
    tryIt: "Click or tap to animate the arc over the obstacle.",
    conceptHtml:
      '<strong>OVER</strong> means above something while crossing from one side to the other, keeping clearance over it.',
    strategyHtml: strategy("Ways to express <em>over</em> in a sketch:", [
      ["Arc path", "Raise Y mid-crossing with a sine or parabola"],
      ["Clearance", "Peak height clears the obstacle top"],
      ["Phase flags", "Track before, above, and after the obstacle"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Arc motion</strong><br>
            • ${REF("lerp()", "lerp")} on X; ${REF("sin()", "sin")} on Y for height<br>
            • ${REF("map()", "map")} — optional height scaling<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define obstacle and endpoints</strong><br>
            <code>let obstacle = { x: 200, y: 180, w: 60, h: 40 };</code><br>
            <code>let start = { x: 80, y: 200 }, end = { x: 320, y: 200 };</code><br><br>
            2. <strong>Compute arc height</strong><br>
            <code>let arcH = start.y - obstacle.y + clearance;</code><br><br>
            3. <strong>Position on the arc</strong><br>
            <code>let x = lerp(start.x, end.x, t);</code><br>
            <code>let y = start.y - sin(t * PI) * arcH;</code><br><br>
            4. <strong>Test above obstacle span</strong><br>
            <code>let over = x &gt; obstacle.x &amp;&amp; x &lt; obstacle.x + obstacle.w &amp;&amp; y &lt; obstacle.y;</code>`),
  },
  {
    slug: "under",
    title: "Under",
    category: "movement",
    editorSketchId: "2a5R_KyKS",
    tryIt: "Click or tap to run the arc beneath the obstacle. Keys 1–3 change depth; Space toggles the path guide.",
    conceptHtml:
      '<strong>UNDER</strong> means passing below something. The sketch animates a curved path that dips beneath a bridge-like barrier.',
    strategyHtml: strategy("Ways to express <em>under</em> in a sketch:", [
      ["Dip path", "Use a Bézier or sine curve below ground level"],
      ["Obstacle span", "Highlight when X is beneath the barrier width"],
      ["Depth control", "Adjust how far below the path travels"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Curved path</strong><br>
            • ${REF("bezierPoint()", "bezierPoint")} — sample points along the dip<br>
            • ${REF("lerp()", "lerp")} — progress from 0 to 1<br><br>
            <strong>Drawing</strong><br>
            • ${REF("rect()", "rect")} — bridge; ${REF("beginShape()", "beginShape")} — path guide<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define path and obstacle</strong><br>
            <code>let start = { x: 50, y: 200 }, end = { x: 350, y: 200 };</code><br>
            <code>let control = { x: 200, y: 260 };</code><br><br>
            2. <strong>Sample the curve</strong><br>
            <code>let x = bezierPoint(start.x, start.x, end.x, end.x, t);</code><br>
            <code>let y = bezierPoint(start.y, control.y, control.y, end.y, t);</code><br><br>
            3. <strong>Advance animation</strong><br>
            <code>if (isMoving &amp;&amp; t &lt; 1) t += 0.015;</code><br><br>
            4. <strong>Detect under the span</strong><br>
            <code>let under = x &gt; obs.x &amp;&amp; x &lt; obs.x + obs.w;</code>`),
  },
  {
    slug: "before",
    title: "Before",
    category: "time",
    editorSketchId: "09_b4Rpy1",
    tryIt: "Click or tap to start. Obstacles clear the path before the main mover can proceed.",
    conceptHtml:
      '<strong>BEFORE</strong> means earlier than a reference event. In code, finish prerequisite steps before the primary action runs.',
    strategyHtml: strategy("Ways to express <em>before</em> in code:", [
      ["Prerequisites", "Gate the main action behind a readiness check"],
      ["Sequential stages", "Run setup motion, then primary motion"],
      ["State flags", "Track whether each prerequisite has completed"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>State</strong><br>
            • Booleans such as <code>isClearing</code> and <code>isMoving</code><br>
            • Arrays of obstacles with <code>hasCleared</code> per item<br><br>
            <strong>Loops</strong><br>
            • <code>for (let item of array)</code> — check every prerequisite<br><br>
            <strong>Motion</strong><br>
            • ${REF("lerp()", "lerp")}, ${REF("dist()", "dist")} — move obstacles aside<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Create prerequisites</strong><br>
            <code>obstacles.push({ x, y, hasCleared: false });</code><br><br>
            2. <strong>Test readiness</strong><br>
            <code>let allClear = obstacles.every(o =&gt; o.hasCleared);</code><br><br>
            3. <strong>Start main action only when ready</strong><br>
            <code>if (allClear) { isClearing = false; isMoving = true; }</code><br><br>
            4. <strong>Report progress</strong><br>
            <code>text("Clearing path (" + cleared + "/" + total + ")", x, y);</code>`),
  },
  {
    slug: "after",
    title: "After",
    category: "time",
    editorSketchId: "GzGonI_p9",
    tryIt: "Click or tap to launch toward the impact point. Particles scatter after the collision.",
    conceptHtml:
      '<strong>AFTER</strong> means following a reference event. Trigger secondary effects once the primary event has occurred.',
    strategyHtml: strategy("Ways to express <em>after</em> in code:", [
      ["Event trigger", "Detect collision or arrival, then change phase"],
      ["Consequences", "Spawn particles, sounds, or state changes afterward"],
      ["Phases", "Separate logic for before, during, and after the event"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Detection</strong><br>
            • ${REF("dist()", "dist")} — impact threshold<br>
            • ${REF("atan2()", "atan2")}, ${REF("cos()", "cos")}, ${REF("sin()", "sin")} — scatter directions<br><br>
            <strong>Particles</strong><br>
            • Arrays; update velocity while <code>impact.hasHappened</code><br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Setup projectile and impact point</strong><br>
            <code>let shot = { x: 50, y: 150, moving: false };</code><br>
            <code>let impact = { x: 200, y: 150, happened: false };</code><br><br>
            2. <strong>Move until collision</strong><br>
            <code>if (dist(shot.x, shot.y, impact.x, impact.y) &lt; threshold) {</code><br>
            <code>&nbsp;&nbsp;impact.happened = true;</code><br>
            <code>}</code><br><br>
            3. <strong>Run after-effects</strong><br>
            <code>if (impact.happened) { /* spawn / move particles */ }</code><br><br>
            4. <strong>Damp particle velocity over time</strong><br>
            <code>particle.vx *= 0.98; particle.vy *= 0.98;</code>`),
  },
  {
    slug: "during",
    title: "During",
    category: "time",
    editorSketchId: "_0kHqjHjb",
    tryIt: "Click or tap to begin the journey from A to B. Particles emit continuously during the trip.",
    conceptHtml:
      '<strong>DURING</strong> means throughout the span of another process. Run secondary logic on each frame while the primary action is still underway.',
    strategyHtml: strategy("Ways to express <em>during</em> in code:", [
      ["Overlapping activity", "Emit or update while a flag is true"],
      ["Primary process", "A journey or timer that must stay active"],
      ["Frame timing", `Use ${REF("frameCount", "frameCount")} or modulo for emission rate`],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Timing</strong><br>
            • ${REF("frameCount", "frameCount")} — periodic emission<br>
            • ${REF("random()", "random")} — vary particle velocity<br><br>
            <strong>Motion</strong><br>
            • ${REF("atan2()", "atan2")}, ${REF("cos()", "cos")}, ${REF("sin()", "sin")} — traveler direction<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Define the journey</strong><br>
            <code>let traveler = { x: 50, y: 150, targetX: 350, targetY: 150, moving: false };</code><br><br>
            2. <strong>Move while active</strong><br>
            <code>if (traveler.moving) { /* update x, y toward target */ }</code><br><br>
            3. <strong>Emit during movement</strong><br>
            <code>if (traveler.moving &amp;&amp; frameCount % 8 === 0) {</code><br>
            <code>&nbsp;&nbsp;particles.push({ x: traveler.x, y: traveler.y, vx, vy });</code><br>
            <code>}</code><br><br>
            4. <strong>Update particles each frame</strong><br>
            <code>particle.x += particle.vx; particle.life -= 0.01;</code>`),
  },
  {
    slug: "since",
    title: "Since",
    category: "time",
    editorSketchId: "UdyLk3RHP",
    tryIt: "Click or tap to set a start point. The trail grows continuously from that moment forward.",
    conceptHtml:
      '<strong>SINCE</strong> marks the start of a period that continues to the present. Accumulate state from that reference point onward.',
    strategyHtml: strategy("Ways to express <em>since</em> in code:", [
      ["Reference moment", "Record start time or position on click"],
      ["Continuous growth", "Append data each frame after the start"],
      ["Visual duration", "Trail length reflects elapsed time or frames"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Accumulation</strong><br>
            • Arrays of trail points; ${REF("push()", "push")} each step<br>
            • ${REF("frameCount", "frameCount")} — throttle point frequency<br><br>
            <strong>Drawing</strong><br>
            • ${REF("beginShape()", "beginShape")}, ${REF("vertex()", "vertex")} — connect the trail<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Store start and trail</strong><br>
            <code>let origin = { x: 0, y: 0 };</code><br>
            <code>let trail = [];</code><br>
            <code>let growing = false;</code><br><br>
            2. <strong>Begin on click</strong><br>
            <code>origin.x = mouseX; origin.y = mouseY; trail = []; growing = true;</code><br><br>
            3. <strong>Add points since start</strong><br>
            <code>if (growing &amp;&amp; frameCount % 3 === 0) trail.push({ x, y });</code><br><br>
            4. <strong>Draw the accumulated path</strong><br>
            <code>beginShape(); for (let p of trail) vertex(p.x, p.y); endShape();</code>`),
  },
  {
    slug: "until",
    title: "Until",
    category: "time",
    editorSketchId: "T-UhaoxHZ",
    tryIt: "Click or tap to start the countdown. It runs until the target value is reached, then stops.",
    conceptHtml:
      '<strong>UNTIL</strong> means continuing up to a boundary, then stopping when that condition is met.',
    strategyHtml: strategy("Ways to express <em>until</em> in code:", [
      ["Target value", "Define the endpoint (100%, zero, destination)"],
      ["Loop while not done", "Increment progress each frame until the cap"],
      ["Termination", "Flip <code>isRunning</code> off when the target is reached"],
    ]),
    methodsHtml: codeSection("Key methods", `<strong>Progress</strong><br>
            • ${REF("map()", "map")} — progress to bar width or label<br>
            • <code>if (progress &gt;= target)</code> — stop condition<br><br>
            <strong>Drawing</strong><br>
            • ${REF("rect()", "rect")}, ${REF("text()", "text")} — bar and readout<br><br>
            ${POINTER_CLICK}`),
    codeHtml: codeSection("Code pattern", `1. <strong>Track progress</strong><br>
            <code>let progress = 0, target = 100, running = false;</code><br><br>
            2. <strong>Increment while running</strong><br>
            <code>if (running &amp;&amp; progress &lt; target) progress += speed;</code><br><br>
            3. <strong>Stop at the boundary</strong><br>
            <code>if (progress &gt;= target) { running = false; progress = target; }</code><br><br>
            4. <strong>Map to visuals</strong><br>
            <code>let w = map(progress, 0, target, 0, barWidth);</code>`),
  },
];

if (prepositions.length !== 24) {
  throw new Error(`Expected 24 entries, got ${prepositions.length}`);
}

fs.writeFileSync(OUT, JSON.stringify(prepositions, null, 2) + "\n");
console.log(`Wrote ${prepositions.length} editorial entries to ${OUT}`);
