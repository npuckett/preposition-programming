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
 * - Learn about Y-axis direction (top = 0, bottom = height)
 * - Practice conditional logic with position comparisons
 * - Implement drag-and-drop mouse interaction
 * - Create visual feedback based on relationships
 * 
 * KEY VARIABLES:
 * - blueCircle: object storing position, radius, and drag state
 * - redCircle: object storing position, radius, and drag state
 * - mouseX, mouseY: built-in P5 variables for mouse position
 * 
 * KEY METHODS:
 * - setup(): runs once, creates canvas
 * - draw(): runs continuously, renders graphics
 * - mousePressed(): detects when mouse is clicked
 * - mouseDragged(): detects when mouse is moved while pressed
 * - mouseReleased(): detects when mouse button is released
 * - dist(): calculates distance between two points
 * 
 * HOW TO EXTEND:
 * 1. Add more circles to create complex relationships
 * 2. Change colors based on different height differences
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

function setup() {
  // Create a 400x300 pixel canvas
  createCanvas(400, 300);
}

function draw() {
  // Clear the background each frame
  background(240);
  
  // Draw horizontal reference lines for each circle
  drawYLevelLine(blueCircle, color(100, 150, 255));
  drawYLevelLine(redCircle, color(255, 100, 100));
  
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
  drawCircle(blueCircle, color(100, 150, 255), "Blue");
  drawCircle(redCircle, color(255, 100, 100), "Red");
  
  // Display the current relationship
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  text(relationship, width/2, height - 20);
}

// Helper function to draw a circle with label
function drawCircle(circle, circleColor, label) {
  // Draw the main circle
  fill(circleColor);
  noStroke();
  ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
  
  // Draw the label above the circle
  fill(0);
  textAlign(CENTER);
  textSize(12);
  text(label, circle.x, circle.y - circle.radius - 8);
}

// Helper function to draw Y-level reference lines
function drawYLevelLine(circle, lineColor) {
  // Draw a thin horizontal line across the screen at the circle's Y position
  stroke(lineColor);
  strokeWeight(1);
  line(0, circle.y, width, circle.y);
  
  // Show the Y coordinate value
  fill(lineColor);
  noStroke();
  textAlign(LEFT);
  textSize(10);  text("Y: " + Math.round(circle.y), 5, circle.y - 3);
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
  
  // Check if input is over blue circle
  if (dist(inputX, inputY, blueCircle.x, blueCircle.y) < blueCircle.radius) {
    blueCircle.dragging = true;
  }
  // Check if input is over red circle  
  else if (dist(inputX, inputY, redCircle.x, redCircle.y) < redCircle.radius) {
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
function mousePressed() {
  handleInputStart();
}

// Detect when mouse is moved while pressed (dragging)
function mouseDragged() {
  handleInputDrag();
}

// Detect when mouse button is released
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
