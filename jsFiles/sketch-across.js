// P5.js Sketch: Preposition "Across"
// This sketch demonstrates "across" as moving from one side of a space to the other
// Like walking across a room from one wall to the opposite wall

// Room boundaries
let room = {
  x: 50,         // Left wall
  y: 80,         // Top wall
  width: 300,    // Room width
  height: 140    // Room height
};

// Start and end points for crossing the room
let startPoint = { x: 70, y: 150 };
let endPoint = { x: 330, y: 150 };

// Moving circle that crosses from one side of the room to the other
let movingCircle = {
  x: 70,         // Current x position  
  y: 150,        // Current y position
  radius: 15     // Radius of circle
};

// Animation control variables
let progress = 0;           // How far across the room (0 to 1)
let isMoving = false;       // Whether currently moving
let hasCrossed = false;     // Whether crossing is complete
let crossingPath = [];      // Trail of movement

function setup() {
  createCanvas(400, 300).parent('canvas');
  
  // Set initial position
  movingCircle.x = startPoint.x;
  movingCircle.y = startPoint.y;
}

function draw() {
  background(240);
  
  // Update position based on progress
  if (isMoving && progress < 1) {
    progress += 0.02; // Speed of crossing the room
    
    // Use lerp to interpolate between start and end points
    movingCircle.x = lerp(startPoint.x, endPoint.x, progress);
    movingCircle.y = lerp(startPoint.y, endPoint.y, progress);
    
    // Add current position to crossing path trail
    crossingPath.push({x: movingCircle.x, y: movingCircle.y});
    
    // Limit trail length for performance
    if (crossingPath.length > 80) {
      crossingPath.shift(); // Remove oldest point
    }
  } else if (progress >= 1 && isMoving) {
    // Crossing complete
    isMoving = false;
    hasCrossed = true;
  }
  
  // Draw crossing path trail
  if (crossingPath.length > 1) {
    stroke(255, 200, 0, 150); // Semi-transparent yellow trail
    strokeWeight(3);
    noFill();
    beginShape();
    for (let point of crossingPath) {
      vertex(point.x, point.y);
    }
    endShape();
  }
  
  // Draw the room
  fill(240, 240, 255); // Light blue room interior
  stroke(100, 100, 150);
  strokeWeight(3);
  rect(room.x, room.y, room.width, room.height);
  
  // Draw room labels
  fill(100, 100, 150);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Room", room.x + room.width/2, room.y - 10);
  
  // Draw start and end markers
  fill(100, 255, 100); // Green start
  noStroke();
  ellipse(startPoint.x, startPoint.y, 12, 12);
  
  fill(255, 100, 100); // Red end
  ellipse(endPoint.x, endPoint.y, 12, 12);
  
  // Draw the moving circle with different colors based on progress
  if (hasCrossed) {
    fill(100, 255, 100); // Green when successfully crossed room
    stroke(50, 200, 50);
  } else if (isMoving) {
    fill(255, 255, 100); // Yellow when moving across
    stroke(200, 200, 0);
  } else {
    fill(255, 150, 100); // Orange when at start
    stroke(200, 100, 50);
  }
  
  strokeWeight(2);
  ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
  
  // Draw simple labels
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Start", startPoint.x, startPoint.y + 25);
  text("End", endPoint.x, endPoint.y + 25);
  
  // Simple status text at bottom
  textAlign(CENTER);
  textSize(14);
  
  let statusText = "";
  if (hasCrossed) {
    statusText = "Circle moved ACROSS the room";
  } else if (isMoving) {
    statusText = "Circle is moving ACROSS the room";
  } else {
    statusText = "Click to move circle ACROSS the room";
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
  
  // Start the crossing animation or reset if already completed
  if (!isMoving) {
    // Reset to initial state and start
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
