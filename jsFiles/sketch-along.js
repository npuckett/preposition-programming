/*
 * P5.js Sketch: ALONG – Path Following and Trajectory
 *
 * CONCEPT:
 * "Along" means following the length or direction of something, such as a path or line.
 * In this sketch, a circle moves along a curved path, visually demonstrating the preposition.
 *
 * LEARNING OBJECTIVES:
 * • Understand path following and trajectory
 * • Practice array-based path storage and interpolation
 * • Explore animation along custom paths
 * • Visualize movement history and trails
 *
 * KEY VARIABLES & METHODS:
 * • pathPoints: array of points defining the path
 * • movingCircle: object storing position and radius
 * • pathProgress: current position along the path
 * • isMoving, hasCompleted: animation state flags
 * • trail[]: array to store movement history
 *
 * EXTENSION IDEAS:
 * • Multiple moving objects along the same or different paths
 * • Dynamic path editing or drawing
 * • Variable speed or direction changes
 *
 * INTERACTION:
 * • Click to start or reset the movement along the path
 */

// P5.js Sketch: Preposition "Along"
// This sketch demonstrates the concept of "along" through path following
// The circle moves along a curved path, following its shape

// Path configuration
let pathPoints = [];
let movingCircle = {
  x: 0,           // Current x position
  y: 0,           // Current y position
  radius: 12      // Circle radius
};

// Animation control
let pathProgress = 0;       // Current position along path (0 to pathPoints.length-1)
let isMoving = false;       // Whether circle is moving
let hasCompleted = false;   // Whether path traversal is complete
let trail = [];             // Trail showing movement history

function setup() {
  createCanvas(400, 300).parent('canvas');
  
  // Create a curved path using sine wave
  // This creates an interesting winding path to follow
  for (let i = 0; i <= 100; i++) {
    let x = map(i, 0, 100, 50, 350);                    // X from left to right
    let y = 150 + sin(map(i, 0, 100, 0, TWO_PI * 2)) * 60; // Y as sine wave
    pathPoints.push({x: x, y: y});
  }
  
  // Set initial position at start of path
  movingCircle.x = pathPoints[0].x;
  movingCircle.y = pathPoints[0].y;
}

function draw() {
  background(240);
  
  // Update position along path
  if (isMoving && pathProgress < pathPoints.length - 1) {
    pathProgress += 0.8; // Speed along path
    
    // Get current and next points for interpolation
    let currentIndex = Math.floor(pathProgress);
    let nextIndex = Math.min(currentIndex + 1, pathPoints.length - 1);
    let t = pathProgress - currentIndex; // Interpolation factor
    
    // Smoothly interpolate between path points
    movingCircle.x = lerp(pathPoints[currentIndex].x, pathPoints[nextIndex].x, t);
    movingCircle.y = lerp(pathPoints[currentIndex].y, pathPoints[nextIndex].y, t);
    
    // Add current position to trail
    trail.push({x: movingCircle.x, y: movingCircle.y});
    
    // Limit trail length for performance
    if (trail.length > 150) {
      trail.shift(); // Remove oldest point
    }
  } else if (pathProgress >= pathPoints.length - 1 && isMoving) {
    // Movement complete
    isMoving = false;
    hasCompleted = true;
  }
  
  // Draw the path that will be followed
  stroke(150, 150, 150);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < pathPoints.length; i++) {
    vertex(pathPoints[i].x, pathPoints[i].y);
  }
  endShape();
  
  // Draw path markers (dots along the path)
  fill(180, 180, 180);
  noStroke();
  for (let i = 0; i < pathPoints.length; i += 5) { // Every 5th point
    ellipse(pathPoints[i].x, pathPoints[i].y, 4, 4);
  }
  
  // Draw the trail showing where circle has moved
  if (trail.length > 1) {
    stroke(255, 200, 0, 150); // Semi-transparent yellow
    strokeWeight(4);
    noFill();
    beginShape();
    for (let i = 0; i < trail.length; i++) {
      vertex(trail[i].x, trail[i].y);
    }
    endShape();
  }
  
  // Draw direction arrow showing movement along path
  if (isMoving && pathProgress < pathPoints.length - 2) {
    let currentIndex = Math.floor(pathProgress);
    let nextIndex = Math.min(currentIndex + 5, pathPoints.length - 1); // Look ahead
    
    drawArrow(pathPoints[currentIndex].x, pathPoints[currentIndex].y,
             pathPoints[nextIndex].x, pathPoints[nextIndex].y);
  }
  
  // Draw start and end markers
  fill(100, 255, 100); // Green start
  noStroke();
  ellipse(pathPoints[0].x, pathPoints[0].y, 16, 16);
  fill(0);
  textAlign(CENTER);
  textSize(10);
  text("START", pathPoints[0].x, pathPoints[0].y - 15);
  
  fill(255, 100, 100); // Red end
  noStroke();
  ellipse(pathPoints[pathPoints.length-1].x, pathPoints[pathPoints.length-1].y, 16, 16);
  fill(0);
  text("END", pathPoints[pathPoints.length-1].x, pathPoints[pathPoints.length-1].y - 15);
  
  // Draw the moving circle
  if (hasCompleted) {
    fill(100, 255, 100); // Green when complete
    stroke(50, 200, 50);
  } else {
    fill(255, 200, 100); // Yellow when moving
    stroke(255, 150, 0);
  }
  strokeWeight(2);
  ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
  
  // Circle label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Moving Circle", movingCircle.x, movingCircle.y - 30);
  
  // Determine relationship status
  let relationship = "";
  if (isMoving) {
    relationship = "Circle is moving ALONG the path";
  } else if (hasCompleted) {
    relationship = "Circle has traveled ALONG the entire path";
  } else {
    relationship = "Click to move circle ALONG the path";
  }
  
  // Remove measurement information and reset button for cleaner design
  
  // Draw relationship status
  textAlign(CENTER);
  textSize(14);
  fill(0);
  
  let statusText = "";
  if (movingCircle.isMoving) {
    statusText = "Circle is moving ALONG the path";
  } else {
    statusText = "Click anywhere to start movement along path";
  }
  
  text(statusText, width/2, height - 20);
}

// Function to draw direction arrow
function drawArrow(fromX, fromY, toX, toY) {
  let angle = atan2(toY - fromY, toX - fromX);
  
  stroke(100, 200, 100);
  strokeWeight(2);
  
  // Draw arrow head
  let arrowSize = 8;
  let arrowX = fromX + cos(angle) * 20; // Position arrow along path
  let arrowY = fromY + sin(angle) * 20;
  
  line(arrowX, arrowY, 
       arrowX - cos(angle - 0.5) * arrowSize, 
       arrowY - sin(angle - 0.5) * arrowSize);
  line(arrowX, arrowY, 
       arrowX - cos(angle + 0.5) * arrowSize, 
       arrowY - sin(angle + 0.5) * arrowSize);
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
  
  // Check if reset button was clicked/touched
  if (inputX > 10 && inputX < 70 && inputY > 75 && inputY < 100) {
    // Reset to initial state
    pathProgress = 0;
    isMoving = false;
    hasCompleted = false;
    movingCircle.x = pathPoints[0].x;
    movingCircle.y = pathPoints[0].y;
    trail = [];
    return;
  }
  
  // Start movement along path
  if (!isMoving && !hasCompleted) {
    isMoving = true;
    trail = []; // Clear previous trail
  } else if (hasCompleted) {
    // If completed, reset and start again
    pathProgress = 0;
    isMoving = true;
    hasCompleted = false;
    movingCircle.x = pathPoints[0].x;
    movingCircle.y = pathPoints[0].y;
    trail = [];
  }
}

// Handle mouse clicks
function mousePressed() {
  handleInputStart();
}

// Handle touch events for mobile
function touchStarted() {
  handleInputStart();
  return false; // Prevent default touch behavior
}

/*
EDUCATIONAL NOTES:

1. PATH FOLLOWING:
   - Path is defined as series of connected points
   - Object moves from point to point in sequence
   - Smooth interpolation between points creates fluid movement

2. PROGRESS TRACKING:
   - Progress variable tracks position along entire path
   - Can be used for percentage completion calculations
   - Allows for variable speed movement

3. INTERPOLATION:
   - lerp() creates smooth movement between discrete points
   - Prevents jerky movement on curved paths
   - Essential for natural-looking path following

4. TRAIL VISUALIZATION:
   - Shows the exact path taken by the moving object
   - Demonstrates adherence to the predefined route
   - Visual proof of "along" relationship

5. PATH CREATION:
   - Mathematical functions (sine wave) create interesting paths
   - Points can be calculated or manually defined
   - Flexibility allows for any shape or route

This pattern can be adapted for other "along" scenarios like:
- Character following a road or river
- Cursor moving along UI elements
- Data flowing through a network path
- Animation following a motion path
- Game objects on rails or tracks
*/
