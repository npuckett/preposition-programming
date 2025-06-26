/**
 * P5.js Sketch: AMONG - Distribution Within a Group
 * 
 * CONCEPT: "Among" represents being in the midst of or surrounded by
 * multiple things, typically suggesting distribution or placement within
 * a group or collection of similar objects.
 * 
 * LEARNING OBJECTIVES:
 * • Understand spatial distribution and random placement
 * • Practice collision detection with multiple objects
 * • Learn array manipulation and object management
 * • Explore highlighting and selection in groups
 * 
 * KEY VARIABLES & METHODS:
 * • array.push() - Add objects to collections
 * • random(min, max) - Generate random positions
 * • dist() - Check distances between objects
 * • for loops - Process multiple objects
 * 
 * EXTENSION IDEAS:
 * • Different group sizes and densities
 * • Interactive selection of objects in the group
 * • Animation showing object joining/leaving group
 * • Different shapes or colors for variety
 * • Clustering and spacing algorithms
 */

let blueCircles = [];
let movingCircle = { x: 200, y: 150, radius: 15, isAmong: false };
let numCircles = 12;
let isMoving = false;
let targetPosition = { x: 200, y: 150 };
let currentPosition = { x: 200, y: 150 };
let progress = 0;

function setup() {
    createCanvas(400, 300).parent('canvas');
    
    // Create group of blue circles
    for (let i = 0; i < numCircles; i++) {
        let circle = {
            x: random(60, width - 60),
            y: random(60, height - 60),
            radius: random(12, 20)
        };
        
        // Ensure circles don't overlap too much
        let attempts = 0;
        while (attempts < 50) {
            let hasOverlap = false;
            for (let other of blueCircles) {
                if (dist(circle.x, circle.y, other.x, other.y) < circle.radius + other.radius + 10) {
                    hasOverlap = true;
                    break;
                }
            }
            
            if (!hasOverlap) break;
            
            circle.x = random(60, width - 60);
            circle.y = random(60, height - 60);
            attempts++;
        }
        
        blueCircles.push(circle);
    }
}

function draw() {
    background(240);
    
    // Update movement
    if (isMoving && progress < 1) {
        progress += 0.02;
        movingCircle.x = lerp(currentPosition.x, targetPosition.x, progress);
        movingCircle.y = lerp(currentPosition.y, targetPosition.y, progress);
        
        if (progress >= 1) {
            isMoving = false;
            currentPosition.x = movingCircle.x;
            currentPosition.y = movingCircle.y;
        }
    }
    
    // Check if moving circle is among the blue circles
    let nearbyCount = 0;
    let minDistanceToGroup = Infinity;
    
    for (let circle of blueCircles) {
        let distance = dist(movingCircle.x, movingCircle.y, circle.x, circle.y);
        minDistanceToGroup = min(minDistanceToGroup, distance);
        
        // Count nearby circles (within a reasonable distance)
        if (distance < 80) {
            nearbyCount++;
        }
    }
    
    // Determine if the circle is "among" the group
    movingCircle.isAmong = nearbyCount >= 3 && minDistanceToGroup < 60;
    
    // Draw blue circles (the group)
    for (let i = 0; i < blueCircles.length; i++) {
        let circle = blueCircles[i];
        let distance = dist(movingCircle.x, movingCircle.y, circle.x, circle.y);
        
        // Highlight circles that are close to the moving circle
        if (distance < 80) {
            fill(100, 150, 255, 150); // Lighter blue for nearby circles
            stroke(70, 120, 200);
        } else {
            fill(70, 130, 180);
            stroke(50, 100, 150);
        }
        
        strokeWeight(2);
        ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
        
        // Draw connection lines to nearby circles
        if (distance < 80 && movingCircle.isAmong) {
            stroke(150, 150, 150, 100);
            strokeWeight(1);
            line(movingCircle.x, movingCircle.y, circle.x, circle.y);
        }
    }
    
    // Draw moving circle
    if (movingCircle.isAmong) {
        fill(100, 255, 100); // Green when among the group
        stroke(50, 200, 50);
    } else {
        fill(255, 215, 0); // Yellow when not among the group
        stroke(200, 165, 0);
    }
    strokeWeight(3);
    ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
    
    // Draw proximity indicator circle
    if (movingCircle.isAmong) {
        noFill();
        stroke(100, 255, 100, 100);
        strokeWeight(2);
        ellipse(movingCircle.x, movingCircle.y, 160, 160); // Shows the "among" detection radius
    }
    
    // Labels and instructions
    fill(50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    
    if (movingCircle.isAmong) {
        text("Yellow circle is AMONG the blue circles!", width/2, 25);
        textSize(12);
        text(`Nearby circles: ${nearbyCount}`, width/2, 40);
    } else {
        text("Click anywhere to move the yellow circle", width/2, 25);
        text("Try to place it AMONG the blue circles", width/2, 40);
    }
    
    textSize(14);
    text("Green = among the group, Yellow = separate from group", width/2, height - 20);
    
    // Status information
    textAlign(LEFT, TOP);
    textSize(10);
    text(`Status: ${movingCircle.isAmong ? "AMONG" : "SEPARATE"}`, 10, 10);
    text(`Nearby circles: ${nearbyCount}`, 10, 25);    text(`Min distance: ${minDistanceToGroup.toFixed(1)}px`, 10, 40);
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
    if (!isMoving) {
        targetPosition.x = getInputX();
        targetPosition.y = getInputY();
        isMoving = true;
        progress = 0;
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
    // Reset to different positions
    if (key === '1') {
        // Place in center of group
        targetPosition.x = width/2;
        targetPosition.y = height/2;
    } else if (key === '2') {
        // Place at edge
        targetPosition.x = 50;
        targetPosition.y = height/2;
    } else if (key === '3') {
        // Place among a cluster
        if (blueCircles.length > 0) {
            let randomCircle = blueCircles[floor(random(blueCircles.length))];
            targetPosition.x = randomCircle.x + random(-30, 30);
            targetPosition.y = randomCircle.y + random(-30, 30);
        }
    } else if (key === 'r' || key === 'R') {
        // Regenerate the blue circles
        blueCircles = [];
        for (let i = 0; i < numCircles; i++) {
            let circle = {
                x: random(60, width - 60),
                y: random(60, height - 60),
                radius: random(12, 20)
            };
            blueCircles.push(circle);
        }
    }
    
    if (key >= '1' && key <= '3') {
        isMoving = true;
        progress = 0;
    }
}
