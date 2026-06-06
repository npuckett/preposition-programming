import { PALETTE } from "../js/shared/palette.js";
import * as diagram from "../js/shared/diagram.js";

export default function createSketch(p) {
/**
 * P5.js Sketch: INTO - Entry and Containment (Side View)
 * 
 * CONCEPT: "Into" represents movement from outside to inside something,
 * entering or penetrating a space, container, or boundary. This shows
 * a side view of a circle moving in an arc into a semi-transparent box.
 * 
 * LEARNING OBJECTIVES:
 * • Understand boundary detection and containment
 * • Practice arc movement with sine functions
 * • Learn drawing order for visual depth
 * • Explore transparency and visual effects
 * 
 * KEY VARIABLES & METHODS:
 * • p.sin() - Creates smooth arc movement
 * • p.lerp() - Smooth interpolation between points
 * • Drawing order: circle first, then container (for depth)
 * • Alpha transparency for see-through effects
 * 
 * EXTENSION IDEAS:
 * • Multiple objects entering the box
 * • Different entry angles or speeds
 * • Sound effects when entering
 * • Interactive dragging to control path
 */

// Container (the box the circle moves into)
let boxX = 280;
let boxY = 150;
let boxWidth = 100;
let boxHeight = 80;

// Moving circle
let circleX = 80;
let circleY = 200;
let circleSize = 20;

// Animation
let startX = 80;
let startY = 200;
let targetX = 330; // Inside the box
let targetY = 170; // Near the top inside the box
let progress = 0;
let isMoving = false;

p.setup = function() {
}

p.draw = function() {
    p.background(...PALETTE.bg);
    
    // Update movement when animation is active
    if (isMoving && progress < 1) {
        progress += 0.015; // Animation speed
        
        // Horizontal movement (linear)
        circleX = p.lerp(startX, targetX, progress);
        
        // Vertical movement with p.arc (using sine for smooth curve)
        let straightY = p.lerp(startY, targetY, progress);
        let arcHeight = 80; // Height of the arc
        let arcOffset = p.sin(progress * p.PI) * arcHeight;
        circleY = straightY - arcOffset;
        
        // Stop when animation completes
        if (progress >= 1) {
            isMoving = false;
        }
    }
    
    // Check if circle is inside the box
    let isInside = circleX > boxX && circleX < boxX + boxWidth &&
                   circleY > boxY && circleY < boxY + boxHeight;
    
    // Draw arc path guide (shows where circle will move)
    if (!isMoving || progress < 1) {
        drawArcPath();
    }
    
    // Draw the moving circle FIRST (so it appears behind the box)
    if (isInside) {
        p.fill(255, 100, 100); // Red when inside
    } else {
        p.fill(70, 130, 180); // Blue when outside
    }
    p.stroke(...PALETTE.ink);
    p.strokeWeight(2);
    p.ellipse(circleX, circleY, circleSize, circleSize);
    
    // Draw the box LAST (so it appears in front with transparency)
    if (isInside) {
        p.fill(100, 200, 100, 150); // Semi-transparent green when occupied
        p.stroke(80, 150, 80);
    } else {
        p.fill(200, 200, 200, 150); // Semi-transparent gray when empty
        p.stroke(120, 120, 120);
    }
    p.strokeWeight(3);
    p.rect(boxX, boxY, boxWidth, boxHeight);
    
    // Add opening indicator at top of box
    p.stroke(80, 80, 80);
    p.strokeWeight(4);
    p.line(boxX, boxY, boxX + boxWidth, boxY);
    
    // Instructions and status
    p.fill(...PALETTE.ink);
    p.noStroke();
    p.textAlign(CENTER);
    p.textSize(16);
    
    if (progress >= 1) {
        p.text("Circle moved INTO the box!", p.width/2, p.height - 40);
        p.textSize(12);
        p.text("Click to animate again", p.width/2, p.height - 20);
    } else if (isMoving) {
        p.text("Moving INTO the box...", p.width/2, p.height - 40);
    } else {
        p.text("Click to move circle INTO the box", p.width/2, p.height - 40);
        p.textSize(12);
        p.text("Watch the arc path and transparency effect", p.width/2, p.height - 20);
    }
}

function drawArcPath() {
    // Draw dotted line showing the arc path
    p.stroke(150, 150, 150, 120);
    p.strokeWeight(2);
    p.noFill();
    
    // Draw path in small segments for dotted effect
    for (let i = 0; i <= 20; i++) {
        let t = i / 20;
        let x = p.lerp(startX, targetX, t);
        let straightY = p.lerp(startY, targetY, t);
        let arcOffset = p.sin(t * p.PI) * 80;
        let y = straightY - arcOffset;
        
        // Draw dots every few segments
        if (i % 3 === 0) {
            p.ellipse(x, y, 3, 3);
        }
    }
}

p.mousePressed = function() {
    // Start or restart the animation
    progress = 0;
    isMoving = true;
    circleX = startX;
    circleY = startY;
}

// Touch support for mobile devices
p.touchStarted = function() {
    progress = 0;
    isMoving = true;
    circleX = startX;
    circleY = startY;
    return false; // Prevent default touch behavior
}

}
