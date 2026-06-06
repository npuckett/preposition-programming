import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/*
 * PREPOSITION: TOWARD
 * 
 * CONCEPT:
 * "Toward" indicates directional movement in the direction of a target,
 * but not necessarily reaching it. It's about the direction of motion
 * rather than the destination.
 * 
 * LEARNING OBJECTIVES:
 * - Calculate direction vectors between points
 * - Implement smooth movement animations
 * - Use trigonometry for directional movement
 * - Create interactive target-following behavior
 * - Understand vector mathematics in graphics
 * 
 * KEY VARIABLES:
 * - movingDot: object with position and movement properties
 * - target: destination p.point (mouse position)
 * - speed: movement velocity
 * - direction: calculated movement vector
 * 
 * KEY METHODS:
 * - p.atan2(): calculates angle between points
 * - p.cos()/p.sin(): converts angles to movement vectors
 * - p.lerp(): linear interpolation for smooth movement
 * - p.dist(): distance calculations
 * 
 * HOW TO EXTEND:
 * 1. Add multiple objects moving toward different targets
 * 2. Implement acceleration/deceleration
 * 3. Add obstacles that objects must navigate around
 * 4. Create steering behaviors (seek, flee, wander)
 * 5. Add trail effects showing movement paths
 * 6. Implement flocking behavior with multiple objects
 * 7. Add gravity or magnetic attraction effects
 */

// Moving object that moves toward the mouse
let movingDot = {
  x: 200,           // Current X position
  y: 150,           // Current Y position
  targetX: 200,     // Target X position (mouse)
  targetY: 150,     // Target Y position (mouse)
  speed: 0.05,      // Movement speed (0-1, where 1 = instant)
  size: 20,         // Dot size
  trail: []         // Array to store trail positions
};

// Animation control
let isMoving = false;

p.setup = function() {
// Initialize target to center
  movingDot.targetX = p.width / 2;
  movingDot.targetY = p.height / 2;
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Update movement if animation is active
  if (isMoving) {
    updateMovement();
  }
  
  // Draw trail showing path toward target
  drawTrail();
  
  // Draw the target (mouse position or click point)
  drawTarget();
  
  // Draw the moving dot
  drawMovingDot();
  
  // Draw connection line showing direction
  drawDirectionLine();
  
  // Display information and controls
  drawInformation();
  
  // Draw control buttons
  drawControls();
}

function updateMovement() {
  // Calculate movement toward target using linear interpolation
  // This creates smooth, gradual movement
  movingDot.x = p.lerp(movingDot.x, movingDot.targetX, movingDot.speed);
  movingDot.y = p.lerp(movingDot.y, movingDot.targetY, movingDot.speed);
  
  // Add current position to trail
  movingDot.trail.push({x: movingDot.x, y: movingDot.y});
  
  // Limit trail length
  if (movingDot.trail.length > 50) {
    movingDot.trail.shift();
  }
  
  // Check if dot has reached target (within small distance)
  let distanceToTarget = p.dist(movingDot.x, movingDot.y, movingDot.targetX, movingDot.targetY);
  if (distanceToTarget < 5) {
    isMoving = false;  // Stop moving when target is reached
  }
}

function drawTrail() {
  // Draw trail showing movement path
  if (movingDot.trail.length > 1) {
    for (let i = 1; i < movingDot.trail.length; i++) {
      let alpha = p.map(i, 0, movingDot.trail.length, 0, 255);
      p.stroke(100, 150, 255, alpha);
      p.strokeWeight(2);
      p.line(movingDot.trail[i-1].x, movingDot.trail[i-1].y,
           movingDot.trail[i].x, movingDot.trail[i].y);
    }
  }
}

function drawTarget() {
  // Draw target as crosshairs
  p.stroke(255, 100, 100);
  p.strokeWeight(2);
  p.line(movingDot.targetX - 15, movingDot.targetY, movingDot.targetX + 15, movingDot.targetY);
  p.line(movingDot.targetX, movingDot.targetY - 15, movingDot.targetX, movingDot.targetY + 15);
  
  // Target circle
  p.noFill();
  p.stroke(255, 100, 100);
  p.strokeWeight(1);
  p.ellipse(movingDot.targetX, movingDot.targetY, 30, 30);
  
  // Label
  p.fill(255, 100, 100);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(12);
  p.text("Target", movingDot.targetX, movingDot.targetY - 25);
}

function drawMovingDot() {
  // Main moving dot
  p.fill(100, 200, 100);
  p.stroke(50, 150, 50);
  p.strokeWeight(2);
  p.ellipse(movingDot.x, movingDot.y, movingDot.size, movingDot.size);
  
  // Label
  p.fill(0);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(12);
  p.text("Moving Dot", movingDot.x, movingDot.y - 20);
}

function drawDirectionLine() {
  // Draw line showing direction toward target
  if (isMoving) {
    p.stroke(150, 100, 255, 150);
    p.strokeWeight(2);
    p.line(movingDot.x, movingDot.y, movingDot.targetX, movingDot.targetY);
    
    // Arrow head
    let angle = p.atan2(movingDot.targetY - movingDot.y, movingDot.targetX - movingDot.x);
    let arrowLength = 10;
    
    p.push();
    p.translate(movingDot.targetX, movingDot.targetY);
    p.rotate(angle);
    p.line(0, 0, -arrowLength, -5);
    p.line(0, 0, -arrowLength, 5);
    p.pop();
  }
}

function drawInformation() {
  // Calculate distance for display
  let distance = p.dist(movingDot.x, movingDot.y, movingDot.targetX, movingDot.targetY);
  
  // Simple status text at bottom
  p.fill(0);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(14);
  
  let statusText = "";
  if (isMoving) {
    statusText = "Green dot is moving TOWARD the target";
  } else {
    statusText = "Click anywhere to set target - dot will move toward it";
  }
  
  p.text(statusText, p.width/2, p.height - 20);
}

function drawControls() {
  // Remove all control buttons and complex UI elements
  // Keep the interaction simple - just click to set target
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
  let inputX = getInputX();
  let inputY = getInputY();
  
  // Set new target and start moving
  movingDot.targetX = inputX;
  movingDot.targetY = inputY;
  isMoving = true;
  movingDot.trail = []; // Clear trail for new movement
}

p.mousePressed = function() {
  handleInputStart();
}

// Handle touch events for mobile
p.touchStarted = function() {
  handleInputStart();
  return false; // Prevent default touch behavior
}

p.keyPressed = function() {
  // Remove speed controls for simplicity
}

}
