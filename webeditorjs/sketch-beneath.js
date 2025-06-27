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
  width: 300,
  height: 10,
  color: [100, 150, 255],
  dragging: false
};

// Object beneath the surface
let beneathObject = {
  x: 170,
  y: 30,
  width: 60,
  height: 40,
  color: [255, 150, 100],
  dragging: false
};

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240);
  
  // Draw beneath zone indicators first
  drawBeneathZone();
  
  // Draw objects in correct depth order (beneath first, then surface)
  drawBeneathObject();
  drawSurfaceObject();
}

function drawSurfaceObject() {
  // Draw the surface object
  fill(surfaceObject.color[0], surfaceObject.color[1], surfaceObject.color[2]);
  stroke(surfaceObject.color[0] - 50, surfaceObject.color[1] - 50, surfaceObject.color[2] - 50);
  strokeWeight(2);
  rect(surfaceObject.x, surfaceObject.y, surfaceObject.width, surfaceObject.height, 2);
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
  fill(beneathObject.color[0], beneathObject.color[1], beneathObject.color[2]);
  if (isFullyBeneath) {
    stroke(0, 150, 0); // Green border when properly beneath
    strokeWeight(3);
  } else {
    stroke(beneathObject.color[0] - 50, beneathObject.color[1] - 50, beneathObject.color[2] - 50);
    strokeWeight(2);
  }
  rect(beneathObject.x, beneathObject.y, beneathObject.width, beneathObject.height, 5);
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
    fill(100, 255, 100, 30); // Light green when object is beneath
  } else {
    fill(200, 200, 200, 30); // Light gray when empty
  }
  noStroke();
  rect(surfaceObject.x, zoneY, surfaceObject.width, zoneHeight);
  
  // Draw zone border
  stroke(150);
  strokeWeight(1);
  noFill();
  rect(surfaceObject.x, zoneY, surfaceObject.width, zoneHeight);
  
  // Draw arrows pointing down from surface
  stroke(100);
  strokeWeight(2);
  let arrowSpacing = 40;
  for (let x = surfaceObject.x + 20; x < surfaceObject.x + surfaceObject.width - 20; x += arrowSpacing) {
    // Arrow line
    line(x, surfaceObject.y + surfaceObject.height, x, zoneY + 25);
    
    // Arrow head
    let arrowSize = 6;
    let arrowY = zoneY + 25;
    line(x, arrowY, x - arrowSize, arrowY - arrowSize);
    line(x, arrowY, x + arrowSize, arrowY - arrowSize);
  }
  
  // Draw "BENEATH ZONE" label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text("BENEATH ZONE", surfaceObject.x + surfaceObject.width/2, zoneY + zoneHeight - 5);
  
  // Display status
  textAlign(CENTER);
  textSize(14);
  if (isFullyBeneath) {
    fill(0, 150, 0);
    text("Orange is BENEATH blue surface", width/2, height - 20);
  } else {
    fill(150, 0, 0);
    text("Orange is NOT beneath (must be fully in zone)", width/2, height - 20);
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
    surfaceObject.x = constrain(inputX - surfaceObject.width/2, 0, width - surfaceObject.width);
    surfaceObject.y = constrain(inputY - surfaceObject.height/2, 0, height - surfaceObject.height);
  }
  
  if (beneathObject.dragging) {
    beneathObject.x = constrain(inputX - beneathObject.width/2, 0, width - beneathObject.width);
    beneathObject.y = constrain(inputY - beneathObject.height/2, 0, height - beneathObject.height);
  }
}

// Handle input end (both mouse and touch)
function handleInputEnd() {
  surfaceObject.dragging = false;
  beneathObject.dragging = false;
}

function mousePressed() {
  handleInputStart();
}

function mouseDragged() {
  handleInputDrag();
}

function mouseReleased() {
  handleInputEnd();
}

// Touch event handlers for mobile
function touchStarted() {
  handleInputStart();
  return false; // Prevent default touch behavior
}

function touchMoved() {
  handleInputDrag();
  return false; // Prevent scrolling
}

function touchEnded() {
  handleInputEnd();
  return false;
}
