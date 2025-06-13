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
 * • showBoundaries, showDistances: visual feedback toggles
 * • dist(), rect(), ellipse(): P5.js drawing and math functions
 *
 * EXTENSION IDEAS:
 * • Multiple containers or nested boundaries
 * • Dynamic resizing or moving containers
 * • Obstacles or zones within the container
 *
 * INTERACTION:
 * • Drag the object to move it within or outside the container
 * • Toggle visual feedback for boundaries and distances
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

// Visual controls
let showBoundaries = true;
let showDistances = false;
let dragOffset = { x: 0, y: 0 };

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240, 248, 255);
  
  // Draw the container
  drawContainer();
  
  // Draw boundary indicators if enabled
  if (showBoundaries) {
    drawBoundaryIndicators();
  }
  
  // Draw objects
  drawMovingObject();
  drawOutsideObject();
  
  // Draw distance measurements if enabled
  if (showDistances) {
    drawDistanceMeasurements();
  }
  
  // Draw relationship information
  drawRelationshipInfo();
  
  // Draw controls
  drawControls();
}

function drawContainer() {
  // Draw container background
  fill(container.color[0], container.color[1], container.color[2], 100);
  stroke(container.borderColor[0], container.borderColor[1], container.borderColor[2]);
  strokeWeight(3);
  rect(container.x, container.y, container.width, container.height, 10);
  
  // Draw container label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  text("Container", container.x + container.width/2, container.y - 10);
  
  // Draw corner coordinates
  textSize(10);
  fill(100);
  textAlign(LEFT);
  text("(" + container.x + "," + container.y + ")", 
       container.x + 5, container.y + 15);
  textAlign(RIGHT);
  text("(" + (container.x + container.width) + "," + (container.y + container.height) + ")", 
       container.x + container.width - 5, container.y + container.height - 5);
}

function drawBoundaryIndicators() {
  // Draw dashed boundary lines
  stroke(150, 150, 150);
  strokeWeight(1);
  drawDashedRect(container.x, container.y, container.width, container.height);
  
  // Draw margin indicators
  stroke(200, 100, 100, 100);
  strokeWeight(1);
  let margin = 10;
  drawDashedRect(container.x + margin, container.y + margin, 
                container.width - margin * 2, container.height - margin * 2);
}

function drawDashedRect(x, y, w, h) {
  let dashLength = 5;
  
  // Top edge
  for (let i = x; i < x + w; i += dashLength * 2) {
    line(i, y, Math.min(i + dashLength, x + w), y);
  }
  
  // Bottom edge
  for (let i = x; i < x + w; i += dashLength * 2) {
    line(i, y + h, Math.min(i + dashLength, x + w), y + h);
  }
  
  // Left edge
  for (let i = y; i < y + h; i += dashLength * 2) {
    line(x, i, x, Math.min(i + dashLength, y + h));
  }
  
  // Right edge
  for (let i = y; i < y + h; i += dashLength * 2) {
    line(x + w, i, x + w, Math.min(i + dashLength, y + h));
  }
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
  
  // Draw object label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text("Moving Object", movingObject.x, movingObject.y - 25);
  text("(" + Math.round(movingObject.x) + "," + Math.round(movingObject.y) + ")", 
       movingObject.x, movingObject.y + 30);
  
  // Draw selection indicator if dragging
  if (movingObject.dragging) {
    stroke(255, 255, 0);
    strokeWeight(2);
    noFill();
    ellipse(movingObject.x, movingObject.y, movingObject.radius * 2 + 10, movingObject.radius * 2 + 10);
  }
}

function drawOutsideObject() {
  // This object demonstrates something NOT within the container
  fill(outsideObject.color[0], outsideObject.color[1], outsideObject.color[2]);
  stroke(100, 100, 100);
  strokeWeight(2);
  ellipse(outsideObject.x, outsideObject.y, outsideObject.radius * 2, outsideObject.radius * 2);
  
  // Draw object label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text("Outside Object", outsideObject.x, outsideObject.y - 20);
  
  // Draw selection indicator if dragging
  if (outsideObject.dragging) {
    stroke(255, 255, 0);
    strokeWeight(2);
    noFill();
    ellipse(outsideObject.x, outsideObject.y, outsideObject.radius * 2 + 8, outsideObject.radius * 2 + 8);
  }
}

function drawDistanceMeasurements() {
  // Calculate distances to container edges
  let leftDist = movingObject.x - container.x;
  let rightDist = (container.x + container.width) - movingObject.x;
  let topDist = movingObject.y - container.y;
  let bottomDist = (container.y + container.height) - movingObject.y;
  
  // Draw distance lines
  stroke(100, 100, 100, 150);
  strokeWeight(1);
  
  // Left distance
  if (leftDist > 0) {
    line(container.x, movingObject.y, movingObject.x - movingObject.radius, movingObject.y);
    text(Math.round(leftDist), container.x + leftDist/2, movingObject.y - 5);
  }
  
  // Top distance
  if (topDist > 0) {
    line(movingObject.x, container.y, movingObject.x, movingObject.y - movingObject.radius);
    text(Math.round(topDist), movingObject.x + 10, container.y + topDist/2);
  }
}

function drawRelationshipInfo() {
  // Determine containment status
  let isWithin = checkWithinContainer(movingObject);
  let isOutsideWithin = checkWithinContainer(outsideObject);
  
  let relationship = "";
  if (isWithin) {
    relationship = "Orange circle is WITHIN the container";
  } else {
    relationship = "Orange circle is OUTSIDE the container";
  }
  
  // Draw relationship status
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  
  if (isWithin) {
    fill(0, 150, 0); // Green for within
  } else {
    fill(150, 0, 0); // Red for outside
  }
  text(relationship, width/2, height - 60);
  
  // Additional information
  fill(0);
  textSize(12);
  text("Green circle is " + (isOutsideWithin ? "WITHIN" : "OUTSIDE") + " container", 
       width/2, height - 40);
  
  // Containment rules
  textSize(10);
  text("Objects are WITHIN when completely inside boundaries", width/2, height - 20);
}

function drawControls() {
  // Instructions
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(10);
  text("Drag circles to explore containment", 10, 20);
  text("Objects are 'within' when inside boundaries", 10, 35);
  
  // Control buttons
  fill(200);
  stroke(100);
  strokeWeight(1);
  
  // Boundaries toggle
  rect(250, 10, 90, 20);
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(9);
  text(showBoundaries ? "Hide Boundaries" : "Show Boundaries", 295, 23);
  
  // Distances toggle
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(250, 35, 90, 20);
  fill(0);
  noStroke();
  text(showDistances ? "Hide Distances" : "Show Distances", 295, 48);
  
  // Reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(350, 10, 40, 20);
  fill(0);
  noStroke();
  text("Reset", 370, 23);
}

function checkWithinContainer(obj) {
  // Check if object's center is within container bounds
  // (Could also check if entire object including radius is within)
  return (obj.x >= container.x && 
          obj.x <= container.x + container.width &&
          obj.y >= container.y && 
          obj.y <= container.y + container.height);
}

function checkCompletelyWithinContainer(obj) {
  // Check if entire object including radius is within container
  return (obj.x - obj.radius >= container.x && 
          obj.x + obj.radius <= container.x + container.width &&
          obj.y - obj.radius >= container.y &&          obj.y + obj.radius <= container.y + container.height);
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
  
  // Check control buttons
  if (inputY >= 10 && inputY <= 30) {
    if (inputX >= 250 && inputX <= 340) {
      showBoundaries = !showBoundaries;
      return;
    }
    if (inputX >= 350 && inputX <= 390) {
      resetObjects();
      return;
    }
  }
  
  if (inputY >= 35 && inputY <= 55 && inputX >= 250 && inputX <= 340) {
    showDistances = !showDistances;
    return;
  }
  
  // Check object selection
  let distToMoving = dist(inputX, inputY, movingObject.x, movingObject.y);
  let distToOutside = dist(inputX, inputY, outsideObject.x, outsideObject.y);
  
  if (distToMoving <= movingObject.radius) {
    movingObject.dragging = true;
    dragOffset.x = inputX - movingObject.x;
    dragOffset.y = inputY - movingObject.y;
  } else if (distToOutside <= outsideObject.radius) {
    outsideObject.dragging = true;
    dragOffset.x = inputX - outsideObject.x;
    dragOffset.y = inputY - outsideObject.y;
  }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
  let inputX = getInputX();
  let inputY = getInputY();
  
  if (movingObject.dragging) {
    movingObject.x = inputX - dragOffset.x;
    movingObject.y = inputY - dragOffset.y;
    
    // Keep within canvas bounds
    movingObject.x = constrain(movingObject.x, movingObject.radius, width - movingObject.radius);
    movingObject.y = constrain(movingObject.y, movingObject.radius, height - movingObject.radius);
  }
  
  if (outsideObject.dragging) {
    outsideObject.x = inputX - dragOffset.x;
    outsideObject.y = inputY - dragOffset.y;
    
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

function resetObjects() {
  movingObject.x = 150;
  movingObject.y = 120;
  movingObject.dragging = false;
  
  outsideObject.x = 50;
  outsideObject.y = 50;
  outsideObject.dragging = false;
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
