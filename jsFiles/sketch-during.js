/**
 * P5.js Sketch: DURING - Particle Emission During Movement
 * 
 * CONCEPT: "During" represents events that happen throughout
 * a period of time or process. This shows particles being emitted
 * during a traveler's journey from point A to point B.
 * 
 * LEARNING OBJECTIVES:
 * • Understand events occurring within a time period
 * • Practice tracking ongoing activities during movement
 * • Learn continuous processes vs. single events
 * • Explore spatial representation of "during" relationships
 * 
 * KEY VARIABLES & METHODS:
 * • traveler - main object making the journey
 * • particles - objects emitted during the journey
 * • Continuous emission throughout movement
 * 
 * EXTENSION IDEAS:
 * • Different emission patterns during journey
 * • Varying particle behaviors during movement
 * • Multiple travelers with different emission rates
 */

// Main traveler moving between points
let traveler = {
  x: 50,
  y: 150,
  targetX: 350,
  targetY: 150,
  speed: 2,
  size: 12,
  isMoving: false
};

// Particles emitted during the journey
let particles = [];

// Trail showing the journey path
let journeyTrail = [];

function setup() {
  createCanvas(400, 300).parent('canvas');
}

function draw() {
  background(240, 248, 255);
  
  // Update traveler movement
  if (traveler.isMoving) {
    updateJourney();
  }
  
  // Update particles
  updateParticles();
  
  // Draw journey path
  drawPath();
  
  // Draw particles
  drawParticles();
  
  // Draw traveler
  drawTraveler();
  
  // Draw trail
  drawTrail();
  
  // Draw status
  drawStatus();
}

function updateJourney() {
  // Add to trail
  let trailPoint = { x: traveler.x, y: traveler.y };
  journeyTrail.push(trailPoint);
  if (journeyTrail.length > 100) {
    journeyTrail.shift();
  }
  
  // Move traveler toward target
  let dx = traveler.targetX - traveler.x;
  let dy = traveler.targetY - traveler.y;
  let distance = sqrt(dx * dx + dy * dy);
  
  if (distance < traveler.speed) {
    traveler.x = traveler.targetX;
    traveler.y = traveler.targetY;
    traveler.isMoving = false;
  } else {
    let angle = atan2(dy, dx);
    traveler.x += cos(angle) * traveler.speed;
    traveler.y += sin(angle) * traveler.speed;
  }
  
  // Emit particles DURING the journey (every few frames)
  if (frameCount % 8 === 0) {
    let newParticle = {
      x: traveler.x,
      y: traveler.y,
      vx: random(-2, 2),
      vy: random(-2, 2),
      size: random(4, 8),
      life: 1.0,
      trail: [],
      color: [random(100, 255), random(100, 255), random(100, 255)]
    };
    
    particles.push(newParticle);
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    
    // Move particle
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Add to trail
    let particleTrailPoint = { x: particle.x, y: particle.y };
    particle.trail.push(particleTrailPoint);
    if (particle.trail.length > 20) {
      particle.trail.shift();
    }
    
    // Fade out over time
    particle.life -= 0.01;
    particle.vx *= 0.99;
    particle.vy *= 0.99;
    
    // Remove when faded
    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawPath() {
  // Draw journey path line
  stroke(200);
  strokeWeight(2);
  line(50, 150, 350, 150);
  
  // Draw start and end markers
  fill(100, 200, 100);
  noStroke();
  ellipse(50, 150, 20, 20);
  
  fill(200, 100, 100);
  ellipse(350, 150, 20, 20);
}

function drawParticles() {
  for (let particle of particles) {
    // Draw particle trail
    if (particle.trail.length > 1) {
      let alpha = particle.life * 150;
      stroke(particle.color[0], particle.color[1], particle.color[2], alpha);
      strokeWeight(2);
      noFill();
      beginShape();
      for (let i = 0; i < particle.trail.length; i++) {
        vertex(particle.trail[i].x, particle.trail[i].y);
      }
      endShape();
    }
    
    // Draw particle
    let alpha = particle.life * 255;
    fill(particle.color[0], particle.color[1], particle.color[2], alpha);
    noStroke();
    ellipse(particle.x, particle.y, particle.size, particle.size);
  }
}

function drawTraveler() {
  fill(70, 130, 180);
  noStroke();
  ellipse(traveler.x, traveler.y, traveler.size, traveler.size);
}

function drawTrail() {
  if (journeyTrail.length > 1) {
    stroke(70, 130, 180, 150);
    strokeWeight(3);
    noFill();
    beginShape();
    for (let i = 0; i < journeyTrail.length; i++) {
      vertex(journeyTrail[i].x, journeyTrail[i].y);
    }
    endShape();
  }
}

function drawStatus() {
  fill(60);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  
  if (!traveler.isMoving) {
    text("Click to start journey - particles emit DURING travel", width/2, height - 20);
  } else {
    let progress = ((traveler.x - 50) / (350 - 50)) * 100;
    text(`Particles emitting DURING journey (${progress.toFixed(0)}% complete, ${particles.length} active)`, width/2, height - 20);
  }
}

function mousePressed() {
  // Reset journey
  traveler.x = 50;
  traveler.y = 150;
  traveler.isMoving = true;
  
  // Clear existing particles and trail
  particles = [];
  journeyTrail = [];
}
