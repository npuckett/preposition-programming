import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/**
 * P5.js Sketch: UNTIL - Continuous Movement Until Stopped
 * 
 * CONCEPT: "Until" means continuing an action up to a specific point,
 * then stopping when that condition is met. This shows an object
 * moving continuously around the canvas until you click to stop it.
 * 
 * LEARNING OBJECTIVES:
 * • Understand conditional termination and stopping points
 * • Practice continuous processes with stopping conditions
 * • Learn state transitions (moving → stopped)
 * • Explore spatial representation of temporal limits
 * 
 * KEY VARIABLES & METHODS:
 * • mover - object that moves until clicked
 * • Continuous wandering movement pattern
 * • Click interaction to trigger stopping condition
 * 
 * EXTENSION IDEAS:
 * • Different movement patterns until stopped
 * • Multiple objects moving until different conditions
 * • Obstacles that cause stopping until cleared
 */

// Moving object that wanders until stopped
let mover = {
  x: 200,
  y: 150,
  vx: 2,
  vy: 1.5,
  size: 12,
  isMoving: true,
  isStopped: false
};

// Movement trail
let trail = [];

p.setup = function() {
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Update movement until stopped
  if (mover.isMoving && !mover.isStopped) {
    updateMovement();
  }
  
  // Draw trail
  drawTrail();
  
  // Draw mover
  drawMover();
  
  // Draw status
  drawStatus();
}

function updateMovement() {
  // Move the object
  mover.x += mover.vx;
  mover.y += mover.vy;
  
  // Bounce off edges
  if (mover.x <= mover.size/2 || mover.x >= p.width - mover.size/2) {
    mover.vx *= -1;
  }
  if (mover.y <= mover.size/2 || mover.y >= p.height - mover.size/2) {
    mover.vy *= -1;
  }
  
  // Keep within bounds
  mover.x = p.constrain(mover.x, mover.size/2, p.width - mover.size/2);
  mover.y = p.constrain(mover.y, mover.size/2, p.height - mover.size/2);
  
  // Add to trail
  let trailPoint = { x: mover.x, y: mover.y };
  trail.push(trailPoint);
  
  // Keep trail manageable
  if (trail.length > 100) {
    trail.shift();
  }
}

function drawTrail() {
  if (trail.length < 2) return;
  
  p.stroke(150, 150, 150, 150);
  p.strokeWeight(2);
  p.noFill();
  
  p.beginShape();
  for (let i = 0; i < trail.length; i++) {
    p.vertex(trail[i].x, trail[i].y);
  }
  p.endShape();
}

function drawMover() {
  // Moving object
  if (mover.isStopped) {
    p.fill(220, 50, 50); // Red when stopped
  } else {
    p.fill(70, 130, 180); // Blue when moving
  }
  
  p.noStroke();
  p.ellipse(mover.x, mover.y, mover.size, mover.size);
  
  // Velocity indicator when moving
  if (mover.isMoving && !mover.isStopped) {
    p.stroke(70, 130, 180);
    p.strokeWeight(2);
    let arrowX = mover.x + mover.vx * 5;
    let arrowY = mover.y + mover.vy * 5;
    p.line(mover.x, mover.y, arrowX, arrowY);
  }
}

function drawStatus() {
  p.fill(...PALETTE.ink);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(14);
  
  if (!mover.isMoving) {
    p.text("Click to start continuous movement", p.width/2, p.height - 20);
  } else if (mover.isStopped) {
    p.text("Movement stopped! Click to restart continuous movement", p.width/2, p.height - 20);
  } else {
    p.text("Moving continuously UNTIL you click to stop", p.width/2, p.height - 20);
  }
}

p.mousePressed = function() {
  if (!mover.isMoving || mover.isStopped) {
    // Start or restart movement
    mover.x = 200;
    mover.y = 150;
    mover.vx = p.random(-3, 3);
    mover.vy = p.random(-3, 3);
    // Ensure minimum speed
    if (p.abs(mover.vx) < 1) mover.vx = mover.vx > 0 ? 1 : -1;
    if (p.abs(mover.vy) < 1) mover.vy = mover.vy > 0 ? 1 : -1;
    
    mover.isMoving = true;
    mover.isStopped = false;
    trail = [];
  } else {
    // Stop movement
    mover.isStopped = true;
  }
}

// Helper functions for cross-platform input handling
function getInputX() {
  return p.touches.length > 0 ? p.touches[0].x : p.mouseX;
}

function getInputY() {
  return p.touches.length > 0 ? p.touches[0].y : p.mouseY;
}

// Handle touch events for mobile
p.touchStarted = function() {
  mousePressed();
  return false; // Prevent default touch behavior
}

}
