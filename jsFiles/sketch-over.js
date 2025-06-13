/**
 * P5.js Sketch: OVER - Crossing Above or Spanning Across
 * 
 * CONCEPT: "Over" can mean crossing above something (like a bridge over water)
 * or spanning across a distance. It implies movement that goes above and 
 * across an obstacle or area, often suggesting a path that clears something.
 * 
 * LEARNING OBJECTIVES:
 * • Understand height/elevation relationships in 2D space
 * • Practice arc movement and trajectory calculations  
 * • Learn collision detection with obstacles
 * • Explore path visualization and clearance concepts
 * 
 * KEY VARIABLES & METHODS:
 * • Bezier curves or quadratic curves for arc paths
 * • Height simulation using Y coordinates
 * • Path planning around obstacles
 * • lerp() for smooth movement along curves
 * 
 * EXTENSION IDEAS:
 * • Multiple obstacles to cross over
 * • Variable arc heights based on obstacle size
 * • Interactive bridge-building mechanics
 * • Physics simulation with gravity and launching
 * • Different crossing methods (bridge, jump, fly)
 */

let obstacle = { x: 200, y: 180, width: 80, height: 60 };
let movingCircle = { x: 50, y: 200, radius: 12 };
let startPoint = { x: 50, y: 200 };
let endPoint = { x: 350, y: 200 };
let controlPoint = { x: 200, y: 100 }; // Peak of the arc
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
        
        // Calculate position along bezier curve (going "over" the obstacle)
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
      // Draw obstacle (what we're going over)
    fill(120, 80, 60);
    stroke(90, 60, 40);
    strokeWeight(2);
    rect(obstacle.x - obstacle.width/2, obstacle.y - obstacle.height/2, 
         obstacle.width, obstacle.height);
    
    // Draw dotted lines showing the "over" trigger zone
    stroke(100, 100, 100, 150);
    strokeWeight(1);
    drawingContext.setLineDash([5, 5]); // Create dotted line pattern
    
    // Left boundary line
    line(obstacle.x - obstacle.width/2, obstacle.y - obstacle.height/2, 
         obstacle.x - obstacle.width/2, 50);
    
    // Right boundary line  
    line(obstacle.x + obstacle.width/2, obstacle.y - obstacle.height/2, 
         obstacle.x + obstacle.width/2, 50);
    
    // Reset line dash for other drawings
    drawingContext.setLineDash([]);
    
    // Zone label
    fill(100, 100, 100, 150);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(8);
    text("Over Zone", obstacle.x, 60);
    
    // Obstacle label
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    text("Obstacle", obstacle.x, obstacle.y);
    
    // Draw the arc path (showing the "over" trajectory)
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
    
    // Draw height indicators
    if (isMoving || hasCompleted) {
        // Current height above ground
        let heightAboveGround = 220 - movingCircle.y;
        stroke(200, 100, 100, 150);
        strokeWeight(1);
        line(movingCircle.x, movingCircle.y, movingCircle.x, 220);
        
        // Height label
        fill(200, 100, 100);
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(8);
        text(`${heightAboveGround.toFixed(0)}px high`, movingCircle.x + 15, movingCircle.y - 10);
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
    
    // Check if circle is over the obstacle
    let isOverObstacle = (movingCircle.x > obstacle.x - obstacle.width/2 && 
                         movingCircle.x < obstacle.x + obstacle.width/2);
    
    if (isOverObstacle && isMoving) {
        // Highlight when crossing over
        fill(255, 255, 0, 100);
        noStroke();
        ellipse(movingCircle.x, movingCircle.y, 40, 40);
        
        fill(50);
        textAlign(CENTER, CENTER);
        textSize(10);
        text("OVER the obstacle!", movingCircle.x, movingCircle.y - 30);
    }
    
    // Instructions and status
    fill(50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    
    if (hasCompleted) {
        text("Successfully crossed OVER the obstacle!", width/2, 30);
        text("Click to reset and try again", width/2, 45);
    } else if (isMoving) {
        text("Moving OVER the obstacle...", width/2, 30);
        text(`Progress: ${(progress * 100).toFixed(1)}%`, width/2, 45);
    } else {
        text("Click to move the yellow circle OVER the brown obstacle", width/2, 30);
        text("Watch the arc path that goes above and across", width/2, 45);
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
        path.push({x: x, y: y});    }
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
        // Low arc
        controlPoint.y = 150;
        calculatePath();
    } else if (key === '2') {
        // Medium arc
        controlPoint.y = 100;
        calculatePath();
    } else if (key === '3') {
        // High arc
        controlPoint.y = 60;
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
