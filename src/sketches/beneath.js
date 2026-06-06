import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/*
 * P5.js Sketch: BENEATH – Simple Surface and Object
 *
 * CONCEPT:
 * "Beneath" means positioned directly below something else, typically with close proximity.
 * The blue surface is wide and thin, and the orange object can be positioned beneath it.
 *
 * INTERACTION:
 * • Drag either object to explore "beneath" relationships
 */

// Surface object (wide and thin)
let surfaceObject = {
  x: 50,
  y: 100,
  p.width: 300,
  p.height: 10,
  color: [100, 150, 255],
  dragging: false
};

// Object beneath the surface
let beneathObject = {
  x: 170,
  y: 30,
  p.width: 60,
  p.height: 40,
  color: [255, 150, 100],
  dragging: false
};

p.setup = function() {
}

p.draw = function() {
  p.background(...PALETTE.bg);
  
  // Draw beneath zone indicators first
  drawBeneathZone();
  
  // Draw objects in correct depth order (beneath first, then surface)
  drawBeneathObject();
  drawSurfaceObject();
}

function drawSurfaceObject() {
  // Draw the surface object
  p.fill(surfaceObject.color[0], surfaceObject.color[1], surfaceObject.color[2]);
  p.stroke(surfaceObject.color[0] - 50, surfaceObject.color[1] - 50, surfaceObject.color[2] - 50);
  p.strokeWeight(2);
  p.rect(surfaceObject.x, surfaceObject.y, surfaceObject.width, surfaceObject.height, 2);
}

function drawBeneathObject() {
  // Check if object is fully beneath
  let zoneY = surfaceObject.y + surfaceObject.height;
  let zoneHeight = 60;
  let isFullyBeneath = (beneathObject.y >= zoneY && 
                       beneathObject.y + beneathObject.height <= zoneY + zoneHeight &&
                       beneathObject.x >= surfaceObject.x &&
                       beneathObject.x + beneathObject.width <= surfaceObject.x + surfaceObject.width);
  
  // Draw the beneath object with different appearance based on position
  p.fill(beneathObject.color[0], beneathObject.color[1], beneathObject.color[2]);
  if (isFullyBeneath) {
    p.stroke(0, 150, 0); // Green border when properly beneath
    p.strokeWeight(3);
  } else {
    p.stroke(beneathObject.color[0] - 50, beneathObject.color[1] - 50, beneathObject.color[2] - 50);
    p.strokeWeight(2);
  }
  p.rect(beneathObject.x, beneathObject.y, beneathObject.width, beneathObject.height, 5);
}

function drawBeneathZone() {
  // Define beneath zone - extends down from the surface
  let zoneHeight = 60;
  let zoneY = surfaceObject.y + surfaceObject.height;
  
  // Check if beneath object is fully within the zone
  let isFullyBeneath = (beneathObject.y >= zoneY && 
                       beneathObject.y + beneathObject.height <= zoneY + zoneHeight &&
                       beneathObject.x >= surfaceObject.x &&
                       beneathObject.x + beneathObject.width <= surfaceObject.x + surfaceObject.width);
  
  // Draw zone background
  if (isFullyBeneath) {
    p.fill(100, 255, 100, 30); // Light green when object is beneath
  } else {
    p.fill(200, 200, 200, 30); // Light gray when empty
  }
  p.noStroke();
  p.rect(surfaceObject.x, zoneY, surfaceObject.width, zoneHeight);
  
  // Draw zone border
  p.stroke(150);
  p.strokeWeight(1);
  p.noFill();
  p.rect(surfaceObject.x, zoneY, surfaceObject.width, zoneHeight);
  
  // Draw arrows pointing down from surface
  p.stroke(100);
  p.strokeWeight(2);
  let arrowSpacing = 40;
  for (let x = surfaceObject.x + 20; x < surfaceObject.x + surfaceObject.width - 20; x += arrowSpacing) {
    // Arrow line
    p.line(x, surfaceObject.y + surfaceObject.height, x, zoneY + 25);
    
    // Arrow head
    let arrowSize = 6;
    let arrowY = zoneY + 25;
    p.line(x, arrowY, x - arrowSize, arrowY - arrowSize);
    p.line(x, arrowY, x + arrowSize, arrowY - arrowSize);
  }
  
  // Draw "BENEATH ZONE" label
  p.fill(...PALETTE.ink);
  p.noStroke();
  p.textAlign(CENTER);
  p.textSize(10);
  p.text("BENEATH ZONE", surfaceObject.x + surfaceObject.width/2, zoneY + zoneHeight - 5);
  
  // Display status
  p.textAlign(CENTER);
  p.textSize(14);
  if (isFullyBeneath) {
    p.fill(0, 150, 0);
    p.text("Orange is BENEATH blue surface", p.width/2, p.height - 20);
  } else {
    p.fill(150, 0, 0);
    p.text("Orange is NOT beneath (must be fully in zone)", p.width/2, p.height - 20);
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
  
  // Check object selection
  if (inputX >= surfaceObject.x && inputX <= surfaceObject.x + surfaceObject.width &&
      inputY >= surfaceObject.y && inputY <= surfaceObject.y + surfaceObject.height) {
    surfaceObject.dragging = true;
    return;
  }
  
  if (inputX >= beneathObject.x && inputX <= beneathObject.x + beneathObject.width &&
      inputY >= beneathObject.y && inputY <= beneathObject.y + beneathObject.height) {
    beneathObject.dragging = true;
    return;
  }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
  let inputX = getInputX();
  let inputY = getInputY();
  
  if (surfaceObject.dragging) {
    surfaceObject.x = p.constrain(inputX - surfaceObject.width/2, 0, p.width - surfaceObject.width);
    surfaceObject.y = p.constrain(inputY - surfaceObject.height/2, 0, p.height - surfaceObject.height);
  }
  
  if (beneathObject.dragging) {
    beneathObject.x = p.constrain(inputX - beneathObject.width/2, 0, p.width - beneathObject.width);
    beneathObject.y = p.constrain(inputY - beneathObject.height/2, 0, p.height - beneathObject.height);
  }
}

// Handle input end (both mouse and touch)
function handleInputEnd() {
  surfaceObject.dragging = false;
  beneathObject.dragging = false;
}

p.mousePressed = function() {
  handleInputStart();
}

p.mouseDragged = function() {
  handleInputDrag();
}

p.mouseReleased = function() {
  handleInputEnd();
}

// Touch event handlers for mobile
p.touchStarted = function() {
  handleInputStart();
  return false; // Prevent default touch behavior
}

p.touchMoved = function() {
  handleInputDrag();
  return false; // Prevent scrolling
}

p.touchEnded = function() {
  handleInputEnd();
  return false;
}

}
