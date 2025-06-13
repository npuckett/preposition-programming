/*
 * P5.js Sketch: AWAY – Directional Repulsion
 *
 * CONCEPT:
 * "Away" means moving farther from a reference point, showing repulsion or escape.
 * In this sketch, a circle moves away from a user-selected source point, visually demonstrating the preposition.
 *
 * LEARNING OBJECTIVES:
 * • Understand vector direction and normalization
 * • Practice distance calculation and movement control
 * • Explore event-driven animation (mouse interaction)
 * • Visualize trails, boundaries, and feedback
 *
 * KEY VARIABLES & METHODS:
 * • movingCircle: object storing position, speed, and movement state
 * • source: object for the user-selected point of repulsion
 * • trail[]: array to store the path of the moving circle
 * • dist(), atan2(), cos(), sin(): P5.js math functions for movement and drawing
 *
 * EXTENSION IDEAS:
 * • Multiple circles repelled from the source
 * • Dynamic speed or acceleration based on distance
 * • Obstacles or zones affecting movement
 *
 * INTERACTION:
 * • Click anywhere to set a source point; the circle moves away from it
 * • Click the Reset button to return to the initial state
 */

// Moving object that will move away from the source
let movingCircle = {
  x: 200,        // Starting x position
  y: 150,        // Starting y position
  speed: 2,      // Movement speed in pixels per frame
  isMoving: false // Whether the circle is currently moving
};

// Source point (where the user clicks)
let source = {
  x: 100,        // Source x position
  y: 100,        // Source y position
  visible: false // Whether to show the source point
};

// Trail to show the path of movement
let trail = [];

// Movement control variables
let movementFrames = 0;      // Count frames of movement
let maxMovementFrames = 100; // Stop movement after this many frames
let maxDistance = 120;       // Maximum distance to move away

function setup() {
  createCanvas(400, 300).parent('canvas');
  
  // Set initial position for the circle
  movingCircle.x = width / 2;
  movingCircle.y = height / 2;
}

function draw() {
  background(240);
  
  // Calculate distance and direction from source to circle
  let distance = dist(movingCircle.x, movingCircle.y, source.x, source.y);
  
  // Calculate direction vector (away from source)
  // Note: dx and dy point FROM source TO circle (away direction)
  let dx = movingCircle.x - source.x;
  let dy = movingCircle.y - source.y;
  
  // Move the circle away from source if conditions are met
  if (movingCircle.isMoving && 
      movementFrames < maxMovementFrames && 
      distance < maxDistance && 
      distance > 0) {
    
    // Normalize the direction vector and apply speed
    let moveX = (dx / distance) * movingCircle.speed;
    let moveY = (dy / distance) * movingCircle.speed;
    
    // Calculate new position
    let newX = movingCircle.x + moveX;
    let newY = movingCircle.y + moveY;
    
    // Keep circle within canvas boundaries (with margin)
    if (newX > 20 && newX < width - 20 && 
        newY > 20 && newY < height - 20) {
      
      movingCircle.x = newX;
      movingCircle.y = newY;
      
      // Add current position to trail
      trail.push({x: movingCircle.x, y: movingCircle.y});
      
      // Limit trail length for performance
      if (trail.length > 50) {
        trail.shift(); // Remove oldest point
      }
      
      movementFrames++;
    } else {
      // Stop at boundaries
      movingCircle.isMoving = false;
    }
  } else if (distance >= maxDistance || movementFrames >= maxMovementFrames) {
    // Stop movement when max distance or time reached
    movingCircle.isMoving = false;
  }
  
  // Draw the movement trail
  if (trail.length > 1) {
    stroke(255, 200, 0, 100); // Semi-transparent yellow
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < trail.length; i++) {
      vertex(trail[i].x, trail[i].y);
    }
    endShape();
  }
  
  // Draw direction line from source to circle
  if (movingCircle.isMoving && source.visible && distance > 5) {
    stroke(200, 100, 100, 150); // Semi-transparent red
    strokeWeight(1);
    line(source.x, source.y, movingCircle.x, movingCircle.y);
    
    // Draw arrow showing direction away from source
    drawArrow(source.x, source.y, movingCircle.x, movingCircle.y);
  }
  
  // Draw maximum distance circle
  if (source.visible) {
    stroke(150, 150, 150, 100);
    strokeWeight(1);
    noFill();
    ellipse(source.x, source.y, maxDistance * 2, maxDistance * 2);
  }
  
  // Draw the source point
  if (source.visible) {
    fill(255, 100, 100, 200); // Red with transparency
    stroke(200, 50, 50);
    strokeWeight(2);
    ellipse(source.x, source.y, 20, 20);
    
    // Draw crosshairs on source
    stroke(200, 50, 50);
    strokeWeight(1);
    line(source.x - 10, source.y, source.x + 10, source.y);
    line(source.x, source.y - 10, source.x, source.y + 10);
    
    // Draw ripple effect around source
    noFill();
    stroke(200, 100, 100, 60);
    for (let i = 1; i <= 3; i++) {
      ellipse(source.x, source.y, i * 12, i * 12);
    }
  }
  
  // Draw the moving circle
  fill(255, 200, 100); // Yellow
  stroke(255, 150, 0);  // Orange border
  strokeWeight(2);
  ellipse(movingCircle.x, movingCircle.y, 25, 25);
  
  // Draw labels
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Moving Circle", movingCircle.x, movingCircle.y - 20);
  
  if (source.visible) {
    text("Source Point", source.x, source.y + 20);
  }
  
  // Determine relationship status
  let relationship = "";
  if (movingCircle.isMoving) {
    relationship = "Circle is moving AWAY from the source";
  } else if (distance >= maxDistance) {
    relationship = "Circle has moved far AWAY (reached max distance)";
  } else if (source.visible && !movingCircle.isMoving) {
    relationship = "Circle stopped AWAY from the source";
  } else {
    relationship = "Click to set a source point";
  }
  
  // Draw measurement information
  textAlign(LEFT);
  textSize(10);
  fill(0);
  text("Distance from source: " + Math.round(distance), 10, 20);
  text("Max distance: " + maxDistance, 10, 35);
  text("Speed: " + movingCircle.speed + " pixels/frame", 10, 50);
  text("Moving: " + movingCircle.isMoving, 10, 65);
  text("Movement frames: " + movementFrames + "/" + maxMovementFrames, 10, 80);
  
  // Draw reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(10, 90, 60, 25);
  fill(0);
  noStroke();
  textAlign(CENTER);
  text("Reset", 40, 107);
  
  // Draw relationship status
  textAlign(CENTER);
  textSize(16);
  fill(0);
  text(relationship, width/2, height - 40);
  text("Click anywhere to set a source point", width/2, height - 15);
}

// Function to draw an arrow showing direction
function drawArrow(fromX, fromY, toX, toY) {
  let angle = atan2(toY - fromY, toX - fromX);
  let distance = dist(fromX, fromY, toX, toY);
  
  // Only draw arrow if there's enough distance
  if (distance > 30) {
    // Position arrow head at the moving circle
    let arrowX = toX;
    let arrowY = toY;
    
    stroke(200, 100, 100);
    strokeWeight(2);
    
    // Draw arrow head lines
    let arrowSize = 8;
    line(arrowX, arrowY, 
         arrowX - cos(angle - 0.5) * arrowSize, 
         arrowY - sin(angle - 0.5) * arrowSize);
    line(arrowX, arrowY, 
         arrowX - cos(angle + 0.5) * arrowSize, 
         arrowY - sin(angle + 0.5) * arrowSize);
  }
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
  if (inputX > 10 && inputX < 70 && inputY > 90 && inputY < 115) {
    // Reset everything to initial state
    movingCircle.x = width / 2;
    movingCircle.y = height / 2;
    movingCircle.isMoving = false;
    source.visible = false;
    trail = [];
    movementFrames = 0;
    return;
  }
  
  // Set new source point where input was detected
  source.x = inputX;
  source.y = inputY;
  source.visible = true;
  
  // Start movement away from the source
  movingCircle.isMoving = true;
  trail = []; // Clear previous trail
  movementFrames = 0; // Reset movement counter
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

1. VECTOR MATHEMATICS:
   - Direction away: dx = currentX - sourceX, dy = currentY - sourceY
   - This gives us a vector pointing FROM source TO current position
   - Moving along this vector takes us further away from the source

2. DISTANCE AND MOVEMENT:
   - We normalize the direction vector by dividing by distance
   - Then multiply by speed to get a consistent movement rate
   - dist() function calculates Euclidean distance between two points

3. BOUNDARY HANDLING:
   - Check new position against canvas bounds before moving
   - Stop movement if circle would go outside the safe area
   - Alternatively, could implement bouncing or wrapping

4. MOVEMENT CONTROL:
   - Use frame counting to limit how long movement continues
   - Use maximum distance to create a "repulsion zone"
   - Boolean flags control when movement should occur

5. VISUAL FEEDBACK:
   - Trail shows the path of movement
   - Direction line and arrow show the "away" relationship
   - Status text explains what's happening

This pattern can be adapted for other "away" scenarios like:
- Multiple objects repelling each other
- Particles fleeing from a mouse cursor
- Enemies avoiding the player character
- Objects escaping from a danger zone
*/
