/**
 * P5.js Sketch: INTO - Entry and Containment
 * 
 * CONCEPT: "Into" represents movement from outside to inside something,
 * entering or penetrating a space, container, or boundary. This implies
 * a transition from external to internal position.
 * 
 * LEARNING OBJECTIVES:
 * • Understand boundary detection and containment
 * • Practice distance calculations for circular boundaries
 * • Learn state transitions (outside → inside)
 * • Explore smooth movement with lerp()
 * 
 * KEY VARIABLES & METHODS:
 * • dist(x1, y1, x2, y2) - Calculate distance between points
 * • lerp(start, stop, amount) - Smooth interpolation
 * • isInside boolean - Track containment state
 * • progress - Animation progression (0 to 1)
 * 
 * EXTENSION IDEAS:
 * • Multiple entry points or paths
 * • Different container shapes (rectangles, polygons)
 * • Particle system entering container
 * • Interactive dragging to move objects into containers
 * • Sound or visual effects when entry is complete
 */

let container = { x: 280, y: 150, radius: 70 };
let movingCircle = { x: 80, y: 150, radius: 15 };
let startPoint = { x: 80, y: 150 };
let targetPoint = { x: 280, y: 150 };
let progress = 0;
let isMoving = false;
let hasEntered = false;
let wasOutside = true;
let trail = [];

function setup() {
    createCanvas(400, 300);
}

function draw() {
    background(240);
    
    // Update movement
    if (isMoving && progress < 1) {
        progress += 0.015; // Speed of entry
        movingCircle.x = lerp(startPoint.x, targetPoint.x, progress);
        movingCircle.y = lerp(startPoint.y, targetPoint.y, progress);
        
        // Add to trail
        trail.push({x: movingCircle.x, y: movingCircle.y});
        
        // Limit trail length
        if (trail.length > 40) {
            trail.shift();
        }
        
        // Check if animation is complete
        if (progress >= 1) {
            isMoving = false;
            hasEntered = true;
        }
    }
    
    // Check if circle is inside container
    let distance = dist(movingCircle.x, movingCircle.y, container.x, container.y);
    let isInside = distance <= container.radius - movingCircle.radius;
    
    // Track entry event
    if (isInside && wasOutside && !isMoving) {
        hasEntered = true;
    }
    wasOutside = !isInside;
    
    // Draw container with visual feedback
    if (isInside) {
        fill(100, 200, 100, 100); // Green when object is inside
        stroke(50, 150, 50);
    } else {
        fill(70, 130, 180, 100); // Blue when empty
        stroke(50, 100, 150);
    }
    strokeWeight(3);
    ellipse(container.x, container.y, container.radius * 2, container.radius * 2);
    
    // Draw entry path guide
    if (!hasEntered) {
        stroke(150, 150, 150, 100);
        strokeWeight(2);
        setLineDash([5, 5]);
        line(startPoint.x, startPoint.y, targetPoint.x, targetPoint.y);
        setLineDash([]);
    }
    
    // Draw trail
    if (trail.length > 1) {
        stroke(255, 200, 0, 150);
        strokeWeight(3);
        noFill();
        for (let i = 1; i < trail.length; i++) {
            let alpha = map(i, 0, trail.length - 1, 50, 255);
            stroke(255, 200, 0, alpha);
            line(trail[i-1].x, trail[i-1].y, trail[i].x, trail[i].y);
        }
    }
    
    // Draw moving circle
    fill(255, 215, 0);
    stroke(200, 165, 0);
    strokeWeight(2);
    ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
    
    // Draw direction arrow when moving
    if (isMoving) {
        let dirX = targetPoint.x - startPoint.x;
        let dirY = targetPoint.y - startPoint.y;
        let dirLength = dist(0, 0, dirX, dirY);
        dirX = (dirX / dirLength) * 25;
        dirY = (dirY / dirLength) * 25;
        
        stroke(255, 100, 100);
        strokeWeight(3);
        line(movingCircle.x, movingCircle.y, 
             movingCircle.x + dirX, movingCircle.y + dirY);
          // Arrow head
        push();
        translate(movingCircle.x + dirX, movingCircle.y + dirY);
        rotate(atan2(dirY, dirX));
        fill(255, 100, 100);
        noStroke();
        triangle(0, 0, -8, -4, -8, 4);
        pop();
    }
    
    // Labels and status
    fill(50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    
    if (hasEntered) {
        text("Object has entered the container!", width/2, 30);
        text("Click to reset and try again", width/2, height - 30);
    } else if (isMoving) {
        text("Moving INTO the container...", width/2, 30);
        text(`Progress: ${(progress * 100).toFixed(1)}%`, width/2, height - 30);
    } else {
        text("Click to move the yellow circle INTO the blue container", width/2, 30);
        text("Yellow circle moves from outside to inside", width/2, height - 30);
    }
    
    // Status indicator
    textAlign(LEFT, TOP);
    textSize(10);
    text(`Status: ${isInside ? "INSIDE" : "OUTSIDE"}`, 10, 40);
    text(`Distance from center: ${distance.toFixed(1)}px`, 10, 65);    text(`Container radius: ${container.radius}px`, 10, 80);
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
    if (hasEntered || !isMoving) {
        // Reset animation
        progress = 0;
        isMoving = true;
        hasEntered = false;
        wasOutside = true;
        trail = [];
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
    // Change entry direction
    if (key === '1') {
        startPoint = { x: 80, y: 150 };   // From left
        targetPoint = { x: 280, y: 150 };
    } else if (key === '2') {
        startPoint = { x: 280, y: 80 };   // From top
        targetPoint = { x: 280, y: 150 };
    } else if (key === '3') {
        startPoint = { x: 380, y: 150 };  // From right
        targetPoint = { x: 280, y: 150 };
    } else if (key === '4') {
        startPoint = { x: 280, y: 220 };  // From bottom
        targetPoint = { x: 280, y: 150 };
    }
    
    // Reset if direction changed
    if (key >= '1' && key <= '4') {
        progress = 0;
        isMoving = false;
        hasEntered = false;
        trail = [];
        movingCircle.x = startPoint.x;
        movingCircle.y = startPoint.y;
    }
}

// Helper function for dashed lines (P5.js doesn't have native support)
function setLineDash(segments) {
    // This is a placeholder - actual implementation would require custom line drawing
    // For web editor, you might need to use native canvas methods or draw manual dashes
}
