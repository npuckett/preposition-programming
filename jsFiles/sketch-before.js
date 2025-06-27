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

function setup() {
  createCanvas(400, 300).parent('canvas');
  
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

function draw() {
  background(240, 248, 255);
  
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
      // Move toward target using lerp() function
      // lerp(start, stop, amount) - amount of 0.1 = move 10% closer each frame
      obstacle.x = lerp(obstacle.x, obstacle.targetX, 0.1);
      obstacle.y = lerp(obstacle.y, obstacle.targetY, 0.1);
      
      // Check if close enough
      let distance = dist(obstacle.x, obstacle.y, obstacle.targetX, obstacle.targetY);
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
  stroke(200);
  strokeWeight(2);
  line(50, 150, 370, 150);
}

function drawObstacles() {
  // for...of loop: goes through each obstacle one by one
  // Same as saying "for each obstacle in the obstacles array"
  for (let obstacle of obstacles) {
    // Choose color based on state
    if (obstacle.hasCleared) {
      fill(100, 200, 100); // Green when cleared
    } else if (isClearing) {
      fill(255, 200, 0); // Yellow when moving
    } else {
      fill(200, 100, 100); // Red when blocking
    }
    
    noStroke();
    ellipse(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
  }
}

function drawCircle() {
  // Choose circle color
  if (isMoving) {
    fill(70, 130, 180); // Blue when moving
  } else {
    fill(150); // Gray when waiting
  }
  
  noStroke();
  ellipse(circle.x, circle.y, circle.size, circle.size);
}

function drawTrail() {
  // Draw simple trail dots
  fill(70, 130, 180, 150);
  noStroke();
  for (let i = 0; i < trail.length; i++) {
    let size = map(i, 0, trail.length - 1, 2, 8);
    ellipse(trail[i].x, trail[i].y, size, size);
  }
}

function drawStatus() {
  fill(60);
  textAlign(CENTER);
  textSize(14);
  
  if (!isClearing && !isMoving) {
    text("Click to start - obstacles must clear BEFORE main movement", width/2, height - 20);
  } else if (isClearing) {
    let cleared = 0;
    // Count cleared obstacles using for...of loop
    // This checks each obstacle to see if it's cleared
    for (let obstacle of obstacles) {
      if (obstacle.hasCleared) cleared++;
    }
    text(`Obstacles clearing path BEFORE movement (${cleared}/4 cleared)`, width/2, height - 20);
  } else if (isMoving) {
    text("Path clear! Circle moving after obstacles cleared", width/2, height - 20);
  } else {
    text("Sequence complete - click to restart", width/2, height - 20);
  }
}

function mousePressed() {
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
      obstacles[i].targetX = random(50, 350);
      obstacles[i].targetY = random() < 0.5 ? random(20, 80) : random(220, 280);
    }
  }
}

// Helper functions for cross-platform input handling
function getInputX() {
  return touches.length > 0 ? touches[0].x : mouseX;
}

function getInputY() {
  return touches.length > 0 ? touches[0].y : mouseY;
}

// Handle touch events for mobile
function touchStarted() {
  mousePressed();
  return false; // Prevent default touch behavior
}
