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
 * • Snapping mechanisms for precise positioning
 * • Visual indicators for "beside" relationships
 * 
 * EXTENSION IDEAS:
 * • Multiple objects that can be placed beside each other
 * • Snap-to-grid functionality for precise alignment
 * • Different "beside" variations (left, right, both sides)
 * • Interactive arrangement of objects in rows
 * • Magnetic attraction when objects get close
 */

let blueSquare = { x: 200, y: 150, size: 60 };
let movingCircle = { x: 100, y: 100, radius: 20 };
let isDragging = false;
let isBeside = false;
let besideDirection = ""; // "left", "right", or ""
let snapDistance = 80; // Distance for "beside" detection
let alignmentTolerance = 30; // Y-axis alignment tolerance

function setup() {
    createCanvas(400, 300);
}

function draw() {
    background(240);
    
    // Check if circle is beside the square
    checkBesideRelationship();
    
    // Draw alignment guides
    drawAlignmentGuides();
    
    // Draw blue square
    if (isBeside) {
        fill(100, 200, 255); // Lighter blue when circle is beside it
        stroke(50, 150, 200);
    } else {
        fill(70, 130, 180);
        stroke(50, 100, 150);
    }
    strokeWeight(3);
    rectMode(CENTER);
    rect(blueSquare.x, blueSquare.y, blueSquare.size, blueSquare.size);
    
    // Draw "beside" zones (visual indicators)
    if (!isBeside) {
        // Left beside zone
        fill(100, 255, 100, 50);
        stroke(50, 200, 50, 100);
        strokeWeight(2);
        rect(blueSquare.x - blueSquare.size/2 - snapDistance/2, blueSquare.y, 
             snapDistance, blueSquare.size + alignmentTolerance * 2);
        
        // Right beside zone  
        rect(blueSquare.x + blueSquare.size/2 + snapDistance/2, blueSquare.y, 
             snapDistance, blueSquare.size + alignmentTolerance * 2);
        
        // Zone labels
        fill(50, 150, 50);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(10);
        text("BESIDE\n(left)", blueSquare.x - blueSquare.size/2 - snapDistance/2, blueSquare.y);
        text("BESIDE\n(right)", blueSquare.x + blueSquare.size/2 + snapDistance/2, blueSquare.y);
    }
    
    // Draw moving circle
    if (isBeside) {
        fill(100, 255, 100); // Green when beside
        stroke(50, 200, 50);
    } else {
        fill(255, 215, 0); // Yellow when not beside
        stroke(200, 165, 0);
    }
    strokeWeight(3);
    ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
    
    // Draw connection line when beside
    if (isBeside) {
        stroke(100, 255, 100, 150);
        strokeWeight(2);
        line(movingCircle.x, movingCircle.y, blueSquare.x, blueSquare.y);
        
        // Distance indicator
        let distance = dist(movingCircle.x, movingCircle.y, blueSquare.x, blueSquare.y);
        fill(50);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(8);
        text(`${distance.toFixed(0)}px`, 
             (movingCircle.x + blueSquare.x) / 2, 
             (movingCircle.y + blueSquare.y) / 2 - 10);
    }
    
    // Draw positioning information
    drawPositionInfo();
    
    // Instructions
    fill(50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    
    if (isBeside) {
        text(`Circle is BESIDE the square (${besideDirection} side)!`, width/2, 30);
        text("Green connection shows the beside relationship", width/2, 45);
    } else {
        text("Drag the yellow circle to place it BESIDE the blue square", width/2, 30);
        text("Try to align it horizontally and position it to the left or right", width/2, 45);
    }
    
    // Controls
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text("Drag the circle • Green zones show where 'beside' positioning works", width/2, height - 10);
}

function checkBesideRelationship() {
    let horizontalDistance = abs(movingCircle.x - blueSquare.x);
    let verticalAlignment = abs(movingCircle.y - blueSquare.y);
    
    // Check if vertically aligned (same level)
    let isAligned = verticalAlignment <= alignmentTolerance;
    
    // Check if horizontally beside (appropriate distance)
    let minBesideDistance = blueSquare.size/2 + movingCircle.radius + 10;
    let maxBesideDistance = snapDistance;
    let isBesideDistance = horizontalDistance >= minBesideDistance && 
                          horizontalDistance <= maxBesideDistance;
    
    isBeside = isAligned && isBesideDistance;
    
    if (isBeside) {
        if (movingCircle.x < blueSquare.x) {
            besideDirection = "left";
        } else {
            besideDirection = "right";
        }
    } else {
        besideDirection = "";
    }
}

function drawAlignmentGuides() {
    // Horizontal alignment guide
    stroke(200, 100, 100, 100);
    strokeWeight(1);
    setLineDash([5, 5]);
    line(0, blueSquare.y, width, blueSquare.y);
    setLineDash([]);
    
    // Vertical alignment indicators
    let minY = blueSquare.y - alignmentTolerance;
    let maxY = blueSquare.y + alignmentTolerance;
    
    if (movingCircle.y >= minY && movingCircle.y <= maxY) {
        // Show alignment zone
        fill(255, 100, 100, 50);
        noStroke();
        rect(0, minY, width, alignmentTolerance * 2);
        
        // Alignment status
        fill(255, 100, 100);
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(10);
        text("ALIGNED", 10, blueSquare.y);
    }
}

function drawPositionInfo() {
    // Info panel
    fill(255, 255, 255, 200);
    stroke(150);
    strokeWeight(1);
    rect(10, 10, 180, 80);
    
    fill(50);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(10);
    text("Position Information:", 15, 20);
    
    text(`Circle: (${movingCircle.x.toFixed(0)}, ${movingCircle.y.toFixed(0)})`, 15, 35);
    text(`Square: (${blueSquare.x}, ${blueSquare.y})`, 15, 50);
    
    let hDist = abs(movingCircle.x - blueSquare.x);
    let vDist = abs(movingCircle.y - blueSquare.y);
    text(`H-Distance: ${hDist.toFixed(0)}px`, 15, 65);
    text(`V-Distance: ${vDist.toFixed(0)}px`, 15, 80);
    
    // Status indicator
    if (isBeside) {
        fill(100, 255, 100);
        text("STATUS: BESIDE (" + besideDirection + ")", 15, 5);
    } else {
        fill(255, 100, 100);
        text("STATUS: NOT BESIDE", 15, 5);
    }
}

function mousePressed() {
    // Check if mouse is over the circle
    let distance = dist(mouseX, mouseY, movingCircle.x, movingCircle.y);
    if (distance < movingCircle.radius) {
        isDragging = true;
    }
}

function mouseDragged() {
    if (isDragging) {
        movingCircle.x = mouseX;
        movingCircle.y = mouseY;
        
        // Keep circle within canvas bounds
        movingCircle.x = constrain(movingCircle.x, movingCircle.radius, 
                                  width - movingCircle.radius);
        movingCircle.y = constrain(movingCircle.y, movingCircle.radius, 
                                  height - movingCircle.radius);
    }
}

function mouseReleased() {
    if (isDragging) {
        // Snap to beside position if close enough
        let horizontalDistance = abs(movingCircle.x - blueSquare.x);
        let verticalAlignment = abs(movingCircle.y - blueSquare.y);
        
        if (verticalAlignment <= alignmentTolerance * 1.5) {
            // Snap to horizontal alignment
            movingCircle.y = blueSquare.y;
            
            // Snap to beside position if close
            let snapToBeside = blueSquare.size/2 + movingCircle.radius + 20;
            
            if (movingCircle.x < blueSquare.x && horizontalDistance < snapDistance) {
                // Snap to left beside
                movingCircle.x = blueSquare.x - snapToBeside;
            } else if (movingCircle.x > blueSquare.x && horizontalDistance < snapDistance) {
                // Snap to right beside
                movingCircle.x = blueSquare.x + snapToBeside;
            }
        }
    }
    
    isDragging = false;
}

function keyPressed() {
    if (key === '1') {
        // Position circle beside left
        movingCircle.x = blueSquare.x - blueSquare.size/2 - movingCircle.radius - 20;
        movingCircle.y = blueSquare.y;
    } else if (key === '2') {
        // Position circle beside right
        movingCircle.x = blueSquare.x + blueSquare.size/2 + movingCircle.radius + 20;
        movingCircle.y = blueSquare.y;
    } else if (key === '3') {
        // Position circle not beside (above)
        movingCircle.x = blueSquare.x;
        movingCircle.y = blueSquare.y - 80;
    } else if (key === 'r' || key === 'R') {
        // Reset to starting position
        movingCircle.x = 100;
        movingCircle.y = 100;
    }
}

// Helper function for dashed lines
function setLineDash(segments) {
    // Placeholder for dashed line functionality
    // In actual P5.js, you might need to implement this manually
}
