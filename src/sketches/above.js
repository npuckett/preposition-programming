import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/*
 * PREPOSITION: ABOVE
 * 
 * CONCEPT:
 * "Above" means positioned at a higher level than something else. 
 * In screen coordinates, this translates to having a smaller Y value, 
 * since Y increases downward from the top of the screen.
 * 
 * LEARNING OBJECTIVES:
 * - Understand coordinate systems in computer graphics
 * - Learn about Y-axis direction (top = 0, bottom = p.height)
 * - Practice conditional logic with position comparisons
 * - Implement drag-and-drop mouse interaction
 * - Create visual feedback based on relationships
 * 
 * KEY VARIABLES:
 * - blueCircle: object storing position, radius, and drag state
 * - redCircle: object storing position, radius, and drag state
 * - p.mouseX, p.mouseY: built-in P5 variables for mouse position
 * 
 * KEY METHODS:
 * - setup(): runs once, creates canvas
 * - draw(): runs continuously, renders graphics
 * - mousePressed(): detects when mouse is clicked
 * - mouseDragged(): detects when mouse is moved while pressed
 * - mouseReleased(): detects when mouse button is released
 * - p.dist(): calculates distance between two points
 * 
 * HOW TO EXTEND:
 * 1. Add more circles to create complex relationships
 * 2. Change colors based on different p.height differences
 * 3. Add snap-to-grid functionality
 * 4. Create zones (high, medium, low) with different behaviors
 * 5. Add sound effects when relationships change
 * 6. Make circles automatically move to demonstrate "above"
 */

// Circle objects to store position, size, and interaction state
let blueCircle = { 
  x: 120,           // X position
  y: 100,           // Y position  
  radius: 20,       // Circle radius
  dragging: false   // Is this circle being dragged?
};

let redCircle = { 
  x: 280, 
  y: 180, 
  radius: 20, 
  dragging: false 
};

p.setup = function() {
  // Create a 400x300 pixel canvas
}

p.draw = function() {
  // Clear the background each frame
  p.background(...PALETTE.bg);
  
  // Draw horizontal reference lines for each circle
  drawYLevelLine(blueCircle, p.color(100, 150, 255));
  drawYLevelLine(redCircle, p.color(255, 100, 100));
  
  // Determine which circle is above the other
  let relationship = "";
  if (blueCircle.y < redCircle.y) {
    // Remember: smaller Y = higher on screen = "above"
    relationship = "Blue is ABOVE red";
  } else if (redCircle.y < blueCircle.y) {
    relationship = "Red is ABOVE blue";
  } else {
    // Y positions are equal
    relationship = "Circles are at SAME level";
  }
  
  // Draw the circles with labels
  drawCircle(blueCircle, p.color(100, 150, 255), "Blue");
  drawCircle(redCircle, p.color(255, 100, 100), "Red");
  
  // Display the current relationship
  p.fill(0);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(14);
  p.text(relationship, p.width/2, p.height - 20);
}

// Helper function to draw a circle with label
function drawCircle(circle, circleColor, label) {
  // Draw the main circle
  p.fill(circleColor);
  p.noStroke();
  p.ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
  
  // Draw the label above the circle
  p.fill(0);
  p.textAlign(CENTER);
  p.textSize(12);
  p.text(label, circle.x, circle.y - circle.radius - 8);
}

// Helper function to draw Y-level reference lines
function drawYLevelLine(circle, lineColor) {
  // Draw a thin horizontal line across the screen at the circle's Y position
  p.stroke(lineColor);
  p.strokeWeight(1);
  p.line(0, circle.y, p.width, circle.y);
  
  // Show the Y coordinate value
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
  
  // Check if input is over blue circle
  if (p.dist(inputX, inputY, blueCircle.x, blueCircle.y) < blueCircle.radius) {
    blueCircle.dragging = true;
  }
  // Check if input is over red circle  
  else if (p.dist(inputX, inputY, redCircle.x, redCircle.y) < redCircle.radius) {
    redCircle.dragging = true;
  }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
  let inputX = getInputX();
  let inputY = getInputY();
  
  // Update position if circle is being dragged
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
  // Stop dragging both circles
  blueCircle.dragging = false;
  redCircle.dragging = false;
}

// Detect when mouse is first pressed
p.mousePressed = function() {
  handleInputStart();
}

// Detect when mouse is moved while pressed (dragging)
p.mouseDragged = function() {
  handleInputDrag();
}

// Detect when mouse button is released
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
