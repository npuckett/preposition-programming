/*
 * P5.js Sketch: PAST – Movement Beyond a Reference Point
 *
 * CONCEPT:
 * "Past" means moving beyond or continuing beyond a specific reference point, not just reaching or stopping at it.
 * In this sketch, an object moves past a reference point, visually demonstrating the preposition through motion and state change.
 *
 * LEARNING OBJECTIVES:
 * • Understand reference points and spatial relationships
 * • Practice movement, direction, and state tracking
 * • Explore visual feedback for before/at/past states
 * • Visualize trails and passing events
 *
 * KEY VARIABLES & METHODS:
 * • referencePoint: object representing the fixed reference
 * • movingObject: object that moves past the reference
 * • trail[]: array to store movement history
 * • passedPoint: records when/where the object passed the reference
 * • updateMovement(), drawRelationshipIndicators(): core logic and feedback
 *
 * EXTENSION IDEAS:
 * • Multiple reference points or checkpoints
 * • Variable speeds or directions
 * • Obstacles or interactive events after passing
 *
 * INTERACTION:
 * • Click left or right of the reference to move the object past it
 * • Use buttons to change direction or reset
 */

// Reference point that objects move past
let referencePoint = {
  x: 200,
  y: 150,
  radius: 30,
  color: [100, 150, 255]
};

// Moving object that goes past the reference
let movingObject = {
  x: -50,
  y: 150,
  radius: 15,
  speed: 2,
  color: [255, 150, 100],
  isMoving: false,
  hasPassed: false,
  direction: 1 // 1 for right, -1 for left
};

// Trail and movement tracking
let trail = [];
let passedPoint = null; // Records when object passed the reference

function setup() {
  createCanvas(400, 300).parent('canvas');
}

function draw() {
  background(240, 248, 255);
  
  // Update movement
  if (movingObject.isMoving) {
    updateMovement();
  }
  
  // Draw trail
  drawTrail();
  
  // Draw reference point
  drawReferencePoint();
  
  // Draw moving object
  drawMovingObject();
  
  // Draw relationship indicators
  drawRelationshipIndicators();
  
  // Draw information and controls
  drawInfo();
  drawControls();
}

function updateMovement() {
  // Store previous position for trail
  trail.push({x: movingObject.x, y: movingObject.y});
  if (trail.length > 150) {
    trail.shift();
  }
  
  // Move the object
  movingObject.x += movingObject.speed * movingObject.direction;
  
  // Check if object has passed the reference point
  if (!movingObject.hasPassed) {
    if (movingObject.direction > 0 && movingObject.x > referencePoint.x) {
      // Moving right and passed
      movingObject.hasPassed = true;
      passedPoint = {x: movingObject.x, y: movingObject.y, time: millis()};
    } else if (movingObject.direction < 0 && movingObject.x < referencePoint.x) {
      // Moving left and passed
      movingObject.hasPassed = true;
      passedPoint = {x: movingObject.x, y: movingObject.y, time: millis()};
    }
  }
  
  // Stop when object reaches edge of screen
  if (movingObject.x > width + 50 || movingObject.x < -50) {
    movingObject.isMoving = false;
  }
}

function drawTrail() {
  if (trail.length > 1) {
    stroke(255, 200, 0, 150);
    strokeWeight(3);
    noFill();
    beginShape();
    for (let i = 0; i < trail.length; i++) {
      vertex(trail[i].x, trail[i].y);
    }
    endShape();
    
    // Draw trail points
    fill(255, 200, 0, 100);
    noStroke();
    for (let i = 0; i < trail.length; i += 8) {
      ellipse(trail[i].x, trail[i].y, 4, 4);
    }
  }
}

function drawReferencePoint() {
  // Draw reference point shadow
  fill(0, 0, 0, 30);
  noStroke();
  ellipse(referencePoint.x + 3, referencePoint.y + 3, referencePoint.radius * 2, referencePoint.radius * 2);
  
  // Draw the reference point
  fill(referencePoint.color[0], referencePoint.color[1], referencePoint.color[2]);
  stroke(referencePoint.color[0] - 50, referencePoint.color[1] - 50, referencePoint.color[2] - 50);
  strokeWeight(3);
  ellipse(referencePoint.x, referencePoint.y, referencePoint.radius * 2, referencePoint.radius * 2);
  
  // Reference point details
  stroke(255, 255, 255, 150);
  strokeWeight(2);
  line(referencePoint.x - 10, referencePoint.y, referencePoint.x + 10, referencePoint.y);
  line(referencePoint.x, referencePoint.y - 10, referencePoint.x, referencePoint.y + 10);
  
  // Label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text("Reference Point", referencePoint.x, referencePoint.y - 35);
  text("(" + referencePoint.x + ", " + referencePoint.y + ")", referencePoint.x, referencePoint.y + 45);
}

function drawMovingObject() {
  // Different colors based on state
  if (movingObject.hasPassed) {
    fill(100, 255, 100); // Green when past
    stroke(50, 200, 50);
  } else if (movingObject.isMoving) {
    fill(255, 200, 100); // Yellow when moving
    stroke(255, 150, 0);
  } else {
    fill(movingObject.color[0], movingObject.color[1], movingObject.color[2]);
    stroke(200, 100, 50);
  }
  
  strokeWeight(2);
  ellipse(movingObject.x, movingObject.y, movingObject.radius * 2, movingObject.radius * 2);
  
  // Motion indicator
  if (movingObject.isMoving) {
    // Draw motion lines
    stroke(255, 100, 100, 150);
    strokeWeight(1);
    for (let i = 1; i <= 3; i++) {
      let trailX = movingObject.x - (i * 8 * movingObject.direction);
      line(trailX, movingObject.y - 3, trailX, movingObject.y + 3);
    }
    
    // Direction arrow
    stroke(255, 100, 100);
    strokeWeight(2);
    let arrowX = movingObject.x + (15 * movingObject.direction);
    let arrowSize = 6;
    line(movingObject.x, movingObject.y, arrowX, movingObject.y);
    line(arrowX, movingObject.y, 
         arrowX - (arrowSize * movingObject.direction), movingObject.y - arrowSize);
    line(arrowX, movingObject.y, 
         arrowX - (arrowSize * movingObject.direction), movingObject.y + arrowSize);
  }
  
  // Object label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text("Moving Object", movingObject.x, movingObject.y - 25);
}

function drawRelationshipIndicators() {
  // Draw vertical line at reference point for clarity
  stroke(200, 200, 200, 100);
  strokeWeight(1);
  line(referencePoint.x, 0, referencePoint.x, height);
  
  // Mark the "past" point if object has passed
  if (passedPoint) {
    stroke(100, 255, 100, 150);
    strokeWeight(2);
    line(passedPoint.x, passedPoint.y - 20, passedPoint.x, passedPoint.y + 20);
    
    fill(100, 255, 100);
    noStroke();
    textAlign(CENTER);
    textSize(10);
    text("Passed here", passedPoint.x, passedPoint.y - 25);
  }
  
  // Show distance relationship
  if (movingObject.isMoving || movingObject.hasPassed) {
    let distance = movingObject.x - referencePoint.x;
    
    stroke(150, 150, 150, 100);
    strokeWeight(1);
    line(referencePoint.x, referencePoint.y + 40, movingObject.x, movingObject.y + 40);
    
    // Distance label
    fill(100);
    noStroke();
    textAlign(CENTER);
    textSize(10);
    let midX = (referencePoint.x + movingObject.x) / 2;
    text(Math.abs(Math.round(distance)) + "px", midX, referencePoint.y + 55);
    
    if (distance > 0) {
      text("(past reference)", midX, referencePoint.y + 70);
    } else {
      text("(before reference)", midX, referencePoint.y + 70);
    }
  }
}

function drawInfo() {
  // Determine relationship status
  let relationship = "";
  if (movingObject.hasPassed) {
    relationship = "Object has moved PAST the reference point";
  } else if (movingObject.isMoving) {
    let distance = movingObject.x - referencePoint.x;
    if (distance < 0) {
      relationship = "Object is approaching the reference point";
    } else {
      relationship = "Object is moving PAST the reference point";
    }
  } else {
    relationship = "Click to move object PAST the reference point";
  }
  
  // Draw relationship status
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  
  if (movingObject.hasPassed) {
    fill(0, 150, 0); // Green when past
  } else if (movingObject.isMoving) {
    fill(0, 0, 150); // Blue when moving
  } else {
    fill(100, 100, 100); // Gray when waiting
  }
  text(relationship, width/2, height - 60);
  
  // Additional information
  fill(0);
  textSize(12);
  text("'Past' means moving beyond a reference point", width/2, height - 40);
  
  // Status display
  textAlign(LEFT);
  textSize(10);
  text("Position: " + Math.round(movingObject.x), 10, height - 25);
  text("Reference X: " + referencePoint.x, 10, height - 10);
  text("Has passed: " + movingObject.hasPassed, 150, height - 25);
  text("Direction: " + (movingObject.direction > 0 ? "Right" : "Left"), 150, height - 10);
}

function drawControls() {
  // Instructions
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(10);
  text("Click left or right of reference to move object past it", 10, 20);
  text("Watch the object go beyond the reference point", 10, 35);
  
  // Control buttons
  fill(200);
  stroke(100);
  strokeWeight(1);
  
  // Direction buttons
  rect(250, 10, 60, 20);
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text("← Left", 280, 23);
  
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(320, 10, 60, 20);
  fill(0);
  noStroke();
  text("Right →", 350, 23);
  
  // Reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(250, 35, 50, 20);
  fill(0);
  noStroke();  text("Reset", 275, 48);
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
  
  // Check control buttons
  if (inputY >= 10 && inputY <= 30) {
    if (inputX >= 250 && inputX <= 310) {
      startMovement(-1); // Move left
      return;
    }
    if (inputX >= 320 && inputX <= 380) {
      startMovement(1); // Move right
      return;
    }
  }
  
  if (inputY >= 35 && inputY <= 55 && inputX >= 250 && inputX <= 300) {
    resetMovement();
    return;
  }
  
  // Click/touch to start movement in direction of input
  if (!movingObject.isMoving) {
    if (inputX < referencePoint.x) {
      startMovement(-1); // Click left, move left past reference
    } else {
      startMovement(1); // Click right, move right past reference
    }
  }
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
  
  // Check control buttons
  if (inputY >= 10 && inputY <= 30) {
    if (inputX >= 250 && inputX <= 310) {
      startMovement(-1); // Move left
      return;
    }
    if (inputX >= 320 && inputX <= 380) {
      startMovement(1); // Move right
      return;
    }
  }
  
  if (inputY >= 35 && inputY <= 55 && inputX >= 250 && inputX <= 300) {
    resetMovement();
    return;
  }
  
  // Click/touch to start movement in direction of input
  if (!movingObject.isMoving) {
    if (inputX < referencePoint.x) {
      startMovement(-1); // Click left, move left past reference
    } else {
      startMovement(1); // Click right, move right past reference
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

function startMovement(direction) {
  if (movingObject.isMoving) return;
  
  movingObject.direction = direction;
  movingObject.isMoving = true;
  movingObject.hasPassed = false;
  passedPoint = null;
  trail = [];
  
  // Set starting position based on direction
  if (direction > 0) {
    movingObject.x = -50; // Start from left
  } else {
    movingObject.x = width + 50; // Start from right
  }
  
  movingObject.y = referencePoint.y;
}

function resetMovement() {
  movingObject.x = -50;
  movingObject.y = referencePoint.y;
  movingObject.isMoving = false;
  movingObject.hasPassed = false;
  movingObject.direction = 1;
  passedPoint = null;
  trail = [];
}

/*
EDUCATIONAL NOTES:

1. MOVEMENT BEYOND:
   - "Past" requires movement that continues beyond a reference
   - Different from stopping "at" or "near" a point
   - Implies continuation of motion after passing

2. REFERENCE POINTS:
   - Clear reference point needed to define "past"
   - Spatial relationship changes as object moves
   - Before/at/past are distinct states

3. DIRECTIONAL AWARENESS:
   - "Past" can occur in different directions
   - Movement vector determines approach and departure
   - Visual indicators show direction clearly

4. STATE TRACKING:
   - Boolean flags track passing events
   - Position comparison determines current state
   - Historical data (when/where passed) provides context

5. TEMPORAL SEQUENCE:
   - "Past" implies a sequence: approach → at → beyond
   - Each phase has different visual representation
   - Clear transitions between states

This pattern can be adapted for other "past" scenarios like:
- UI scroll positions past elements
- Game characters moving past checkpoints
- Data values exceeding thresholds
- Animation keyframes progressing past markers
- Time-based events occurring after deadlines
*/
