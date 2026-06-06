import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/**
 * P5.js Sketch: BESIDE - Adjacent Positioning and Side-by-Side Relationships
 * 
 * CONCEPT: "Beside" means next to or at the side of something, indicating
 * a close proximity relationship where objects are positioned adjacent
 * to each other, typically at the same level or p.height.
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

let blueRect = { x: 200, y: 150, p.width: 80, p.height: 140 };
let movingCircle = { x: 80, y: 150, radius: 20, dragging: false };

// Zone dimensions
let besideZoneWidth = 60;
let besideZoneHeight = 140; // Same p.height as the rectangle

p.setup = function() {
}

p.draw = function() {
    p.background(...PALETTE.bg);
    
    // Draw blue rectangle (main object)
    p.fill(100, 150, 255);
    p.stroke(70, 120, 220);
    p.strokeWeight(3);
    rectMode(CENTER);
    p.rect(blueRect.x, blueRect.y, blueRect.width, blueRect.height);
    
    // Draw beside zones (left and right)
    drawBesideZones();
    
    // Draw the moving circle
    drawMovingCircle();
    
    // Draw status text
    drawSimpleStatus();
}

function drawBesideZones() {
    // Left beside zone
    let leftZoneX = blueRect.x - blueRect.width/2 - besideZoneWidth/2;
    let rightZoneX = blueRect.x + blueRect.width/2 + besideZoneWidth/2;
    let zoneY = blueRect.y;
    
    // Draw zones with subtle background
    p.fill(100, 150, 255, 50);
    p.stroke(100, 150, 255, 120);
    p.strokeWeight(2);
    
    // Left zone
    p.rect(leftZoneX, zoneY, besideZoneWidth, besideZoneHeight);
    
    // Right zone  
    p.rect(rightZoneX, zoneY, besideZoneWidth, besideZoneHeight);
    
    // Draw arrows pointing left and right from rectangle
    p.stroke(70, 120, 220);
    p.strokeWeight(2);
    let arrowLength = 20;
    let arrowSpacing = 35;
    
    // Calculate centered arrow positions
    let numArrows = 3;
    let totalArrowSpan = (numArrows - 1) * arrowSpacing;
    let startY = blueRect.y - totalArrowSpan/2;
    
    // Left arrows
    let leftRectEdge = blueRect.x - blueRect.width/2;
    for (let i = 0; i < numArrows; i++) {
        let y = startY + i * arrowSpacing;
        
        // Arrow line pointing left
        p.line(leftRectEdge, y, leftRectEdge - arrowLength, y);
        
        // Arrow head pointing left
        let arrowSize = 5;
        let arrowX = leftRectEdge - arrowLength;
        p.line(arrowX, y, arrowX + arrowSize, y - arrowSize);
        p.line(arrowX, y, arrowX + arrowSize, y + arrowSize);
    }
    
    // Right arrows
    let rightRectEdge = blueRect.x + blueRect.width/2;
    for (let i = 0; i < numArrows; i++) {
        let y = startY + i * arrowSpacing;
        
        // Arrow line pointing right
        p.line(rightRectEdge, y, rightRectEdge + arrowLength, y);
        
        // Arrow head pointing right
        let arrowSize = 5;
        let arrowX = rightRectEdge + arrowLength;
        p.line(arrowX, y, arrowX - arrowSize, y - arrowSize);
        p.line(arrowX, y, arrowX - arrowSize, y + arrowSize);
    }
    
    // Zone labels
    p.fill(70, 120, 220);
    p.noStroke();
    p.textAlign(CENTER, CENTER);
    p.textSize(10);
    p.text("BESIDE", leftZoneX, zoneY + besideZoneHeight/2 + 15);
    p.text("BESIDE", rightZoneX, zoneY + besideZoneHeight/2 + 15);
}

function drawMovingCircle() {
    // Check if circle center point is in either beside zone
    let inLeftZone = isInLeftBesideZone(movingCircle.x, movingCircle.y);
    let inRightZone = isInRightBesideZone(movingCircle.x, movingCircle.y);
    let inBesideZone = inLeftZone || inRightZone;
    
    // Set circle color based on zone
    if (inBesideZone) {
        p.fill(100, 255, 100); // Green when beside
        p.stroke(50, 200, 50);
    } else {
        p.fill(255, 150, 100); // Orange when not beside
        p.stroke(200, 100, 50);
    }
    
    p.strokeWeight(2);
    p.ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
}

function drawSimpleStatus() {
    // Check current status
    let inLeftZone = isInLeftBesideZone(movingCircle.x, movingCircle.y);
    let inRightZone = isInRightBesideZone(movingCircle.x, movingCircle.y);
    
    p.fill(...PALETTE.ink);
    p.noStroke();
    p.textAlign(CENTER);
    p.textSize(14);
    
    if (inLeftZone) {
        p.text("Circle is BESIDE the rectangle (left)", p.width/2, p.height - 20);
    } else if (inRightZone) {
        p.text("Circle is BESIDE the rectangle (right)", p.width/2, p.height - 20);
    } else {
        p.text("Circle is NOT beside the rectangle", p.width/2, p.height - 20);
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
    return p.touches.length > 0 ? p.touches[0].x : p.mouseX;
}

function getInputY() {
    return p.touches.length > 0 ? p.touches[0].y : p.mouseY;
}

// Handle input start (both mouse and touch)
function handleInputStart() {
    let inputX = getInputX();
    let inputY = getInputY();
    
    // Check if input is over the circle
    let distance = p.dist(inputX, inputY, movingCircle.x, movingCircle.y);
    if (distance < movingCircle.radius) {
        movingCircle.dragging = true;
    }
}

// Handle input drag (both mouse and touch)
function handleInputDrag() {
    if (movingCircle.dragging) {
        let inputX = getInputX();
        let inputY = getInputY();
        
        movingCircle.x = inputX;
        movingCircle.y = inputY;
        
        // Keep circle within canvas bounds
        movingCircle.x = p.constrain(movingCircle.x, movingCircle.radius, 
                                  p.width - movingCircle.radius);
        movingCircle.y = p.constrain(movingCircle.y, movingCircle.radius, 
                                  p.height - movingCircle.radius);
    }
}

// Handle input end (both mouse and touch)
function handleInputEnd() {
    movingCircle.dragging = false;
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
