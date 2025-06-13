// P5.js Sketch: Preposition "Across"
// This sketch demonstrates the concept of "across" through crossing movement
// The circle moves across a barrier from one side to the other

// Barrier that will be crossed
let barrier = {
  x: 180,        // X position of barrier
  y: 50,         // Y position of barrier
  width: 40,     // Width of barrier
  height: 200    // Height of barrier
};

// Start and end points for crossing
let startPoint = { x: 50, y: 150 };
let endPoint = { x: 350, y: 150 };

// Moving circle that crosses the barrier
let movingCircle = {
  x: 50,         // Current x position
  y: 150,        // Current y position
  radius: 15     // Radius of circle
};

// Animation control variables
let progress = 0;           // How far across (0 to 1)
let isMoving = false;       // Whether currently moving
let hasCrossed = false;     // Whether crossing is complete
let crossingPath = [];      // Trail of movement

function setup() {
  createCanvas(400, 300);
  
  // Set initial position
  movingCircle.x = startPoint.x;
  movingCircle.y = startPoint.y;
}

function draw() {
  background(240);
  
  // Update position based on progress
  if (isMoving && progress < 1) {
    progress += 0.015; // Speed of crossing
    
    // Use lerp to interpolate between start and end points
    movingCircle.x = lerp(startPoint.x, endPoint.x, progress);
    movingCircle.y = lerp(startPoint.y, endPoint.y, progress);
    
    // Add current position to crossing path trail
    crossingPath.push({x: movingCircle.x, y: movingCircle.y});
    
    // Limit trail length for performance
    if (crossingPath.length > 100) {
      crossingPath.shift(); // Remove oldest point
    }
  } else if (progress >= 1 && isMoving) {
    // Crossing complete
    isMoving = false;
    hasCrossed = true;
  }
  
  // Draw crossing path trail
  if (crossingPath.length > 1) {
    stroke(255, 200, 0, 150); // Semi-transparent yellow
    strokeWeight(3);
    noFill();
    beginShape();
    for (let point of crossingPath) {
      vertex(point.x, point.y);
    }
    endShape();
  }
  
  // Draw full crossing line (start to end)
  stroke(200, 200, 200, 100);
  strokeWeight(2);
  line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
  
  // Draw the barrier being crossed
  fill(100, 150, 255, 100); // Semi-transparent blue
  stroke(100, 150, 255);
  strokeWeight(3);
  rect(barrier.x, barrier.y, barrier.width, barrier.height);
  
  // Check if circle is currently crossing the barrier
  let isCrossingBarrier = (movingCircle.x > barrier.x && 
                          movingCircle.x < barrier.x + barrier.width);
  
  // Draw start and end markers
  fill(100, 255, 100); // Green start
  noStroke();
  ellipse(startPoint.x, startPoint.y, 12, 12);
  
  fill(255, 100, 100); // Red end
  ellipse(endPoint.x, endPoint.y, 12, 12);
  
  // Draw the moving circle with different colors based on state
  if (isCrossingBarrier) {
    fill(255, 150, 255); // Magenta when crossing barrier
    stroke(200, 100, 200);
  } else if (hasCrossed) {
    fill(100, 255, 100); // Green when crossed
    stroke(50, 200, 50);
  } else {
    fill(255, 200, 100); // Yellow default
    stroke(255, 150, 0);
  }
  
  strokeWeight(2);
  ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
  
  // Draw labels
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Start", startPoint.x, startPoint.y - 15);
  text("End", endPoint.x, endPoint.y - 15);
  text("Barrier", barrier.x + barrier.width/2, barrier.y - 10);
  text("Moving Circle", movingCircle.x, movingCircle.y - 25);
  
  // Determine relationship status
  let relationship = "";
  if (isMoving && isCrossingBarrier) {
    relationship = "Circle is moving ACROSS the barrier";
  } else if (isMoving && !isCrossingBarrier) {
    relationship = "Circle is approaching/leaving the barrier";
  } else if (hasCrossed) {
    relationship = "Circle has moved ACROSS to the other side";
  } else {
    relationship = "Click to move circle ACROSS the barrier";
  }
  
  // Draw measurement information
  textAlign(LEFT);
  textSize(10);
  fill(0);
  text("Progress: " + Math.round(progress * 100) + "%", 10, 20);
  text("Position: (" + Math.round(movingCircle.x) + ", " + Math.round(movingCircle.y) + ")", 10, 35);
  text("Crossing barrier: " + isCrossingBarrier, 10, 50);
  text("Has crossed: " + hasCrossed, 10, 65);
  
  // Draw reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(10, 75, 60, 25);
  fill(0);
  noStroke();
  textAlign(CENTER);
  text("Reset", 40, 92);
  
  // Draw relationship status
  textAlign(CENTER);
  textSize(16);
  fill(0);
  text(relationship, width/2, height - 30);
  text("Click anywhere to start crossing", width/2, height - 15);
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
    progress = 0;
    isMoving = false;
    hasCrossed = false;
    movingCircle.x = startPoint.x;
    movingCircle.y = startPoint.y;
    crossingPath = [];
    return;
  }
  
  // Start the crossing animation
  if (!isMoving && !hasCrossed) {
    isMoving = true;
    crossingPath = []; // Clear previous trail
  } else if (hasCrossed) {
    // Reset and start again
    progress = 0;
    isMoving = true;
    hasCrossed = false;
    movingCircle.x = startPoint.x;
    movingCircle.y = startPoint.y;
    crossingPath = [];
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

1. LINEAR INTERPOLATION:
   - lerp(start, end, amount) smoothly transitions between two values
   - amount ranges from 0 (start) to 1 (end)
   - Perfect for creating smooth crossing animations

2. CROSSING DETECTION:
   - Check if object's position overlaps with barrier boundaries
   - Can be extended to detect multiple crossing zones
   - Useful for collision detection and boundary events

3. PROGRESS TRACKING:
   - Use a progress variable (0 to 1) to track completion
   - Allows for easy percentage calculations
   - Can be used to trigger events at specific crossing points

4. VISUAL FEEDBACK:
   - Different colors show different states (approaching, crossing, crossed)
   - Trail shows the path of movement
   - Status text explains what's happening

5. STATE MANAGEMENT:
   - Boolean flags control animation state
   - Prevents unwanted state changes during animation
   - Clean reset functionality

This pattern can be adapted for other "across" scenarios like:
- Character crossing a bridge
- Data flowing across a network
- Objects moving across screen boundaries
- Vehicles crossing intersections
*/
