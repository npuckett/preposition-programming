/*
 * P5.js Sketch: BENEATH – Layered Depth and Proximity
 *
 * CONCEPT:
 * "Beneath" means positioned directly below something else, typically with close proximity or contact, suggesting a layered or stacked relationship.
 * In this sketch, an object can be moved beneath a surface, visually demonstrating the preposition through alignment and proximity.
 *
 * LEARNING OBJECTIVES:
 * • Understand depth layering and visual stacking in 2D graphics
 * • Practice proximity and alignment detection
 * • Explore drag-and-drop and interactive movement
 * • Visualize spatial relationships and feedback for "beneath"
 *
 * KEY VARIABLES & METHODS:
 * • surfaceObject: object representing the upper surface
 * • beneathObject: object that can be beneath the surface
 * • showDepthLayers, showContactLines: visual feedback toggles
 * • checkHorizontalAlignment(), gap calculation: logic for beneath relationship
 *
 * EXTENSION IDEAS:
 * • Multiple layers or objects beneath each other
 * • Dynamic depth changes or stacking order
 * • Visual effects for contact or support
 *
 * INTERACTION:
 * • Drag objects to explore "beneath" relationships
 * • Use buttons to toggle depth layers, contact lines, and reset
 */

// Upper object (what things are beneath)
let surfaceObject = {
  x: 150,
  y: 100,
  width: 100,
  height: 20,
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

// Visual controls
let showDepthLayers = true;
let showContactLines = true;
let dragOffset = { x: 0, y: 0 };

function setup() {
  createCanvas(400, 300).parent('canvas');
}

function draw() {
  background(240, 248, 255);
  
  // Draw depth layers if enabled
  if (showDepthLayers) {
    drawDepthLayers();
  }
  
  // Draw objects in correct depth order (beneath first, then surface)
  drawBeneathObject();
  drawSurfaceObject();
  
  // Draw contact/proximity lines
  if (showContactLines) {
    drawContactLines();
  }
  
  // Draw relationship information
  drawRelationshipInfo();
  
  // Draw controls
  drawControls();
}

function drawDepthLayers() {
  // Draw subtle depth layers
  for (let i = 0; i < 5; i++) {
    let layerY = 80 + (i * 30);
    let alpha = map(i, 0, 4, 20, 5);
    
    fill(100, 100, 150, alpha);
    noStroke();
    rect(0, layerY, width, 30);
    
    // Layer labels
    fill(100, 100, 100, 100);
    textAlign(LEFT);
    textSize(10);
    text("Layer " + i, 10, layerY + 15);
  }
}

function drawSurfaceObject() {
  // Draw shadow beneath surface object
  fill(0, 0, 0, 20);
  noStroke();
  ellipse(surfaceObject.x + surfaceObject.width/2, 
          surfaceObject.y + surfaceObject.height + 2, 
          surfaceObject.width + 10, 8);
  
  // Draw the surface object
  fill(surfaceObject.color[0], surfaceObject.color[1], surfaceObject.color[2]);
  stroke(surfaceObject.color[0] - 50, surfaceObject.color[1] - 50, surfaceObject.color[2] - 50);
  strokeWeight(2);
  rect(surfaceObject.x, surfaceObject.y, surfaceObject.width, surfaceObject.height, 5);
  
  // Surface texture
  stroke(255, 255, 255, 100);
  strokeWeight(1);
  for (let i = 0; i < 3; i++) {
    let lineY = surfaceObject.y + 5 + (i * 3);
    line(surfaceObject.x + 10, lineY, surfaceObject.x + surfaceObject.width - 10, lineY);
  }
  
  // Label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Surface", surfaceObject.x + surfaceObject.width/2, surfaceObject.y - 10);
  
  // Selection indicator
  if (surfaceObject.dragging) {
    stroke(255, 255, 0);
    strokeWeight(3);
    noFill();
    rect(surfaceObject.x - 3, surfaceObject.y - 3, 
         surfaceObject.width + 6, surfaceObject.height + 6);
  }
}

function drawBeneathObject() {
  // Calculate how close beneath object is to surface
  let gap = beneathObject.y - (surfaceObject.y + surfaceObject.height);
  let isDirectlyBeneath = gap >= 0 && gap <= 30; // Within reasonable "beneath" distance
  let isAligned = checkHorizontalAlignment();
  
  // Draw with different appearance based on beneath relationship
  if (isDirectlyBeneath && isAligned) {
    fill(beneathObject.color[0], beneathObject.color[1], beneathObject.color[2]);
    stroke(50, 150, 50); // Green border when properly beneath
  } else {
    fill(beneathObject.color[0], beneathObject.color[1], beneathObject.color[2], 150);
    stroke(150, 150, 150); // Gray border when not properly beneath
  }
  
  strokeWeight(2);
  rect(beneathObject.x, beneathObject.y, beneathObject.width, beneathObject.height, 5);
  
  // Add texture to show it's beneath/underground
  stroke(0, 0, 0, 50);
  strokeWeight(1);
  for (let i = 0; i < 4; i++) {
    let dotY = beneathObject.y + 8 + (i * 8);
    for (let j = 0; j < 6; j++) {
      let dotX = beneathObject.x + 8 + (j * 8);
      point(dotX, dotY);
    }
  }
  
  // Label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Beneath Object", beneathObject.x + beneathObject.width/2, beneathObject.y + beneathObject.height + 20);
  
  // Selection indicator
  if (beneathObject.dragging) {
    stroke(255, 255, 0);
    strokeWeight(3);
    noFill();
    rect(beneathObject.x - 3, beneathObject.y - 3, 
         beneathObject.width + 6, beneathObject.height + 6);
  }
}

function drawContactLines() {
  let isAligned = checkHorizontalAlignment();
  
  if (isAligned) {
    // Find overlap region
    let overlapLeft = Math.max(surfaceObject.x, beneathObject.x);
    let overlapRight = Math.min(surfaceObject.x + surfaceObject.width, 
                               beneathObject.x + beneathObject.width);
    
    if (overlapLeft < overlapRight) {
      // Draw connection lines in overlap region
      stroke(100, 200, 100, 150);
      strokeWeight(2);
      
      let gap = beneathObject.y - (surfaceObject.y + surfaceObject.height);
      
      // Draw multiple connection lines
      for (let x = overlapLeft; x < overlapRight; x += 15) {
        line(x, surfaceObject.y + surfaceObject.height, x, beneathObject.y);
        
        // Draw small arrows
        drawDownArrow(x, surfaceObject.y + surfaceObject.height + gap/2);
      }
      
      // Gap measurement
      fill(100, 200, 100);
      noStroke();
      textAlign(CENTER);
      textSize(10);
      text(Math.round(gap) + "px", (overlapLeft + overlapRight)/2, 
           surfaceObject.y + surfaceObject.height + gap/2 + 15);
    }
  }
}

function drawDownArrow(x, y) {
  stroke(100, 200, 100);
  strokeWeight(1);
  let arrowSize = 4;
  line(x, y, x - arrowSize, y - arrowSize);
  line(x, y, x + arrowSize, y - arrowSize);
}

function checkHorizontalAlignment() {
  // Check if objects overlap horizontally (indicating one is beneath the other)
  return !(surfaceObject.x + surfaceObject.width < beneathObject.x || 
           beneathObject.x + beneathObject.width < surfaceObject.x);
}

function drawRelationshipInfo() {
  let gap = beneathObject.y - (surfaceObject.y + surfaceObject.height);
  let isDirectlyBeneath = gap >= 0 && gap <= 30;
  let isAligned = checkHorizontalAlignment();
  
  let relationship = "";
  if (isDirectlyBeneath && isAligned) {
    relationship = "Orange object is BENEATH the blue surface";
  } else if (isAligned && gap < 0) {
    relationship = "Objects are overlapping (too close)";
  } else if (isAligned && gap > 30) {
    relationship = "Orange object is below but too far to be 'beneath'";
  } else {
    relationship = "Objects are not properly aligned for 'beneath'";
  }
  
  // Draw relationship status
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  
  if (isDirectlyBeneath && isAligned) {
    fill(0, 150, 0); // Green for correct beneath relationship
  } else {
    fill(150, 0, 0); // Red for incorrect relationship
  }
  text(relationship, width/2, height - 60);
  
  // Additional info
  fill(0);
  textSize(12);
  text("Gap: " + Math.round(gap) + "px, Aligned: " + isAligned, width/2, height - 40);
  text("'Beneath' requires close proximity and alignment", width/2, height - 20);
}

function drawControls() {
  // Instructions
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(10);
  text("Drag objects to explore 'beneath' relationships", 10, 20);
  text("'Beneath' implies direct proximity below", 10, 35);
  
  // Control buttons
  fill(200);
  stroke(100);
  strokeWeight(1);
  
  // Depth layers toggle
  rect(250, 10, 80, 20);
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(9);
  text(showDepthLayers ? "Hide Layers" : "Show Layers", 290, 23);
  
  // Contact lines toggle
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(250, 35, 80, 20);
  fill(0);
  noStroke();
  text(showContactLines ? "Hide Lines" : "Show Lines", 290, 48);
  
  // Reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(340, 10, 50, 20);
  fill(0);
  noStroke();
  text("Reset", 365, 23);
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
  
  // Check control buttons
  if (inputY >= 10 && inputY <= 30) {
    if (inputX >= 250 && inputX <= 330) {
      showDepthLayers = !showDepthLayers;
      return;
    }
    if (inputX >= 340 && inputX <= 390) {
      resetObjects();
      return;
    }
  }
  
  if (inputY >= 35 && inputY <= 55 && inputX >= 250 && inputX <= 330) {
    showContactLines = !showContactLines;
    return;
  }
  
  // Check object selection (surface object has priority for visibility)
  if (inputX >= surfaceObject.x && inputX <= surfaceObject.x + surfaceObject.width &&
      inputY >= surfaceObject.y && inputY <= surfaceObject.y + surfaceObject.height) {
    surfaceObject.dragging = true;
    dragOffset.x = inputX - surfaceObject.x;
    dragOffset.y = inputY - surfaceObject.y;
    return;
  }
  
  if (inputX >= beneathObject.x && inputX <= beneathObject.x + beneathObject.width &&
      inputY >= beneathObject.y && inputY <= beneathObject.y + beneathObject.height) {
    beneathObject.dragging = true;
    dragOffset.x = inputX - beneathObject.x;
    dragOffset.y = inputY - beneathObject.y;
    return;
  }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
  let inputX = getInputX();
  let inputY = getInputY();
  
  if (surfaceObject.dragging) {
    surfaceObject.x = constrain(inputX - dragOffset.x, 0, width - surfaceObject.width);
    surfaceObject.y = constrain(inputY - dragOffset.y, 0, height - surfaceObject.height);
  }
  
  if (beneathObject.dragging) {
    beneathObject.x = constrain(inputX - dragOffset.x, 0, width - beneathObject.width);
    beneathObject.y = constrain(inputY - dragOffset.y, 0, height - beneathObject.height);
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

function resetObjects() {
  surfaceObject.x = 150;
  surfaceObject.y = 100;
  surfaceObject.dragging = false;
  
  beneathObject.x = 170;
  beneathObject.y = 130;
  beneathObject.dragging = false;
}

/*
EDUCATIONAL NOTES:

1. PROXIMITY VS DIRECTION:
   - "Beneath" implies both position (below) and proximity (close)
   - Different from just "below" which only requires lower position
   - Contact or near-contact is typically implied

2. ALIGNMENT REQUIREMENTS:
   - Horizontal overlap often required for "beneath" relationship
   - Pure vertical separation may not constitute "beneath"
   - Spatial context affects interpretation

3. LAYERED DEPTH:
   - "Beneath" suggests depth layers or stacking
   - Visual techniques (shadows, transparency) convey depth
   - Drawing order affects perceived spatial relationships

4. MEASUREMENT CRITERIA:
   - Distance thresholds define "close enough" for beneath
   - Alignment percentages determine sufficient overlap
   - Clear criteria prevent ambiguous relationships

5. CONTEXTUAL MEANING:
   - "Beneath" often implies support or foundation
   - Physical contact or very close proximity
   - Different from abstract "below" positioning

This pattern can be adapted for other "beneath" scenarios like:
- UI elements with dropdown overlays
- Game objects with ground/foundation relationships
- Layered graphics with depth ordering
- Architecture with floor/foundation relationships
- Data visualization with base/overlay relationships
*/
