/**
 * P5.js Sketch: DURING - Simultaneous Events and Temporal Overlap
 * 
 * CONCEPT: "During" represents events or actions that happen at the same
 * time as something else, showing temporal overlap or simultaneity.
 * In programming, this often means managing multiple processes or states
 * that occur concurrently within a time period.
 * 
 * LEARNING OBJECTIVES:
 * • Understand time-based programming and event scheduling
 * • Practice managing multiple simultaneous processes
 * • Learn state tracking for overlapping events
 * • Explore timeline visualization and progress indicators
 * 
 * KEY VARIABLES & METHODS:
 * • millis() - Get current time since program start
 * • Timer objects - Track event durations and schedules
 * • Boolean flags - Track multiple concurrent states
 * • Progress calculations - Show event completion
 * 
 * EXTENSION IDEAS:
 * • Multiple overlapping events with different durations
 * • Interactive timeline scrubbing
 * • Event triggering based on user input during periods
 * • Visual calendar or schedule representation
 * • Sound or animation that occurs during specific periods
 */

let mainEvent = {
    name: "Main Process",
    startTime: 0,
    duration: 8000, // 8 seconds
    isActive: false,
    color: [70, 130, 180]
};

let duringEvents = [
    {
        name: "Event A",
        startTime: 2000,
        duration: 3000,
        isActive: false,
        color: [255, 100, 100],
        progress: 0
    },
    {
        name: "Event B", 
        startTime: 4000,
        duration: 2500,
        isActive: false,
        color: [100, 255, 100],
        progress: 0
    },
    {
        name: "Event C",
        startTime: 1500,
        duration: 4000,
        isActive: false,
        color: [255, 215, 0],
        progress: 0
    }
];

let programStartTime = 0;
let isRunning = false;
let timelineScale = 50; // pixels per second
let currentTime = 0;

function setup() {
    createCanvas(600, 400).parent('canvas');
    programStartTime = millis();
}

function draw() {
    background(240);
    
    if (isRunning) {
        currentTime = millis() - programStartTime;
        
        // Update main event
        if (currentTime >= mainEvent.startTime && 
            currentTime < mainEvent.startTime + mainEvent.duration) {
            mainEvent.isActive = true;
        } else {
            mainEvent.isActive = false;
        }
        
        // Update during events
        for (let event of duringEvents) {
            if (currentTime >= event.startTime && 
                currentTime < event.startTime + event.duration) {
                event.isActive = true;
                event.progress = (currentTime - event.startTime) / event.duration;
            } else {
                event.isActive = false;
                if (currentTime >= event.startTime + event.duration) {
                    event.progress = 1;
                } else {
                    event.progress = 0;
                }
            }
        }
        
        // Check if main event is complete
        if (currentTime >= mainEvent.startTime + mainEvent.duration) {
            isRunning = false;
        }
    }
    
    // Draw timeline
    drawTimeline();
    
    // Draw current time indicator
    if (isRunning) {
        let timeX = 50 + (currentTime / 1000) * timelineScale;
        stroke(255, 0, 0);
        strokeWeight(3);
        line(timeX, 80, timeX, 320);
        
        // Time indicator
        fill(255, 0, 0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(10);
        text("NOW", timeX, 70);
    }
    
    // Draw event status
    drawEventStatus();
    
    // Instructions
    fill(50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    
    if (!isRunning && currentTime === 0) {
        text("Click START to begin the timeline", width/2, 350);
        text("Watch how events occur DURING the main process", width/2, 370);
    } else if (isRunning) {
        text("Events running... Watch what happens DURING the main process", width/2, 350);
    } else {
        text("Timeline complete! Click RESET to run again", width/2, 350);
    }
}

function drawTimeline() {
    // Timeline background
    fill(250);
    stroke(150);
    strokeWeight(2);
    rect(40, 100, 520, 200);
    
    // Time markers
    stroke(180);
    strokeWeight(1);
    textAlign(CENTER, TOP);
    textSize(10);
    fill(100);
    for (let i = 0; i <= 10; i++) {
        let x = 50 + i * timelineScale;
        line(x, 100, x, 300);
        noStroke();
        text(i + "s", x, 305);
        stroke(180);
    }
    
    // Main event bar
    let mainStartX = 50 + (mainEvent.startTime / 1000) * timelineScale;
    let mainWidth = (mainEvent.duration / 1000) * timelineScale;
    
    if (mainEvent.isActive) {
        fill(mainEvent.color[0], mainEvent.color[1], mainEvent.color[2], 200);
    } else {
        fill(mainEvent.color[0], mainEvent.color[1], mainEvent.color[2], 100);
    }
    stroke(mainEvent.color[0] - 30, mainEvent.color[1] - 30, mainEvent.color[2] - 30);
    strokeWeight(2);
    rect(mainStartX, 120, mainWidth, 40);
    
    // Main event label
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text(mainEvent.name, mainStartX + mainWidth/2, 140);
    
    // During events
    for (let i = 0; i < duringEvents.length; i++) {
        let event = duringEvents[i];
        let startX = 50 + (event.startTime / 1000) * timelineScale;
        let eventWidth = (event.duration / 1000) * timelineScale;
        let yPos = 180 + i * 35;
        
        // Event bar
        if (event.isActive) {
            fill(event.color[0], event.color[1], event.color[2], 200);
        } else {
            fill(event.color[0], event.color[1], event.color[2], 100);
        }
        stroke(event.color[0] - 30, event.color[1] - 30, event.color[2] - 30);
        strokeWeight(2);
        rect(startX, yPos, eventWidth, 25);
        
        // Progress fill
        if (event.progress > 0) {
            fill(event.color[0], event.color[1], event.color[2], 255);
            noStroke();
            rect(startX, yPos, eventWidth * event.progress, 25);
        }
        
        // Event label
        fill(50);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(10);
        text(event.name, startX + eventWidth/2, yPos + 12);
        
        // "DURING" indicator
        if (event.isActive && mainEvent.isActive) {
            fill(255, 0, 0);
            textAlign(LEFT, CENTER);
            textSize(10);
            text("DURING", startX + eventWidth + 5, yPos + 12);
        }
    }
}

function drawEventStatus() {
    // Status panel
    fill(255);
    stroke(150);
    strokeWeight(2);
    rect(20, 20, 200, 60);
    
    fill(50);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);
    text("Current Status:", 30, 30);
    
    textSize(10);
    if (mainEvent.isActive) {
        fill(mainEvent.color[0], mainEvent.color[1], mainEvent.color[2]);
        text("● " + mainEvent.name + " - ACTIVE", 30, 45);
    } else {
        fill(150);
        text("○ " + mainEvent.name + " - inactive", 30, 45);
    }
    
    let activeCount = 0;
    for (let event of duringEvents) {
        if (event.isActive && mainEvent.isActive) {
            activeCount++;
        }
    }
    
    fill(50);
    text(`Events occurring DURING: ${activeCount}`, 30, 60);
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
    if (!isRunning && currentTime < mainEvent.startTime + mainEvent.duration) {
        // Start or reset
        if (currentTime === 0) {
            // Start
            isRunning = true;
            programStartTime = millis();
            currentTime = 0;
        } else {
            // Reset
            isRunning = false;
            programStartTime = millis();
            currentTime = 0;
            
            // Reset all events
            mainEvent.isActive = false;
            for (let event of duringEvents) {
                event.isActive = false;
                event.progress = 0;
            }
        }
    } else if (currentTime >= mainEvent.startTime + mainEvent.duration) {
        // Timeline complete, reset
        isRunning = false;
        programStartTime = millis();
        currentTime = 0;
        
        // Reset all events
        mainEvent.isActive = false;
        for (let event of duringEvents) {
            event.isActive = false;
            event.progress = 0;
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
