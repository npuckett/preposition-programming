/**
 * P5.js Sketch: UNTIL - Continuing Until a Condition is Met
 * 
 * CONCEPT: "Until" means an action continues up to a specific point,
 * then stops when that condition is reached. This shows the temporal
 * boundary where something ongoing comes to an end.
 * 
 * LEARNING OBJECTIVES:
 * • Understand conditional termination and stopping points
 * • Practice progress tracking toward a target
 * • Learn state transitions (running → stopped)
 * • Explore time-based or condition-based endings
 * 
 * KEY VARIABLES & METHODS:
 * • progress - tracks how close we are to the "until" point
 * • isRunning - boolean state for the ongoing action
 * • targetValue - the condition that ends the process
 * • map() - convert progress to visual representation
 * 
 * EXTENSION IDEAS:
 * • Multiple different "until" conditions
 * • User-defined stopping points
 * • Visual countdown indicators
 * • Different types of progress (time, distance, count)
 */

let progress = 0;
let isRunning = false;
let targetValue = 100; // Continue until we reach 100%
let startTime = 0;
let fillSpeed = 0.8; // How fast the progress increases

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240);
  
  // Update progress if running
  if (isRunning && progress < targetValue) {
    progress += fillSpeed;
    
    // Check if we've reached the "until" condition
    if (progress >= targetValue) {
      isRunning = false; // Stop when condition is met
      progress = targetValue; // Cap at target
    }
  }
  
  // Draw the progress container
  drawProgressBar();
  
  // Draw status and instructions
  drawInfo();
}

function drawProgressBar() {
  // Background container
  fill(220);
  stroke(150);
  strokeWeight(2);
  rect(50, 150, 300, 40, 5);
  
  // Progress fill (grows until target is reached)
  let fillWidth = map(progress, 0, targetValue, 0, 300);
  
  if (isRunning) {
    fill(100, 150, 255); // Blue while running
  } else if (progress >= targetValue) {
    fill(100, 255, 100); // Green when complete
  } else {
    fill(200); // Gray when stopped
  }
  
  noStroke();
  rect(50, 150, fillWidth, 40, 5);
  
  // Progress percentage text
  fill(50);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(`${progress.toFixed(1)}%`, 200, 170);
  
  // Target line
  stroke(255, 100, 100);
  strokeWeight(3);
  line(350, 140, 350, 200);
  
  // Target label
  fill(255, 100, 100);
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text("UNTIL", 350, 130);
  text("100%", 350, 210);
}

function drawInfo() {
  fill(50);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  
  if (progress >= targetValue) {
    fill(0, 150, 0);
    text("Process completed! It ran UNTIL 100%", width/2, 60);
    text("Click to start again", width/2, 250);
  } else if (isRunning) {
    fill(0, 0, 150);
    text("Process is running UNTIL it reaches 100%...", width/2, 60);
    text("Watch it continue until the target", width/2, 250);
  } else {
    text("Click to start a process that runs UNTIL 100%", width/2, 60);
    text("It will continue until the red line", width/2, 250);
  }
  
  // Simple status
  textAlign(LEFT);
  textSize(12);
  fill(100);
  text(`Status: ${isRunning ? "Running" : progress >= targetValue ? "Complete" : "Stopped"}`, 20, 30);
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
  if (progress >= targetValue || !isRunning) {
    // Reset and start the process
    progress = 0;
    isRunning = true;
    startTime = millis();
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
  if (key === 'r' || key === 'R') {
    // Reset
    progress = 0;
    isRunning = false;
  } else if (key === ' ') {
    // Start/stop toggle
    if (progress < targetValue) {
      isRunning = !isRunning;
    }
  }
}
