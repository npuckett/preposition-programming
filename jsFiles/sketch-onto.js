/*
 * P5.js Sketch: ONTO – Landing, Placement, and Contact
 *
 * CONCEPT:
 * "Onto" means movement that ends with contact on the surface of something, showing a transition from off to on.
 * In this sketch, an object is launched and lands onto a surface, visually demonstrating the preposition through motion and contact.
 *
 * LEARNING OBJECTIVES:
 * • Understand motion, trajectory, and landing detection
 * • Practice collision/contact logic and state transitions
 * • Explore physics simulation (gravity, bounce, friction)
 * • Visualize movement history and landing feedback
 *
 * KEY VARIABLES & METHODS:
 * • surface: object representing the landing area
 * • movingObject: object that moves onto the surface
 * • gravity, bounce, friction: physics parameters
 * • trajectory[]: array to store movement path
 * • updatePhysics(), drawTrajectory(), drawRelationshipInfo(): core logic and feedback
 *
 * EXTENSION IDEAS:
 * • Multiple surfaces or moving platforms
 * • Variable launch power or direction
 * • Obstacles or targets to land onto
 *
 * INTERACTION:
 * • Click to launch the object onto the surface
 * • Use buttons to toggle trajectory trail and reset
 */

// Surface to land onto
let surface = {
  x: 100,
  y: 200,
  width: 200,
  height: 30,
  color: [100, 150, 255]
};

// Object that moves onto the surface
let movingObject = {
  x: 50,
  y: 50,
  width: 30,
  height: 20,
  vx: 0,
  vy: 0,
  onSurface: false,
  hasLanded: false,
  color: [255, 150, 100]
};

// Physics simulation
let gravity = 0.3;
let bounce = -0.6;
let friction = 0.95;
let isMoving = false;

// Visual elements
let showTrajectory = true;
let trajectory = [];

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(240, 248, 255);
  
  // Update physics if moving
  if (isMoving && !movingObject.hasLanded) {
    updatePhysics();
  }
  
  // Draw trajectory if enabled
  if (showTrajectory && trajectory.length > 1) {
    drawTrajectory();
  }
  
  // Draw surface
  drawSurface();
  
  // Draw moving object
  drawMovingObject();
  
  // Draw relationship information
  drawRelationshipInfo();
  
  // Draw controls
  drawControls();
}

function updatePhysics() {
  // Store position in trajectory
  trajectory.push({x: movingObject.x, y: movingObject.y});
  if (trajectory.length > 100) {
    trajectory.shift();
  }
  
  // Apply gravity
  movingObject.vy += gravity;
  
  // Update position
  movingObject.x += movingObject.vx;
  movingObject.y += movingObject.vy;
  
  // Check collision with surface
  if (movingObject.y + movingObject.height >= surface.y &&
      movingObject.x + movingObject.width > surface.x &&
      movingObject.x < surface.x + surface.width &&
      movingObject.vy > 0) {
    
    // Land on surface
    movingObject.y = surface.y - movingObject.height;
    movingObject.vy *= bounce;
    movingObject.vx *= friction;
    
    // Check if settled (low velocity = landed)
    if (Math.abs(movingObject.vy) < 1 && Math.abs(movingObject.vx) < 0.5) {
      movingObject.vy = 0;
      movingObject.vx = 0;
      movingObject.onSurface = true;
      movingObject.hasLanded = true;
      isMoving = false;
    }
  }
  
  // Check boundaries
  if (movingObject.x < 0 || movingObject.x + movingObject.width > width) {
    movingObject.vx *= -0.8; // Bounce off walls
    movingObject.x = constrain(movingObject.x, 0, width - movingObject.width);
  }
  
  // Check if fell below surface
  if (movingObject.y > height) {
    resetObject();
  }
}

function drawTrajectory() {
  stroke(255, 200, 0, 150);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < trajectory.length; i++) {
    vertex(trajectory[i].x + movingObject.width/2, trajectory[i].y + movingObject.height/2);
  }
  endShape();
  
  // Draw trajectory points
  fill(255, 200, 0, 100);
  noStroke();
  for (let i = 0; i < trajectory.length; i += 5) {
    ellipse(trajectory[i].x + movingObject.width/2, trajectory[i].y + movingObject.height/2, 4, 4);
  }
}

function drawSurface() {
  // Draw surface shadow
  fill(0, 0, 0, 20);
  noStroke();
  ellipse(surface.x + surface.width/2, surface.y + surface.height + 5, surface.width + 20, 10);
  
  // Draw the surface
  fill(surface.color[0], surface.color[1], surface.color[2]);
  stroke(surface.color[0] - 50, surface.color[1] - 50, surface.color[2] - 50);
  strokeWeight(3);
  rect(surface.x, surface.y, surface.width, surface.height, 5);
  
  // Surface texture
  stroke(255, 255, 255, 150);
  strokeWeight(1);
  for (let i = 0; i < 4; i++) {
    let lineX = surface.x + 20 + (i * 40);
    line(lineX, surface.y + 5, lineX, surface.y + surface.height - 5);
  }
  
  // Surface label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  text("Landing Surface", surface.x + surface.width/2, surface.y - 10);
  
  // Landing zone indicator
  if (!movingObject.hasLanded) {
    stroke(100, 255, 100, 100);
    strokeWeight(2);
    noFill();
    rect(surface.x - 5, surface.y - 5, surface.width + 10, surface.height + 10);
  }
}

function drawMovingObject() {
  // Different appearance based on state
  if (movingObject.onSurface) {
    fill(100, 255, 100); // Green when on surface
    stroke(50, 200, 50);
  } else if (isMoving) {
    fill(255, 200, 100); // Yellow when moving
    stroke(255, 150, 0);
  } else {
    fill(movingObject.color[0], movingObject.color[1], movingObject.color[2]);
    stroke(200, 100, 50);
  }
  
  strokeWeight(2);
  rect(movingObject.x, movingObject.y, movingObject.width, movingObject.height, 3);
  
  // Motion lines when moving
  if (isMoving && !movingObject.hasLanded) {
    stroke(255, 100, 100, 150);
    strokeWeight(1);
    for (let i = 1; i <= 3; i++) {
      line(movingObject.x - i * movingObject.vx * 2, 
           movingObject.y - i * movingObject.vy * 2,
           movingObject.x - (i-1) * movingObject.vx * 2, 
           movingObject.y - (i-1) * movingObject.vy * 2);
    }
  }
  
  // Object label
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(10);
  text("Moving Object", movingObject.x + movingObject.width/2, movingObject.y - 8);
  
  // Velocity display when moving
  if (isMoving) {
    textSize(8);
    text("vx:" + nf(movingObject.vx, 1, 1), movingObject.x + movingObject.width/2, movingObject.y + movingObject.height + 15);
    text("vy:" + nf(movingObject.vy, 1, 1), movingObject.x + movingObject.width/2, movingObject.y + movingObject.height + 25);
  }
}

function drawRelationshipInfo() {
  // Determine relationship status
  let relationship = "";
  if (movingObject.onSurface && movingObject.hasLanded) {
    relationship = "Object has landed ONTO the surface";
  } else if (isMoving) {
    relationship = "Object is moving ONTO the surface";
  } else {
    relationship = "Click to launch object ONTO the surface";
  }
  
  // Check if object is properly positioned on surface
  let isProperlyOn = movingObject.onSurface && 
                     movingObject.x + movingObject.width > surface.x &&
                     movingObject.x < surface.x + surface.width;
  
  // Draw relationship status
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  
  if (isProperlyOn) {
    fill(0, 150, 0); // Green for successful landing
  } else if (isMoving) {
    fill(0, 0, 150); // Blue for in progress
  } else {
    fill(100, 100, 100); // Gray for waiting
  }
  text(relationship, width/2, height - 60);
  
  // Physics info
  fill(0);
  textSize(12);
  if (movingObject.hasLanded) {
    text("Object is now resting ON the surface", width/2, height - 40);
  } else {
    text("'Onto' involves movement ending with contact", width/2, height - 40);
  }
  
  // Status indicators
  textAlign(LEFT);
  textSize(10);
  text("On Surface: " + movingObject.onSurface, 10, height - 20);
  text("Has Landed: " + movingObject.hasLanded, 10, height - 5);
}

function drawControls() {
  // Instructions
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(10);
  text("Click anywhere to launch object toward that point", 10, 20);
  text("Watch object move ONTO the surface", 10, 35);
  
  // Control buttons
  fill(200);
  stroke(100);
  strokeWeight(1);
  
  // Trajectory toggle
  rect(250, 10, 80, 20);
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(9);
  text(showTrajectory ? "Hide Trail" : "Show Trail", 290, 23);
  
  // Reset button
  fill(200);
  stroke(100);
  strokeWeight(1);
  rect(340, 10, 50, 20);
  fill(0);
  noStroke();
  text("Reset", 365, 23);
  
  // Launch power indicator
  if (!isMoving && !movingObject.hasLanded) {
    fill(150);
    noStroke();
    textAlign(LEFT);
    textSize(10);
    text("Click further for more power", 10, 50);
  }
}

function mousePressed() {
  // Check control buttons
  if (mouseY >= 10 && mouseY <= 30) {
    if (mouseX >= 250 && mouseX <= 330) {
      showTrajectory = !showTrajectory;
      return;
    }
    if (mouseX >= 340 && mouseX <= 390) {
      resetObject();
      return;
    }
  }
  
  // Launch object if not currently moving
  if (!isMoving) {
    launchObject(mouseX, mouseY);
  }
}

function launchObject(targetX, targetY) {
  // Calculate velocity based on distance to target
  let dx = targetX - (movingObject.x + movingObject.width/2);
  let dy = targetY - (movingObject.y + movingObject.height/2);
  
  // Scale velocity (adjust for reasonable launch speed)
  movingObject.vx = dx * 0.08;
  movingObject.vy = dy * 0.08;
  
  // Limit maximum velocity
  movingObject.vx = constrain(movingObject.vx, -8, 8);
  movingObject.vy = constrain(movingObject.vy, -8, 8);
  
  // Start movement
  isMoving = true;
  movingObject.onSurface = false;
  movingObject.hasLanded = false;
  trajectory = [];
}

function resetObject() {
  movingObject.x = 50;
  movingObject.y = 50;
  movingObject.vx = 0;
  movingObject.vy = 0;
  movingObject.onSurface = false;
  movingObject.hasLanded = false;
  isMoving = false;
  trajectory = [];
}

/*
EDUCATIONAL NOTES:

1. DIRECTIONAL MOVEMENT:
   - "Onto" implies movement ending with contact
   - Different from static "on" which is just position
   - Motion trajectory matters for the relationship

2. PHYSICS SIMULATION:
   - Gravity creates realistic falling motion
   - Collision detection determines landing
   - Bouncing and friction create settling behavior

3. STATE TRANSITIONS:
   - Clear states: launching, moving, landed
   - Each state has different visual and behavioral properties
   - State changes triggered by specific conditions

4. CONTACT DETECTION:
   - Precise collision detection for landing
   - Velocity thresholds determine when motion stops
   - Position validation ensures proper surface contact

5. TRAJECTORY VISUALIZATION:
   - Shows the path of movement onto surface
   - Helps understand the motion component of "onto"
   - Visual feedback for the preposition's meaning

This pattern can be adapted for other "onto" scenarios like:
- Drag and drop UI interactions
- Game character jumping onto platforms
- File operations (saving onto disk)
- Animation sequences with landing
- Physics simulations with object placement
*/
