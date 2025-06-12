/*
 * PREPOSITION: BELOW
 * 
 * CONCEPT:
 * "Below" means positioned at a lower level than something else.
 * In screen coordinates, this translates to having a larger Y value,
 * since Y increases downward from the top of the screen.
 * 
 * LEARNING OBJECTIVES:
 * - Understand Y-axis direction in computer graphics
 * - Practice comparative logic with coordinates
 * - Learn drag-and-drop interaction patterns
 * - Create dynamic visual relationships
 * - Use conditional statements for real-time feedback
 * 
 * KEY VARIABLES:
 * - greenCircle, orangeCircle: objects storing position and state
 * - dragging: boolean flag for interaction state
 * - mouseX, mouseY: mouse position variables
 * 
 * KEY METHODS:
 * - setup(): initializes canvas
 * - draw(): continuous rendering loop
 * - dist(): calculates distance between points
 * - mousePressed(), mouseDragged(), mouseReleased(): mouse interaction
 * 
 * HOW TO EXTEND:
 * 1. Add multiple objects in a vertical stack
 * 2. Create gravity simulation where objects fall "below" others
 * 3. Add collision detection when objects are below each other
 * 4. Implement layering system with depth
 * 5. Add animations that demonstrate "sinking below"
 * 6. Create a sorting game where objects must be arranged below/above
 */

// Circle objects with position, size, and interaction properties
let greenCircle = { 
  x: 150, 
  y: 80, 
  radius: 20, 
  dragging: false 
};

let orangeCircle = { 
  x: 250, 
  y: 200, 
  radius: 20, 
  dragging: false 
};

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240);
  
  // Draw reference lines to show Y levels
  drawYLevelLine(greenCircle, color(100, 200, 100));
  drawYLevelLine(orangeCircle, color(255, 150, 100));
  
  // Determine the "below" relationship
  let relationship = "";
  if (greenCircle.y > orangeCircle.y) {
    // Larger Y value = lower on screen = "below"
    relationship = "Green is BELOW orange";
  } else if (orangeCircle.y > greenCircle.y) {
    relationship = "Orange is BELOW green";
  } else {
    relationship = "Circles are at SAME level";
  }
  
  // Draw the circles
  drawCircle(greenCircle, color(100, 200, 100), "Green");
  drawCircle(orangeCircle, color(255, 150, 100), "Orange");
  
  // Display relationship and instructions
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  text(relationship, width/2, 30);
  text("Drag the circles to change the relationship", width/2, height - 15);
}

function drawCircle(circle, circleColor, label) {
  // Draw main circle
  fill(circleColor);
  noStroke();
  ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
  
  // Draw label
  fill(0);
  textAlign(CENTER);
  textSize(12);
  text(label, circle.x, circle.y - circle.radius - 8);
}

function drawYLevelLine(circle, lineColor) {
  // Horizontal reference line
  stroke(lineColor);
  strokeWeight(1);
  line(0, circle.y, width, circle.y);
  
  // Y coordinate display
  fill(lineColor);
  noStroke();
  textAlign(LEFT);
  textSize(10);
  text("Y: " + Math.round(circle.y), 5, circle.y - 3);
}

function mousePressed() {
  // Check which circle is clicked
  if (dist(mouseX, mouseY, greenCircle.x, greenCircle.y) < greenCircle.radius) {
    greenCircle.dragging = true;
  } else if (dist(mouseX, mouseY, orangeCircle.x, orangeCircle.y) < orangeCircle.radius) {
    orangeCircle.dragging = true;
  }
}

function mouseDragged() {
  // Update position of dragged circle
  if (greenCircle.dragging) {
    greenCircle.x = mouseX;
    greenCircle.y = mouseY;
  }
  if (orangeCircle.dragging) {
    orangeCircle.x = mouseX;
    orangeCircle.y = mouseY;
  }
}

function mouseReleased() {
  // Stop dragging
  greenCircle.dragging = false;
  orangeCircle.dragging = false;
}
