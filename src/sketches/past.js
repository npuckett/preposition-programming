import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/**
 * P5.js Sketch: PAST - Moving Beyond a Reference Point
 * 
 * CONCEPT: "Past" represents movement that continues beyond a reference point.
 * This shows the transition from approaching → at → beyond the reference.
 * 
 * LEARNING OBJECTIVES:
 * • Understand movement beyond a fixed reference
 * • Practice simple state tracking (before/at/past)
 * • Learn basic animation with position comparison
 * • Explore visual feedback for spatial relationships
 * 
 * KEY VARIABLES & METHODS:
 * • reference object - fixed point to move past
 * • circle object - moves past the reference
 * • Simple state tracking with position comparison
 * 
 * EXTENSION IDEAS:
 * • Multiple reference points to pass
 * • Different speeds or directions
 * • Sound effects when passing the reference
 */

// Fixed reference point to move past
let reference = {
  x: 200,
  y: 150,
  size: 40
};

// Moving circle that goes past the reference
let circle = {
  x: 50,
  y: 150,
  size: 25,
  speed: 2,
  isMoving: false,
  hasPassed: false
};

let trail = [];

p.setup = function() {
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Update movement
  if (circle.isMoving) {
    updateMovement();
  }
  
  // Draw trail
  drawTrail();
  
  // Draw reference point
  drawReference();
  
  // Draw moving circle
  drawCircle();
  
  // Draw status
  drawStatus();
}

function updateMovement() {
  // Add to trail
  trail.push({x: circle.x, y: circle.y});
  if (trail.length > 50) {
    trail.shift();
  }
  
  // Move circle
  circle.x += circle.speed;
  
  // Check if passed the reference
  if (!circle.hasPassed && circle.x > reference.x) {
    circle.hasPassed = true;
  }
  
  // Stop when reaching edge
  if (circle.x > p.width + 30) {
    circle.isMoving = false;
  }
}

function drawTrail() {
  // Simple trail dots
  p.fill(255, 200, 0, 150);
  p.noStroke();
  for (let i = 0; i < trail.length; i++) {
    let alpha = p.map(i, 0, trail.length - 1, 50, 150);
    p.fill(255, 200, 0, alpha);
    p.ellipse(trail[i].x, trail[i].y, 8, 8);
  }
}

function drawReference() {
  // Reference point shadow
  p.fill(0, 0, 0, 30);
  p.noStroke();
  p.ellipse(reference.x + 3, reference.y + 3, reference.size, reference.size);
  
  // Reference point
  p.fill(100, 150, 255);
  p.stroke(70, 120, 200);
  p.strokeWeight(3);
  p.ellipse(reference.x, reference.y, reference.size, reference.size);
  
  // Reference label
  p.fill(255);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(10);
  p.text("REF", reference.x, reference.y + 4);
  
  // Vertical reference line
  p.stroke(100, 150, 255, 100);
  p.strokeWeight(2);
  p.line(reference.x, 0, reference.x, p.height);
}

function drawCircle() {
  // Circle color based on state
  if (circle.hasPassed) {
    p.fill(100, 255, 100); // Green when past
    p.stroke(50, 200, 50);
  } else if (circle.isMoving) {
    p.fill(255, 200, 0); // Yellow when moving
    p.stroke(255, 150, 0);
  } else {
    p.fill(255, 150, 100); // Orange when waiting
    p.stroke(200, 100, 50);
  }
  
  p.strokeWeight(3);
  p.ellipse(circle.x, circle.y, circle.size, circle.size);
  
  // Movement arrow when moving
  if (circle.isMoving) {
    p.stroke(255, 100, 100);
    p.strokeWeight(2);
    p.line(circle.x + 8, circle.y, circle.x + 18, circle.y);
    p.line(circle.x + 18, circle.y, circle.x + 14, circle.y - 4);
    p.line(circle.x + 18, circle.y, circle.x + 14, circle.y + 4);
  }
}

function drawStatus() {
  // Status text at bottom
  p.fill(...PALETTE.ink);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(14);
  
  let statusText = "";
  if (circle.hasPassed) {
    statusText = "Circle moved PAST the reference point";
  } else if (circle.isMoving) {
    if (circle.x < reference.x) {
      statusText = "Circle is approaching the reference point";
    } else {
      statusText = "Circle is moving PAST the reference point";
    }
  } else {
    statusText = "Click to move circle PAST the reference point";
  }
  
  p.text(statusText, p.width/2, p.height - 20);
}

// Helper functions for cross-platform input handling
function getInputX() {
  return p.touches.length > 0 ? p.touches[0].x : p.mouseX;
}

function getInputY() {
  return p.touches.length > 0 ? p.touches[0].y : p.mouseY;
}

// Handle input start (both mouse and touch)
function handleInputStart() {
  // Start movement if not already moving
  if (!circle.isMoving) {
    startMovement();
  }
}

function startMovement() {
  // Reset to starting position
  circle.x = 50;
  circle.y = 150;
  circle.isMoving = true;
  circle.hasPassed = false;
  trail = [];
}

p.mousePressed = function() {
  handleInputStart();
}

// Handle touch events for mobile
p.touchStarted = function() {
  handleInputStart();
  return false; // Prevent default touch behavior
}

}
