import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
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
 * • p.random(min, max) - Generate random positions
 * • p.dist() - Check distances between objects
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

p.setup = function() {
// Create group of blue circles
    for (let i = 0; i < numCircles; i++) {
        let circle = {
            x: p.random(60, p.width - 60),
            y: p.random(60, p.height - 60),
            radius: p.random(12, 20)
        };
        
        // Ensure circles don't overlap too much
        let attempts = 0;
        while (attempts < 50) {
            let hasOverlap = false;
            for (let other of blueCircles) {
                if (p.dist(circle.x, circle.y, other.x, other.y) < circle.radius + other.radius + 10) {
                    hasOverlap = true;
                    break;
                }
            }
            
            if (!hasOverlap) break;
            
            circle.x = p.random(60, p.width - 60);
            circle.y = p.random(60, p.height - 60);
            attempts++;
        }
        
        blueCircles.push(circle);
    }
}

p.draw = function() {
    p.background(...PALETTE.bg);
    
    // Update movement
    if (isMoving && progress < 1) {
        progress += 0.02;
        movingCircle.x = p.lerp(currentPosition.x, targetPosition.x, progress);
        movingCircle.y = p.lerp(currentPosition.y, targetPosition.y, progress);
        
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
        let distance = p.dist(movingCircle.x, movingCircle.y, circle.x, circle.y);
        minDistanceToGroup = p.min(minDistanceToGroup, distance);
        
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
        let distance = p.dist(movingCircle.x, movingCircle.y, circle.x, circle.y);
        
        // Highlight circles that are close to the moving circle
        if (distance < 80) {
            p.fill(100, 150, 255, 150); // Lighter blue for nearby circles
            p.stroke(70, 120, 200);
        } else {
            p.fill(70, 130, 180);
            p.stroke(50, 100, 150);
        }
        
        p.strokeWeight(2);
        p.ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
        
        // Draw connection lines to nearby circles
        if (distance < 80 && movingCircle.isAmong) {
            p.stroke(150, 150, 150, 100);
            p.strokeWeight(1);
            p.line(movingCircle.x, movingCircle.y, circle.x, circle.y);
        }
    }
    
    // Draw moving circle
    if (movingCircle.isAmong) {
        p.fill(100, 255, 100); // Green when among the group
        p.stroke(50, 200, 50);
    } else {
        p.fill(255, 215, 0); // Yellow when not among the group
        p.stroke(200, 165, 0);
    }
    p.strokeWeight(3);
    p.ellipse(movingCircle.x, movingCircle.y, movingCircle.radius * 2, movingCircle.radius * 2);
    
    // Draw proximity indicator circle
    if (movingCircle.isAmong) {
        p.noFill();
        p.stroke(100, 255, 100, 100);
        p.strokeWeight(2);
        p.ellipse(movingCircle.x, movingCircle.y, 160, 160); // Shows the "among" detection radius
    }
    
    // Labels and instructions
    p.fill(...PALETTE.ink);
    p.noStroke();
    p.textAlign(CENTER, CENTER);
    p.textSize(14);
    
    if (movingCircle.isAmong) {
        p.text("Yellow circle is AMONG the blue circles!", p.width/2, 25);
        p.textSize(12);
        p.text(`Nearby circles: ${nearbyCount}`, p.width/2, 40);
    } else {
        p.text("Click anywhere to move the yellow circle", p.width/2, 25);
        p.text("Try to place it AMONG the blue circles", p.width/2, 40);
    }
    
    p.textSize(14);
    p.text("Green = among the group, Yellow = separate from group", p.width/2, p.height - 20);
    
   
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
        targetPosition.x = getInputX();
        targetPosition.y = getInputY();
        isMoving = true;
        progress = 0;
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
    // Reset to different positions
    if (p.key === '1') {
        // Place in center of group
        targetPosition.x = p.width/2;
        targetPosition.y = p.height/2;
    } else if (p.key === '2') {
        // Place at edge
        targetPosition.x = 50;
        targetPosition.y = p.height/2;
    } else if (p.key === '3') {
        // Place among a cluster
        if (blueCircles.length > 0) {
            let randomCircle = blueCircles[p.floor(p.random(blueCircles.length))];
            targetPosition.x = randomCircle.x + p.random(-30, 30);
            targetPosition.y = randomCircle.y + p.random(-30, 30);
        }
    } else if (p.key === 'r' || p.key === 'R') {
        // Regenerate the blue circles
        blueCircles = [];
        for (let i = 0; i < numCircles; i++) {
            let circle = {
                x: p.random(60, p.width - 60),
                y: p.random(60, p.height - 60),
                radius: p.random(12, 20)
            };
            blueCircles.push(circle);
        }
    }
    
    if (p.key >= '1' && p.key <= '3') {
        isMoving = true;
        progress = 0;
    }
}

}
