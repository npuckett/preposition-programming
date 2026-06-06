import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
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
 * • p.dist(), p.atan2(), p.cos(), p.sin(): P5.js math functions for movement and drawing
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

// Source p.point (where the user clicks)
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

p.setup = function() {
// Set initial position for the circle
  movingCircle.x = p.width / 2;
  movingCircle.y = p.height / 2;
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Calculate distance and direction from source to circle
  let distance = p.dist(movingCircle.x, movingCircle.y, source.x, source.y);
  
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
    if (newX > 20 && newX < p.width - 20 && 
        newY > 20 && newY < p.height - 20) {
      
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
    p.stroke(255, 200, 0, 100); // Semi-transparent yellow
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < trail.length; i++) {
      p.vertex(trail[i].x, trail[i].y);
    }
    p.endShape();
  }
  
  // Draw direction line from source to circle
  if (movingCircle.isMoving && source.visible && distance > 5) {
    p.stroke(200, 100, 100, 150); // Semi-transparent red
    p.strokeWeight(1);
    p.line(source.x, source.y, movingCircle.x, movingCircle.y);
    
    // Draw arrow showing direction away from source
    drawArrow(source.x, source.y, movingCircle.x, movingCircle.y);
  }
  
  // Draw maximum distance circle
  if (source.visible) {
    p.stroke(150, 150, 150, 100);
    p.strokeWeight(1);
    p.noFill();
    p.ellipse(source.x, source.y, maxDistance * 2, maxDistance * 2);
  }
  
  // Draw the source point
  if (source.visible) {
    p.fill(255, 100, 100, 200); // Red with transparency
    p.stroke(200, 50, 50);
    p.strokeWeight(2);
    p.ellipse(source.x, source.y, 20, 20);
    
    // Draw crosshairs on source
    p.stroke(200, 50, 50);
    p.strokeWeight(1);
    p.line(source.x - 10, source.y, source.x + 10, source.y);
    p.line(source.x, source.y - 10, source.x, source.y + 10);
    
    // Draw ripple effect around source
    p.noFill();
    p.stroke(200, 100, 100, 60);
    for (let i = 1; i <= 3; i++) {
      p.ellipse(source.x, source.y, i * 12, i * 12);
    }
  }
  
  // Draw the moving circle
  p.fill(255, 200, 100); // Yellow
  p.stroke(255, 150, 0);  // Orange border
  p.strokeWeight(2);
  p.ellipse(movingCircle.x, movingCircle.y, 25, 25);
  
  // Draw labels
  p.fill(...PALETTE.ink);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(12);
  p.text("Moving Circle", movingCircle.x, movingCircle.y - 20);
  
  if (source.visible) {
    p.text("Source Point", source.x, source.y + 20);
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
  
  // Remove measurement information and reset button for cleaner design
  
  // Draw relationship status
  p.textAlign(CENTER);
  p.textSize(14);
  p.fill(...PALETTE.ink);
  
  let statusText = "";
  if (movingCircle.isMoving) {
    statusText = "Circle is moving AWAY from the source point";
  } else {
    statusText = "Click anywhere to set source - circle will move away";
  }
  
  p.text(statusText, p.width/2, p.height - 20);
}

// Function to draw an arrow showing direction
function drawArrow(fromX, fromY, toX, toY) {
  let angle = p.atan2(toY - fromY, toX - fromX);
  let distance = p.dist(fromX, fromY, toX, toY);
  
  // Only draw arrow if there's enough distance
  if (distance > 30) {
    // Position arrow head at the moving circle
    let arrowX = toX;
    let arrowY = toY;
    
    p.stroke(200, 100, 100);
    p.strokeWeight(2);
    
    // Draw arrow head lines
    let arrowSize = 8;
    p.line(arrowX, arrowY, 
         arrowX - p.cos(angle - 0.5) * arrowSize, 
         arrowY - p.sin(angle - 0.5) * arrowSize);
    p.line(arrowX, arrowY, 
         arrowX - p.cos(angle + 0.5) * arrowSize, 
         arrowY - p.sin(angle + 0.5) * arrowSize);
  }
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
p.mousePressed = function() {
  handleInputStart();
}

// Handle touch events for mobile
p.touchStarted = function() {
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
   - p.dist() function calculates Euclidean distance between two points

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

}
