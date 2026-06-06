import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
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
 * • Explore smooth animation with p.lerp()
 * 
 * KEY VARIABLES & METHODS:
 * • p.lerp(start, stop, amount) - Smooth movement
 * • p.dist() - Check if close enough to "land"
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
  p.width: 150,
  p.height: 20
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

p.setup = function() {
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Update animation
  if (isAnimating) {
    animationProgress += 0.02; // Speed of movement
      // Smooth movement using lerp
    circle.x = p.lerp(circle.startX, circle.targetX, animationProgress);
    circle.y = p.lerp(80, circle.targetY, animationProgress);
    
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
  p.fill(0, 0, 0, 30);
  p.noStroke();
  p.ellipse(surface.x + surface.width/2, surface.y + surface.height + 8, surface.width + 20, 8);
  
  // Main surface
  p.fill(100, 150, 255);
  p.stroke(70, 120, 200);
  p.strokeWeight(2);
  p.rect(surface.x, surface.y, surface.width, surface.height, 5);
  
  // Surface label
  p.fill(255);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(12);
  p.text("SURFACE", surface.x + surface.width/2, surface.y + surface.height/2 + 4);
}

function drawCircle() {
  // Circle appearance changes based on state
  if (circle.isOnSurface) {
    p.fill(100, 255, 100); // Green when successfully placed onto surface
    p.stroke(50, 200, 50);
  } else if (isAnimating) {
    p.fill(255, 200, 0); // Yellow when moving onto surface
    p.stroke(255, 150, 0);
  } else {
    p.fill(255, 150, 100); // Orange when waiting
    p.stroke(200, 100, 50);
  }
  
  p.strokeWeight(3);
  p.ellipse(circle.x, circle.y, circle.size, circle.size);
  
  // Movement arrow when animating
  if (isAnimating) {
    p.stroke(255, 100, 100);
    p.strokeWeight(2);
    let arrowX = circle.targetX - circle.x;
    let arrowY = circle.targetY - circle.y;
    let arrowLength = 25;
    
    if (p.dist(0, 0, arrowX, arrowY) > 5) {
      let normalized = arrowLength / p.dist(0, 0, arrowX, arrowY);
      arrowX *= normalized;
      arrowY *= normalized;
      
      p.line(circle.x, circle.y, circle.x + arrowX, circle.y + arrowY);
      
      // Simple arrowhead
      p.push();
      p.translate(circle.x + arrowX, circle.y + arrowY);
      p.rotate(p.atan2(arrowY, arrowX));
      p.fill(255, 100, 100);
      p.noStroke();
      p.triangle(0, 0, -8, -3, -8, 3);
      p.pop();
    }
  }
}

function drawInfo() {
  // Simple status text at bottom
  p.fill(...PALETTE.ink);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(14);
  
  let statusText = "";
  if (circle.isOnSurface) {
    statusText = "Circle moved ONTO the surface";
  } else if (isAnimating) {
    statusText = "Circle is moving ONTO the surface";
  } else {
    statusText = "Click to move circle ONTO the surface";
  }
  
  p.text(statusText, p.width/2, p.height - 20);
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
  
  // Only start animation if click is above the surface
  // Allow restarting if circle is already on surface or if not currently animating
  if (inputY < surface.y - circle.size/2 && (circle.isOnSurface || !isAnimating)) {
    // Set starting position to click location
    circle.startX = inputX;
    circle.x = inputX;
    circle.y = inputY;
    
    // Reset animation state
    circle.isOnSurface = false;
    animationProgress = 0;
    isAnimating = true;
  }
}

p.mousePressed = function() {
  handleInputStart();
}

// Handle touch events for mobile
p.touchStarted = function() {
  handleInputStart();
  return false; // Prevent default touch behavior
}

}
