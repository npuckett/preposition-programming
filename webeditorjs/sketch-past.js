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

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240, 248, 255);
  
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
  if (circle.x > width + 30) {
    circle.isMoving = false;
  }
}

function drawTrail() {
  // Simple trail dots
  fill(255, 200, 0, 150);
  noStroke();
  for (let i = 0; i < trail.length; i++) {
    let alpha = map(i, 0, trail.length - 1, 50, 150);
    fill(255, 200, 0, alpha);
    ellipse(trail[i].x, trail[i].y, 8, 8);
  }
}

function drawReference() {
  // Reference point shadow
  fill(0, 0, 0, 30);
  noStroke();
  ellipse(reference.x + 3, reference.y + 3, reference.size, reference.size);
  
  // Reference point
  fill(100, 150, 255);
  stroke(70, 120, 200);
  strokeWeight(3);
  ellipse(reference.x, reference.y, reference.size, reference.size);
  
  // Reference label
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text("REF", reference.x, reference.y + 4);
  
  // Vertical reference line
  stroke(100, 150, 255, 100);
  strokeWeight(2);
  line(reference.x, 0, reference.x, height);
}

function drawCircle() {
  // Circle color based on state
  if (circle.hasPassed) {
    fill(100, 255, 100); // Green when past
    stroke(50, 200, 50);
  } else if (circle.isMoving) {
    fill(255, 200, 0); // Yellow when moving
    stroke(255, 150, 0);
  } else {
    fill(255, 150, 100); // Orange when waiting
    stroke(200, 100, 50);
  }
  
  strokeWeight(3);
  ellipse(circle.x, circle.y, circle.size, circle.size);
  
  // Movement arrow when moving
  if (circle.isMoving) {
    stroke(255, 100, 100);
    strokeWeight(2);
    line(circle.x + 8, circle.y, circle.x + 18, circle.y);
    line(circle.x + 18, circle.y, circle.x + 14, circle.y - 4);
    line(circle.x + 18, circle.y, circle.x + 14, circle.y + 4);
  }
}

function drawStatus() {
  // Status text at bottom
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  
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
  
  text(statusText, width/2, height - 20);
}

// Helper functions for cross-platform input handling
function getInputX() {
  return touches.length > 0 ? touches[0].x : mouseX;
}

function getInputY() {
  return touches.length > 0 ? touches[0].y : mouseY;
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

function mousePressed() {
  handleInputStart();
}

// Handle touch events for mobile
function touchStarted() {
  handleInputStart();
  return false; // Prevent default touch behavior
}
