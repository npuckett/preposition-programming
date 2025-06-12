/*
 * PREPOSITION: UNTIL
 * 
 * CONCEPT:
 * "Until" indicates that an action or state continues up to a specific 
 * point in time or condition, then stops. It defines the endpoint or 
 * terminating condition for an ongoing process.
 * 
 * LEARNING OBJECTIVES:
 * - Implement conditional termination and endpoints
 * - Create countdown and progress tracking systems
 * - Use loop conditions with exit criteria
 * - Manage state transitions at specific thresholds
 * - Build time-bounded and condition-bounded processes
 * 
 * KEY VARIABLES:
 * - process: object containing start time and activities
 * - activities: array of different processes with individual targets
 * - stopCondition: boolean for manual termination
 * 
 * KEY METHODS:
 * - millis(): time tracking for countdowns
 * - map(): progress visualization
 * - constrain(): limit values within bounds
 * - min()/max(): boundary calculations
 * 
 * HOW TO EXTEND:
 * 1. Add user-defined stopping conditions
 * 2. Create cascading stop conditions (one stops others)
 * 3. Implement pause/resume functionality
 * 4. Add visual warnings before stopping
 * 5. Create different types of stopping criteria
 * 6. Add sound effects for completions
 * 7. Implement save/load for process states
 */

// Process management object
let process = {
  startTime: null,        // When processes started
  running: false,         // Are processes currently running?
  stopCondition: false,   // Manual stop trigger
  activities: []          // Array of different activities
};

// Visual effects
let particles = [];

function setup() {
  createCanvas(600, 400);
  
  // Define different activities that run "until" their conditions are met
  process.activities = [
    {
      name: "Countdown Timer",
      target: 6000,           // 6 seconds until stop
      active: false,
      type: "timer"
    },
    {
      name: "Progress Bar", 
      target: 100,            // Until 100% complete
      current: 0,
      active: false,
      type: "progress"
    },
    {
      name: "Ball Movement",
      target: 500,            // Until 500 pixels traveled
      current: 0,
      active: false,
      type: "movement"
    },
    {
      name: "Rotation",
      target: 360,            // Until full rotation (360 degrees)
      current: 0,
      active: false,
      type: "rotation"
    }
  ];
}

function draw() {
  background(240, 248, 255);
  
  if (process.running) {
    updateActivities();
    drawActivities();
    updateParticles();
    displayStatus();
  } else {
    drawInstructions();
  }
  
  drawControls();
}

function updateActivities() {
  if (!process.startTime) return;
  
  let elapsed = millis() - process.startTime;
  
  // Update each activity until its condition is met
  for (let activity of process.activities) {
    if (activity.active && !process.stopCondition) {
      switch (activity.type) {
        case "timer":
          // Continue until time target reached
          if (elapsed >= activity.target) {
            activity.active = false;
            addCompletionParticles(width/2, 80);
          }
          break;
          
        case "progress":
          // Continue until progress reaches 100%
          activity.current = Math.min(100, elapsed / 80);
          if (activity.current >= activity.target) {
            activity.active = false;
            addCompletionParticles(width/2, 170);
          }
          break;
          
        case "movement":
          // Continue until ball reaches target distance
          activity.current = Math.min(activity.target, elapsed / 20);
          if (activity.current >= activity.target) {
            activity.active = false;
            addCompletionParticles(100 + activity.current, 250);
          }
          break;
          
        case "rotation":
          // Continue until full rotation completed
          activity.current = (elapsed / 20) % 360;
          if (elapsed >= 7200) { // 360 degrees worth of time
            activity.active = false;
            addCompletionParticles(width/2, 340);
          }
          break;
      }
    } else if (process.stopCondition) {
      // Manual stop condition triggered
      activity.active = false;
    }
  }
}

function drawActivities() {
  let elapsed = millis() - process.startTime;
  
  // Countdown Timer Activity
  let timer = process.activities[0];
  let timeRemaining = Math.max(0, timer.target - elapsed);
  
  fill(timer.active ? color(255, 100, 100) : color(150));
  textSize(24);
  textAlign(CENTER);
  text("Timer: " + (timeRemaining/1000).toFixed(1) + "s", width/2, 80);
  
  textSize(14);
  fill(100);
  text(timer.active ? "(Running until 0)" : "(Stopped)", width/2, 105);
  
  // Progress Bar Activity
  let progress = process.activities[1];
  fill(0);
  textSize(16);
  text("Progress Bar (until 100%)", width/2, 140);
  
  // Progress bar background
  fill(200);
  noStroke();
  rect(150, 155, 300, 25);
  
  // Progress bar fill
  fill(progress.active ? color(100, 200, 100) : color(150));
  rect(150, 155, map(progress.current, 0, 100, 0, 300), 25);
  
  // Progress percentage
  fill(0);
  textSize(14);
  text(progress.current.toFixed(1) + "%", width/2, 170);
  text(progress.active ? "(Filling until complete)" : "(Complete/Stopped)", width/2, 190);
  
  // Ball Movement Activity
  let movement = process.activities[2];
  fill(0);
  textSize(16);
  text("Ball Movement (until right edge)", width/2, 220);
  
  let ballX = 100 + movement.current;
  fill(movement.active ? color(100, 150, 255) : color(150));
  noStroke();
  circle(ballX, 250, 20);
  
  fill(0);
  textSize(14);
  text(movement.active ? "(Moving until target)" : "(Reached target/Stopped)", width/2, 270);
  
  // Rotation Activity
  let rotation = process.activities[3];
  fill(0);
  textSize(16);
  text("Rotating Square (until full rotation)", width/2, 300);
  
  push();
  translate(width/2, 340);
  rotate(radians(rotation.current));
  fill(rotation.active ? color(255, 150, 100) : color(150));
  noStroke();
  rectMode(CENTER);
  rect(0, 0, 30, 30);
  pop();
  
  fill(0);
  textSize(14);
  text(rotation.current.toFixed(0) + "°", width/2, 365);
  text(rotation.active ? "(Rotating until 360°)" : "(Full rotation/Stopped)", width/2, 385);
}

function addCompletionParticles(x, y) {
  // Add celebration particles when an activity completes
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-3, 3),
      vy: random(-3, 3),
      life: 60,
      color: [random(100, 255), random(100, 255), random(100, 255)]
    });
  }
}

function updateParticles() {
  // Update and draw completion particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    
    if (p.life > 0) {
      fill(p.color[0], p.color[1], p.color[2], map(p.life, 0, 60, 0, 255));
      noStroke();
      circle(p.x, p.y, 4);
    } else {
      particles.splice(i, 1);
    }
  }
}

function displayStatus() {
  // Count active processes
  let activeCount = process.activities.filter(a => a.active).length;
  
  fill(0);
  textAlign(CENTER);
  textSize(16);
  
  if (process.stopCondition) {
    text("All activities stopped by manual trigger", width/2, 30);
  } else if (activeCount > 0) {
    text(activeCount + " activities running until their conditions are met", width/2, 30);
  } else {
    text("All activities completed - reached their 'until' conditions", width/2, 30);
  }
}

function drawInstructions() {
  fill(100);
  textAlign(CENTER);
  textSize(16);
  text("Click 'Start Process' to begin multiple activities", width/2, height/2 - 60);
  text("Each will continue UNTIL its condition is met:", width/2, height/2 - 30);
  
  textSize(14);
  text("• Timer counts down until 0", width/2, height/2);
  text("• Progress bar fills until 100%", width/2, height/2 + 20);
  text("• Ball moves until it reaches the edge", width/2, height/2 + 40);
  text("• Square rotates until full circle", width/2, height/2 + 60);
  
  text("Or click 'Trigger Stop' to stop all activities immediately", width/2, height/2 + 100);
}

function drawControls() {
  // Start Process button
  fill(process.running ? color(200, 100, 100) : color(100, 200, 100));
  stroke(100);
  strokeWeight(1);
  rect(50, 50, 100, 30);
  
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text(process.running ? "Running..." : "Start Process", 100, 70);
  
  // Trigger Stop button
  fill(process.running ? color(255, 150, 100) : color(200));
  stroke(100);
  rect(50, 90, 100, 30);
  
  fill(process.running ? color(255) : color(150));
  text("Trigger Stop", 100, 110);
  
  // Reset button
  fill(200);
  stroke(100);
  rect(50, 130, 100, 30);
  
  fill(0);
  text("Reset", 100, 150);
}

function mousePressed() {
  // Handle button clicks
  if (mouseX > 50 && mouseX < 150) {
    if (mouseY > 50 && mouseY < 80) {
      // Start Process button
      startProcess();
    } else if (mouseY > 90 && mouseY < 120) {
      // Trigger Stop button
      if (process.running) {
        process.stopCondition = true;
      }
    } else if (mouseY > 130 && mouseY < 160) {
      // Reset button
      resetProcess();
    }
  }
}

function startProcess() {
  process.startTime = millis();
  process.running = true;
  process.stopCondition = false;
  
  // Reset and activate all activities
  for (let activity of process.activities) {
    activity.active = true;
    if (activity.hasOwnProperty('current')) {
      activity.current = 0;
    }
  }
  
  particles = [];
}

function resetProcess() {
  process.running = false;
  process.startTime = null;
  process.stopCondition = false;
  
  // Reset all activities
  for (let activity of process.activities) {
    activity.active = false;
    if (activity.hasOwnProperty('current')) {
      activity.current = 0;
    }
  }
  
  particles = [];
}
