/**
 * P5.js Sketch: ONTO - Simple Placement
 * 
 * CONCEPT: "Onto" represents movement that ends with an object being placed
 * on top of a surface. This shows the transition from "off" to "on".
 * 
 * LEARNING OBJECTIVES:
 * • Understand simple movement ending with placement
 * • Practice basic collision detection
 * • Learn state changes (moving → placed)
 * • Explore smooth animation with lerp()
 * 
 * KEY VARIABLES & METHODS:
 * • lerp(start, stop, amount) - Smooth movement
 * • dist() - Check if close enough to "land"
 * • Boolean states for tracking placement
 * 
 * EXTENSION IDEAS:
 * • Multiple objects to place onto surface
 * • Different shaped surfaces
 * • Drag and drop interaction
 * • Sound effects when placement occurs
 */

// Simple surface to place objects onto
let surface = {
  x: 150,
  y: 200,
  width: 150,
  height: 20
};

// Object that moves onto the surface
let circle = {
  x: 80,
  y: 80,
  startX: 80,    // Starting X position (will be randomized)
  size: 30,
  targetX: 225,  // Center of surface
  targetY: 185,  // On top of surface (surface.y - circle.size/2 - 5)
  isOnSurface: false
};

let animationProgress = 0;
let isAnimating = false;

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240, 248, 255);
  
  // Update animation
  if (isAnimating) {
    animationProgress += 0.02; // Speed of movement
      // Smooth movement using lerp
    circle.x = lerp(circle.startX, circle.targetX, animationProgress);
    circle.y = lerp(80, circle.targetY, animationProgress);
    
    // Check if animation is complete
    if (animationProgress >= 1) {
      isAnimating = false;
      circle.isOnSurface = true;
      animationProgress = 1;
    }
  }
  
  // Draw surface
  drawSurface();
  
  // Draw the moving circle
  drawCircle();
  
  // Draw instructions and status
  drawInfo();
}

function drawSurface() {
  // Surface shadow
  fill(0, 0, 0, 30);
  noStroke();
  ellipse(surface.x + surface.width/2, surface.y + surface.height + 8, surface.width + 20, 8);
  
  // Main surface
  fill(100, 150, 255);
  stroke(70, 120, 200);
  strokeWeight(2);
  rect(surface.x, surface.y, surface.width, surface.height, 5);
  
  // Surface label
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("SURFACE", surface.x + surface.width/2, surface.y + surface.height/2 + 4);
}

function drawCircle() {
  // Circle appearance changes based on state
  if (circle.isOnSurface) {
    fill(100, 255, 100); // Green when successfully placed onto surface
    stroke(50, 200, 50);
  } else if (isAnimating) {
    fill(255, 200, 0); // Yellow when moving onto surface
    stroke(255, 150, 0);
  } else {
    fill(255, 150, 100); // Orange when waiting
    stroke(200, 100, 50);
  }
  
  strokeWeight(3);
  ellipse(circle.x, circle.y, circle.size, circle.size);
  
  // Movement arrow when animating
  if (isAnimating) {
    stroke(255, 100, 100);
    strokeWeight(2);
    let arrowX = circle.targetX - circle.x;
    let arrowY = circle.targetY - circle.y;
    let arrowLength = 25;
    
    if (dist(0, 0, arrowX, arrowY) > 5) {
      let normalized = arrowLength / dist(0, 0, arrowX, arrowY);
      arrowX *= normalized;
      arrowY *= normalized;
      
      line(circle.x, circle.y, circle.x + arrowX, circle.y + arrowY);
      
      // Simple arrowhead
      push();
      translate(circle.x + arrowX, circle.y + arrowY);
      rotate(atan2(arrowY, arrowX));
      fill(255, 100, 100);
      noStroke();
      triangle(0, 0, -8, -3, -8, 3);
      pop();
    }
  }
}

function drawInfo() {
  fill(50);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  
  if (circle.isOnSurface) {
    fill(0, 150, 0);
    text("Circle is now ONTO the surface!", width/2, 40);
    text("Click to reset and try again", width/2, height - 30);
  } else if (isAnimating) {
    fill(0, 0, 150);
    text("Circle is moving ONTO the surface...", width/2, 40);
    text(`Progress: ${(animationProgress * 100).toFixed(0)}%`, width/2, height - 30);
  } else {
    text("Click to move the circle ONTO the surface", width/2, 40);
    text("Watch it move from OFF to ON", width/2, height - 30);
  }
  
  // Simple status
  textAlign(LEFT);
  textSize(12);
  fill(100);
  text(`Status: ${circle.isOnSurface ? "ON surface" : "OFF surface"}`, 20, height - 60);
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
  // Start or reset the animation
  if (circle.isOnSurface || !isAnimating) {
    // Randomize starting X position (but keep some margin from edges)
    circle.startX = random(40, width - 40);
    
    // Reset to new starting position
    circle.x = circle.startX;
    circle.y = 80;
    circle.isOnSurface = false;
    animationProgress = 0;
    isAnimating = true;
  }
}

function mousePressed() {
  handleInputStart();
}

// Handle touch events for mobile
function touchStarted() {
  handleInputStart();
  return false; // Prevent default touch behavior
}
