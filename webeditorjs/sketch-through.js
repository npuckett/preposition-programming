/*
 * P5.js Sketch: THROUGH – Movement and Boundary Crossing
 *
 * CONCEPT:
 * "Through" means moving from one side of something to the other,
 * passing inside or across its boundaries. This involves motion
 * and the crossing of a barrier or boundary.
 *
 * LEARNING OBJECTIVES:
 * • Track object movement across boundaries
 * • Detect state changes during movement
 * • Understand sequential spatial relationships
 * • Practice collision detection logic
 *
 * KEY VARIABLES & METHODS:
 * • barrier: object defining obstacle boundaries
 * • movingCircle: object with position and state tracking
 * • hasEnteredBarrier, hasExitedBarrier: state tracking booleans
 * • Boundary checking and collision detection
 *
 * EXTENSION IDEAS:
 * • Multiple barriers to pass through
 * • Speed detection through barriers
 * • Different barrier shapes and orientations
 *
 * INTERACTION:
 * • Drag the circle through the barrier
 * • Visual feedback shows movement progress
 */

// P5.js Sketch: Preposition "Through"
// This sketch demonstrates moving from one side to the other through a barrier

// Barrier obstacle that objects pass through
let barrier = { 
  x: 180, 
  y: 50, 
  width: 40, 
  height: 200,
  color: [100, 150, 255]
};

// Moving circle with state tracking
let movingCircle = { 
  x: 100, 
  y: 150, 
  radius: 15, 
  color: [255, 150, 100],
  dragging: false,
  hasEnteredBarrier: false,
  hasExitedBarrier: false,
  hasPassed: false,
  entryFromLeft: null  // Track which side the circle entered from
};

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240);
  
  // Draw the barrier obstacle
  drawBarrier();
  
  // Check if circle is currently inside the barrier
  let isInsideBarrier = checkInsideBarrier();
  
  // Update state based on position
  updateMovementState(isInsideBarrier);
  
  // Draw the moving circle
  drawMovingCircle(isInsideBarrier);
  
  // Draw simple status text
  drawSimpleStatus(isInsideBarrier);
}

function drawBarrier() {
  // Draw barrier background
  fill(barrier.color[0], barrier.color[1], barrier.color[2], 100);
  stroke(barrier.color[0], barrier.color[1], barrier.color[2]);
  strokeWeight(3);
  rect(barrier.x, barrier.y, barrier.width, barrier.height);
}

function checkInsideBarrier() {
  return (movingCircle.x > barrier.x && 
          movingCircle.x < barrier.x + barrier.width &&
          movingCircle.y > barrier.y && 
          movingCircle.y < barrier.y + barrier.height);
}

function updateMovementState(isInsideBarrier) {
  // Auto-reset when circle moves far enough from barrier
  let distanceFromBarrier = getDistanceFromBarrier();
  if (movingCircle.hasPassed && distanceFromBarrier > 50) {
    resetMovementState();
  }
  
  // Track entrance to barrier
  if (isInsideBarrier && !movingCircle.hasEnteredBarrier) {
    movingCircle.hasEnteredBarrier = true;
    // Track which side the circle entered from
    movingCircle.entryFromLeft = movingCircle.x < barrier.x + barrier.width / 2;
  }
  
  // Track exit from barrier (only after entering)
  if (!isInsideBarrier && movingCircle.hasEnteredBarrier && !movingCircle.hasExitedBarrier) {
    let exitedToLeft = movingCircle.x < barrier.x + barrier.width / 2;
    
    // Only mark as "passed through" if exited to opposite side
    if (movingCircle.entryFromLeft !== exitedToLeft) {
      movingCircle.hasExitedBarrier = true;
      movingCircle.hasPassed = true;
    }
  }
}

function getDistanceFromBarrier() {
  // Calculate shortest distance from circle to barrier
  let barrierCenterX = barrier.x + barrier.width / 2;
  let barrierCenterY = barrier.y + barrier.height / 2;
  
  // Distance to barrier center
  let distToCenter = dist(movingCircle.x, movingCircle.y, barrierCenterX, barrierCenterY);
  
  // Approximate distance to barrier edge
  let halfWidth = barrier.width / 2;
  let halfHeight = barrier.height / 2;
  let approximateRadius = Math.max(halfWidth, halfHeight);
  
  return Math.max(0, distToCenter - approximateRadius);
}

function resetMovementState() {
  movingCircle.hasEnteredBarrier = false;
  movingCircle.hasExitedBarrier = false;
  movingCircle.hasPassed = false;
  movingCircle.entryFromLeft = null;
}

function drawMovingCircle(isInsideBarrier) {
  // Simple color logic based on position and state
  if (isInsideBarrier) {
    fill(255, 255, 100);      // Yellow - currently passing through
    stroke(255, 200, 0);
  } else if (movingCircle.hasPassed) {
    // Color based on which side the circle is on after passing through
    if (movingCircle.x < barrier.x + barrier.width / 2) {
      fill(movingCircle.color[0], movingCircle.color[1], movingCircle.color[2]); // Orange - on left side
      stroke(200, 100, 50);
    } else {
      fill(100, 255, 100);      // Green - on right side
      stroke(50, 200, 50);
    }
  } else {
    fill(movingCircle.color[0], movingCircle.color[1], movingCircle.color[2]); // Orange - starting state
    stroke(200, 100, 50);
  }
  
  strokeWeight(2);
  ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
}

function drawSimpleStatus(isInsideBarrier) {
  // Simple status text at the bottom
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  
  let statusText = "";
  if (movingCircle.hasPassed) {
    // Show direction of completed movement
    let direction = movingCircle.x < barrier.x + barrier.width / 2 ? "right to left" : "left to right";
    statusText = `Circle moved through barrier (${direction})`;
  } else if (isInsideBarrier) {
    // Show current movement direction when inside
    let entryDirection = movingCircle.entryFromLeft ? "left" : "right";
    statusText = `Inside barrier - entered from ${entryDirection}`;
  } else if (movingCircle.hasEnteredBarrier) {
    statusText = "Circle entered but hasn't exited";
  } else {
    statusText = "Drag circle through the barrier";
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
  let inputX = getInputX();
  let inputY = getInputY();
  
  // Check if input is over the moving circle
  if (dist(inputX, inputY, movingCircle.x, movingCircle.y) < movingCircle.radius) {
    movingCircle.dragging = true;
  }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
  if (movingCircle.dragging) {
    let inputX = getInputX();
    let inputY = getInputY();
    
    movingCircle.x = inputX;
    movingCircle.y = inputY;
    
    // Keep within canvas bounds
    movingCircle.x = constrain(movingCircle.x, movingCircle.radius, width - movingCircle.radius);
    movingCircle.y = constrain(movingCircle.y, movingCircle.radius, height - movingCircle.radius);
  }
}

// Handle input end (both mouse and touch)
function handleInputEnd() {
  movingCircle.dragging = false;
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

1. STATE TRACKING:
   - "Through" requires tracking entry AND exit from a boundary
   - Sequential states: outside → inside → outside again
   - Boolean flags track progress through the sequence
   - Auto-reset allows continuous experimentation

2. BOUNDARY DETECTION:
   - Check if object center is within barrier bounds
   - Multiple conditions must be true for "inside" state
   - State changes trigger when crossing boundaries

3. CONTINUOUS INTERACTION:
   - Movement state resets when circle moves far from barrier
   - Allows repeated "through" movements without manual reset
   - Distance calculation determines when to reset state

4. VISUAL FEEDBACK:
   - Color changes show current state and progress
   - Orange: not started, Yellow: in progress, Green: completed
   - Clear visual indication of the "through" relationship

5. MOVEMENT LOGIC:
   - "Through" implies motion from one side to another
   - Different from simple containment ("within")
   - Requires completing the full traversal

This pattern can be adapted for other "through" scenarios like:
- Moving through doorways or passages
- Passing through checkpoints in games
- Data flowing through processing stages
- Objects moving through filters or screens
- Continuous monitoring of boundary crossings
*/
