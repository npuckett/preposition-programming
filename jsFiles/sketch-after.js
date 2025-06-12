// P5.js Sketch: Preposition "After"
// This sketch demonstrates the concept of "after" through sequential timing
// Events happen after a main event occurs, showing temporal sequence

// Timeline configuration
let timeline = {
  startTime: null,           // When timeline started
  running: false,            // Whether timeline is active
  mainEventTime: 3000,       // Main event happens at 3 seconds
  mainEventTriggered: false, // Whether main event has occurred
  afterEvents: [             // Events that happen after main event
    {delay: 1000, triggered: false, name: "First after event", color: [100, 255, 100]},
    {delay: 2500, triggered: false, name: "Second after event", color: [255, 150, 100]},
    {delay: 4000, triggered: false, name: "Final after event", color: [255, 100, 255]}
  ]
};

// Visual elements
let particles = [];
let timelineY = 200;

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(240, 248, 255);
  
  if (timeline.running) {
    checkAfterEvents();
    drawTimeline();
    updateParticles();
    updateStatus();
  } else {
    drawInstructions();
  }
}

function checkAfterEvents() {
  let elapsed = millis() - timeline.startTime;
  
  // Check if main event should trigger
  if (elapsed >= timeline.mainEventTime && !timeline.mainEventTriggered) {
    timeline.mainEventTriggered = true;
    createMainEventEffect();
  }
  
  // Check after events (only if main event has happened)
  if (timeline.mainEventTriggered) {
    for (let afterEvent of timeline.afterEvents) {
      let afterTime = timeline.mainEventTime + afterEvent.delay;
      if (elapsed >= afterTime && !afterEvent.triggered) {
        afterEvent.triggered = true;
        createAfterEventEffect(afterEvent);
      }
    }
  }
}

function drawTimeline() {
  let elapsed = millis() - timeline.startTime;
  let totalTime = 8000; // 8 second timeline
  let progress = elapsed / totalTime;
  
  // Draw timeline base
  stroke(100);
  strokeWeight(4);
  line(50, timelineY, width - 50, timelineY);
  
  // Draw time markers
  let timelineWidth = width - 100;
  let mainEventX = 50 + (timeline.mainEventTime / totalTime) * timelineWidth;
  
  // Main event marker
  stroke(255, 100, 100);
  strokeWeight(6);
  if (timeline.mainEventTriggered) {
    fill(255, 100, 100);
  } else {
    noFill();
  }
  ellipse(mainEventX, timelineY, 20, 20);
  
  // Main event label
  fill(0);
  noStroke();
  textSize(12);
  text("Main Event", mainEventX, timelineY - 30);
  text("(3s)", mainEventX, timelineY - 15);
  
  // After event markers
  for (let i = 0; i < timeline.afterEvents.length; i++) {
    let afterEvent = timeline.afterEvents[i];
    let afterTime = timeline.mainEventTime + afterEvent.delay;
    let afterEventX = 50 + (afterTime / totalTime) * timelineWidth;
    
    stroke(afterEvent.color[0], afterEvent.color[1], afterEvent.color[2]);
    strokeWeight(4);
    if (afterEvent.triggered) {
      fill(afterEvent.color[0], afterEvent.color[1], afterEvent.color[2]);
    } else {
      noFill();
    }
    ellipse(afterEventX, timelineY, 16, 16);
    
    // After event labels
    fill(0);
    noStroke();
    textSize(10);
    text("After " + (afterEvent.delay/1000) + "s", afterEventX, timelineY + 25);
  }
  
  // Current time indicator
  let currentTimeX = 50 + progress * timelineWidth;
  if (currentTimeX <= width - 50) {
    stroke(50, 150, 255);
    strokeWeight(3);
    line(currentTimeX, timelineY - 40, currentTimeX, timelineY + 40);
    
    // Current time label
    fill(50, 150, 255);
    noStroke();
    textSize(12);
    text(nf(elapsed/1000, 1, 1) + "s", currentTimeX, timelineY - 50);
  }
}

function createMainEventEffect() {
  // Create burst of particles for main event
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: width/2,
      y: 100,
      vx: random(-5, 5),
      vy: random(-8, -2),
      life: 60,
      maxLife: 60,
      color: [255, 100, 100],
      size: random(4, 8)
    });
  }
}

function createAfterEventEffect(afterEvent) {
  // Create smaller particle effects for after events
  let eventX = width/2 + random(-100, 100);
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: eventX,
      y: 120,
      vx: random(-3, 3),
      vy: random(-5, -1),
      life: 40,
      maxLife: 40,
      color: afterEvent.color,
      size: random(3, 6)
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // Gravity
    
    // Update life
    p.life--;
    
    // Draw particle
    let alpha = map(p.life, 0, p.maxLife, 0, 255);
    fill(p.color[0], p.color[1], p.color[2], alpha);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
    
    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function updateStatus() {
  let elapsed = millis() - timeline.startTime;
  
  // Status text
  fill(0);
  noStroke();
  textSize(16);
  
  if (!timeline.mainEventTriggered) {
    text("Waiting for main event...", width/2, 50);
  } else {
    text("Main event occurred! After events following...", width/2, 50);
  }
  
  // Event status list
  textAlign(LEFT);
  textSize(12);
  let statusY = 300;
  
  text("Event Status:", 50, statusY);
  statusY += 20;
  
  let mainStatus = timeline.mainEventTriggered ? "✓ COMPLETED" : "⏳ Waiting";
  text("Main Event (3.0s): " + mainStatus, 70, statusY);
  statusY += 15;
  
  for (let afterEvent of timeline.afterEvents) {
    let status = afterEvent.triggered ? "✓ COMPLETED" : "⏳ Waiting";
    let totalTime = (timeline.mainEventTime + afterEvent.delay) / 1000;
    text("After " + (afterEvent.delay/1000) + "s (" + totalTime + "s total): " + status, 70, statusY);
    statusY += 15;
  }
  
  // Reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(width - 100, 20, 80, 30);
  fill(0);
  noStroke();
  textAlign(CENTER);
  text("Reset", width - 60, 35);
}

function drawInstructions() {
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(18);
  text("Temporal Sequence: AFTER", width/2, 100);
  
  textSize(14);
  text("This demonstrates how events happen AFTER other events", width/2, 140);
  text("Click to start the timeline", width/2, 170);
  text("Watch how after-events only occur AFTER the main event", width/2, 200);
  
  // Preview timeline
  stroke(150);
  strokeWeight(2);
  line(100, 250, width - 100, 250);
  
  // Preview markers
  fill(255, 100, 100);
  noStroke();
  ellipse(200, 250, 15, 15);
  text("Main", 200, 230);
  
  fill(100, 255, 100);
  ellipse(300, 250, 12, 12);
  text("After 1s", 300, 230);
  
  fill(255, 150, 100);
  ellipse(400, 250, 12, 12);
  text("After 2.5s", 400, 230);
  
  fill(255, 100, 255);
  ellipse(500, 250, 12, 12);
  text("After 4s", 500, 230);
}

function mousePressed() {
  // Check reset button
  if (timeline.running && mouseX > width - 100 && mouseX < width - 20 && 
      mouseY > 20 && mouseY < 50) {
    resetTimeline();
    return;
  }
  
  // Start timeline
  if (!timeline.running) {
    startTimeline();
  }
}

function startTimeline() {
  timeline.startTime = millis();
  timeline.running = true;
  timeline.mainEventTriggered = false;
  
  // Reset all after events
  for (let afterEvent of timeline.afterEvents) {
    afterEvent.triggered = false;
  }
  
  particles = [];
}

function resetTimeline() {
  timeline.running = false;
  timeline.startTime = null;
  timeline.mainEventTriggered = false;
  
  // Reset all after events
  for (let afterEvent of timeline.afterEvents) {
    afterEvent.triggered = false;
  }
  
  particles = [];
}

/*
EDUCATIONAL NOTES:

1. TEMPORAL SEQUENCING:
   - Events are scheduled relative to other events
   - "After" means something happens following another event
   - Order and timing are crucial for the relationship

2. TIME MANAGEMENT:
   - Use millis() to track elapsed time
   - Calculate relative times from reference points
   - Boolean flags prevent duplicate event triggers

3. CONDITIONAL EXECUTION:
   - After-events only happen if main event has occurred
   - This enforces the temporal dependency
   - Prevents logical inconsistencies

4. VISUAL TIMELINE:
   - Shows the sequence of events clearly
   - Current time indicator shows progression
   - Different colors distinguish event types

5. STATE TRACKING:
   - Each event has its own triggered state
   - Status display shows what has/hasn't happened
   - Clean reset functionality for repeated demonstrations

This pattern can be adapted for other "after" scenarios like:
- Game events triggered after player actions
- UI responses after user interactions
- Animation sequences with dependent stages
- Process steps that must follow others
*/
