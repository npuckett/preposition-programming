/*
 * P5.js Sketch: WITHIN – Containment and Boundaries
 *
 * CONCEPT:
 * "Within" means inside the boundaries of something else, showing containment or enclosure.
 * In this sketch, an object can be moved within a container, visually demonstrating the preposition.
 *
 * LEARNING OBJECTIVES:
 * • Understand boundary detection and containment
 * • Practice collision and overlap logic
 * • Explore drag-and-drop and interactive movement
 * • Visualize spatial relationships and feedback
 *
 * KEY VARIABLES & METHODS:
 * • container: object storing position, size, and color of the boundary
 * • movingObject: object that can be moved within the container
 * • outsideObject: object for comparison, outside the container
 * • checkWithinContainer(): function to test if object is within bounds
 * • dist(), rect(), ellipse(): P5.js drawing and math functions
 *
 * EXTENSION IDEAS:
 * • Multiple containers or nested boundaries
 * • Dynamic resizing or moving containers
 * • Obstacles or zones within the container
 *
 * INTERACTION:
 * • Drag the circles to move them within or outside the container
 * • Visual feedback shows containment status with colors
 */

// P5.js Sketch: Preposition "Within"
// This sketch demonstrates the concept of "within" through containment
// Objects positioned inside the boundaries of other objects

// Container object
let container = {
  x: 100,
  y: 80,
  width: 200,
  height: 140,
  color: [100, 150, 255],
  borderColor: [50, 100, 200]
};

// Object that can be within the container
let movingObject = {
  x: 150,
  y: 120,
  radius: 20,
  color: [255, 150, 100],
  dragging: false
};

// Additional objects for comparison
let outsideObject = {
  x: 50,
  y: 50,
  radius: 15,
  color: [100, 255, 100],
  dragging: false
};

// Visual controls - removed for simplicity

function setup() {
  createCanvas(400, 300).parent('canvas');
}

function draw() {
  background(240);
  
  // Draw the container
  drawContainer();
  
  // Draw objects
  drawMovingObject();
  drawOutsideObject();
  
  // Draw simple status text
  drawSimpleStatus();
}

function drawContainer() {
  // Draw container background
  fill(container.color[0], container.color[1], container.color[2], 100);
  stroke(container.borderColor[0], container.borderColor[1], container.borderColor[2]);
  strokeWeight(3);
  rect(container.x, container.y, container.width, container.height, 10);
}

function drawMovingObject() {
  // Check if object is within container
  let isWithin = checkWithinContainer(movingObject);
  
  // Draw object with different appearance based on containment
  if (isWithin) {
    fill(movingObject.color[0], movingObject.color[1], movingObject.color[2]);
    stroke(50, 200, 50); // Green border when within
    strokeWeight(3);
  } else {
    fill(movingObject.color[0], movingObject.color[1], movingObject.color[2], 150);
    stroke(200, 50, 50); // Red border when outside
    strokeWeight(2);
  }
  
  ellipse(movingObject.x, movingObject.y, movingObject.radius * 2, movingObject.radius * 2);
}

function drawOutsideObject() {
  // This object demonstrates something NOT within the container
  fill(outsideObject.color[0], outsideObject.color[1], outsideObject.color[2]);
  stroke(100, 100, 100);
  strokeWeight(2);
  ellipse(outsideObject.x, outsideObject.y, outsideObject.radius * 2, outsideObject.radius * 2);
}

function drawSimpleStatus() {
  // Simple status text at the bottom
  let movingWithin = checkWithinContainer(movingObject);
  let outsideWithin = checkWithinContainer(outsideObject);
  
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  
  let statusText = "";
  if (movingWithin) {
    statusText += "Orange circle: within";
  } else {
    statusText += "Orange circle: not within";
  }
  
  statusText += " | ";
  
  if (outsideWithin) {
    statusText += "Green circle: within";
  } else {
    statusText += "Green circle: not within";
  }
  
  text(statusText, width/2, height - 20);
}

function checkWithinContainer(obj) {
  // Check if object's center is within container bounds
  // (Could also check if entire object including radius is within)
  return (obj.x >= container.x && 
          obj.x <= container.x + container.width &&
          obj.y >= container.y && 
          obj.y <= container.y + container.height);
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
  
  // Check object selection
  let distToMoving = dist(inputX, inputY, movingObject.x, movingObject.y);
  let distToOutside = dist(inputX, inputY, outsideObject.x, outsideObject.y);
  
  if (distToMoving <= movingObject.radius) {
    movingObject.dragging = true;
  } else if (distToOutside <= outsideObject.radius) {
    outsideObject.dragging = true;
  }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
  let inputX = getInputX();
  let inputY = getInputY();
  
  if (movingObject.dragging) {
    movingObject.x = inputX;
    movingObject.y = inputY;
    
    // Keep within canvas bounds
    movingObject.x = constrain(movingObject.x, movingObject.radius, width - movingObject.radius);
    movingObject.y = constrain(movingObject.y, movingObject.radius, height - movingObject.radius);
  }
  
  if (outsideObject.dragging) {
    outsideObject.x = inputX;
    outsideObject.y = inputY;
    
    // Keep within canvas bounds
    outsideObject.x = constrain(outsideObject.x, outsideObject.radius, width - outsideObject.radius);
    outsideObject.y = constrain(outsideObject.y, outsideObject.radius, height - outsideObject.radius);
  }
}

// Handle input end (both mouse and touch)
function handleInputEnd() {
  movingObject.dragging = false;
  outsideObject.dragging = false;
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

/*
EDUCATIONAL NOTES:

1. BOUNDARY DETECTION:
   - Simple method: check if center point is within bounds
   - Complete method: check if entire object (including radius) is within
   - Different criteria give different results for edge cases

2. COORDINATE COMPARISON:
   - "Within" requires multiple boundary checks (left, right, top, bottom)
   - All conditions must be true for containment
   - Logical AND operation combines multiple criteria

3. VISUAL FEEDBACK:
   - Color changes indicate containment status
   - Border colors provide immediate visual feedback
   - Transparency can show "partial" states

4. CONTAINMENT RULES:
   - Clear definition of what constitutes "within"
   - Consistent application of rules
   - Edge case handling (what happens exactly on boundaries)

5. INTERACTIVE EXPLORATION:
   - Real-time feedback as objects move
   - Multiple objects for comparison
   - Toggle options to show/hide helper information

This pattern can be adapted for other "within" scenarios like:
- UI elements contained within panels
- Game collision detection with zones
- Form validation for input ranges
- Geographic points within regions
- Data filtering within specified bounds
*/
