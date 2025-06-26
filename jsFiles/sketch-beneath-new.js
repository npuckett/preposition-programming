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
  y: 130,
  width: 60,
  height: 40,
  color: [255, 150, 100],
  dragging: false
};

function setup() {
  createCanvas(400, 300).parent('canvas');
}

function draw() {
  background(240);
  
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
  // Draw the beneath object
  fill(beneathObject.color[0], beneathObject.color[1], beneathObject.color[2]);
  stroke(beneathObject.color[0] - 50, beneathObject.color[1] - 50, beneathObject.color[2] - 50);
  strokeWeight(2);
  rect(beneathObject.x, beneathObject.y, beneathObject.width, beneathObject.height, 5);
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
