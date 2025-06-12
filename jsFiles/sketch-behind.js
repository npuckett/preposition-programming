/*
 * P5.js Sketch: BEHIND – Depth, Occlusion, and Layering
 *
 * CONCEPT:
 * "Behind" means one object is visually or spatially at the back of another, demonstrating occlusion or depth layering.
 * In this sketch, circles can overlap, and the blue circle is always rendered behind the red circle, visually demonstrating the preposition.
 *
 * LEARNING OBJECTIVES:
 * • Understand depth ordering and occlusion in 2D graphics
 * • Practice sorting and rendering objects by depth
 * • Explore overlap detection and percentage calculation
 * • Visualize spatial relationships and feedback
 *
 * KEY VARIABLES & METHODS:
 * • circles[]: array of circle objects with position, radius, color, and depth
 * • depth: property to determine rendering order (smaller = behind)
 * • percentOverlap: calculated overlap between circles
 * • dist(), ellipse(), sort(): P5.js math and drawing functions
 *
 * EXTENSION IDEAS:
 * • More than two objects with varying depths
 * • Dynamic depth changes (bring to front/back)
 * • Transparency or shadow effects for depth cues
 *
 * INTERACTION:
 * • Drag circles to change their position and overlap
 * • Blue is always behind, red is always in front
 */

// Circle objects in the scene
let circles = [
  { x: 120, y: 150, radius: 25, depth: 1, color: [100, 150, 255], label: "Blue (Back)", dragging: false },
  { x: 280, y: 150, radius: 25, depth: 2, color: [255, 100, 100], label: "Red (Front)", dragging: false }
];

function setup() {
  createCanvas(400, 300);
  // Set consistent depth order - blue circle is always behind (depth 1)
  circles[0].depth = 1; // Blue circle - always behind
  circles[1].depth = 2; // Red circle - always in front
}

function draw() {
  background(240);
  
  // Calculate the 3 key variables ALWAYS
  let distance = dist(circles[0].x, circles[0].y, circles[1].x, circles[1].y);
  let radiusSum = circles[0].radius + circles[1].radius;
  let isOverlapping = distance < radiusSum;
  
  // Calculate percentage overlap
  let percentOverlap = 0;
  if (isOverlapping) {
    let overlapDistance = radiusSum - distance;
    let maxPossibleOverlap = Math.min(circles[0].radius, circles[1].radius) * 2;
    percentOverlap = Math.min(100, (overlapDistance / maxPossibleOverlap) * 100);
  }
  
  // Sort circles by depth (smaller depth = behind)
  let sortedCircles = [...circles].sort((a, b) => a.depth - b.depth);
  let backCircle = sortedCircles[0]; // First in sorted array (lowest depth)
  let frontCircle = sortedCircles[1]; // Second in sorted array (highest depth)
  
  // Draw distance line between center points - ALWAYS
  stroke(100, 100, 100);
  strokeWeight(2);
  line(backCircle.x, backCircle.y, frontCircle.x, frontCircle.y);
  
  // Draw center points
  fill(50, 50, 50);
  noStroke();
  ellipse(backCircle.x, backCircle.y, 4, 4);
  ellipse(frontCircle.x, frontCircle.y, 4, 4);
  
  // Draw circles in depth order (back to front) - ALWAYS draw both
  for (let circle of sortedCircles) {
    // Determine if this circle is behind or in front
    let isBehind = (circle === backCircle);
    let isFront = (circle === frontCircle);
    
    // Make both circles 50% transparent for better overlap visibility
    fill(circle.color[0], circle.color[1], circle.color[2], 128); // 50% transparency
    
    // Color based on overlap status and position
    if (isOverlapping && isBehind) {
      stroke(255, 0, 0); // Red stroke for behind circle
      strokeWeight(3);
    } else if (isOverlapping && isFront) {
      stroke(0, 150, 0); // Green stroke for front circle
      strokeWeight(3);
    } else {
      stroke(0);
      strokeWeight(2);
    }
    
    ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
  }
  
  // Draw percentage on the back circle if overlapping
  if (isOverlapping) {
    fill(255, 255, 255);
    stroke(0);
    strokeWeight(1);
    textAlign(CENTER);
    textSize(12);
    text(Math.round(percentOverlap) + "%", backCircle.x, backCircle.y + 2);
    textSize(8);
    text("BEHIND", backCircle.x, backCircle.y - 10);
  }
  
  // Draw labels - ALWAYS
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  for (let circle of circles) {
    // Use the original label since depth is now fixed
    text(circle.label, circle.x, circle.y - circle.radius - 15);
    text("Depth: " + circle.depth, circle.x, circle.y - circle.radius - 5);
  }
  
  // ALWAYS display the 3 key variables
  textAlign(LEFT);
  textSize(12);
  fill(0);
  text("DISTANCE: " + Math.round(distance) + " pixels", 10, 25);
  text("OVERLAPPING: " + (isOverlapping ? "YES" : "NO"), 10, 45);
  text("% OVERLAP: " + Math.round(percentOverlap) + "%", 10, 65);
  
  // Determine relationship
  let relationship = "";
  if (isOverlapping) {
    let backColor = backCircle.label.split(' ')[0];
    let frontColor = frontCircle.label.split(' ')[0];
    relationship = `${backColor} is ${Math.round(percentOverlap)}% BEHIND ${frontColor}`;
  } else {
    relationship = "No overlap - no behind relationship";
  }
  
  // Draw relationship text
  textAlign(CENTER);
  textSize(16);
  if (isOverlapping) {
    fill(200, 50, 50); // Red when overlapping
  } else {
    fill(100, 100, 100); // Gray when not overlapping
  }
  text(relationship, width/2, height - 40);
  
  fill(0);
  textSize(12);
  text("Drag circles to change overlap • Blue is always behind, Red is always in front", width/2, height - 15);
}

function mousePressed() {
  // Check which circle is clicked - only for dragging, not for changing depth
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    if (dist(mouseX, mouseY, circle.x, circle.y) < circle.radius) {
      circle.dragging = true;
      break;
    }
  }
}

function mouseDragged() {
  // Update position if dragging
  for (let circle of circles) {
    if (circle.dragging) {
      circle.x = mouseX;
      circle.y = mouseY;
    }
  }
}

function mouseReleased() {
  // Stop dragging
  for (let circle of circles) {
    circle.dragging = false;
  }
}
