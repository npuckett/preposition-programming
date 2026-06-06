import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
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
 * • p.lerp() for smooth movement along curves
 * 
 * EXTENSION IDEAS:
 * • Multiple obstacles to pass under
 * • Variable arc depths based on obstacle size
 * • Interactive tunnel mechanics
 * • Underground/underwater movement simulation
 * • Different passing methods (tunnel, dive, crawl)
 */

let obstacle = { x: 200, y: 120, p.width: 80, p.height: 60 };
let movingCircle = { x: 50, y: 200, radius: 12 };
let startPoint = { x: 50, y: 200 };
let endPoint = { x: 350, y: 200 };
let controlPoint = { x: 200, y: 260 }; // Lowest point of the p.arc (going under)
let progress = 0;
let isMoving = false;
let hasCompleted = false;
let path = [];
let showPath = true;

p.setup = function() {
// Pre-calculate the path for visualization
    calculatePath();
}

p.draw = function() {
    p.background(...PALETTE.bg);
    
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
    p.stroke(100, 150, 100);
    p.strokeWeight(3);
    p.line(0, 220, p.width, 220);
    p.fill(100, 150, 100);
    p.noStroke();
    p.textAlign(CENTER, CENTER);
    p.textSize(10);
    p.text("Ground Level", p.width/2, 235);
      // Draw obstacle (what we're going under) - positioned higher than in "over"
    p.fill(120, 80, 60);
    p.stroke(90, 60, 40);
    p.strokeWeight(2);
    p.rect(obstacle.x - obstacle.width/2, obstacle.y - obstacle.height/2, 
         obstacle.width, obstacle.height);
    
    // Draw dotted lines showing the "under" trigger zone
    p.stroke(100, 100, 100, 150);
    p.strokeWeight(1);
    drawingContext.setLineDash([5, 5]); // Create dotted line pattern
    
    // Left boundary p.line (extending downward)
    p.line(obstacle.x - obstacle.width/2, obstacle.y + obstacle.height/2, 
         obstacle.x - obstacle.width/2, 280);
    
    // Right boundary p.line (extending downward)
    p.line(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
         obstacle.x + obstacle.width/2, 280);
    
    // Reset line dash for other drawings
    drawingContext.setLineDash([]);
    
    // Zone label
    p.fill(100, 100, 100, 150);
    p.noStroke();
    p.textAlign(CENTER, CENTER);
    p.textSize(8);
    p.text("Under Zone", obstacle.x, 270);
    
    // Obstacle label
    p.fill(255);
    p.noStroke();
    p.textAlign(CENTER, CENTER);
    p.textSize(10);
    p.text("Obstacle", obstacle.x, obstacle.y);
    
    // Draw the arc path (showing the "under" trajectory)
    if (showPath) {
        p.stroke(150, 150, 150, 150);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < path.length; i++) {
            p.vertex(path[i].x, path[i].y);
        }
        p.endShape();
        
        // Draw path points
        p.fill(150, 150, 150, 100);
        p.noStroke();
        for (let i = 0; i < path.length; i += 5) {
            p.ellipse(path[i].x, path[i].y, 3, 3);
        }
    }
    
    // Draw depth indicators
    if (isMoving || hasCompleted) {
        // Current depth below ground
        let depthBelowGround = movingCircle.y - 220;
        if (depthBelowGround > 0) {
            p.stroke(100, 100, 200, 150);
            p.strokeWeight(1);
            p.line(movingCircle.x, movingCircle.y, movingCircle.x, 220);
            
            // Depth label
            p.fill(100, 100, 200);
            p.noStroke();
            p.textAlign(LEFT, CENTER);
            p.textSize(8);
            p.text(`${depthBelowGround.toFixed(0)}px deep`, movingCircle.x + 15, movingCircle.y + 10);
        }
    }
    
    // Draw start and end points
    p.fill(100, 255, 100);
    p.stroke(50, 200, 50);
    p.strokeWeight(2);
    p.ellipse(startPoint.x, startPoint.y, 20, 20);
    
    p.fill(255, 100, 100);
    p.stroke(200, 50, 50);
    p.ellipse(endPoint.x, endPoint.y, 20, 20);
    
    // Labels for start/end
    p.fill(...PALETTE.ink);
    p.noStroke();
    p.textAlign(CENTER, CENTER);
    p.textSize(9);
    p.text("Start", startPoint.x, startPoint.y - 25);
    p.text("End", endPoint.x, endPoint.y - 25);
    
    // Draw moving circle
    p.fill(255, 215, 0);
    p.stroke(200, 165, 0);
    p.strokeWeight(2);
    p.ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
    
    // Draw direction arrow when moving
    if (isMoving) {
        // Calculate direction based on curve tangent
        let t = progress;
        let nextT = p.min(t + 0.01, 1);
        let currentX = bezierPoint(startPoint.x, startPoint.x, endPoint.x, endPoint.x, t);
        let currentY = bezierPoint(startPoint.y, controlPoint.y, controlPoint.y, endPoint.y, t);
        let nextX = bezierPoint(startPoint.x, startPoint.x, endPoint.x, endPoint.x, nextT);
        let nextY = bezierPoint(startPoint.y, controlPoint.y, controlPoint.y, endPoint.y, nextT);
        
        let dirX = nextX - currentX;
        let dirY = nextY - currentY;
        let dirLength = p.dist(0, 0, dirX, dirY);
        if (dirLength > 0) {
            dirX = (dirX / dirLength) * 20;
            dirY = (dirY / dirLength) * 20;
            
            p.stroke(255, 100, 100);
            p.strokeWeight(2);
            p.line(movingCircle.x, movingCircle.y, 
                 movingCircle.x + dirX, movingCircle.y + dirY);
        }
    }
    
    // Check if circle is under the obstacle
    let isUnderObstacle = (movingCircle.x > obstacle.x - obstacle.width/2 && 
                          movingCircle.x < obstacle.x + obstacle.width/2);
    
    if (isUnderObstacle && isMoving) {
        // Highlight when passing under
        p.fill(100, 100, 255, 100);
        p.noStroke();
        p.ellipse(movingCircle.x, movingCircle.y, 40, 40);
        
        p.fill(...PALETTE.ink);
        p.textAlign(CENTER, CENTER);
        p.textSize(10);
        p.text("UNDER the bridge!", movingCircle.x, movingCircle.y + 30);
    }
    
    // Instructions and status
    p.fill(...PALETTE.ink);
    p.noStroke();
    p.textAlign(CENTER, CENTER);
    p.textSize(12);
    
    if (hasCompleted) {
        p.text("Successfully passed UNDER the bridge!", p.width/2, 30);
        p.text("Click to reset and try again", p.width/2, 45);
    } else if (isMoving) {
        p.text("Moving UNDER the bridge...", p.width/2, 30);
        p.text(`Progress: ${(progress * 100).toFixed(1)}%`, p.width/2, 45);
    } else {
        p.text("Click to move the yellow circle UNDER the brown bridge", p.width/2, 30);
        p.text("Watch the arc path that goes below and across", p.width/2, 45);
    }
    
    // Controls hint
    p.textAlign(CENTER, BOTTOM);
    p.textSize(10);
    p.text("Press SPACE to toggle path visibility", p.width/2, p.height - 10);
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
    return p.touches.length > 0 ? p.touches[0].x : p.mouseX;
}

function getInputY() {
    return p.touches.length > 0 ? p.touches[0].y : p.mouseY;
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

p.mousePressed = function() {
    handleInputStart();
}

// Handle touch events for mobile
p.touchStarted = function() {
    handleInputStart();
    return false; // Prevent default touch behavior
}

p.keyPressed = function() {
    if (p.key === ' ') {
        showPath = !showPath;
    } else if (p.key === '1') {
        // Shallow dip
        controlPoint.y = 240;
        calculatePath();
    } else if (p.key === '2') {
        // Medium dip
        controlPoint.y = 260;
        calculatePath();
    } else if (p.key === '3') {
        // Deep dip
        controlPoint.y = 280;
        calculatePath();
    } else if (p.key === 'r' || p.key === 'R') {
        // Reset
        progress = 0;
        isMoving = false;
        hasCompleted = false;
        movingCircle.x = startPoint.x;
        movingCircle.y = startPoint.y;
    }
}

}
