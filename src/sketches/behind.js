import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
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
 * • p.dist(), p.ellipse(), sort(): P5.js math and drawing functions
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

p.setup = function() {
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Calculate distance between circle centers
  let distance = p.dist(blueCircle.x, blueCircle.y, redCircle.x, redCircle.y);
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
  p.fill(100, 150, 255);
  if (isOverlapping) {
    p.stroke(255, 0, 0); // Red stroke when overlapping
    p.strokeWeight(3);
  } else {
    p.stroke(0);
    p.strokeWeight(2);
  }
  p.ellipse(blueCircle.x, blueCircle.y, blueCircle.radius * 2, blueCircle.radius * 2);
  
  // Draw red circle SECOND (in front)
  p.fill(255, 100, 100);
  if (isOverlapping) {
    p.stroke(0, 150, 0); // Green stroke when overlapping
    p.strokeWeight(3);
  } else {
    p.stroke(0);
    p.strokeWeight(2);
  }
  p.ellipse(redCircle.x, redCircle.y, redCircle.radius * 2, redCircle.radius * 2);
  
  // Draw percentage on the blue circle if overlapping
  if (isOverlapping) {
    p.fill(255, 255, 255);
    p.stroke(0);
    p.strokeWeight(1);
    p.textAlign(CENTER);
    p.textSize(12);
    p.text(Math.round(percentOverlap) + "%", blueCircle.x, blueCircle.y + 2);
    p.textSize(10);
    p.text("BEHIND", blueCircle.x, blueCircle.y - 10);
  }
  
  // Draw labels
  p.fill(...PALETTE.ink);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(12);
  p.text("Back", blueCircle.x, blueCircle.y - blueCircle.radius - 15);
  p.text("Front", redCircle.x, redCircle.y - redCircle.radius - 15);
  

  
  p.fill(...PALETTE.ink);
  p.textSize(14);
  p.text("Drag circles • Blue is always behind, Red is always in front", p.width/2, p.height - 20);
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
  
  // Check which circle is clicked/touched
  if (p.dist(inputX, inputY, redCircle.x, redCircle.y) < redCircle.radius) {
    redCircle.dragging = true;
  } else if (p.dist(inputX, inputY, blueCircle.x, blueCircle.y) < blueCircle.radius) {
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

p.mousePressed = function() {
  handleInputStart();
}

p.mouseDragged = function() {
  handleInputDrag();
}

p.mouseReleased = function() {
  handleInputEnd();
}

// Touch event handlers for mobile
p.touchStarted = function() {
  handleInputStart();
  return false; // Prevent default touch behavior
}

p.touchMoved = function() {
  handleInputDrag();
  return false; // Prevent scrolling
}

p.touchEnded = function() {
  handleInputEnd();
  return false;
}

}
