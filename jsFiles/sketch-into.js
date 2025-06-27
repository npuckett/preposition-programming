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
 * • sin() - Creates smooth arc movement
 * • lerp() - Smooth interpolation between points
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

function setup() {
    createCanvas(400, 300).parent('canvas');
}

function draw() {
    background(240, 248, 255);
    
    // Update movement when animation is active
    if (isMoving && progress < 1) {
        progress += 0.015; // Animation speed
        
        // Horizontal movement (linear)
        circleX = lerp(startX, targetX, progress);
        
        // Vertical movement with arc (using sine for smooth curve)
        let straightY = lerp(startY, targetY, progress);
        let arcHeight = 80; // Height of the arc
        let arcOffset = sin(progress * PI) * arcHeight;
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
        fill(255, 100, 100); // Red when inside
    } else {
        fill(70, 130, 180); // Blue when outside
    }
    stroke(50);
    strokeWeight(2);
    ellipse(circleX, circleY, circleSize, circleSize);
    
    // Draw the box LAST (so it appears in front with transparency)
    if (isInside) {
        fill(100, 200, 100, 150); // Semi-transparent green when occupied
        stroke(80, 150, 80);
    } else {
        fill(200, 200, 200, 150); // Semi-transparent gray when empty
        stroke(120, 120, 120);
    }
    strokeWeight(3);
    rect(boxX, boxY, boxWidth, boxHeight);
    
    // Add opening indicator at top of box
    stroke(80, 80, 80);
    strokeWeight(4);
    line(boxX, boxY, boxX + boxWidth, boxY);
    
    // Instructions and status
    fill(60);
    noStroke();
    textAlign(CENTER);
    textSize(16);
    
    if (progress >= 1) {
        text("Circle moved INTO the box!", width/2, height - 40);
        textSize(12);
        text("Click to animate again", width/2, height - 20);
    } else if (isMoving) {
        text("Moving INTO the box...", width/2, height - 40);
    } else {
        text("Click to move circle INTO the box", width/2, height - 40);
        textSize(12);
        text("Watch the arc path and transparency effect", width/2, height - 20);
    }
}

function drawArcPath() {
    // Draw dotted line showing the arc path
    stroke(150, 150, 150, 120);
    strokeWeight(2);
    noFill();
    
    // Draw path in small segments for dotted effect
    for (let i = 0; i <= 20; i++) {
        let t = i / 20;
        let x = lerp(startX, targetX, t);
        let straightY = lerp(startY, targetY, t);
        let arcOffset = sin(t * PI) * 80;
        let y = straightY - arcOffset;
        
        // Draw dots every few segments
        if (i % 3 === 0) {
            ellipse(x, y, 3, 3);
        }
    }
}

function mousePressed() {
    // Start or restart the animation
    progress = 0;
    isMoving = true;
    circleX = startX;
    circleY = startY;
}

// Touch support for mobile devices
function touchStarted() {
    progress = 0;
    isMoving = true;
    circleX = startX;
    circleY = startY;
    return false; // Prevent default touch behavior
}
