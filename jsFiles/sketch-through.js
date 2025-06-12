/*
 * PREPOSITION: THROUGH
 * 
 * CONCEPT:
 * "Through" means moving from one side of something to the other,
 * passing inside or across its boundaries. This involves motion
 * and the crossing of a barrier or boundary.
 * 
 * LEARNING OBJECTIVES:
 * - Track object movement and position history
 * - Detect boundary crossings and state changes
 * - Implement path tracking and visualization
 * - Create complex interaction states
 * - Use arrays to store position history
 * 
 * KEY VARIABLES:
 * - barrier: object defining obstacle boundaries
 * - movingCircle: object with position, state, and path history
 * - path: array storing movement trail
 * - hasEnteredBarrier, hasExitedBarrier: state tracking booleans
 * 
 * KEY METHODS:
 * - beginShape()/endShape(): draw complex paths
 * - vertex(): add points to shapes
 * - push()/shift(): manage arrays
 * - collision detection with rectangles
 * 
 * HOW TO EXTEND:
 * 1. Add multiple barriers to pass through
 * 2. Create maze-like obstacles
 * 3. Add particle effects when passing through
 * 4. Implement speed detection through barriers
 * 5. Create portals that teleport objects
 * 6. Add sound effects for barrier crossing
 * 7. Make barriers that react to passage
 */

// Barrier obstacle that objects pass through
let barrier = { 
  x: 180, 
  y: 50, 
  width: 40, 
  height: 200 
};

// Moving circle with tracking properties
let movingCircle = { 
  x: 100, 
  y: 150, 
  radius: 15, 
  dragging: false,
  path: [],                    // Array to store movement trail
  hasEnteredBarrier: false,    // Has the circle entered the barrier?
  hasExitedBarrier: false,     // Has the circle exited after entering?
  hasPassed: false            // Has the circle completely passed through?
};

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240);
  
  // Draw the barrier obstacle
  fill(100, 150, 255, 100);  // Semi-transparent blue
  stroke(100, 150, 255);
  strokeWeight(3);
  rect(barrier.x, barrier.y, barrier.width, barrier.height);
  
  // Check if circle is currently inside the barrier
  let isInsideBarrier = (movingCircle.x > barrier.x && 
                        movingCircle.x < barrier.x + barrier.width &&
                        movingCircle.y > barrier.y && 
                        movingCircle.y < barrier.y + barrier.height);
  
  // Track entrance to barrier
  if (isInsideBarrier && !movingCircle.hasEnteredBarrier) {
    movingCircle.hasEnteredBarrier = true;
  }
  
  // Track exit from barrier (only after entering)
  if (!isInsideBarrier && movingCircle.hasEnteredBarrier && !movingCircle.hasExitedBarrier) {
    movingCircle.hasExitedBarrier = true;
    movingCircle.hasPassed = true;  // Completed the "through" movement
  }
  
  // Draw the movement trail
  drawMovementTrail();
  
  // Draw the moving circle with state-based coloring
  drawMovingCircle(isInsideBarrier);
  
  // Draw position markers
  drawPositionMarkers();
  
  // Draw labels and status information
  drawLabelsAndStatus(isInsideBarrier);
  
  // Draw reset button
  drawResetButton();
  
  // Determine and display current relationship
  displayRelationship(isInsideBarrier);
}

function drawMovementTrail() {
  // Draw the path trail as a continuous line
  if (movingCircle.path.length > 1) {
    stroke(255, 200, 0, 150);  // Semi-transparent yellow
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < movingCircle.path.length; i++) {
      let point = movingCircle.path[i];
      vertex(point.x, point.y);
    }
    endShape();
  }
}

function drawMovingCircle(isInsideBarrier) {
  // Color changes based on state
  if (movingCircle.hasPassed) {
    fill(100, 255, 100);      // Green - has passed through
    stroke(50, 200, 50);
  } else if (isInsideBarrier) {
    fill(255, 255, 100);      // Yellow - currently passing through
    stroke(255, 200, 0);
  } else {
    fill(255, 200, 100);      // Orange - hasn't passed through yet
    stroke(255, 150, 50);
  }
  
  strokeWeight(2);
  ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
}

function drawPositionMarkers() {
  if (movingCircle.path.length > 0) {
    // Start position marker (green)
    fill(100, 255, 100);
    noStroke();
    ellipse(movingCircle.path[0].x, movingCircle.path[0].y, 8, 8);
    
    // Current position marker (red)
    fill(255, 100, 100);
    ellipse(movingCircle.x, movingCircle.y, 6, 6);
  }
}

function drawLabelsAndStatus(isInsideBarrier) {
  // Barrier label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Barrier", barrier.x + barrier.width/2, barrier.y - 10);
  text("Moving Circle", movingCircle.x, movingCircle.y - movingCircle.radius - 8);
  
  // State information for debugging/learning
  textAlign(LEFT);
  textSize(10);
  text("Inside barrier: " + isInsideBarrier, 10, 20);
  text("Has entered: " + movingCircle.hasEnteredBarrier, 10, 35);
  text("Has exited: " + movingCircle.hasExitedBarrier, 10, 50);
  text("Has passed through: " + movingCircle.hasPassed, 10, 65);
}

function drawResetButton() {
  // Reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(10, 80, 80, 25);
  fill(0);
  noStroke();
  textAlign(CENTER);
  text("Reset", 50, 97);
}

function displayRelationship(isInsideBarrier) {
  // Determine current relationship state
  let relationship = "";
  if (movingCircle.hasPassed) {
    relationship = "Circle has moved THROUGH the barrier";
  } else if (isInsideBarrier) {
    relationship = "Circle is passing through the barrier";
  } else if (movingCircle.hasEnteredBarrier) {
    relationship = "Circle entered but hasn't exited";
  } else {
    relationship = "Circle hasn't passed through yet";
  }
  
  // Display relationship text
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text(relationship, width/2, height - 40);
  text("Drag the circle through the barrier", width/2, height - 15);
}

function mousePressed() {
  // Check if reset button was clicked
  if (mouseX > 10 && mouseX < 90 && mouseY > 80 && mouseY < 105) {
    resetMovement();
    return;
  }
  
  // Check if mouse is over the moving circle
  if (dist(mouseX, mouseY, movingCircle.x, movingCircle.y) < movingCircle.radius) {
    movingCircle.dragging = true;
  }
}

function mouseDragged() {
  // Update circle position if being dragged
  if (movingCircle.dragging) {
    movingCircle.x = mouseX;
    movingCircle.y = mouseY;
    
    // Add current position to the path trail
    movingCircle.path.push({x: mouseX, y: mouseY});
    
    // Limit path length to prevent memory issues
    if (movingCircle.path.length > 100) {
      movingCircle.path.shift();  // Remove oldest point
    }
  }
}

function mouseReleased() {
  movingCircle.dragging = false;
}

function resetMovement() {
  // Reset all movement tracking variables
  movingCircle.hasEnteredBarrier = false;
  movingCircle.hasExitedBarrier = false;
  movingCircle.hasPassed = false;
  movingCircle.path = [];
  movingCircle.x = 100;
  movingCircle.y = 150;
}
