import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/**
 * P5.js Sketch: SINCE - Growing Trail
 * 
 * CONCEPT: "Since" means from a point in time until now.
 * This shows a trail that grows longer since you clicked,
 * demonstrating accumulation over time through space.
 * 
 * LEARNING OBJECTIVES:
 * • Understand continuous growth from a starting point
 * • Practice trail/path visualization
 * • Learn state management and time tracking
 * • Explore spatial representation of temporal concepts
 * 
 * KEY VARIABLES & METHODS:
 * • trail - array of points that grows since start
 * • isGrowing - tracks if trail is active
 * • Simple point addition over time
 * 
 * EXTENSION IDEAS:
 * • Multiple trails from different start points
 * • Trail fading over time
 * • Different trail patterns and shapes
 */

// Trail that grows since starting point
let trail = [];
let isGrowing = false;
let startPoint = { x: 0, y: 0 };
let currentAngle = 0;
let trailLength = 0;

p.setup = function() {
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Update trail if growing
  if (isGrowing) {
    updateTrail();
  }
  
  // Draw trail
  drawTrail();
  
  // Draw status
  drawStatus();
}

function updateTrail() {
  // Add new point to trail every few frames
  if (p.frameCount % 3 === 0) {
    // Spiral pattern growing outward
    let radius = trailLength * 2;
    let x = startPoint.x + p.cos(currentAngle) * radius;
    let y = startPoint.y + p.sin(currentAngle) * radius;
    
    trail.push({ x: x, y: y });
    
    currentAngle += 0.2;
    trailLength += 0.5;
    
    // Keep trail manageable
    if (trail.length > 200) {
      trail.shift();
    }
  }
}

function drawTrail() {
  if (trail.length < 2) return;
  
  p.stroke(70, 130, 180);
  p.strokeWeight(3);
  p.noFill();
  
  // Draw the growing trail
  p.beginShape();
  for (let i = 0; i < trail.length; i++) {
    p.vertex(trail[i].x, trail[i].y);
  }
  p.endShape();
  
  // Draw start point
  p.fill(220, 50, 50);
  p.noStroke();
  p.ellipse(startPoint.x, startPoint.y, 8, 8);
  
  // Draw current end point
  if (trail.length > 0) {
    p.fill(50, 150, 50);
    let lastPoint = trail[trail.length - 1];
    p.ellipse(lastPoint.x, lastPoint.y, 6, 6);
  }
}

function drawStatus() {
  p.fill(...PALETTE.ink);
  p.textAlign(CENTER);
  p.textSize(14);
  
  if (!isGrowing) {
    p.text("Click to start a trail that grows SINCE your click", p.width/2, p.height - 20);
  } else {
    p.text(`Trail growing SINCE start (${trail.length} points)`, p.width/2, p.height - 20);
  }
}

p.mousePressed = function() {
  // Start new trail from click point
  startPoint.x = p.mouseX;
  startPoint.y = p.mouseY;
  trail = [];
  isGrowing = true;
  currentAngle = 0;
  trailLength = 0;
}

  if (typeof p.mousePressed === "function") {
    p.touchStarted = function () {
      p.mousePressed();
      return false;
    };
  }
}
