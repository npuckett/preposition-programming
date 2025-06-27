/**
 * P5.js Sketch: SINCE - Growing Trail
 * 
 * CONCEPT: "Since" means from a point in time until now.
 * This shows a trail that grows longer since you clicked,
 * demonstrating accumulation over time through space.
 * 
 * LEARNING OBJECTIVES:
 * • Understand continuous growth from a starting point
 * • Practice trail/path visualization
 * • Learn state management and time tracking
 * • Explore spatial representation of temporal concepts
 * 
 * KEY VARIABLES & METHODS:
 * • trail - array of points that grows since start
 * • isGrowing - tracks if trail is active
 * • Simple point addition over time
 * 
 * EXTENSION IDEAS:
 * • Multiple trails from different start points
 * • Trail fading over time
 * • Different trail patterns and shapes
 */

// Trail that grows since starting point
let trail = [];
let isGrowing = false;
let startPoint = { x: 0, y: 0 };
let currentAngle = 0;
let trailLength = 0;

function setup() {
  createCanvas(400, 300).parent('canvas');
}

function draw() {
  background(240, 248, 255);
  
  // Update trail if growing
  if (isGrowing) {
    updateTrail();
  }
  
  // Draw trail
  drawTrail();
  
  // Draw status
  drawStatus();
}

function updateTrail() {
  // Add new point to trail every few frames
  if (frameCount % 3 === 0) {
    // Spiral pattern growing outward
    let radius = trailLength * 2;
    let x = startPoint.x + cos(currentAngle) * radius;
    let y = startPoint.y + sin(currentAngle) * radius;
    
    trail.push({ x: x, y: y });
    
    currentAngle += 0.2;
    trailLength += 0.5;
    
    // Keep trail manageable
    if (trail.length > 200) {
      trail.shift();
    }
  }
}

function drawTrail() {
  if (trail.length < 2) return;
  
  stroke(70, 130, 180);
  strokeWeight(3);
  noFill();
  
  // Draw the growing trail
  beginShape();
  for (let i = 0; i < trail.length; i++) {
    vertex(trail[i].x, trail[i].y);
  }
  endShape();
  
  // Draw start point
  fill(220, 50, 50);
  noStroke();
  ellipse(startPoint.x, startPoint.y, 8, 8);
  
  // Draw current end point
  if (trail.length > 0) {
    fill(50, 150, 50);
    let lastPoint = trail[trail.length - 1];
    ellipse(lastPoint.x, lastPoint.y, 6, 6);
  }
}

function drawStatus() {
  fill(60);
  textAlign(CENTER);
  textSize(14);
  
  if (!isGrowing) {
    text("Click to start a trail that grows SINCE your click", width/2, height - 20);
  } else {
    text(`Trail growing SINCE start (${trail.length} points)`, width/2, height - 20);
  }
}

function mousePressed() {
  // Start new trail from click point
  startPoint.x = mouseX;
  startPoint.y = mouseY;
  trail = [];
  isGrowing = true;
  currentAngle = 0;
  trailLength = 0;
}
