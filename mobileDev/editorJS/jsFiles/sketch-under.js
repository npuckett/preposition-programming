/*
 * P5.js Sketch: UNDER – Vertical Position and Spatial Relationships
 *
 * CONCEPT:
 * "Under" means positioned below something else in vertical space, often with clear separation or alignment.
 * In this sketch, objects can be moved to explore when one is under the other, visually demonstrating the preposition.
 *
 * LEARNING OBJECTIVES:
 * • Understand vertical relationships and Y-coordinate logic
 * • Practice spatial alignment and overlap detection
 * • Explore interactive movement and visual feedback
 * • Visualize measurements and relationship indicators
 *
 * KEY VARIABLES & METHODS:
 * • upperObject, lowerObject: objects representing the vertical relationship
 * • showGrid, dropShadows: visual feedback toggles
 * • checkHorizontalOverlap(): logic for alignment
 *
 * EXTENSION IDEAS:
 * • Multiple stacked objects or layers
 * • Dynamic changes in object size or shape
 * • Additional visual cues for complex relationships
 *
 * INTERACTION:
 * • Drag objects to explore "under" relationships
 * • Use buttons to toggle grid, shadows, and reset
 */

// P5.js Sketch: Preposition "Under"
// This sketch demonstrates the concept of "under" through vertical relationships
// Objects positioned below others in vertical space

// Objects in the scene
let upperObject = {
  x: 200,
  y: 80,
  width: 100,
  height: 40,
  color: [100, 150, 255],
  dragging: false,
  label: "Upper Object"
};

let lowerObject = {
  x: 180,
  y: 180,
  width: 80,
  height: 30,
  color: [255, 150, 100],
  dragging: false,
  label: "Lower Object"
};

// Visual elements
let showGrid = true;
let dragOffset = { x: 0, y: 0 };
let dropShadows = true;

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240, 248, 255);
  
  // Draw reference grid if enabled
  if (showGrid) {
    drawGrid();
  }
  
  // Draw drop shadows if enabled
  if (dropShadows) {
    drawShadows();
  }
  
  // Draw objects
  drawObject(upperObject);
  drawObject(lowerObject);
  
  // Draw relationship indicators
  drawRelationshipLines();
  drawRelationshipInfo();
  
  // Draw controls and instructions
  drawControls();
}

function drawGrid() {
  stroke(200, 200, 200, 100);
  strokeWeight(1);
  
  // Horizontal reference lines
  for (let y = 0; y <= height; y += 20) {
    line(0, y, width, y);
  }
  
  // Vertical reference lines
  for (let x = 0; x <= width; x += 20) {
    line(x, 0, x, height);
  }
  
  // Y-axis labels
  fill(150, 150, 150);
  noStroke();
  textAlign(LEFT);
  textSize(10);
  for (let y = 0; y <= height; y += 40) {
    text("y=" + y, 5, y + 12);
  }
}

function drawShadows() {
  // Shadow for upper object
  fill(0, 0, 0, 30);
  noStroke();
  ellipse(upperObject.x + upperObject.width/2, 
          upperObject.y + upperObject.height + 10, 
          upperObject.width + 20, 15);
  
  // Shadow for lower object
  fill(0, 0, 0, 30);
  noStroke();
  ellipse(lowerObject.x + lowerObject.width/2, 
          lowerObject.y + lowerObject.height + 10, 
          lowerObject.width + 20, 15);
}

function drawObject(obj) {
  // Draw the object
  fill(obj.color[0], obj.color[1], obj.color[2]);
  stroke(obj.color[0] - 50, obj.color[1] - 50, obj.color[2] - 50);
  strokeWeight(2);
  rect(obj.x, obj.y, obj.width, obj.height, 8);
  
  // Draw object label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text(obj.label, obj.x + obj.width/2, obj.y + obj.height/2 + 4);
  
  // Draw Y coordinate
  textSize(10);
  fill(100);
  text("y: " + Math.round(obj.y), obj.x + obj.width/2, obj.y - 8);
  
  // Draw selection border if dragging
  if (obj.dragging) {
    stroke(255, 255, 0);
    strokeWeight(3);
    noFill();
    rect(obj.x - 3, obj.y - 3, obj.width + 6, obj.height + 6);
  }
}

function drawRelationshipLines() {
  // Draw vertical relationship line if objects are aligned
  let horizontalOverlap = checkHorizontalOverlap(upperObject, lowerObject);
  
  if (horizontalOverlap) {
    stroke(255, 100, 100, 150);
    strokeWeight(2);
    
    // Draw line from bottom of upper object to top of lower object
    let lineX = (Math.max(upperObject.x, lowerObject.x) + 
                Math.min(upperObject.x + upperObject.width, lowerObject.x + lowerObject.width)) / 2;
    
    line(lineX, upperObject.y + upperObject.height, 
         lineX, lowerObject.y);
    
    // Draw arrows indicating direction
    drawVerticalArrow(lineX, upperObject.y + upperObject.height + 10, "down");
    drawVerticalArrow(lineX, lowerObject.y - 10, "up");
  }
}

function drawVerticalArrow(x, y, direction) {
  stroke(255, 100, 100);
  strokeWeight(2);
  
  let arrowSize = 6;
  if (direction === "down") {
    line(x, y, x - arrowSize, y - arrowSize);
    line(x, y, x + arrowSize, y - arrowSize);
  } else {
    line(x, y, x - arrowSize, y + arrowSize);
    line(x, y, x + arrowSize, y + arrowSize);
  }
}

function drawRelationshipInfo() {
  // Determine which object is under the other
  let relationship = "";
  let isUnder = false;
  
  if (lowerObject.y > upperObject.y + upperObject.height) {
    relationship = lowerObject.label + " is UNDER " + upperObject.label;
    isUnder = true;
  } else if (upperObject.y > lowerObject.y + lowerObject.height) {
    relationship = upperObject.label + " is UNDER " + lowerObject.label;
    isUnder = true;
  } else {
    relationship = "Objects are at similar vertical levels";
    isUnder = false;
  }
  
  // Check for horizontal alignment
  let horizontalAlignment = checkHorizontalOverlap(upperObject, lowerObject);
  let alignmentText = horizontalAlignment ? 
    "Objects are horizontally aligned" : 
    "Objects are not horizontally aligned";
  
  // Draw relationship status
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  
  if (isUnder) {
    fill(0, 150, 0); // Green for clear relationship
  } else {
    fill(150, 0, 0); // Red for unclear relationship
  }
  text(relationship, width/2, height - 60);
  
  fill(0);
  textSize(12);
  text(alignmentText, width/2, height - 40);
  
  // Draw measurements
  textAlign(LEFT);
  textSize(10);
  let verticalDistance = Math.abs((upperObject.y + upperObject.height) - lowerObject.y);
  text("Vertical separation: " + Math.round(verticalDistance) + " pixels", 10, height - 20);
}

function drawControls() {
  // Instructions
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(10);
  text("Drag objects to explore 'under' relationships", 10, 20);
  text("Objects are 'under' when positioned below others", 10, 35);
  
  // Toggle buttons
  fill(200);
  stroke(100);
  strokeWeight(1);
  
  // Grid toggle
  rect(250, 10, 70, 20);
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text(showGrid ? "Hide Grid" : "Show Grid", 285, 23);
  
  // Shadow toggle
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(325, 10, 70, 20);
  fill(0);
  noStroke();
  text(dropShadows ? "Hide Shadows" : "Show Shadows", 360, 23);
  
  // Reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(250, 35, 50, 20);
  fill(0);
  noStroke();
  text("Reset", 275, 48);
}

function checkHorizontalOverlap(obj1, obj2) {
  return !(obj1.x + obj1.width < obj2.x || obj2.x + obj2.width < obj1.x);
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
    if (inputX >= 250 && inputX <= 320) {
      showGrid = !showGrid;
      return;
    }
    if (inputX >= 325 && inputX <= 395) {
      dropShadows = !dropShadows;
      return;
    }
  }
  
  if (inputY >= 35 && inputY <= 55 && inputX >= 250 && inputX <= 300) {
    resetObjects();
    return;
  }
  
  // Check object selection (prioritize upper object for visibility)
  if (inputX >= upperObject.x && inputX <= upperObject.x + upperObject.width &&
      inputY >= upperObject.y && inputY <= upperObject.y + upperObject.height) {
    upperObject.dragging = true;
    dragOffset.x = inputX - upperObject.x;
    dragOffset.y = inputY - upperObject.y;
    return;
  }
  
  if (inputX >= lowerObject.x && inputX <= lowerObject.x + lowerObject.width &&
      inputY >= lowerObject.y && inputY <= lowerObject.y + lowerObject.height) {
    lowerObject.dragging = true;
    dragOffset.x = inputX - lowerObject.x;
    dragOffset.y = inputY - lowerObject.y;
    return;
  }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
  let inputX = getInputX();
  let inputY = getInputY();
  
  if (upperObject.dragging) {
    upperObject.x = constrain(inputX - dragOffset.x, 0, width - upperObject.width);
    upperObject.y = constrain(inputY - dragOffset.y, 0, height - upperObject.height);
  }
  
  if (lowerObject.dragging) {
    lowerObject.x = constrain(inputX - dragOffset.x, 0, width - lowerObject.width);
    lowerObject.y = constrain(inputY - dragOffset.y, 0, height - lowerObject.height);
  }
}

// Handle input end (both mouse and touch)
function handleInputEnd() {
  upperObject.dragging = false;
  lowerObject.dragging = false;
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
  upperObject.x = 200;
  upperObject.y = 80;
  upperObject.dragging = false;
  
  lowerObject.x = 180;
  lowerObject.y = 180;
  lowerObject.dragging = false;
}

/*
EDUCATIONAL NOTES:

1. VERTICAL RELATIONSHIPS:
   - "Under" is defined by Y-coordinate comparison
   - Lower Y values are "above", higher Y values are "below/under"
   - Clear vertical separation makes relationships obvious

2. COORDINATE SYSTEMS:
   - In screen coordinates, Y increases downward
   - This can be counterintuitive compared to mathematical coordinates
   - Visual reference grid helps understand the coordinate system

3. SPATIAL ALIGNMENT:
   - Horizontal overlap enhances "under" relationships
   - Objects can be "under" without horizontal alignment
   - Alignment affects clarity of spatial relationships

4. MEASUREMENT AND FEEDBACK:
   - Distance calculations quantify spatial relationships
   - Real-time coordinate display shows position changes
   - Visual indicators (arrows, lines) clarify relationships

5. INTERACTIVE EXPLORATION:
   - Dragging allows dynamic exploration of spatial concepts
   - Immediate visual feedback shows relationship changes
   - Multiple toggle options let users focus on different aspects

This pattern can be adapted for other "under" scenarios like:
- UI dropdown menus appearing under buttons
- Game objects with vertical layering (platforms, bridges)
- Chart elements with baseline relationships
- Architecture visualization with floor levels
- Hierarchical layouts with parent-child positioning
*/
