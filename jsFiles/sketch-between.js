/*
 * PREPOSITION: BETWEEN
 * 
 * CONCEPT:
 * "Between" means positioned in the space separating two other objects.
 * This involves checking if one object's position falls within the range
 * defined by two boundary objects.
 * 
 * LEARNING OBJECTIVES:
 * - Understand range checking and boundary detection
 * - Practice coordinate comparison logic
 * - Implement multi-object interaction systems
 * - Create visual feedback for spatial relationships
 * - Use conditional logic for position analysis
 * 
 * KEY VARIABLES:
 * - leftCircle, rightCircle: boundary objects
 * - middleCircle: object that can be "between" the others
 * - dragging: interaction state tracking
 * 
 * KEY METHODS:
 * - min()/max(): find boundary values
 * - constrain(): limit values within bounds
 * - dist(): calculate distances between objects
 * - Mouse interaction functions
 * 
 * HOW TO EXTEND:
 * 1. Add vertical "between" checking (Y coordinates)
 * 2. Create 3D "between" with depth
 * 3. Add magnetic snapping to "between" positions
 * 4. Implement multiple objects that can be between others
 * 5. Add angle-based "between" for rotational relationships
 * 6. Create zones with different "between" behaviors
 * 7. Add particle effects when objects enter "between" state
 */

// Three circles - green can be positioned between blue and red
let blueCircle = { 
  x: 100, 
  y: 150, 
  radius: 25, 
  dragging: false 
};

let redCircle = { 
  x: 300, 
  y: 150, 
  radius: 25, 
  dragging: false 
};

let greenCircle = { 
  x: 200, 
  y: 150, 
  radius: 20, 
  dragging: false 
};

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240, 248, 255);
  
  // Calculate the "between" relationship
  let isBetween = checkBetweenRelationship();
  
  // Draw connection lines between boundary circles
  drawConnectionLines(isBetween);
  
  // Draw all three circles
  drawCircle(blueCircle, color(100, 150, 255), "Blue");
  drawCircle(redCircle, color(255, 100, 100), "Red");
  drawCircle(greenCircle, isBetween ? color(100, 255, 100) : color(150, 150, 150), "Green");
  
  // Draw "between" zone visualization
  drawBetweenZone(isBetween);
  
  // Display relationship information
  displayRelationshipInfo(isBetween);
  
  // Show coordinate information
  displayCoordinateInfo();
}

function checkBetweenRelationship() {
  // Find the leftmost and rightmost X coordinates of the boundary circles
  let leftBoundary = min(blueCircle.x, redCircle.x);
  let rightBoundary = max(blueCircle.x, redCircle.x);
  
  // Check if green circle is between the blue and red circles
  // (considering circle radius for more accurate detection)
  let greenLeft = greenCircle.x - greenCircle.radius;
  let greenRight = greenCircle.x + greenCircle.radius;
  let boundaryLeft = leftBoundary + (blueCircle.x < redCircle.x ? blueCircle.radius : redCircle.radius);
  let boundaryRight = rightBoundary - (blueCircle.x < redCircle.x ? redCircle.radius : blueCircle.radius);
  
  return (greenLeft >= boundaryLeft && greenRight <= boundaryRight);
}

function drawConnectionLines(isBetween) {
  // Draw line connecting the two boundary circles
  stroke(150);
  strokeWeight(2);
  line(blueCircle.x, blueCircle.y, redCircle.x, redCircle.y);
  
  // If green is between, draw connecting lines to it
  if (isBetween) {
    stroke(100, 255, 100, 150);
    strokeWeight(1);
    line(blueCircle.x, blueCircle.y, greenCircle.x, greenCircle.y);
    line(redCircle.x, redCircle.y, greenCircle.x, greenCircle.y);
  }
}

function drawCircle(circle, circleColor, label) {
  // Main circle
  fill(circleColor);
  stroke(50);
  strokeWeight(1);
  ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
  
  // Circle label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text(label, circle.x, circle.y - circle.radius - 8);
  
  // Show coordinates
  textSize(9);
  fill(100);
  text("(" + Math.round(circle.x) + "," + Math.round(circle.y) + ")", 
       circle.x, circle.y + circle.radius + 15);
}

function drawBetweenZone(isBetween) {
  // Calculate and visualize the "between" zone
  let leftBoundary = min(blueCircle.x, redCircle.x);
  let rightBoundary = max(blueCircle.x, redCircle.x);
  
  // Add circle radius offsets for accurate zone
  let boundaryLeft = leftBoundary + (blueCircle.x < redCircle.x ? blueCircle.radius : redCircle.radius);
  let boundaryRight = rightBoundary - (blueCircle.x < redCircle.x ? redCircle.radius : blueCircle.radius);
  
  // Draw "between" zone as a highlighted rectangle
  if (isBetween) {
    fill(100, 255, 100, 50);  // Green highlight when object is between
  } else {
    fill(200, 200, 200, 30);  // Gray when not between
  }
  
  noStroke();
  rect(boundaryLeft, 50, boundaryRight - boundaryLeft, 200);
  
  // Zone boundary lines
  stroke(isBetween ? color(100, 200, 100) : color(150));
  strokeWeight(1);
  line(boundaryLeft, 50, boundaryLeft, 250);
  line(boundaryRight, 50, boundaryRight, 250);
  
  // Zone label
  fill(isBetween ? color(0, 150, 0) : color(100));
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text("\"Between\" Zone", (boundaryLeft + boundaryRight) / 2, 40);
}

function displayRelationshipInfo() {
  // Determine current relationship
  let relationship = "";
  let isBetween = checkBetweenRelationship();
  
  if (isBetween) {
    relationship = "Green is BETWEEN blue and red";
  } else {
    // Determine which side green is on
    let leftBoundary = min(blueCircle.x, redCircle.x);
    let rightBoundary = max(blueCircle.x, redCircle.x);
    
    if (greenCircle.x < leftBoundary) {
      relationship = "Green is to the LEFT of both circles";
    } else if (greenCircle.x > rightBoundary) {
      relationship = "Green is to the RIGHT of both circles";
    } else {
      relationship = "Green is partially between (overlapping boundary)";
    }
  }
  
  // Display relationship
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  text(relationship, width/2, 25);
  
  // Instructions
  textSize(12);
  text("Drag any circle to change the relationship", width/2, height - 15);
}

function displayCoordinateInfo() {
  // Information panel showing coordinates and measurements
  fill(255, 255, 255, 200);
  stroke(100);
  strokeWeight(1);
  rect(10, 260, 200, 35);
  
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(9);
  
  let leftBoundary = min(blueCircle.x, redCircle.x);
  let rightBoundary = max(blueCircle.x, redCircle.x);
  let distance = rightBoundary - leftBoundary;
  
  text("Left boundary: " + Math.round(leftBoundary), 12, 272);
  text("Right boundary: " + Math.round(rightBoundary), 12, 282);
  text("Distance between: " + Math.round(distance), 12, 292);
}

function mousePressed() {
  // Check which circle is clicked
  if (dist(mouseX, mouseY, blueCircle.x, blueCircle.y) < blueCircle.radius) {
    blueCircle.dragging = true;
  } else if (dist(mouseX, mouseY, redCircle.x, redCircle.y) < redCircle.radius) {
    redCircle.dragging = true;
  } else if (dist(mouseX, mouseY, greenCircle.x, greenCircle.y) < greenCircle.radius) {
    greenCircle.dragging = true;
  }
}

function mouseDragged() {
  // Update position of dragged circle
  if (blueCircle.dragging) {
    blueCircle.x = mouseX;
    blueCircle.y = mouseY;
  }
  if (redCircle.dragging) {
    redCircle.x = mouseX;
    redCircle.y = mouseY;
  }
  if (greenCircle.dragging) {
    greenCircle.x = mouseX;
    greenCircle.y = mouseY;
  }
}

function mouseReleased() {
  // Stop dragging all circles
  blueCircle.dragging = false;
  redCircle.dragging = false;
  greenCircle.dragging = false;
}
