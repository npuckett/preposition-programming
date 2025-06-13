/*
 * PREPOSITION: BEFORE
 * 
 * CONCEPT:
 * "Before" means occurring earlier in time than a reference point.
 * In programming, this involves comparing timestamps, managing 
 * event sequences, and creating time-based conditions.
 * 
 * LEARNING OBJECTIVES:
 * - Understand time tracking with millis()
 * - Create sequential event systems
 * - Use conditional logic for time comparisons
 * - Implement timeline visualizations
 * - Manage multiple timed events
 * 
 * KEY VARIABLES:
 * - startTime: when the timeline began
 * - mainEventTime: reference time for "before" comparisons
 * - events: array of timed events
 * - timerRunning: boolean for animation state
 * 
 * KEY METHODS:
 * - millis(): get current time in milliseconds
 * - map(): convert time values to visual positions
 * - constrain(): limit values within bounds
 * - frameCount: alternative timing method
 * 
 * HOW TO EXTEND:
 * 1. Add user-defined event times
 * 2. Create branching timelines based on events
 * 3. Implement countdown timers
 * 4. Add sound effects for event triggers
 * 5. Create interactive timeline scrubbing
 * 6. Add event categories with different behaviors
 * 7. Implement save/load timeline functionality
 */

// Timeline management variables
let startTime;              // When the timeline started
let timerRunning = false;   // Is the timeline currently running?
let mainEventTime = 3;      // Main event occurs at 3 seconds
let events = [];           // Array to store all timed events
let particles = [];        // Visual effects for events

function setup() {
  createCanvas(400, 300);
  
  // Define events that happen BEFORE the main event
  events = [
    { 
      time: 0.5, 
      message: "Preparation begins", 
      color: [100, 150, 255], 
      triggered: false 
    },
    { 
      time: 1.5, 
      message: "Setup phase", 
      color: [150, 100, 255], 
      triggered: false 
    },
    { 
      time: 2.5, 
      message: "Final preparations", 
      color: [255, 150, 100], 
      triggered: false 
    },
    { 
      time: 3.0, 
      message: "MAIN EVENT!", 
      color: [255, 100, 100], 
      triggered: false, 
      isMain: true 
    }
  ];
}

function draw() {
  background(240);
  
  // Calculate current time if timer is running
  let currentTime = 0;
  if (timerRunning && startTime) {
    currentTime = (millis() - startTime) / 1000;  // Convert to seconds
  }
  
  // Draw the timeline visualization
  drawTimeline(currentTime);
  
  // Check and trigger events based on current time
  checkAndTriggerEvents(currentTime);
  
  // Update and draw visual effects
  updateAndDrawParticles();
  
  // Display event status information
  drawEventStatus(currentTime);
  
  // Draw control buttons
  drawControlButtons();
  
  // Display current relationship and instructions
  displayRelationshipInfo(currentTime);
}

function drawTimeline(currentTime) {
  // Timeline background
  fill(255);
  stroke(100);
  strokeWeight(1);
  rect(50, 50, 300, 40);
  
  // Draw event markers on timeline
  for (let event of events) {
    let x = map(event.time, 0, 4, 50, 350);  // Map time to X position
    
    // Color based on trigger state
    if (event.triggered) {
      fill(event.color[0], event.color[1], event.color[2]);
    } else {
      fill(200);  // Gray for untriggered events
    }
    
    // Special styling for main event
    if (event.isMain) {
      stroke(255, 0, 0);
      strokeWeight(3);
    } else {
      stroke(100);
      strokeWeight(1);
    }
    
    // Draw event marker
    ellipse(x, 70, 12, 12);
    
    // Event time labels
    fill(0);
    noStroke();
    textAlign(CENTER);
    textSize(8);
    text(event.time + "s", x, 105);
    
    // Event message (only if triggered)
    if (event.triggered) {
      textSize(7);
      text(event.message, x, 115);
    }
  }
  
  // Current time indicator (red line)
  if (timerRunning) {
    let currentX = map(currentTime, 0, 4, 50, 350);
    currentX = constrain(currentX, 50, 350);  // Keep within timeline bounds
    
    stroke(255, 0, 0);
    strokeWeight(2);
    line(currentX, 40, currentX, 100);
    
    // Current time marker
    fill(255, 0, 0);
    noStroke();
    ellipse(currentX, 40, 8, 8);
  }
  
  // Timeline labels
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(12);
  text("Timeline:", 50, 40);
  textAlign(RIGHT);
  text("4s", 350, 40);
}

function checkAndTriggerEvents(currentTime) {
  // Check each event to see if it should be triggered
  for (let event of events) {
    if (timerRunning && currentTime >= event.time && !event.triggered) {
      event.triggered = true;
      
      // Add visual effects for events that happen BEFORE main event
      if (!event.isMain) {
        addParticles(event.color);
      }
    }
  }
}

function addParticles(color) {
  // Create particle effects when events are triggered
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: random(width),
      y: random(130, 200),
      vx: random(-2, 2),    // Velocity X
      vy: random(-3, -1),   // Velocity Y
      color: color,
      life: 255,            // Opacity/life
      decay: random(3, 6)   // How fast particle fades
    });
  }
}

function updateAndDrawParticles() {
  // Update and draw all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    
    // Draw particle if still alive
    if (p.life > 0) {
      fill(p.color[0], p.color[1], p.color[2], p.life);
      noStroke();
      ellipse(p.x, p.y, 6, 6);
    } else {
      // Remove dead particles
      particles.splice(i, 1);
    }
  }
}

function drawEventStatus(currentTime) {
  // Display status of each event
  textAlign(LEFT);
  textSize(11);
  fill(0);
  noStroke();
  
  text("Event Status:", 50, 140);
  
  let y = 155;
  for (let event of events) {
    // Color based on state
    if (event.triggered) {
      fill(event.color[0], event.color[1], event.color[2]);
    } else if (timerRunning && currentTime < event.time) {
      fill(100);  // Waiting
    } else {
      fill(200);  // Not started
    }
    
    // Status text
    let status = "";
    if (event.triggered) {
      status = "✓ " + event.message;
    } else if (timerRunning && currentTime < event.time) {
      status = "⏳ " + event.message + " (in " + (event.time - currentTime).toFixed(1) + "s)";
    } else {
      status = "○ " + event.message;
    }
    
    text(status, 50, y);
    y += 15;
  }
  
  // Before/after summary
  if (timerRunning) {
    y += 10;
    fill(0);
    let beforeEvents = events.filter(e => !e.isMain && currentTime < e.time).length;
    let completedEvents = events.filter(e => !e.isMain && e.triggered).length;
    
    text("Events BEFORE main event: " + beforeEvents, 50, y);
    text("Events completed: " + completedEvents, 50, y + 15);
  }
}

function drawControlButtons() {
  // Start/Stop button
  let buttonColor = timerRunning ? color(200, 100, 100) : color(100, 200, 100);
  let buttonText = timerRunning ? "Stop" : "Start Timer";
  
  fill(buttonColor);
  stroke(100);
  strokeWeight(2);
  rect(280, 120, 80, 25);
  
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text(buttonText, 320, 137);
  
  // Reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(280, 150, 80, 25);
  fill(0);
  text("Reset", 320, 167);
}

function displayRelationshipInfo(currentTime) {
  // Determine current relationship
  let relationship = "";
  if (!timerRunning) {
    relationship = "Click 'Start Timer' to begin the sequence";
  } else if (currentTime < mainEventTime) {
    relationship = "Events are happening BEFORE the main event";
  } else {
    relationship = "Main event has occurred!";
  }
  
  // Display relationship and time
  fill(0);
  textAlign(CENTER);
  textSize(14);
  text(relationship, width/2, height - 30);
  
  textSize(12);  text("Current time: " + currentTime.toFixed(1) + "s", width/2, height - 10);
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
  let inputX = getInputX();
  let inputY = getInputY();
  
  // Handle button clicks/touches
  if (inputX > 280 && inputX < 360 && inputY > 120 && inputY < 145) {
    // Start/Stop button
    if (!timerRunning) {
      startTime = millis();
      timerRunning = true;
    } else {
      timerRunning = false;
    }
  } else if (inputX > 280 && inputX < 360 && inputY > 150 && inputY < 175) {
    // Reset button
    timerRunning = false;
    startTime = null;
    particles = [];
    
    // Reset all events
    for (let event of events) {
      event.triggered = false;
    }
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
