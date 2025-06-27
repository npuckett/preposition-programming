/*
 * P5.js Sketch: BEHIND – Depth, Occlusion, and Layering
 *
 * CONCEPT:
 * "Behind" means one object is visually or spatially at the back of another, demonstrating occlusion or depth layering.
 * In this sketch, circles can overlap, and the blue circle is always rendered behind the red circle, visually demonstrating the preposition.
 *
 * LEARNING OBJECTIVES:
 * • Understand depth ordering and occlusion in 2D graphics
 * • Practice sorting and rendering objects by depth
 * • Explore overlap detection and percentage calculation
 * • Visualize spatial relationships and feedback
 *
 * KEY VARIABLES & METHODS:
 * • circles[]: array of circle objects with position, radius, color, and depth
 * • depth: property to determine rendering order (smaller = behind)
 * • percentOverlap: calculated overlap between circles
 * • dist(), ellipse(), sort(): P5.js math and drawing functions
 *
 * EXTENSION IDEAS:
 * • More than two objects with varying depths
 * • Dynamic depth changes (bring to front/back)
 * • Transparency or shadow effects for depth cues
 *
 * INTERACTION:
 * • Drag circles to change their position and overlap
 * • Blue is always behind, red is always in front
 */

// Blue circle (always behind)
let blueCircle = { x: 120, y: 150, radius: 55, dragging: false };
// Red circle (always in front)
let redCircle = { x: 280, y: 150, radius: 55, dragging: false };

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240);
  
  // Calculate distance between circle centers
  let distance = dist(blueCircle.x, blueCircle.y, redCircle.x, redCircle.y);
  let radiusSum = blueCircle.radius + redCircle.radius;
  let isOverlapping = distance < radiusSum;
  
  // Calculate percentage overlap
  let percentOverlap = 0;
  if (isOverlapping) {
    let overlapDistance = radiusSum - distance;
    let maxPossibleOverlap = Math.min(blueCircle.radius, redCircle.radius) * 2;
    percentOverlap = Math.min(100, (overlapDistance / maxPossibleOverlap) * 100);
  }
  
  // Draw blue circle FIRST (behind)
  fill(100, 150, 255);
  if (isOverlapping) {
    stroke(255, 0, 0); // Red stroke when overlapping
    strokeWeight(3);
  } else {
    stroke(0);
    strokeWeight(2);
  }
  ellipse(blueCircle.x, blueCircle.y, blueCircle.radius * 2, blueCircle.radius * 2);
  
  // Draw red circle SECOND (in front)
  fill(255, 100, 100);
  if (isOverlapping) {
    stroke(0, 150, 0); // Green stroke when overlapping
    strokeWeight(3);
  } else {
    stroke(0);
    strokeWeight(2);
  }
  ellipse(redCircle.x, redCircle.y, redCircle.radius * 2, redCircle.radius * 2);
  
  // Draw percentage on the blue circle if overlapping
  if (isOverlapping) {
    fill(255, 255, 255);
    stroke(0);
    strokeWeight(1);
    textAlign(CENTER);
    textSize(12);
    text(Math.round(percentOverlap) + "%", blueCircle.x, blueCircle.y + 2);
    textSize(10);
    text("BEHIND", blueCircle.x, blueCircle.y - 10);
  }
  
  // Draw labels
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Back", blueCircle.x, blueCircle.y - blueCircle.radius - 15);
  text("Front", redCircle.x, redCircle.y - redCircle.radius - 15);
  
  // Determine relationship
  let relationship = "";
  if (isOverlapping) {
    relationship = `Blue is ${Math.round(percentOverlap)}% BEHIND Red`;
  } else {
    relationship = "No overlap - no behind relationship";
  }
  
  // Draw relationship text
  textAlign(CENTER);
  textSize(14);
  if (isOverlapping) {
    fill(200, 50, 50); // Red when overlapping
  } else {
    fill(100, 100, 100); // Gray when not overlapping
  }
  text(relationship, width/2, height - 30);
  
  fill(0);
  textSize(14);
  text("Drag circles • Blue is always behind, Red is always in front", width/2, height - 20);
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
  let inputX = getInputX();
  let inputY = getInputY();
  
  // Check which circle is clicked/touched
  if (dist(inputX, inputY, redCircle.x, redCircle.y) < redCircle.radius) {
    redCircle.dragging = true;
  } else if (dist(inputX, inputY, blueCircle.x, blueCircle.y) < blueCircle.radius) {
    blueCircle.dragging = true;
  }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
  let inputX = getInputX();
  let inputY = getInputY();
  
  // Update position if dragging
  if (blueCircle.dragging) {
    blueCircle.x = inputX;
    blueCircle.y = inputY;
  }
  if (redCircle.dragging) {
    redCircle.x = inputX;
    redCircle.y = inputY;
  }
}

// Handle input end (both mouse and touch)
function handleInputEnd() {
  // Stop dragging
  blueCircle.dragging = false;
  redCircle.dragging = false;
}

function mousePressed() {
  handleInputStart();
}

function mouseDragged() {
  handleInputDrag();
}

function mouseReleased() {
  handleInputEnd();
}

// Touch event handlers for mobile
function touchStarted() {
  handleInputStart();
  return false; // Prevent default touch behavior
}

function touchMoved() {
  handleInputDrag();
  return false; // Prevent scrolling
}

function touchEnded() {
  handleInputEnd();
  return false;
}
