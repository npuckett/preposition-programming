/**
 * P5.js Sketch: AROUND - Circular Motion and Orbital Movement
 * 
 * CONCEPT: "Around" represents circular or curved motion that encircles 
 * or goes about something, typically avoiding or surrounding an obstacle.
 * 
 * LEARNING OBJECTIVES:
 * • Understand trigonometric functions for circular motion
 * • Practice using sin() and cos() for orbital paths
 * • Learn angle management and rotation speed control
 * • Explore path visualization and trail effects
 * 
 * KEY VARIABLES & METHODS:
 * • angle - Current rotation angle in radians
 * • radius - Distance from center point
 * • sin(angle), cos(angle) - Calculate circular coordinates
 * • trail[] - Array to store previous positions
 * 
 * EXTENSION IDEAS:
 * • Multiple objects orbiting at different speeds
 * • Elliptical orbits using different X and Y radii
 * • Variable speed based on distance or mouse position
 * • Interactive controls for orbit size and speed
 * • Planetary system with nested orbits
 */

let obstacle = { x: 280, y: 150, radius: 50 };
let movingCircle = { x: 0, y: 0, radius: 12 };
let angle = 0;
let orbitRadius = 80;
let isMoving = false;
let trail = [];
let speed = 0.03;

function setup() {
    createCanvas(400, 300).parent('canvas');
}

function draw() {
    background(240);
    
    // Update movement
    if (isMoving) {
        angle += speed;
        
        // Calculate circular position around obstacle
        movingCircle.x = obstacle.x + cos(angle) * orbitRadius;
        movingCircle.y = obstacle.y + sin(angle) * orbitRadius;
        
        // Add to trail
        trail.push({x: movingCircle.x, y: movingCircle.y});
        
        // Limit trail length
        if (trail.length > 60) {
            trail.shift();
        }
    }
    
    // Draw orbital path guide
    stroke(200);
    strokeWeight(1);
    noFill();
    ellipse(obstacle.x, obstacle.y, orbitRadius * 2, orbitRadius * 2);
    
    // Draw trail
    if (trail.length > 1) {
        stroke(255, 200, 0, 150);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let i = 0; i < trail.length; i++) {
            let alpha = map(i, 0, trail.length - 1, 0, 255);
            stroke(255, 200, 0, alpha);
            if (i === 0) {
                curveVertex(trail[i].x, trail[i].y);
            }
            curveVertex(trail[i].x, trail[i].y);
            if (i === trail.length - 1) {
                curveVertex(trail[i].x, trail[i].y);
            }
        }
        endShape();
    }
    
    // Draw obstacle (what we're moving around)
    fill(70, 130, 180);
    stroke(50, 100, 150);
    strokeWeight(2);
    ellipse(obstacle.x, obstacle.y, obstacle.radius * 2, obstacle.radius * 2);
    
    // Draw moving circle
    fill(255, 215, 0);
    stroke(200, 165, 0);
    strokeWeight(2);
    ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
    
    // Draw direction indicator
    if (isMoving) {
        let dirX = cos(angle + PI/2) * 20;
        let dirY = sin(angle + PI/2) * 20;
        stroke(255, 100, 100);
        strokeWeight(3);
        line(movingCircle.x, movingCircle.y, 
             movingCircle.x + dirX, movingCircle.y + dirY);
    }
    
    // Draw simple status text
    fill(0);
    noStroke();
    textAlign(CENTER);
    textSize(14);
    
    let statusText = "";
    if (isMoving) {
        statusText = "Yellow circle moves AROUND blue obstacle";
    } else {
        statusText = "Click to start orbital motion around the obstacle";
    }
    
    text(statusText, width/2, height - 20);
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
        isMoving = true;
        trail = []; // Clear any existing trail
    } else {
        // Reset animation
        isMoving = false;
        angle = 0;
        trail = [];
        movingCircle.x = obstacle.x + orbitRadius;
        movingCircle.y = obstacle.y;
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
    // Speed controls
    if (key === '+' || key === '=') {
        speed = min(speed + 0.01, 0.1);
    } else if (key === '-' || key === '_') {
        speed = max(speed - 0.01, 0.005);
    }
    
    // Radius controls
    if (keyCode === UP_ARROW) {
        orbitRadius = min(orbitRadius + 10, 130);
    } else if (keyCode === DOWN_ARROW) {
        orbitRadius = max(orbitRadius - 10, 30);
    }
}
