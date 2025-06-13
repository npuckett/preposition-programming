/**
 * P5.js Sketch: UNDER - Passing Below or Beneath
 * 
 * CONCEPT: "Under" means passing below something, going beneath an 
 * obstacle or barrier. It implies movement that goes below and 
 * across something, often to avoid or pass beneath it.
 * 
 * LEARNING OBJECTIVES:
 * • Understand depth/elevation relationships in 2D space
 * • Practice arc movement and low trajectory calculations  
 * • Learn collision detection with overhead obstacles
 * • Explore path visualization and clearance concepts
 * 
 * KEY VARIABLES & METHODS:
 * • Bezier curves for arc paths that dip below
 * • Depth simulation using Y coordinates
 * • Path planning under obstacles
 * • lerp() for smooth movement along curves
 * 
 * EXTENSION IDEAS:
 * • Multiple obstacles to pass under
 * • Variable arc depths based on obstacle size
 * • Interactive tunnel mechanics
 * • Underground/underwater movement simulation
 * • Different passing methods (tunnel, dive, crawl)
 */

let obstacle = { x: 200, y: 120, width: 80, height: 60 };
let movingCircle = { x: 50, y: 200, radius: 12 };
let startPoint = { x: 50, y: 200 };
let endPoint = { x: 350, y: 200 };
let controlPoint = { x: 200, y: 260 }; // Lowest point of the arc (going under)
let progress = 0;
let isMoving = false;
let hasCompleted = false;
let path = [];
let showPath = true;

function setup() {
    createCanvas(400, 300).parent('canvas');
    
    // Pre-calculate the path for visualization
    calculatePath();
}

function draw() {
    background(240);
    
    // Update movement
    if (isMoving && progress < 1) {
        progress += 0.015; // Speed of crossing
        
        // Calculate position along bezier curve (going "under" the obstacle)
        let t = progress;
        movingCircle.x = bezierPoint(startPoint.x, startPoint.x, endPoint.x, endPoint.x, t);
        movingCircle.y = bezierPoint(startPoint.y, controlPoint.y, controlPoint.y, endPoint.y, t);
        
        // Check if animation is complete
        if (progress >= 1) {
            isMoving = false;
            hasCompleted = true;
        }
    }
    
    // Draw ground line
    stroke(100, 150, 100);
    strokeWeight(3);
    line(0, 220, width, 220);
    fill(100, 150, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    text("Ground Level", width/2, 235);
      // Draw obstacle (what we're going under) - positioned higher than in "over"
    fill(120, 80, 60);
    stroke(90, 60, 40);
    strokeWeight(2);
    rect(obstacle.x - obstacle.width/2, obstacle.y - obstacle.height/2, 
         obstacle.width, obstacle.height);
    
    // Draw dotted lines showing the "under" trigger zone
    stroke(100, 100, 100, 150);
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]); // Create dotted line pattern
    
    // Left boundary line (extending downward)
    line(obstacle.x - obstacle.width/2, obstacle.y + obstacle.height/2, 
         obstacle.x - obstacle.width/2, 280);
    
    // Right boundary line (extending downward)
    line(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
         obstacle.x + obstacle.width/2, 280);
    
    // Reset line dash for other drawings
    drawingContext.setLineDash([]);
    
    // Zone label
    fill(100, 100, 100, 150);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(8);
    text("Under Zone", obstacle.x, 270);
    
    // Obstacle label
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    text("Obstacle", obstacle.x, obstacle.y);
    
    // Draw the arc path (showing the "under" trajectory)
    if (showPath) {
        stroke(150, 150, 150, 150);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let i = 0; i < path.length; i++) {
            vertex(path[i].x, path[i].y);
        }
        endShape();
        
        // Draw path points
        fill(150, 150, 150, 100);
        noStroke();
        for (let i = 0; i < path.length; i += 5) {
            ellipse(path[i].x, path[i].y, 3, 3);
        }
    }
    
    // Draw depth indicators
    if (isMoving || hasCompleted) {
        // Current depth below ground
        let depthBelowGround = movingCircle.y - 220;
        if (depthBelowGround > 0) {
            stroke(100, 100, 200, 150);
            strokeWeight(1);
            line(movingCircle.x, movingCircle.y, movingCircle.x, 220);
            
            // Depth label
            fill(100, 100, 200);
            noStroke();
            textAlign(LEFT, CENTER);
            textSize(8);
            text(`${depthBelowGround.toFixed(0)}px deep`, movingCircle.x + 15, movingCircle.y + 10);
        }
    }
    
    // Draw start and end points
    fill(100, 255, 100);
    stroke(50, 200, 50);
    strokeWeight(2);
    ellipse(startPoint.x, startPoint.y, 20, 20);
    
    fill(255, 100, 100);
    stroke(200, 50, 50);
    ellipse(endPoint.x, endPoint.y, 20, 20);
    
    // Labels for start/end
    fill(50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(9);
    text("Start", startPoint.x, startPoint.y - 25);
    text("End", endPoint.x, endPoint.y - 25);
    
    // Draw moving circle
    fill(255, 215, 0);
    stroke(200, 165, 0);
    strokeWeight(2);
    ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
    
    // Draw direction arrow when moving
    if (isMoving) {
        // Calculate direction based on curve tangent
        let t = progress;
        let nextT = min(t + 0.01, 1);
        let currentX = bezierPoint(startPoint.x, startPoint.x, endPoint.x, endPoint.x, t);
        let currentY = bezierPoint(startPoint.y, controlPoint.y, controlPoint.y, endPoint.y, t);
        let nextX = bezierPoint(startPoint.x, startPoint.x, endPoint.x, endPoint.x, nextT);
        let nextY = bezierPoint(startPoint.y, controlPoint.y, controlPoint.y, endPoint.y, nextT);
        
        let dirX = nextX - currentX;
        let dirY = nextY - currentY;
        let dirLength = dist(0, 0, dirX, dirY);
        if (dirLength > 0) {
            dirX = (dirX / dirLength) * 20;
            dirY = (dirY / dirLength) * 20;
            
            stroke(255, 100, 100);
            strokeWeight(2);
            line(movingCircle.x, movingCircle.y, 
                 movingCircle.x + dirX, movingCircle.y + dirY);
        }
    }
    
    // Check if circle is under the obstacle
    let isUnderObstacle = (movingCircle.x > obstacle.x - obstacle.width/2 && 
                          movingCircle.x < obstacle.x + obstacle.width/2);
    
    if (isUnderObstacle && isMoving) {
        // Highlight when passing under
        fill(100, 100, 255, 100);
        noStroke();
        ellipse(movingCircle.x, movingCircle.y, 40, 40);
        
        fill(50);
        textAlign(CENTER, CENTER);
        textSize(10);
        text("UNDER the bridge!", movingCircle.x, movingCircle.y + 30);
    }
    
    // Instructions and status
    fill(50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    
    if (hasCompleted) {
        text("Successfully passed UNDER the bridge!", width/2, 30);
        text("Click to reset and try again", width/2, 45);
    } else if (isMoving) {
        text("Moving UNDER the bridge...", width/2, 30);
        text(`Progress: ${(progress * 100).toFixed(1)}%`, width/2, 45);
    } else {
        text("Click to move the yellow circle UNDER the brown bridge", width/2, 30);
        text("Watch the arc path that goes below and across", width/2, 45);
    }
    
    // Controls hint
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text("Press SPACE to toggle path visibility", width/2, height - 10);
}

function calculatePath() {
    path = [];
    for (let i = 0; i <= 100; i++) {
        let t = i / 100;
        let x = bezierPoint(startPoint.x, startPoint.x, endPoint.x, endPoint.x, t);
        let y = bezierPoint(startPoint.y, controlPoint.y, controlPoint.y, endPoint.y, t);
        path.push({x: x, y: y});
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
    if (hasCompleted || !isMoving) {
        // Reset animation
        progress = 0;
        isMoving = true;
        hasCompleted = false;
        movingCircle.x = startPoint.x;
        movingCircle.y = startPoint.y;
    }
}

function mousePressed() {
    handleInputStart();
}

// Handle touch events for mobile
function touchStarted() {
    handleInputStart();
    return false; // Prevent default touch behavior
}

function keyPressed() {
    if (key === ' ') {
        showPath = !showPath;
    } else if (key === '1') {
        // Shallow dip
        controlPoint.y = 240;
        calculatePath();
    } else if (key === '2') {
        // Medium dip
        controlPoint.y = 260;
        calculatePath();
    } else if (key === '3') {
        // Deep dip
        controlPoint.y = 280;
        calculatePath();
    } else if (key === 'r' || key === 'R') {
        // Reset
        progress = 0;
        isMoving = false;
        hasCompleted = false;
        movingCircle.x = startPoint.x;
        movingCircle.y = startPoint.y;
    }
}
