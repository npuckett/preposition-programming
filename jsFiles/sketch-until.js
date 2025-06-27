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

function setup() {
  createCanvas(400, 300).parent('canvas');
}

function draw() {
  background(240, 248, 255);
  
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
  if (mover.x <= mover.size/2 || mover.x >= width - mover.size/2) {
    mover.vx *= -1;
  }
  if (mover.y <= mover.size/2 || mover.y >= height - mover.size/2) {
    mover.vy *= -1;
  }
  
  // Keep within bounds
  mover.x = constrain(mover.x, mover.size/2, width - mover.size/2);
  mover.y = constrain(mover.y, mover.size/2, height - mover.size/2);
  
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
  
  stroke(150, 150, 150, 150);
  strokeWeight(2);
  noFill();
  
  beginShape();
  for (let i = 0; i < trail.length; i++) {
    vertex(trail[i].x, trail[i].y);
  }
  endShape();
}

function drawMover() {
  // Moving object
  if (mover.isStopped) {
    fill(220, 50, 50); // Red when stopped
  } else {
    fill(70, 130, 180); // Blue when moving
  }
  
  noStroke();
  ellipse(mover.x, mover.y, mover.size, mover.size);
  
  // Velocity indicator when moving
  if (mover.isMoving && !mover.isStopped) {
    stroke(70, 130, 180);
    strokeWeight(2);
    let arrowX = mover.x + mover.vx * 5;
    let arrowY = mover.y + mover.vy * 5;
    line(mover.x, mover.y, arrowX, arrowY);
  }
}

function drawStatus() {
  fill(60);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  
  if (!mover.isMoving) {
    text("Click to start continuous movement", width/2, height - 20);
  } else if (mover.isStopped) {
    text("Movement stopped! Click to restart continuous movement", width/2, height - 20);
  } else {
    text("Moving continuously UNTIL you click to stop", width/2, height - 20);
  }
}

function mousePressed() {
  if (!mover.isMoving || mover.isStopped) {
    // Start or restart movement
    mover.x = 200;
    mover.y = 150;
    mover.vx = random(-3, 3);
    mover.vy = random(-3, 3);
    // Ensure minimum speed
    if (abs(mover.vx) < 1) mover.vx = mover.vx > 0 ? 1 : -1;
    if (abs(mover.vy) < 1) mover.vy = mover.vy > 0 ? 1 : -1;
    
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
  return touches.length > 0 ? touches[0].x : mouseX;
}

function getInputY() {
  return touches.length > 0 ? touches[0].y : mouseY;
}

// Handle touch events for mobile
function touchStarted() {
  mousePressed();
  return false; // Prevent default touch behavior
}
