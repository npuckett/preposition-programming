import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/*
 * PREPOSITION: BELOW
 * 
 * CONCEPT:
 * "Below" means positioned at a lower level than something else.
 * In screen coordinates, this translates to having a larger Y value,
 * since Y increases downward from the top of the screen.
 * 
 * LEARNING OBJECTIVES:
 * - Understand Y-axis direction in computer graphics
 * - Practice comparative logic with coordinates
 * - Learn drag-and-drop interaction patterns
 * - Create dynamic visual relationships
 * - Use conditional statements for real-time feedback
 * 
 * KEY VARIABLES:
 * - greenCircle, orangeCircle: objects storing position and state
 * - dragging: boolean flag for interaction state
 * - p.mouseX, p.mouseY: mouse position variables
 * 
 * KEY METHODS:
 * - setup(): initializes canvas
 * - draw(): continuous rendering loop
 * - p.dist(): calculates distance between points
 * - mousePressed(), mouseDragged(), mouseReleased(): mouse interaction
 * 
 * HOW TO EXTEND:
 * 1. Add multiple objects in a vertical stack
 * 2. Create gravity simulation where objects fall "below" others
 * 3. Add collision detection when objects are below each other
 * 4. Implement layering system with depth
 * 5. Add animations that demonstrate "sinking below"
 * 6. Create a sorting game where objects must be arranged below/above
 */

// Circle objects with position, size, and interaction properties
let greenCircle = { 
  x: 150, 
  y: 80, 
  radius: 20, 
  dragging: false 
};

let orangeCircle = { 
  x: 250, 
  y: 200, 
  radius: 20, 
  dragging: false 
};

p.setup = function() {
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Draw reference lines to show Y levels
  drawYLevelLine(greenCircle, p.color(100, 200, 100));
  drawYLevelLine(orangeCircle, p.color(255, 150, 100));
  
  // Determine the "below" relationship
  let relationship = "";
  if (greenCircle.y > orangeCircle.y) {
    // Larger Y value = lower on screen = "below"
    relationship = "Green is BELOW orange";
  } else if (orangeCircle.y > greenCircle.y) {
    relationship = "Orange is BELOW green";
  } else {
    relationship = "Circles are at SAME level";
  }
  
  // Draw the circles
  drawCircle(greenCircle, p.color(100, 200, 100), "Green");
  drawCircle(orangeCircle, p.color(255, 150, 100), "Orange");
  
  // Display relationship and instructions
  p.fill(...PALETTE.ink);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(14);
  p.text(relationship, p.width/2, 30);
  p.text("Drag the circles to change the relationship", p.width/2, p.height - 20);
}

function drawCircle(circle, circleColor, label) {
  // Draw main circle
  p.fill(circleColor);
  p.noStroke();
  p.ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
  
  // Draw label
  p.fill(...PALETTE.ink);
  p.textAlign(CENTER);
  p.textSize(12);
  p.text(label, circle.x, circle.y - circle.radius - 8);
}

function drawYLevelLine(circle, lineColor) {
  // Horizontal reference line
  p.stroke(lineColor);
  p.strokeWeight(1);
  p.line(0, circle.y, p.width, circle.y);
  
  // Y coordinate display
  p.fill(lineColor);
  p.noStroke();
  p.textAlign(LEFT);
  p.textSize(10);  p.text("Y: " + Math.round(circle.y), 5, circle.y - 3);
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
  if (p.dist(inputX, inputY, greenCircle.x, greenCircle.y) < greenCircle.radius) {
    greenCircle.dragging = true;
  } else if (p.dist(inputX, inputY, orangeCircle.x, orangeCircle.y) < orangeCircle.radius) {
    orangeCircle.dragging = true;
  }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
  let inputX = getInputX();
  let inputY = getInputY();
  
  // Update position of dragged circle
  if (greenCircle.dragging) {
    greenCircle.x = inputX;
    greenCircle.y = inputY;
  }
  if (orangeCircle.dragging) {
    orangeCircle.x = inputX;
    orangeCircle.y = inputY;
  }
}

// Handle input end (both mouse and touch)
function handleInputEnd() {
  // Stop dragging
  greenCircle.dragging = false;
  orangeCircle.dragging = false;
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
