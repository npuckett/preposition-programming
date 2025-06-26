/**
 * P5.js Sketch: BESIDE - Adjacent Positioning and Side-by-Side Relationships
 * 
 * CONCEPT: "Beside" means next to or at the side of something, indicating
 * a close proximity relationship where objects are positioned adjacent
 * to each other, typically at the same level or height.
 * 
 * LEARNING OBJECTIVES:
 * • Understand adjacency and proximity relationships
 * • Practice relative positioning and alignment
 * • Learn distance calculations and spacing control
 * • Explore visual feedback for positioning relationships
 * 
 * KEY VARIABLES & METHODS:
 * • Distance calculations for proximity detection
 * • Alignment checking (same Y level, adjacent X positions)
 * • Zone-based positioning
 * • Visual indicators for "beside" relationships
 */

let blueRect = { x: 200, y: 150, width: 60, height: 140 };
let movingCircle = { x: 40, y: 90, radius: 15 }; // Start outside the zone
let isDragging = false;

// Zone dimensions
let besideZoneWidth = 80;
let besideZoneHeight = 140; // Same height as the rectangle

function setup() {
    createCanvas(400, 300).parent('canvas');
}

function draw() {
    background(240);
    
    // Draw beside status at top
    drawBesideStatus();
    
    // Draw blue rectangle (main object)
    fill(70, 130, 180);
    stroke(50, 100, 150);
    strokeWeight(2);
    rectMode(CENTER);
    rect(blueRect.x, blueRect.y, blueRect.width, blueRect.height);
    
    // Draw beside zones (left and right)
    drawBesideZones();
    
    // Check if circle is in beside zone and draw circle
    drawMovingCircle();
}

function drawBesideZones() {
    // Left beside zone
    let leftZoneX = blueRect.x - blueRect.width/2 - besideZoneWidth/2;
    fill(70, 130, 180, 60); // Same color as rectangle but transparent
    stroke(50, 100, 150, 100);
    strokeWeight(1);
    rect(leftZoneX, blueRect.y, besideZoneWidth, besideZoneHeight);
    
    // Right beside zone
    let rightZoneX = blueRect.x + blueRect.width/2 + besideZoneWidth/2;
    rect(rightZoneX, blueRect.y, besideZoneWidth, besideZoneHeight);
    
    // Draw arrows pointing left and right from rectangle
    stroke(100);
    strokeWeight(2);
    let arrowLength = 25;
    let arrowSpacing = 25;
    
    // Left arrows
    let leftRectEdge = blueRect.x - blueRect.width/2;
    for (let y = blueRect.y - blueRect.height/2 + 20; y < blueRect.y + blueRect.height/2 - 20; y += arrowSpacing) {
        // Arrow line pointing left
        line(leftRectEdge, y, leftRectEdge - arrowLength, y);
        
        // Arrow head pointing left
        let arrowSize = 6;
        let arrowX = leftRectEdge - arrowLength;
        line(arrowX, y, arrowX + arrowSize, y - arrowSize);
        line(arrowX, y, arrowX + arrowSize, y + arrowSize);
    }
    
    // Right arrows
    let rightRectEdge = blueRect.x + blueRect.width/2;
    for (let y = blueRect.y - blueRect.height/2 + 20; y < blueRect.y + blueRect.height/2 - 20; y += arrowSpacing) {
        // Arrow line pointing right
        line(rightRectEdge, y, rightRectEdge + arrowLength, y);
        
        // Arrow head pointing right
        let arrowSize = 6;
        let arrowX = rightRectEdge + arrowLength;
        line(arrowX, y, arrowX - arrowSize, y - arrowSize);
        line(arrowX, y, arrowX - arrowSize, y + arrowSize);
    }
    
    // Zone labels
    fill(50, 100, 150);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text("BESIDE\nLEFT", leftZoneX, blueRect.y);
    text("BESIDE\nRIGHT", rightZoneX, blueRect.y);
}

function drawMovingCircle() {
    // Check if circle center point is in either beside zone
    let inLeftZone = isInLeftBesideZone(movingCircle.x, movingCircle.y);
    let inRightZone = isInRightBesideZone(movingCircle.x, movingCircle.y);
    let inBesideZone = inLeftZone || inRightZone;
    
    // Set circle color based on zone
    if (inBesideZone) {
        fill(100, 255, 100); // Green when in beside zone
        stroke(50, 200, 50);
    } else {
        fill(255, 215, 0); // Yellow when not in zone
        stroke(200, 165, 0);
    }
    
    strokeWeight(2);
    ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
    
    // Draw crosshairs outside the circle to show center point calculation
    stroke(0);
    strokeWeight(0.5);
    let crossSize = 20;
    let offset = movingCircle.radius + 15; // Distance from edge of circle
    
    // Horizontal crosshair (left and right of circle)
    line(movingCircle.x - offset - crossSize/2, movingCircle.y, 
         movingCircle.x - offset + crossSize/2, movingCircle.y);
    line(movingCircle.x + offset - crossSize/2, movingCircle.y, 
         movingCircle.x + offset + crossSize/2, movingCircle.y);
    
    // Vertical crosshair (above and below circle)
    line(movingCircle.x, movingCircle.y - offset - crossSize/2, 
         movingCircle.x, movingCircle.y - offset + crossSize/2);
    line(movingCircle.x, movingCircle.y + offset - crossSize/2, 
         movingCircle.x, movingCircle.y + offset + crossSize/2);
    
    // Display coordinates near the circle
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    text(`(${Math.round(movingCircle.x)}, ${Math.round(movingCircle.y)})`, 
         movingCircle.x, movingCircle.y + offset + 20);
}

function drawBesideStatus() {
    // Check current status
    let inLeftZone = isInLeftBesideZone(movingCircle.x, movingCircle.y);
    let inRightZone = isInRightBesideZone(movingCircle.x, movingCircle.y);
    
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    
    if (inLeftZone) {
        text("Circle is BESIDE the rectangle (LEFT side)", width/2, 20);
    } else if (inRightZone) {
        text("Circle is BESIDE the rectangle (RIGHT side)", width/2, 20);
    } else {
        text("Circle is NOT beside the rectangle", width/2, 20);
    }
}

function isInLeftBesideZone(x, y) {
    let leftZoneX = blueRect.x - blueRect.width/2 - besideZoneWidth/2;
    let leftZoneLeft = leftZoneX - besideZoneWidth/2;
    let leftZoneRight = leftZoneX + besideZoneWidth/2;
    let zoneTop = blueRect.y - besideZoneHeight/2;
    let zoneBottom = blueRect.y + besideZoneHeight/2;
    
    // Check X coordinate first
    if (x < leftZoneLeft) {
        return false;
    }
    if (x > leftZoneRight) {
        return false;
    }
    
    // Check Y coordinate
    if (y < zoneTop) {
        return false;
    }
    if (y > zoneBottom) {
        return false;
    }
    
    // If we get here, the point is inside the zone
    return true;
}

function isInRightBesideZone(x, y) {
    let rightZoneX = blueRect.x + blueRect.width/2 + besideZoneWidth/2;
    let rightZoneLeft = rightZoneX - besideZoneWidth/2;
    let rightZoneRight = rightZoneX + besideZoneWidth/2;
    let zoneTop = blueRect.y - besideZoneHeight/2;
    let zoneBottom = blueRect.y + besideZoneHeight/2;
    
    // Check X coordinate first
    if (x < rightZoneLeft) {
        return false;
    }
    if (x > rightZoneRight) {
        return false;
    }
    
    // Check Y coordinate
    if (y < zoneTop) {
        return false;
    }
    if (y > zoneBottom) {
        return false;
    }
    
    // If we get here, the point is inside the zone
    return true;
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
    
    // Check if input is over the circle
    let distance = dist(inputX, inputY, movingCircle.x, movingCircle.y);
    if (distance < movingCircle.radius) {
        isDragging = true;
    }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
    if (isDragging) {
        let inputX = getInputX();
        let inputY = getInputY();
        
        movingCircle.x = inputX;
        movingCircle.y = inputY;
        
        // Keep circle within canvas bounds
        movingCircle.x = constrain(movingCircle.x, movingCircle.radius, 
                                  width - movingCircle.radius);
        movingCircle.y = constrain(movingCircle.y, movingCircle.radius, 
                                  height - movingCircle.radius);
    }
}

// Handle input end (both mouse and touch)
function handleInputEnd() {
    isDragging = false;
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
