/*
 * P5.js Sketch: SINCE – Temporal Reference and Ongoing Change
 *
 * CONCEPT:
 * "Since" establishes a reference point in time, and tracks all changes, events, or durations that have occurred from that point up to the present.
 * In this sketch, events and visual changes accumulate and are measured from the moment tracking begins, visually demonstrating the preposition.
 *
 * LEARNING OBJECTIVES:
 * • Understand temporal reference points and duration tracking
 * • Practice event accumulation and state persistence
 * • Explore progressive change and time-based animation
 * • Visualize ongoing effects and event history
 *
 * KEY VARIABLES & METHODS:
 * • referenceTime: the starting point for "since"
 * • currentTime: elapsed time since reference
 * • events[]: array of events that have occurred since reference
 * • growingCircle: visual element that changes over time
 * • checkForEvents(), updateTimeTracking(): core logic for time and event management
 *
 * EXTENSION IDEAS:
 * • Multiple reference points or resettable timers
 * • Different event types or frequencies
 * • Visualizations for cumulative or comparative change
 *
 * INTERACTION:
 * • Click 'Start' to begin tracking since now
 * • Events and visuals accumulate as time passes
 * • Use buttons to stop or reset tracking
 */

// Time tracking
let referenceTime = null;  // The "since" starting point
let currentTime = 0;       // Current elapsed time
let isTracking = false;    // Whether we're tracking since a point

// Events that occur since the reference time
let events = [];
let eventTypes = [
  {name: "Circle grows", color: [100, 255, 100], frequency: 1000},
  {name: "Color changes", color: [255, 150, 100], frequency: 1500},
  {name: "Sound plays", color: [100, 150, 255], frequency: 2000},
  {name: "Data updates", color: [255, 100, 255], frequency: 2500}
];

// Visual elements
let growingCircle = {
  x: 200,
  y: 150,
  baseRadius: 20,
  currentRadius: 20,
  color: [100, 150, 255]
};

let particles = [];

function setup() {
  createCanvas(400, 300);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(240, 248, 255);
  
  if (isTracking) {
    updateTimeTracking();
    checkForEvents();
    updateVisuals();
  }
  
  drawTimeDisplay();
  drawGrowingCircle();
  drawEventHistory();
  drawControls();
  drawInfo();
}

function updateTimeTracking() {
  currentTime = millis() - referenceTime;
  
  // Update circle growth based on time since reference
  let growthFactor = 1 + (currentTime / 5000); // Grows over 5 seconds
  growingCircle.currentRadius = growingCircle.baseRadius * growthFactor;
  
  // Color changes based on time elapsed
  let hue = (currentTime / 50) % 360;
  growingCircle.color = [
    100 + sin(hue * 0.1) * 50,
    150 + cos(hue * 0.08) * 50,
    255 + sin(hue * 0.12) * 50
  ];
}

function checkForEvents() {
  // Check if any events should trigger based on time elapsed
  for (let eventType of eventTypes) {
    let eventsShouldHave = Math.floor(currentTime / eventType.frequency);
    let eventsOfThisType = events.filter(e => e.type === eventType.name).length;
    
    // Create missing events
    while (eventsOfThisType < eventsShouldHave) {
      events.push({
        type: eventType.name,
        time: (eventsOfThisType + 1) * eventType.frequency,
        color: eventType.color,
        created: millis()
      });
      eventsOfThisType++;
      
      // Create visual effect for new event
      createEventEffect(eventType);
    }
  }
}

function createEventEffect(eventType) {
  // Create particles for event visualization
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: random(50, width - 50),
      y: random(50, height - 100),
      vx: random(-2, 2),
      vy: random(-3, -1),
      life: 60,
      maxLife: 60,
      color: eventType.color,
      size: random(3, 8)
    });
  }
}

function updateVisuals() {
  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // Gravity
    p.life--;
    
    // Draw particle
    let alpha = map(p.life, 0, p.maxLife, 0, 200);
    fill(p.color[0], p.color[1], p.color[2], alpha);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
    
    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawTimeDisplay() {
  // Time since reference display
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(20);
  
  if (isTracking) {
    let seconds = currentTime / 1000;
    text("Time SINCE start: " + nf(seconds, 1, 1) + "s", width/2, 30);
  } else {
    text("Click 'Start' to begin tracking SINCE now", width/2, 30);
  }
  
  // Reference time marker
  if (referenceTime) {
    textSize(12);
    fill(100);
    text("Reference time: " + nf(referenceTime/1000, 1, 1) + "s", width/2, 50);
  }
}

function drawGrowingCircle() {
  // Draw the circle that changes since reference time
  fill(growingCircle.color[0], growingCircle.color[1], growingCircle.color[2], 150);
  stroke(50, 50, 50);
  strokeWeight(2);
  ellipse(growingCircle.x, growingCircle.y, 
         growingCircle.currentRadius * 2, growingCircle.currentRadius * 2);
  
  // Circle label
  fill(0);
  noStroke();
  textSize(10);
  text("Growing Circle", growingCircle.x, growingCircle.y - growingCircle.currentRadius - 15);
  
  if (isTracking) {
    text("Radius: " + nf(growingCircle.currentRadius, 1, 1), 
         growingCircle.x, growingCircle.y + growingCircle.currentRadius + 15);
  }
}

function drawEventHistory() {
  // Draw timeline of events that occurred since reference
  if (events.length > 0) {
    textAlign(LEFT);
    textSize(10);
    fill(0);
    text("Events SINCE reference time:", 10, height - 80);
    
    let yPos = height - 65;
    let eventsToShow = Math.min(events.length, 4); // Show last 4 events
    
    for (let i = events.length - eventsToShow; i < events.length; i++) {
      let event = events[i];
      
      // Event color indicator
      fill(event.color[0], event.color[1], event.color[2]);
      noStroke();
      ellipse(15, yPos, 8, 8);
      
      // Event text
      fill(0);
      text(event.type + " at " + nf(event.time/1000, 1, 1) + "s", 25, yPos);
      yPos += 12;
    }
    
    // Event count
    fill(100);
    text("Total events: " + events.length, 10, height - 5);
  }
}

function drawControls() {
  // Control buttons
  fill(200);
  stroke(100);
  strokeWeight(1);
  
  // Start/Stop button
  rect(250, 70, 60, 25);
  fill(0);
  noStroke();
  textAlign(CENTER);
  text(isTracking ? "Stop" : "Start", 280, 82);
  
  // Reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(320, 70, 60, 25);
  fill(0);
  noStroke();
  text("Reset", 350, 82);
  
  // Instructions
  fill(0);
  textAlign(LEFT);
  textSize(10);
  text("Start tracking to see what happens SINCE then", 250, 110);
  text("Events accumulate over time since reference", 250, 125);
}

function drawInfo() {
  // Relationship explanation
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  
  if (isTracking) {
    fill(0, 150, 0);
    text("Tracking events SINCE " + nf(referenceTime/1000, 1, 1) + "s", width/2, height - 100);
  } else {
    fill(100, 100, 100);
    text("'Since' tracks duration and events from a reference point", width/2, height - 100);
  }
  
  // Duration indicator
  if (isTracking && currentTime > 0) {
    textSize(12);
    fill(0);
    text("Duration: " + nf(currentTime/1000, 1, 1) + " seconds", width/2, height - 115);
  }
}

function mousePressed() {
  // Check control buttons
  if (mouseY >= 70 && mouseY <= 95) {
    if (mouseX >= 250 && mouseX <= 310) {
      toggleTracking();
      return;
    }
    if (mouseX >= 320 && mouseX <= 380) {
      resetTracking();
      return;
    }
  }
  
  // Click anywhere else to start tracking if not already
  if (!isTracking) {
    startTracking();
  }
}

function toggleTracking() {
  if (isTracking) {
    stopTracking();
  } else {
    startTracking();
  }
}

function startTracking() {
  referenceTime = millis();
  currentTime = 0;
  isTracking = true;
  events = [];
  particles = [];
  
  // Reset circle
  growingCircle.currentRadius = growingCircle.baseRadius;
  growingCircle.color = [100, 150, 255];
}

function stopTracking() {
  isTracking = false;
}

function resetTracking() {
  referenceTime = null;
  currentTime = 0;
  isTracking = false;
  events = [];
  particles = [];
  
  // Reset circle
  growingCircle.currentRadius = growingCircle.baseRadius;
  growingCircle.color = [100, 150, 255];
}

/*
EDUCATIONAL NOTES:

1. TEMPORAL REFERENCE POINT:
   - "Since" establishes a reference point in time
   - All subsequent events are measured from this point
   - Creates a temporal relationship between past and present

2. DURATION TRACKING:
   - Continuously measures elapsed time from reference
   - Accumulates data about what has happened
   - Provides context for temporal relationships

3. EVENT ACCUMULATION:
   - Events that occur "since" the reference are collected
   - History builds over time from the reference point
   - Different from "during" which has defined end points

4. PROGRESSIVE CHANGE:
   - Visual elements change continuously since reference
   - Shows ongoing effects of time passage
   - Demonstrates cumulative nature of "since"

5. STATE PERSISTENCE:
   - "Since" relationships persist until explicitly reset
   - Different from momentary temporal prepositions
   - Maintains connection to historical reference point

This pattern can be adapted for other "since" scenarios like:
- User activity tracking since login
- Performance metrics since system start
- Changes made since last save
- Messages received since last check
- Progress made since project beginning
*/
