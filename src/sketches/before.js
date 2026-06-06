import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/**
 * P5.js Sketch: BEFORE - Clearing the Path
 * 
 * CONCEPT: "Before" means occurring earlier than a reference event.
 * This shows objects moving out of the way before a main movement
 * can begin, demonstrating that one action must complete before another.
 * 
 * LEARNING OBJECTIVES:
 * • Understand temporal sequence and prerequisites
 * • Practice staged movement dependencies
 * • Learn automatic sequencing in single interaction
 * • Explore spatial representation of "before" relationships
 * 
 * KEY VARIABLES & METHODS:
 * • obstacles - objects that must move before main action
 * • circle - waits until path is clear
 * • for...of loop - goes through each item in an array
 * • Automatic progression from clearing to movement
 * 
 * LOOP EXPLANATIONS:
 * • for...of loop: "for (let item of array)" - gives you each item directly
 * • Traditional for loop: "for (let i = 0; i < array.length; i++)" - uses index numbers
 * • for...of is easier when you just need to work with each item
 * • Traditional for is better when you need the index number (position)
 * 
 * EXTENSION IDEAS:
 * • Multiple obstacles with different clear times
 * • Different path clearing patterns
 * • Multiple main movers waiting for different prerequisites
 */

// Simple state tracking
let isClearing = false;
let isMoving = false;

// Objects that block the path
let obstacles = [];

// Main circle that waits
let circle = {
  x: 50,
  y: 150,
  size: 15,
  speed: 3
};

// Trail dots
let trail = [];

p.setup = function() {
// Create 4 obstacles in the path
  for (let i = 0; i < 4; i++) {
    // Create a single obstacle object with a clear name
    let newObstacle = {
      x: 120 + (i * 60),
      y: 150,
      targetX: 0,
      targetY: 0,
      speed: 2,
      size: 12,
      isMoving: false,
      hasCleared: false
    };
    
    // Add the named obstacle to the array
    obstacles.push(newObstacle);
  }
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Move obstacles if clearing
  if (isClearing) {
    moveObstacles();
  }
  
  // Move main circle if moving
  if (isMoving) {
    moveCircle();
  }
  
  // Draw everything
  drawPath();
  drawObstacles();
  drawCircle();
  drawTrail();
  drawStatus();
}

function moveObstacles() {
  let allCleared = true;
  
  // Move each obstacle using for...of loop
  // This loop goes through each item in the obstacles array
  // "obstacle" is the current item we're working with
  for (let obstacle of obstacles) {
    if (!obstacle.hasCleared) {
      // Move toward target using p.lerp() function
      // p.lerp(start, stop, amount) - amount of 0.1 = move 10% closer each frame
      obstacle.x = p.lerp(obstacle.x, obstacle.targetX, 0.1);
      obstacle.y = p.lerp(obstacle.y, obstacle.targetY, 0.1);
      
      // Check if close enough
      let distance = p.dist(obstacle.x, obstacle.y, obstacle.targetX, obstacle.targetY);
      if (distance < 5) {
        obstacle.hasCleared = true;
      } else {
        allCleared = false;
      }
    }
  }
  
  // Start main movement when all cleared
  if (allCleared) {
    isClearing = false;
    isMoving = true;
  }
}

function moveCircle() {
  // Add to trail
  let trailPoint = {x: circle.x, y: circle.y};
  trail.push(trailPoint);
  if (trail.length > 60) {
    trail.shift();
  }
  
  // Move circle
  circle.x += circle.speed;
  
  // Stop at edge
  if (circle.x > 370) {
    isMoving = false;
  }
}

function drawPath() {
  // Draw simple path line
  p.stroke(200);
  p.strokeWeight(2);
  p.line(50, 150, 370, 150);
}

function drawObstacles() {
  // for...of loop: goes through each obstacle one by one
  // Same as saying "for each obstacle in the obstacles array"
  for (let obstacle of obstacles) {
    // Choose color based on state
    if (obstacle.hasCleared) {
      p.fill(100, 200, 100); // Green when cleared
    } else if (isClearing) {
      p.fill(255, 200, 0); // Yellow when moving
    } else {
      p.fill(200, 100, 100); // Red when blocking
    }
    
    p.noStroke();
    p.ellipse(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
  }
}

function drawCircle() {
  // Choose circle color
  if (isMoving) {
    p.fill(70, 130, 180); // Blue when moving
  } else {
    p.fill(150); // Gray when waiting
  }
  
  p.noStroke();
  p.ellipse(circle.x, circle.y, circle.size, circle.size);
}

function drawTrail() {
  // Draw simple trail dots
  p.fill(70, 130, 180, 150);
  p.noStroke();
  for (let i = 0; i < trail.length; i++) {
    let size = p.map(i, 0, trail.length - 1, 2, 8);
    p.ellipse(trail[i].x, trail[i].y, size, size);
  }
}

function drawStatus() {
  p.fill(60);
  p.textAlign(CENTER);
  p.textSize(14);
  
  if (!isClearing && !isMoving) {
    p.text("Click to start - obstacles must clear BEFORE main movement", p.width/2, p.height - 20);
  } else if (isClearing) {
    let cleared = 0;
    // Count cleared obstacles using for...of loop
    // This checks each obstacle to see if it's cleared
    for (let obstacle of obstacles) {
      if (obstacle.hasCleared) cleared++;
    }
    p.text(`Obstacles clearing path BEFORE movement (${cleared}/4 cleared)`, p.width/2, p.height - 20);
  } else if (isMoving) {
    p.text("Path clear! Circle moving after obstacles cleared", p.width/2, p.height - 20);
  } else {
    p.text("Sequence complete - click to restart", p.width/2, p.height - 20);
  }
}

p.mousePressed = function() {
  // Check if sequence is ready to start or restart
  if (!isClearing && !isMoving) {
    // Start new sequence
    isClearing = true;
    
    // Reset circle position and trail
    circle.x = 50;
    trail = [];
    
    // Reset obstacles and set random targets using traditional for loop
    // This uses index numbers: 0, 1, 2, 3 to access each obstacle
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].x = 120 + (i * 60);
      obstacles[i].y = 150;
      obstacles[i].hasCleared = false;
      obstacles[i].targetX = p.random(50, 350);
      obstacles[i].targetY = p.random() < 0.5 ? p.random(20, 80) : p.random(220, 280);
    }
  }
}

// Helper functions for cross-platform input handling
function getInputX() {
  return p.touches.length > 0 ? p.touches[0].x : p.mouseX;
}

function getInputY() {
  return p.touches.length > 0 ? p.touches[0].y : p.mouseY;
}

// Handle touch events for mobile
p.touchStarted = function() {
  mousePressed();
  return false; // Prevent default touch behavior
}

}
