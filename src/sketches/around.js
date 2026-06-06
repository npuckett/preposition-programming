import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/**
 * P5.js Sketch: AROUND - Circular Motion and Orbital Movement
 * 
 * CONCEPT: "Around" represents circular or curved motion that encircles 
 * or goes about something, typically avoiding or surrounding an obstacle.
 * 
 * LEARNING OBJECTIVES:
 * • Understand trigonometric functions for circular motion
 * • Practice using p.sin() and p.cos() for orbital paths
 * • Learn angle management and rotation speed control
 * • Explore path visualization and trail effects
 * 
 * KEY VARIABLES & METHODS:
 * • angle - Current rotation angle in radians
 * • radius - Distance from center point
 * • p.sin(angle), p.cos(angle) - Calculate circular coordinates
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

p.setup = function() {
}

p.draw = function() {
    p.background(...PALETTE.bg);
    
    // Update movement
    if (isMoving) {
        angle += speed;
        
        // Calculate circular position around obstacle
        movingCircle.x = obstacle.x + p.cos(angle) * orbitRadius;
        movingCircle.y = obstacle.y + p.sin(angle) * orbitRadius;
        
        // Add to trail
        trail.push({x: movingCircle.x, y: movingCircle.y});
        
        // Limit trail length
        if (trail.length > 60) {
            trail.shift();
        }
    }
    
    // Draw orbital path guide
    p.stroke(...PALETTE.light);
    p.strokeWeight(1);
    p.noFill();
    p.ellipse(obstacle.x, obstacle.y, orbitRadius * 2, orbitRadius * 2);
    
    // Draw trail
    if (trail.length > 1) {
        p.stroke(255, 200, 0, 150);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < trail.length; i++) {
            let alpha = p.map(i, 0, trail.length - 1, 0, 255);
            p.stroke(255, 200, 0, alpha);
            if (i === 0) {
                curveVertex(trail[i].x, trail[i].y);
            }
            curveVertex(trail[i].x, trail[i].y);
            if (i === trail.length - 1) {
                curveVertex(trail[i].x, trail[i].y);
            }
        }
        p.endShape();
    }
    
    // Draw obstacle (what we're moving around)
    p.fill(70, 130, 180);
    p.stroke(50, 100, 150);
    p.strokeWeight(2);
    p.ellipse(obstacle.x, obstacle.y, obstacle.radius * 2, obstacle.radius * 2);
    
    // Draw moving circle
    p.fill(255, 215, 0);
    p.stroke(200, 165, 0);
    p.strokeWeight(2);
    p.ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
    
    // Draw direction indicator
    if (isMoving) {
        let dirX = p.cos(angle + p.PI/2) * 20;
        let dirY = p.sin(angle + p.PI/2) * 20;
        p.stroke(255, 100, 100);
        p.strokeWeight(3);
        p.line(movingCircle.x, movingCircle.y, 
             movingCircle.x + dirX, movingCircle.y + dirY);
    }
    
    // Draw simple status text
    p.fill(...PALETTE.ink);
    p.noStroke();
    p.textAlign(CENTER);
    p.textSize(14);
    
    let statusText = "";
    if (isMoving) {
        statusText = "Yellow circle moves AROUND blue obstacle";
    } else {
        statusText = "Click to start orbital motion around the obstacle";
    }
    
    p.text(statusText, p.width/2, p.height - 20);
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

p.mousePressed = function() {
    handleInputStart();
}

// Handle touch events for mobile
p.touchStarted = function() {
    handleInputStart();
    return false; // Prevent default touch behavior
}

p.keyPressed = function() {
    // Speed controls
    if (p.key === '+' || p.key === '=') {
        speed = p.min(speed + 0.01, 0.1);
    } else if (p.key === '-' || p.key === '_') {
        speed = p.max(speed - 0.01, 0.005);
    }
    
    // Radius controls
    if (p.keyCode === UP_ARROW) {
        orbitRadius = p.min(orbitRadius + 10, 130);
    } else if (p.keyCode === DOWN_ARROW) {
        orbitRadius = p.max(orbitRadius - 10, 30);
    }
}

}
